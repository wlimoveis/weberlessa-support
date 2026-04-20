// debug/ui/location-autocomplete.js - v1.0.5
// Sistema de autocomplete de bairros para Weber Lessa
// ✅ COM DIAGNÓSTICO AVANÇADO AUTO-EXECUTÁVEL
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
    let diagnosticButton = null;
    let diagnosticResults = {};
    
    /**
     * Executa diagnóstico completo e mostra resultados na tela
     */
    function runAdvancedDiagnostic() {
        console.log('🔬 Iniciando diagnóstico avançado...');
        
        // Criar painel de resultados
        const resultPanel = document.createElement('div');
        resultPanel.id = 'diagnostic-results-panel';
        resultPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            background: rgba(0,0,0,0.9);
            color: #0f0;
            font-family: monospace;
            font-size: 11px;
            padding: 15px;
            border-radius: 8px;
            z-index: 9999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            border-left: 4px solid #00ff00;
        `;
        
        let html = '<h3 style="margin:0 0 10px 0; color:#0f0;">🔍 DIAGNÓSTICO AUTOCOMPLETE</h3>';
        
        // 1. Verificar container de sugestões
        const suggestionsDiv = document.querySelector('.location-suggestions');
        html += `<div style="margin-bottom:10px;"><strong>1. Container de Sugestões:</strong><br>`;
        html += `   Existe: ${suggestionsDiv ? '✅ SIM' : '❌ NÃO'}<br>`;
        
        if (suggestionsDiv) {
            const styles = window.getComputedStyle(suggestionsDiv);
            html += `   Position: ${styles.position}<br>`;
            html += `   Display: ${styles.display}<br>`;
            html += `   Visibility: ${styles.visibility}<br>`;
            html += `   Opacity: ${styles.opacity}<br>`;
            html += `   Z-index: ${styles.zIndex}<br>`;
            html += `   Top: ${styles.top}<br>`;
            html += `   Left: ${styles.left}<br>`;
            html += `   Width: ${styles.width}<br>`;
            html += `   Height: ${styles.height}<br>`;
            html += `   HTML: ${suggestionsDiv.outerHTML.substring(0, 200)}...<br>`;
        }
        html += `</div>`;
        
        // 2. Verificar campo de localização
        const locationField = document.querySelector(CONFIG.inputSelector);
        html += `<div style="margin-bottom:10px;"><strong>2. Campo de Localização:</strong><br>`;
        html += `   Existe: ${locationField ? '✅ SIM' : '❌ NÃO'}<br>`;
        
        if (locationField) {
            const fieldStyles = window.getComputedStyle(locationField);
            html += `   Position: ${fieldStyles.position}<br>`;
            html += `   Z-index: ${fieldStyles.zIndex}<br>`;
            html += `   Visível: ${locationField.offsetParent !== null ? '✅ SIM' : '❌ NÃO'}<br>`;
            html += `   Placeholder: ${locationField.placeholder}<br>`;
        }
        html += `</div>`;
        
        // 3. Status do módulo
        html += `<div style="margin-bottom:10px;"><strong>3. Status do Módulo:</strong><br>`;
        html += `   Módulo carregado: ${typeof window.LocationAutocomplete === 'object' ? '✅ SIM' : '❌ NÃO'}<br>`;
        html += `   Autocomplete ativo: ${currentInput !== null ? '✅ SIM' : '❌ NÃO'}<br>`;
        html += `   Estilos aplicados: ${forceStylesApplied ? '✅ SIM' : '❌ NÃO'}<br>`;
        html += `   Container ativo: ${suggestionsContainer !== null ? '✅ SIM' : '❌ NÃO'}<br>`;
        html += `</div>`;
        
        // 4. Teste de filtro
        const testResults = filterBairros('Ponta');
        html += `<div style="margin-bottom:10px;"><strong>4. Teste de Filtro ("Ponta"):</strong><br>`;
        html += `   Resultados: ${testResults.length}<br>`;
        html += `   Bairros: ${testResults.join(', ')}<br>`;
        html += `</div>`;
        
        // 5. Teste de criação do container
        html += `<div style="margin-bottom:10px;"><strong>5. Teste de Criação:</strong><br>`;
        
        resultPanel.innerHTML = html;
        document.body.appendChild(resultPanel);
        
        // Executar teste de input
        if (locationField) {
            html += `   Simulando digitação "Ponta"...<br>`;
            resultPanel.innerHTML = html;
            
            const originalValue = locationField.value;
            locationField.value = 'Ponta';
            locationField.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const suggestionsAfter = document.querySelector('.location-suggestions');
                const afterHtml = document.createElement('div');
                afterHtml.innerHTML = `<br>   Container após input: ${suggestionsAfter ? '✅ CRIADO' : '❌ NÃO CRIADO'}<br>`;
                
                if (suggestionsAfter) {
                    afterHtml.innerHTML += `   Itens: ${suggestionsAfter.children.length}<br>`;
                    afterHtml.innerHTML += `   HTML: ${suggestionsAfter.outerHTML.substring(0, 300)}...<br>`;
                    
                    // Verificar cores
                    const firstItem = suggestionsAfter.querySelector('.location-suggestions-item');
                    if (firstItem) {
                        const color = window.getComputedStyle(firstItem).color;
                        const bgColor = window.getComputedStyle(firstItem).backgroundColor;
                        afterHtml.innerHTML += `   Cor do texto: ${color}<br>`;
                        afterHtml.innerHTML += `   Cor do fundo: ${bgColor}<br>`;
                        afterHtml.innerHTML += `   Conflito de cores: ${color === bgColor ? '⚠️ SIM' : '✅ NÃO'}<br>`;
                    }
                    
                    // Verificar posição
                    const rect = suggestionsAfter.getBoundingClientRect();
                    afterHtml.innerHTML += `   Posição: top=${rect.top}, left=${rect.left}<br>`;
                    afterHtml.innerHTML += `   Na tela: ${rect.top >= 0 && rect.bottom <= window.innerHeight ? '✅ SIM' : '❌ NÃO'}<br>`;
                }
                
                resultPanel.innerHTML = html + afterHtml.innerHTML;
                
                // Adicionar botões de ação
                const buttonsDiv = document.createElement('div');
                buttonsDiv.style.marginTop = '15px';
                buttonsDiv.style.display = 'flex';
                buttonsDiv.style.gap = '10px';
                buttonsDiv.innerHTML = `
                    <button id="diag-force-fix" style="background:#1a5276; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                        🔧 Forçar Correção
                    </button>
                    <button id="diag-close" style="background:#666; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                        ✕ Fechar
                    </button>
                `;
                
                resultPanel.appendChild(buttonsDiv);
                
                document.getElementById('diag-force-fix')?.addEventListener('click', () => {
                    forceVisualFix();
                    alert('✅ Correção visual aplicada! O container foi reestilizado.');
                });
                
                document.getElementById('diag-close')?.addEventListener('click', () => {
                    resultPanel.remove();
                    locationField.value = originalValue;
                    hideSuggestions();
                });
                
                console.log('✅ Diagnóstico avançado concluído');
            }, 300);
        } else {
            html += `   ❌ Campo não encontrado - não foi possível testar<br>`;
            resultPanel.innerHTML = html;
            
            setTimeout(() => {
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Fechar';
                closeBtn.style.cssText = 'margin-top:10px; padding:5px 10px; background:#666; color:white; border:none; border-radius:5px; cursor:pointer;';
                closeBtn.onclick = () => resultPanel.remove();
                resultPanel.appendChild(closeBtn);
            }, 100);
        }
    }
    
    /**
     * Força correção visual e mostra resultado
     */
    function forceVisualFix() {
        console.log('🔧 Aplicando correção visual forçada...');
        applyForceStyles();
        
        if (suggestionsContainer) {
            const inputRect = currentInput?.getBoundingClientRect();
            if (inputRect) {
                suggestionsContainer.style.cssText = `
                    position: absolute !important;
                    z-index: 999999 !important;
                    background: white !important;
                    border: 2px solid #1a5276 !important;
                    border-radius: 8px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
                    width: ${inputRect.width}px !important;
                    top: ${inputRect.bottom + window.scrollY + 4}px !important;
                    left: ${inputRect.left + window.scrollX}px !important;
                    display: block !important;
                    max-height: 300px !important;
                    overflow-y: auto !important;
                `;
                console.log('✅ Container reestilizado');
            }
        }
        
        // Notificação visual
        showNotification('✅ Correção visual aplicada!', '#27ae60');
    }
    
    /**
     * Mostra notificação na tela
     */
    function showNotification(message, color = '#27ae60') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999999;
            font-family: monospace;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        // Adicionar animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    /**
     * Aplica estilos de correção visual forçada
     */
    function applyForceStyles() {
        if (forceStylesApplied) return;
        
        console.log('🎨 Aplicando estilos de correção visual...');
        
        const style = document.createElement('style');
        style.id = 'location-autocomplete-force-styles';
        style.textContent = `
            .location-suggestions {
                position: absolute !important;
                background: white !important;
                border: 2px solid #1a5276 !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
                max-height: 300px !important;
                overflow-y: auto !important;
                z-index: 999999 !important;
                margin-top: 4px !important;
            }
            .location-suggestions-item {
                padding: 10px 12px !important;
                cursor: pointer !important;
                border-bottom: 1px solid #e0e0e0 !important;
                font-size: 0.9rem !important;
                color: #333333 !important;
                background: white !important;
                display: block !important;
            }
            .location-suggestions-item:hover {
                background: #f0f7ff !important;
            }
            .location-suggestions-item strong {
                color: #1a5276 !important;
                background: #e8f0fe !important;
                padding: 0 2px !important;
                border-radius: 3px !important;
            }
        `;
        
        const oldStyle = document.getElementById('location-autocomplete-force-styles');
        if (oldStyle) oldStyle.remove();
        
        document.head.appendChild(style);
        forceStylesApplied = true;
        console.log('✅ Estilos de correção visual aplicados');
        showNotification('🎨 Estilos de correção aplicados', '#1a5276');
    }
    
    /**
     * Filtra bairros
     */
    function filterBairros(searchText) {
        if (!searchText || searchText.length < CONFIG.minChars) return [];
        
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
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: 1px solid #e0e0e0;
            font-size: 0.9rem;
            color: #333333;
            background: white;
            display: block;
        `;
        
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
        
        div.addEventListener('click', () => {
            if (currentInput) {
                currentInput.value = bairro;
                hideSuggestions();
                const event = new Event('input', { bubbles: true });
                currentInput.dispatchEvent(event);
                showNotification(`📍 Bairro selecionado: ${bairro}`, '#27ae60');
            }
        });
        
        div.addEventListener('mouseenter', () => div.style.backgroundColor = '#f0f7ff');
        div.addEventListener('mouseleave', () => div.style.backgroundColor = 'white');
        
        return div;
    }
    
    /**
     * Mostra sugestões
     */
    function showSuggestions(suggestions, searchText) {
        hideSuggestions();
        if (!suggestions.length || !currentInput) return;
        
        applyForceStyles();
        
        const rect = currentInput.getBoundingClientRect();
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = CONFIG.suggestionsClass;
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
        `;
        
        suggestions.forEach(bairro => {
            suggestionsContainer.appendChild(createSuggestionElement(bairro, searchText));
        });
        
        document.body.appendChild(suggestionsContainer);
        console.log(`📍 Sugestões exibidas: ${suggestions.length} resultados`);
        
        setTimeout(() => {
            document.addEventListener('click', function onClickOutside(e) {
                if (!suggestionsContainer?.contains(e.target) && e.target !== currentInput) {
                    hideSuggestions();
                    document.removeEventListener('click', onClickOutside);
                }
            });
        }, 0);
    }
    
    function hideSuggestions() {
        if (suggestionsContainer) {
            suggestionsContainer.remove();
            suggestionsContainer = null;
        }
    }
    
    function onInputChange(e) {
        const searchText = e.target.value;
        if (debounceTimer) clearTimeout(debounceTimer);
        
        if (!searchText || searchText.length < CONFIG.minChars) {
            hideSuggestions();
            return;
        }
        
        debounceTimer = setTimeout(() => {
            const suggestions = filterBairros(searchText);
            showSuggestions(suggestions, searchText);
        }, CONFIG.debounceDelay);
    }
    
    function init() {
        const input = document.querySelector(CONFIG.inputSelector);
        if (!input) return false;
        if (currentInput === input) return true;
        
        if (currentInput) {
            currentInput.removeEventListener('input', onInputChange);
            currentInput.removeEventListener('blur', () => setTimeout(hideSuggestions, 200));
        }
        
        currentInput = input;
        currentInput.setAttribute('autocomplete', 'off');
        currentInput.setAttribute('placeholder', 'Ex: Ponta Verde, Maceió-AL (digite o bairro)');
        currentInput.addEventListener('input', onInputChange);
        currentInput.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
        currentInput.style.position = 'relative';
        
        applyForceStyles();
        
        // Criar botão de diagnóstico
        createDiagnosticButton();
        
        console.log('✅ Autocomplete inicializado com', BAIRROS_OFICIAIS.length, 'bairros');
        showNotification('✅ Autocomplete inicializado! Digite o nome do bairro', '#27ae60');
        
        return true;
    }
    
    function destroy() {
        if (currentInput) {
            currentInput.removeEventListener('input', onInputChange);
            currentInput.removeEventListener('blur', () => setTimeout(hideSuggestions, 200));
            currentInput = null;
        }
        hideSuggestions();
        if (debounceTimer) clearTimeout(debounceTimer);
    }
    
    function createDiagnosticButton() {
        if (diagnosticButton) return;
        
        diagnosticButton = document.createElement('div');
        diagnosticButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #1a5276;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999998;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-size: 24px;
            font-family: monospace;
            transition: all 0.3s ease;
        `;
        diagnosticButton.innerHTML = '🔍';
        diagnosticButton.title = 'Clique para diagnosticar o autocomplete';
        
        diagnosticButton.addEventListener('click', () => {
            runAdvancedDiagnostic();
        });
        
        diagnosticButton.addEventListener('mouseenter', () => {
            diagnosticButton.style.transform = 'scale(1.1)';
        });
        
        diagnosticButton.addEventListener('mouseleave', () => {
            diagnosticButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(diagnosticButton);
        console.log('✅ Botão de diagnóstico criado (🔍)');
    }
    
    // API Pública
    window.LocationAutocomplete = {
        init,
        destroy,
        isActive: () => currentInput !== null,
        forceVisualFix,
        runDiagnostic: runAdvancedDiagnostic,
        testSuggestions: () => {
            const field = document.querySelector(CONFIG.inputSelector);
            if (field) {
                field.value = 'Ponta';
                field.dispatchEvent(new Event('input', { bubbles: true }));
                showNotification('🧪 Testando "Ponta"...', '#1a5276');
            }
        },
        getBairrosList: () => [...BAIRROS_OFICIAIS],
        CONFIG
    };
    
    // Auto-registro
    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register('LocationAutocomplete.init', init, 'ui', { isSafe: true });
        window.DiagnosticRegistry.register('LocationAutocomplete.runDiagnostic', runAdvancedDiagnostic, 'ui', { isSafe: true });
        window.DiagnosticRegistry.register('LocationAutocomplete.forceVisualFix', forceVisualFix, 'ui', { isSafe: true });
    }
    
    // Auto-inicialização
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500);
    }
    
    console.log('✅ location-autocomplete.js v1.0.5 carregado -', BAIRROS_OFICIAIS.length, 'bairros');
    console.log('📋 Clique no botão 🔍 no canto inferior direito para executar diagnóstico completo');
})();
