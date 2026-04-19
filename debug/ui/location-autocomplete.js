// debug/ui/location-autocomplete.js - v1.0.2
// Sistema de autocomplete de bairros para Weber Lessa
// ✅ COM DIAGNÓSTICO COMPLETO INTEGRADO
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
     * Cria elemento de sugestão
     */
    function createSuggestionElement(bairro, searchText) {
        const div = document.createElement('div');
        div.className = CONFIG.suggestionsClass + '-item';
        div.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: background 0.2s ease;
            font-size: 0.9rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        // Destacar parte que corresponde à busca
        const searchLower = searchText.toLowerCase();
        const bairroLower = bairro.toLowerCase();
        const index = bairroLower.indexOf(searchLower);
        
        if (index !== -1) {
            const before = bairro.substring(0, index);
            const match = bairro.substring(index, index + searchText.length);
            const after = bairro.substring(index + searchText.length);
            div.innerHTML = `${before}<strong style="color: #1a5276; background: #e8f0fe; padding: 0 2px; border-radius: 3px;">${match}</strong>${after}`;
        } else {
            div.textContent = bairro;
        }
        
        // Evento de clique
        div.addEventListener('click', () => {
            if (currentInput) {
                currentInput.value = bairro;
                hideSuggestions();
                
                // Disparar evento para notificar mudança
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
            div.style.backgroundColor = '';
        });
        
        return div;
    }
    
    /**
     * Mostra sugestões
     */
    function showSuggestions(suggestions, searchText) {
        hideSuggestions();
        
        if (!suggestions.length || !currentInput) return;
        
        // Criar container
        const rect = currentInput.getBoundingClientRect();
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = CONFIG.suggestionsClass;
        suggestionsContainer.style.cssText = `
            position: absolute;
            z-index: 10000;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 300px;
            overflow-y: auto;
            width: ${rect.width}px;
            top: ${rect.bottom + window.scrollY}px;
            left: ${rect.left + window.scrollX}px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        // Adicionar itens
        suggestions.forEach(bairro => {
            suggestionsContainer.appendChild(createSuggestionElement(bairro, searchText));
        });
        
        document.body.appendChild(suggestionsContainer);
        console.log(`📍 Sugestões exibidas: ${suggestions.length} resultados para "${searchText}"`);
        
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
            console.log(`📍 Mínimo de ${CONFIG.minChars} caracteres necessário. Atual: ${searchText?.length || 0}`);
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
            console.log('   Verifique se o seletor está correto');
            return false;
        }
        
        console.log('✅ Campo encontrado:', input);
        console.log('   ID:', input.id);
        console.log('   Placeholder original:', input.placeholder);
        
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
        
        // Estilo para o campo
        currentInput.style.position = 'relative';
        
        console.log('✅ Sistema de autocomplete inicializado com', BAIRROS_OFICIAIS.length, 'bairros');
        console.log('   Placeholder atualizado:', currentInput.placeholder);
        console.log('   Eventos adicionados: input, blur');
        
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
    
    // ========== DIAGNÓSTICO COMPLETO ==========
    function runFullDiagnostic() {
        console.group('🔍 DIAGNÓSTICO COMPLETO DO AUTOCOMPLETE');
        
        // 1. Verificar se o campo está sendo encontrado
        console.log('1. VERIFICANDO CAMPO:');
        const input = document.querySelector(CONFIG.inputSelector);
        console.log('   Seletor:', CONFIG.inputSelector);
        console.log('   Campo encontrado:', input ? '✅ SIM' : '❌ NÃO');
        if (input) {
            console.log('   ID:', input.id);
            console.log('   Tipo:', input.type);
            console.log('   Visível:', input.offsetParent !== null);
            console.log('   Placeholder:', input.placeholder);
        }
        
        // 2. Testar o filtro de bairros manualmente
        console.log('\n2. TESTANDO FILTRO DE BAIRROS:');
        console.log('   Total de bairros:', BAIRROS_OFICIAIS.length);
        const testTerms = ['Ponta', 'Jatiúca', 'Centro', 'XYZ'];
        testTerms.forEach(term => {
            const results = filterBairros(term);
            console.log(`   "${term}": ${results.length} resultados - ${results.slice(0, 3).join(', ') || 'nenhum'}`);
        });
        
        // 3. Verificar se o input event está funcionando
        console.log('\n3. TESTANDO INPUT EVENT:');
        if (input) {
            console.log('   Input event listener:', currentInput === input ? '✅ CONFIGURADO' : '❌ NÃO CONFIGURADO');
            
            // Simular digitação temporariamente
            const originalValue = input.value;
            console.log('   Simulando digitação "Ponta"...');
            input.value = 'Ponta';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const suggestions = document.querySelector('.' + CONFIG.suggestionsClass);
                console.log('   Container de sugestões criado:', suggestions ? '✅ SIM' : '❌ NÃO');
                if (suggestions) {
                    console.log('   Número de itens:', suggestions.children.length);
                    console.log('   Estilos aplicados:', {
                        position: suggestions.style.position,
                        zIndex: suggestions.style.zIndex,
                        display: suggestions.style.display,
                        visibility: window.getComputedStyle(suggestions).visibility
                    });
                }
                input.value = originalValue;
                hideSuggestions();
            }, 500);
        } else {
            console.log('   ❌ Não é possível testar - campo não encontrado');
        }
        
        // 4. Verificar CSS/z-index
        console.log('\n4. VERIFICANDO CSS E Z-INDEX:');
        console.log('   Classe de sugestões:', '.' + CONFIG.suggestionsClass);
        console.log('   Z-index configurado: 10000');
        
        // Verificar elementos que podem sobrepor
        const highZElements = document.querySelectorAll('[style*="z-index"]');
        const conflictingZ = Array.from(highZElements).filter(el => {
            const zIndex = parseInt(el.style.zIndex);
            return zIndex > 9000 && zIndex < 11000;
        });
        if (conflictingZ.length > 0) {
            console.log('   ⚠️ Elementos com z-index próximo:', conflictingZ.length);
            conflictingZ.forEach(el => {
                console.log('     -', el.tagName, 'z-index:', el.style.zIndex);
            });
        } else {
            console.log('   ✅ Nenhum conflito de z-index detectado');
        }
        
        // 5. Status atual
        console.log('\n5. STATUS ATUAL:');
        console.log('   Módulo carregado:', typeof window.LocationAutocomplete === 'object');
        console.log('   Autocomplete ativo:', currentInput !== null);
        console.log('   Campo configurado:', currentInput === input);
        
        console.log('\n📋 RECOMENDAÇÕES:');
        if (!input) {
            console.log('   ❌ CRÍTICO: Campo não encontrado! Verifique se o ID está correto.');
        } else if (currentInput !== input) {
            console.log('   ⚠️ Inicialização pendente. Execute: window.LocationAutocomplete.init()');
        } else {
            console.log('   ✅ Sistema aparentemente normal. Teste digitando no campo.');
            console.log('   Se não aparecerem sugestões, verifique o console durante a digitação.');
        }
        
        console.groupEnd();
    }
    
    // API pública
    window.LocationAutocomplete = {
        init,
        destroy,
        getBairrosList: () => [...BAIRROS_OFICIAIS],
        isActive: () => currentInput !== null,
        runDiagnostic: runFullDiagnostic,
        CONFIG
    };
    
    // Auto-registrar no DiagnosticRegistry se disponível
    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register('LocationAutocomplete.init', init, 'ui', {
            isSafe: true,
            description: 'Inicializa sistema de autocomplete de bairros'
        });
        window.DiagnosticRegistry.register('LocationAutocomplete.runDiagnostic', runFullDiagnostic, 'ui', {
            isSafe: true,
            description: 'Executa diagnóstico completo do autocomplete'
        });
        window.DiagnosticRegistry.register('LocationAutocomplete.getBairrosList', 
            () => BAIRROS_OFICIAIS, 'ui', {
            isSafe: true,
            description: 'Retorna lista oficial de bairros de Maceió'
        });
    }
    
    // ========== INICIALIZAÇÃO AUTOMÁTICA ==========
    function autoInit() {
        console.log('📍 Iniciando auto-inicialização...');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    const result = window.LocationAutocomplete?.init();
                    console.log('📍 Autocomplete auto-inicializado (DOMContentLoaded):', result ? '✅' : '❌');
                    
                    // Executar diagnóstico automático em modo debug
                    if (window.location.search.includes('debug=true')) {
                        setTimeout(() => {
                            console.log('\n🔍 Executando diagnóstico automático...');
                            window.LocationAutocomplete?.runDiagnostic();
                        }, 1000);
                    }
                }, 500);
            });
        } else {
            setTimeout(() => {
                const result = window.LocationAutocomplete?.init();
                console.log('📍 Autocomplete auto-inicializado (pronto):', result ? '✅' : '❌');
                
                // Executar diagnóstico automático em modo debug
                if (window.location.search.includes('debug=true')) {
                    setTimeout(() => {
                        console.log('\n🔍 Executando diagnóstico automático...');
                        window.LocationAutocomplete?.runDiagnostic();
                    }, 1000);
                }
            }, 500);
        }
    }
    
    autoInit();
    
    console.log('✅ location-autocomplete.js carregado -', BAIRROS_OFICIAIS.length, 'bairros disponíveis');
    console.log('📋 Para diagnóstico manual: window.LocationAutocomplete.runDiagnostic()');
})();
