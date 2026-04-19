// debug/ui/location-autocomplete.js - v1.0.3
// Sistema de autocomplete de bairros para Weber Lessa
// ✅ COM CORREÇÕES VISUAIS E DIAGNÓSTICO DE RENDERIZAÇÃO
console.log('📍 location-autocomplete.js - Sistema de sugestão de bairros');

(function() {
    'use strict';
    
    // Lista oficial de bairros (ordem correta)
    const BAIRROS_OFICIAIS = [
        'Pajuçara', 'Ponta Verde', 'Jatiúca', 'Jacarecica', 'Cruz das Almas',
        'Mangabeiras', 'Poço', 'Barro Duro', 'Gruta de Lourdes', 'Serraria',
        'Farol', 'Jardim Petrópolis', 'Centro', 'Prado', 'Jaraguá', 'Feitosa',
        'Pinheiro', 'Santa Lúcia', 'Santa Amélia', 'Tabuleiro do Martins',
        'Cidade Universitária', 'Clima Bom', 'Benedito Bentes', 'Santos Dumont',
        'São Jorge', 'Levada', 'Trapiche da Barra', 'Vergel do Lago',
        'Ouro Preto', 'Mutange', 'Fernão Velho', 'Rio Novo', 'Riacho Doce',
        'Pontal da Barra', 'Guaxuma', 'Ipioca', 'Garça Torta', 'Pescaria',
        'Chã da Jaqueira', 'Chã de Bebedouro', 'Bebedouro', 'Bom Parto',
        'Canaã', 'Pitanguinha', 'Ponta da Terra', 'Santo Amaro', 'Zona Rural'
    ];
    
    // Configuração
    const CONFIG = {
        inputSelector: '#propLocation',
        minChars: 2,
        maxSuggestions: 8,
        debounceDelay: 300,
        suggestionsClass: 'location-suggestions',
        highlightClass: 'suggestion-highlight'
    };
    
    let currentInput = null;
    let suggestionsContainer = null;
    let debounceTimer = null;
    let forceStylesApplied = false;
    
    /**
     * Aplica estilos de correção visual forçada
     */
    function applyForceStyles() {
        if (forceStylesApplied) return;
        
        console.log('🎨 Aplicando estilos de correção visual...');
        
        const style = document.createElement('style');
        style.id = 'location-autocomplete-force-styles';
        style.textContent = `
            /* Estilos forçados para garantir visibilidade das sugestões */
            .location-suggestions {
                position: absolute !important;
                background: white !important;
                border: 2px solid #1a5276 !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
                max-height: 300px !important;
                overflow-y: auto !important;
                z-index: 999999 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                margin-top: 4px !important;
            }
            
            .location-suggestions-item {
                padding: 10px 12px !important;
                cursor: pointer !important;
                border-bottom: 1px solid #e0e0e0 !important;
                transition: background 0.2s ease !important;
                font-size: 0.9rem !important;
                color: #333333 !important;
                background: white !important;
                display: block !important;
            }
            
            .location-suggestions-item:last-child {
                border-bottom: none !important;
            }
            
            .location-suggestions-item:hover {
                background: #f0f7ff !important;
            }
            
            .location-suggestions-item strong {
                color: #1a5276 !important;
                background: #e8f0fe !important;
                padding: 0 2px !important;
                border-radius: 3px !important;
                font-weight: 600 !important;
            }
        `;
        
        // Remover estilo anterior se existir
        const oldStyle = document.getElementById('location-autocomplete-force-styles');
        if (oldStyle) oldStyle.remove();
        
        document.head.appendChild(style);
        forceStylesApplied = true;
        console.log('✅ Estilos de correção visual aplicados');
    }
    
    /**
     * Verifica e corrige overflow da página
     */
    function fixPageOverflow() {
        const bodyOverflow = window.getComputedStyle(document.body).overflow;
        const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;
        
        console.log('📐 Verificando overflow:', { bodyOverflow, htmlOverflow });
        
        if (bodyOverflow === 'hidden' || htmlOverflow === 'hidden') {
            console.log('⚠️ Overflow detectado, corrigindo...');
            if (bodyOverflow === 'hidden') {
                document.body.style.overflow = 'auto';
                document.body.style.setProperty('overflow', 'auto', 'important');
            }
            if (htmlOverflow === 'hidden') {
                document.documentElement.style.overflow = 'auto';
                document.documentElement.style.setProperty('overflow', 'auto', 'important');
            }
            return true;
        }
        return false;
    }
    
    /**
     * Verifica se o container está visível e na posição correta
     */
    function checkContainerVisibility(container) {
        if (!container) return false;
        
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                            rect.bottom <= viewportHeight && 
                            rect.right <= viewportWidth;
        
        console.log('📐 Posição do container:', {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            isInViewport: isInViewport
        });
        
        if (!isInViewport) {
            console.log('⚠️ Container fora da área visível! Aplicando correção...');
            
            // Tentar posicionar corretamente
            if (currentInput) {
                const inputRect = currentInput.getBoundingClientRect();
                const newTop = inputRect.bottom + window.scrollY;
                const newLeft = inputRect.left + window.scrollX;
                
                container.style.top = newTop + 'px';
                container.style.left = newLeft + 'px';
                container.style.width = inputRect.width + 'px';
                
                console.log('📐 Posição corrigida:', { newTop, newLeft });
            }
            
            return false;
        }
        
        return true;
    }
    
    /**
     * Verifica cores do texto e fundo
     */
    function checkColors(suggestionItem) {
        if (!suggestionItem) return;
        
        const computedStyle = window.getComputedStyle(suggestionItem);
        const color = computedStyle.color;
        const bgColor = computedStyle.backgroundColor;
        
        console.log('🎨 Cores do item:', { color, bgColor });
        
        // Verificar se é invisível (mesma cor)
        if (color === bgColor || (color === 'rgba(0, 0, 0, 0)' && bgColor === 'rgba(0, 0, 0, 0)')) {
            console.log('⚠️ Cores conflitantes detectadas! Aplicando correção...');
            suggestionItem.style.color = '#333333';
            suggestionItem.style.backgroundColor = 'white';
            return false;
        }
        
        return true;
    }
    
    /**
     * Filtra bairros baseado no texto digitado
     */
    function filterBairros(searchText) {
        if (!searchText || searchText.length < CONFIG.minChars) {
            return [];
        }
        
        const searchLower = searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        return BAIRROS_OFICIAIS
            .filter(bairro => {
                const bairroLower = bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return bairroLower.includes(searchLower);
            })
            .slice(0, CONFIG.maxSuggestions);
    }
    
    /**
     * Cria elemento de sugestão com estilos garantidos
     */
    function createSuggestionElement(bairro, searchText) {
        const div = document.createElement('div');
        div.className = CONFIG.suggestionsClass + '-item';
        
        // Estilos inline garantidos
        div.style.cssText = `
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: 1px solid #e0e0e0;
            transition: background 0.2s ease;
            font-size: 0.9rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #333333;
            background: white;
            display: block;
        `;
        
        // Destacar parte que corresponde à busca
        const searchLower = searchText.toLowerCase();
        const bairroLower = bairro.toLowerCase();
        const index = bairroLower.indexOf(searchLower);
        
        if (index !== -1) {
            const before = bairro.substring(0, index);
            const match = bairro.substring(index, index + searchText.length);
            const after = bairro.substring(index + searchText.length);
            div.innerHTML = `${before}<strong style="color: #1a5276; background: #e8f0fe; padding: 0 2px; border-radius: 3px; font-weight: 600;">${match}</strong>${after}`;
        } else {
            div.textContent = bairro;
        }
        
        // Evento de clique
        div.addEventListener('click', () => {
            if (currentInput) {
                currentInput.value = bairro;
                hideSuggestions();
                
                const event = new Event('input', { bubbles: true });
                currentInput.dispatchEvent(event);
                
                console.log(`📍 Bairro selecionado: ${bairro}`);
            }
        });
        
        // Hover effect
        div.addEventListener('mouseenter', () => {
            div.style.backgroundColor = '#f0f7ff';
        });
        
        div.addEventListener('mouseleave', () => {
            div.style.backgroundColor = 'white';
        });
        
        return div;
    }
    
    /**
     * Mostra sugestões com correções de posicionamento
     */
    function showSuggestions(suggestions, searchText) {
        hideSuggestions();
        
        if (!suggestions.length || !currentInput) return;
        
        // Aplicar correções antes de mostrar
        applyForceStyles();
        fixPageOverflow();
        
        // Criar container
        const rect = currentInput.getBoundingClientRect();
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = CONFIG.suggestionsClass;
        
        // Estilos inline garantidos
        suggestionsContainer.style.cssText = `
            position: absolute;
            z-index: 999999;
            background: white;
            border: 2px solid #1a5276;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            max-height: 300px;
            overflow-y: auto;
            width: ${rect.width}px;
            top: ${rect.bottom + window.scrollY + 4}px;
            left: ${rect.left + window.scrollX}px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        // Adicionar itens
        suggestions.forEach(bairro => {
            suggestionsContainer.appendChild(createSuggestionElement(bairro, searchText));
        });
        
        document.body.appendChild(suggestionsContainer);
        console.log(`📍 Sugestões exibidas: ${suggestions.length} resultados para "${searchText}"`);
        
        // Verificar visibilidade do container
        setTimeout(() => {
            if (suggestionsContainer) {
                checkContainerVisibility(suggestionsContainer);
                const firstItem = suggestionsContainer.querySelector('.' + CONFIG.suggestionsClass + '-item');
                if (firstItem) {
                    checkColors(firstItem);
                }
            }
        }, 50);
        
        // Fechar ao clicar fora
        setTimeout(() => {
            document.addEventListener('click', function onClickOutside(e) {
                if (!suggestionsContainer?.contains(e.target) && e.target !== currentInput) {
                    hideSuggestions();
                    document.removeEventListener('click', onClickOutside);
                }
            });
        }, 0);
    }
    
    /**
     * Esconde sugestões
     */
    function hideSuggestions() {
        if (suggestionsContainer) {
            suggestionsContainer.remove();
            suggestionsContainer = null;
        }
    }
    
    /**
     * Handler de input
     */
    function onInputChange(e) {
        const searchText = e.target.value;
        console.log(`📍 Digitando: "${searchText}" (${searchText.length} caracteres)`);
        
        if (debounceTimer) clearTimeout(debounceTimer);
        
        if (!searchText || searchText.length < CONFIG.minChars) {
            hideSuggestions();
            return;
        }
        
        debounceTimer = setTimeout(() => {
            const suggestions = filterBairros(searchText);
            console.log(`📍 Filtro: ${suggestions.length} bairros encontrados para "${searchText}"`);
            if (suggestions.length > 0) {
                console.log(`   Sugestões: ${suggestions.slice(0, 5).join(', ')}${suggestions.length > 5 ? '...' : ''}`);
            }
            showSuggestions(suggestions, searchText);
        }, CONFIG.debounceDelay);
    }
    
    /**
     * Inicializa o autocomplete
     */
    function init() {
        console.log('📍 Iniciando inicialização do autocomplete...');
        
        const input = document.querySelector(CONFIG.inputSelector);
        if (!input) {
            console.log('❌ Campo de localização não encontrado:', CONFIG.inputSelector);
            return false;
        }
        
        if (currentInput === input) {
            console.log('📍 Autocomplete já inicializado neste campo');
            return true;
        }
        
        // Limpar anterior
        if (currentInput) {
            currentInput.removeEventListener('input', onInputChange);
            currentInput.removeEventListener('blur', () => setTimeout(hideSuggestions, 200));
        }
        
        currentInput = input;
        currentInput.setAttribute('autocomplete', 'off');
        currentInput.setAttribute('placeholder', 'Ex: Ponta Verde, Maceió-AL (digite o bairro)');
        
        // Adicionar eventos
        currentInput.addEventListener('input', onInputChange);
        currentInput.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
        
        currentInput.style.position = 'relative';
        
        // Aplicar correções visuais
        applyForceStyles();
        
        console.log('✅ Sistema de autocomplete inicializado com', BAIRROS_OFICIAIS.length, 'bairros');
        
        return true;
    }
    
    /**
     * Destrói o autocomplete
     */
    function destroy() {
        if (currentInput) {
            currentInput.removeEventListener('input', onInputChange);
            currentInput.removeEventListener('blur', () => setTimeout(hideSuggestions, 200));
            currentInput = null;
        }
        hideSuggestions();
        if (debounceTimer) clearTimeout(debounceTimer);
        console.log('📍 Sistema de autocomplete destruído');
    }
    
    /**
     * Executa diagnóstico completo com verificações visuais
     */
    function runFullDiagnostic() {
        console.group('🔍 DIAGNÓSTICO COMPLETO DO AUTOCOMPLETE');
        
        // 1. Verificar campo
        const input = document.querySelector(CONFIG.inputSelector);
        console.log('1. CAMPO:', input ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
        
        // 2. Verificar overflow da página
        const bodyOverflow = window.getComputedStyle(document.body).overflow;
        const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;
        console.log('2. OVERFLOW:', { bodyOverflow, htmlOverflow });
        if (bodyOverflow === 'hidden' || htmlOverflow === 'hidden') {
            console.log('   ⚠️ Overflow detectado - pode esconder as sugestões!');
        } else {
            console.log('   ✅ Sem overflow');
        }
        
        // 3. Testar filtro
        const testResults = filterBairros('Ponta');
        console.log('3. FILTRO:', `${testResults.length} resultados para "Ponta"`);
        
        // 4. Verificar estilos aplicados
        console.log('4. ESTILOS:', forceStylesApplied ? '✅ CORREÇÕES APLICADAS' : '⚠️ NENHUMA CORREÇÃO');
        
        // 5. Simular digitação e verificar visualização
        if (input) {
            console.log('\n5. SIMULANDO DIGITAÇÃO...');
            const originalValue = input.value;
            input.value = 'Ponta';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const container = document.querySelector('.' + CONFIG.suggestionsClass);
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
                    console.log('   Container visível:', isInViewport ? '✅ SIM' : '❌ NÃO');
                    console.log('   Posição:', { top: rect.top, bottom: rect.bottom });
                    
                    if (!isInViewport) {
                        console.log('   🔧 Aplicando correção de posição...');
                        const inputRect = input.getBoundingClientRect();
                        container.style.top = (inputRect.bottom + window.scrollY + 4) + 'px';
                        console.log('   ✅ Posição corrigida');
                    }
                    
                    const firstItem = container.querySelector('.' + CONFIG.suggestionsClass + '-item');
                    if (firstItem) {
                        const color = window.getComputedStyle(firstItem).color;
                        const bgColor = window.getComputedStyle(firstItem).backgroundColor;
                        console.log('   Cores:', { color, bgColor });
                        if (color === bgColor) {
                            console.log('   ⚠️ Conflito de cores detectado!');
                        }
                    }
                } else {
                    console.log('   ❌ Nenhum container criado');
                }
                
                input.value = originalValue;
                hideSuggestions();
                console.groupEnd();
            }, 500);
        } else {
            console.groupEnd();
        }
    }
    
    /**
     * Força correção visual das sugestões
     */
    function forceVisualFix() {
        console.log('🔧 Aplicando correção visual forçada...');
        applyForceStyles();
        fixPageOverflow();
        
        // Reaplicar estilos ao container existente
        if (suggestionsContainer) {
            const inputRect = currentInput?.getBoundingClientRect();
            if (inputRect) {
                suggestionsContainer.style.cssText = `
                    position: absolute;
                    z-index: 999999;
                    background: white;
                    border: 2px solid #1a5276;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    max-height: 300px;
                    overflow-y: auto;
                    width: ${inputRect.width}px;
                    top: ${inputRect.bottom + window.scrollY + 4}px;
                    left: ${inputRect.left + window.scrollX}px;
                `;
                console.log('✅ Container reestilizado');
            }
        }
        
        console.log('✅ Correção visual aplicada');
    }
    
    // API pública
    window.LocationAutocomplete = {
        init,
        destroy,
        getBairrosList: () => [...BAIRROS_OFICIAIS],
        isActive: () => currentInput !== null,
        runDiagnostic: runFullDiagnostic,
        forceVisualFix: forceVisualFix,
        CONFIG
    };
    
    // Auto-registrar no DiagnosticRegistry
    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register('LocationAutocomplete.init', init, 'ui', {
            isSafe: true,
            description: 'Inicializa sistema de autocomplete de bairros'
        });
        window.DiagnosticRegistry.register('LocationAutocomplete.runDiagnostic', runFullDiagnostic, 'ui', {
            isSafe: true,
            description: 'Executa diagnóstico completo do autocomplete'
        });
        window.DiagnosticRegistry.register('LocationAutocomplete.forceVisualFix', forceVisualFix, 'ui', {
            isSafe: true,
            description: 'Aplica correção visual forçada nas sugestões'
        });
    }
    
    // Inicialização automática
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    window.LocationAutocomplete?.init();
                    setTimeout(() => {
                        if (window.location.search.includes('debug=true')) {
                            window.LocationAutocomplete?.runDiagnostic();
                        }
                    }, 1000);
                }, 500);
            });
        } else {
            setTimeout(() => {
                window.LocationAutocomplete?.init();
                setTimeout(() => {
                    if (window.location.search.includes('debug=true')) {
                        window.LocationAutocomplete?.runDiagnostic();
                    }
                }, 1000);
            }, 500);
        }
    }
    
    autoInit();
    
    console.log('✅ location-autocomplete.js carregado -', BAIRROS_OFICIAIS.length, 'bairros disponíveis');
    console.log('📋 Comandos: window.LocationAutocomplete.runDiagnostic() | forceVisualFix()');
})();
