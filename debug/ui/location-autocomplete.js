// debug/ui/location-autocomplete.js - v2.0.2
// Módulo de DIAGNÓSTICO para o autocomplete nativo do Core System
// CORREÇÃO: Busca mais robusta pelo campo #propLocation
console.log('📍 location-autocomplete.js v2.0.2 - Módulo de DIAGNÓSTICO do autocomplete nativo');

(function() {
    'use strict';
    
    // ==========================================================
    // CONFIGURAÇÃO
    // ==========================================================
    const CONFIG = {
        inputSelector: '#propLocation',
        inputSelectors: ['#propLocation', '#propLocation', 'input#propLocation', 'input[name="location"]'],
        minChars: 2,
        suggestionsClass: 'admin-location-suggestions',
        diagnosticButtonPosition: 'bottom-left',
        maxRetries: 15,              // Aumentado para 15 tentativas
        retryDelay: 800              // Aumentado para 800ms entre tentativas
    };
    
    let diagnosticPanel = null;
    let diagnosticButton = null;
    let testResults = {};
    let retryCount = 0;
    let checkInterval = null;
    let isInitialized = false;
    
    // ==========================================================
    // FUNÇÃO DE BUSCA ROBUSTA PELO CAMPO
    // ==========================================================
    function findLocationInput() {
        // Estratégia 1: Busca direta pelo ID
        let input = document.getElementById('propLocation');
        if (input) {
            console.log('📍 Campo encontrado via getElementById');
            return input;
        }
        
        // Estratégia 2: Busca por querySelector
        input = document.querySelector('#propLocation');
        if (input) {
            console.log('📍 Campo encontrado via querySelector');
            return input;
        }
        
        // Estratégia 3: Busca em todo o documento por input com ID aproximado
        const allInputs = document.querySelectorAll('input');
        for (let inp of allInputs) {
            if (inp.id && inp.id.toLowerCase().includes('location')) {
                console.log(`📍 Campo encontrado via busca parcial: #${inp.id}`);
                return inp;
            }
        }
        
        // Estratégia 4: Busca no painel admin especificamente
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            const adminInput = adminPanel.querySelector('input[placeholder*="bairro"], input[placeholder*="Localização"]');
            if (adminInput) {
                console.log('📍 Campo encontrado dentro do painel admin por placeholder');
                return adminInput;
            }
        }
        
        console.log('❌ Campo #propLocation NÃO encontrado por nenhuma estratégia');
        return null;
    }
    
    // ==========================================================
    // FUNÇÃO PRINCIPAL: DIAGNÓSTICO COMPLETO
    // ==========================================================
    function runFullDiagnostic() {
        console.log('🔬 [DIAGNÓSTICO] Iniciando análise do autocomplete nativo...');
        testResults = {};
        
        // Usar busca robusta
        const locationInput = findLocationInput();
        testResults.fieldExists = !!locationInput;
        testResults.searchMethod = locationInput ? 'encontrado' : 'não encontrado';
        
        console.log(`${testResults.fieldExists ? '✅' : '❌'} Campo #propLocation existe:`, testResults.fieldExists);
        
        if (!testResults.fieldExists) {
            testResults.error = 'Campo de localização não encontrado no DOM. Verifique se o painel admin está aberto.';
            testResults.suggestion = 'O campo #propLocation só existe quando o painel admin está visível ou após o admin.js carregar. Abra o painel admin primeiro (botão ⚙️ no canto inferior direito).';
            showDiagnosticPanel();
            return;
        }
        
        // Se encontrou, registrar detalhes
        console.log(`📍 ID do campo: ${locationInput.id}`);
        console.log(`📍 Classe do campo: ${locationInput.className}`);
        console.log(`📍 Visível: ${locationInput.offsetParent !== null}`);
        
        // 2. Verificar se foi inicializado pelo admin.js
        testResults.isInitialized = locationInput.hasAttribute('data-autocomplete-initialized');
        console.log(`${testResults.isInitialized ? '✅' : '❌'} Autocomplete nativo inicializado:`, testResults.isInitialized);
        
        // 3. Verificar placeholder
        testResults.placeholder = locationInput.placeholder;
        const hasCorrectPlaceholder = testResults.placeholder && (testResults.placeholder.includes('bairro') || testResults.placeholder.includes('digite'));
        testResults.hasCorrectPlaceholder = hasCorrectPlaceholder;
        console.log(`📍 Placeholder: "${testResults.placeholder}" ${hasCorrectPlaceholder ? '✅' : '⚠️'}`);
        
        // 4. Verificar eventos
        testResults.hasInputEvent = false;
        testResults.hasBlurEvent = false;
        
        const testInput = locationInput.cloneNode(true);
        let inputTriggered = false;
        let blurTriggered = false;
        
        testInput.addEventListener('input', () => { inputTriggered = true; });
        testInput.addEventListener('blur', () => { blurTriggered = true; });
        
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.dispatchEvent(new Event('blur', { bubbles: true }));
        
        testResults.hasInputEvent = inputTriggered;
        testResults.hasBlurEvent = blurTriggered;
        console.log(`${testResults.hasInputEvent ? '✅' : '❌'} Evento INPUT configurado`);
        console.log(`${testResults.hasBlurEvent ? '✅' : '❌'} Evento BLUR configurado`);
        
        // 5. Lista de bairros para referência
        const bairrosMaceio = [
            'Pajuçara', 'Ponta Verde', 'Jatiúca', 'Jacarecica', 'Cruz das Almas',
            'Mangabeiras', 'Poço', 'Barro Duro', 'Gruta de Lourdes', 'Serraria',
            'Farol', 'Jardim Petrópolis', 'Centro', 'Prado', 'Jaraguá', 'Feitosa',
            'Pinheiro', 'Santa Lúcia', 'Santa Amélia', 'Tabuleiro do Martins',
            'Cidade Universitária', 'Clima Bom', 'Benedito Bentes', 'Santos Dumont',
            'São Jorge', 'Levada', 'Trapiche da Barra', 'Vergel do Lago',
            'Ouro Preto', 'Mutange', 'Fernão Velho', 'Rio Novo', 'Riacho Doce',
            'Pontal da Barra', 'Guaxuma', 'Ipioca', 'Garça Torta', 'Pescaria'
        ];
        
        testResults.bairrosCount = bairrosMaceio.length;
        
        // 6. Teste de filtro
        const testSearch = 'Ponta';
        const matches = bairrosMaceio.filter(b => b.toLowerCase().includes(testSearch.toLowerCase()));
        testResults.filterTest = {
            searchTerm: testSearch,
            matchesFound: matches.length,
            matches: matches.slice(0, 5)
        };
        console.log(`🔍 Teste de filtro "${testSearch}": ${matches.length} resultado(s)`);
        
        // 7. Verificar container de sugestões
        const existingSuggestions = document.querySelector(`.${CONFIG.suggestionsClass}`);
        testResults.suggestionsContainerExists = !!existingSuggestions;
        
        if (existingSuggestions) {
            const styles = window.getComputedStyle(existingSuggestions);
            testResults.suggestionsStyles = {
                position: styles.position,
                zIndex: styles.zIndex,
                display: styles.display,
                width: styles.width
            };
            console.log('📦 Container de sugestões encontrado');
        }
        
        // 8. TESTE PRÁTICO (se o campo existe)
        if (locationInput) {
            const originalValue = locationInput.value;
            locationInput.value = testSearch;
            locationInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const suggestionsAfter = document.querySelector(`.${CONFIG.suggestionsClass}`);
                testResults.suggestionsCreated = !!suggestionsAfter;
                console.log(`${testResults.suggestionsCreated ? '✅' : '❌'} Container criado após digitação`);
                
                if (suggestionsAfter) {
                    const items = suggestionsAfter.querySelectorAll('div:not([class])');
                    testResults.suggestionsCount = items.length;
                    console.log(`📋 ${items.length} sugestão(ões) exibida(s)`);
                    
                    if (items.length > 0) {
                        const firstItemText = items[0].textContent || items[0].innerText;
                        testResults.firstSuggestion = firstItemText;
                    }
                }
                
                locationInput.value = originalValue;
                locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
                    if (container) container.remove();
                }, 200);
                
                showDiagnosticPanel();
            }, 400);
        } else {
            showDiagnosticPanel();
        }
    }
    
    // ==========================================================
    // TESTE RÁPIDO DE RESPOSTA
    // ==========================================================
    function testAutocompleteResponse(searchWord = 'Ponta') {
        console.log(`🧪 [TESTE] Verificando resposta para: "${searchWord}"`);
        
        const locationInput = findLocationInput();
        if (!locationInput) {
            alert('❌ Campo de localização não encontrado! Abra o painel admin primeiro.');
            return false;
        }
        
        const existingContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (existingContainer) existingContainer.remove();
        
        const originalValue = locationInput.value;
        locationInput.value = searchWord;
        locationInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
            const suggestionsContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
            if (suggestionsContainer && suggestionsContainer.children.length > 0) {
                const items = Array.from(suggestionsContainer.children)
                    .filter(el => el.tagName === 'DIV' && !el.className)
                    .map(el => el.textContent || el.innerText);
                
                if (items.length > 0) {
                    alert(`✅ TESTE PASSOU!\n\n${items.length} sugestão(ões) para "${searchWord}":\n\n${items.join('\n')}`);
                } else {
                    alert(`⚠️ Container criado mas sem itens para "${searchWord}".`);
                }
            } else {
                alert(`❌ TESTE FALHOU!\n\nNenhuma sugestão encontrada para "${searchWord}".`);
            }
            
            locationInput.value = originalValue;
            locationInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
                if (container) container.remove();
            }, 200);
        }, 500);
        
        return true;
    }
    
    // ==========================================================
    // PAINEL VISUAL DE DIAGNÓSTICO
    // ==========================================================
    function showDiagnosticPanel() {
        if (diagnosticPanel) diagnosticPanel.remove();
        
        let overallStatus = '⚠️ PARCIAL';
        let statusColor = '#e67e22';
        
        if (testResults.fieldExists && testResults.isInitialized && testResults.hasInputEvent) {
            overallStatus = '✅ FUNCIONAL';
            statusColor = '#27ae60';
        } else if (!testResults.fieldExists) {
            overallStatus = '❓ AGUARDANDO PAINEL';
            statusColor = '#3498db';
        }
        
        diagnosticPanel = document.createElement('div');
        diagnosticPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 500px;
            max-height: 85vh;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(12px);
            color: #00ff00;
            font-family: monospace;
            font-size: 11px;
            padding: 18px;
            border-radius: 16px;
            z-index: 9999999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            border-left: 4px solid ${statusColor};
        `;
        
        let html = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid ${statusColor}; padding-bottom: 10px;">
                <h3 style="margin: 0; color: ${statusColor}; font-size: 14px;">🔍 DIAGNÓSTICO AUTOCOMPLETE</h3>
                <button id="close-diag" style="background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 4px 10px;">✕</button>
            </div>
            <div style="margin-bottom: 12px; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 6px;">
                📊 STATUS: <span style="color: ${statusColor}; font-weight: bold;">${overallStatus}</span>
            </div>
        `;
        
        if (testResults.error) {
            html += `<div style="color: #ffaa00; margin-bottom: 12px; padding: 8px; background: rgba(0,0,0,0.5); border-radius: 6px;">
                ⚠️ ${testResults.error}<br>
                <small style="color: #888;">${testResults.suggestion || ''}</small>
            </div>`;
        }
        
        if (testResults.fieldExists) {
            html += `
                <div style="margin-bottom: 10px;">
                    <div>📋 Campo: ${testResults.fieldExists ? '✅ ENCONTRADO' : '❌ NÃO'}</div>
                    <div style="margin-left: 12px;">
                        <div>🔧 Inicializado: ${testResults.isInitialized ? '✅ SIM' : '⚠️ NÃO'}</div>
                        <div>📝 Placeholder: "${testResults.placeholder || ''}"</div>
                        <div>🎯 Eventos: INPUT ${testResults.hasInputEvent ? '✅' : '❌'} | BLUR ${testResults.hasBlurEvent ? '✅' : '❌'}</div>
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    <div>🔍 Teste "${testResults.filterTest?.searchTerm}": ${testResults.filterTest?.matchesFound || 0} resultados</div>
                    <div style="margin-left: 12px; color: #88ff88;">→ ${testResults.filterTest?.matches?.join(', ') || 'N/A'}</div>
                </div>
                <div>
                    <div>📦 Sugestões: ${testResults.suggestionsCreated ? `✅ CRIADO (${testResults.suggestionsCount} itens)` : '⏳ NÃO TESTADO'}</div>
                    ${testResults.firstSuggestion ? `<div style="margin-left: 12px;">🎯 Primeira: "${testResults.firstSuggestion}"</div>` : ''}
                </div>
            `;
        }
        
        html += `
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333; display: flex; gap: 8px; flex-wrap: wrap;">
                <button id="diag-refresh" style="background: #1a5276; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🔄 ATUALIZAR</button>
                <button id="diag-test" style="background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🧪 TESTAR "Ponta"</button>
                <button id="diag-fix-style" style="background: #e67e22; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🎨 CORRIGIR ESTILOS</button>
            </div>
            <div style="margin-top: 8px; font-size: 9px; color: #666; text-align: center;">
                💡 O campo só aparece quando o painel admin está aberto
            </div>
        `;
        
        diagnosticPanel.innerHTML = html;
        document.body.appendChild(diagnosticPanel);
        
        document.getElementById('close-diag')?.addEventListener('click', () => diagnosticPanel.remove());
        document.getElementById('diag-refresh')?.addEventListener('click', () => { diagnosticPanel.remove(); runFullDiagnostic(); });
        document.getElementById('diag-test')?.addEventListener('click', () => testAutocompleteResponse('Ponta'));
        document.getElementById('diag-fix-style')?.addEventListener('click', applyStyleFix);
    }
    
    // ==========================================================
    // CORREÇÃO DE ESTILOS
    // ==========================================================
    function applyStyleFix() {
        const style = document.createElement('style');
        style.id = 'autocomplete-fix-styles';
        style.textContent = `
            .admin-location-suggestions {
                position: absolute !important;
                z-index: 999999 !important;
                background: white !important;
                border: 2px solid #1a5276 !important;
                border-radius: 8px !important;
                max-height: 280px !important;
                overflow-y: auto !important;
            }
            .admin-location-suggestions div {
                padding: 10px 14px !important;
                cursor: pointer !important;
                color: #2c3e50 !important;
                background: white !important;
                border-bottom: 1px solid #ecf0f1 !important;
            }
            .admin-location-suggestions div:hover {
                background: #e8f4fd !important;
            }
            .admin-location-suggestions div strong {
                color: #1a5276 !important;
                background: #d4e6f1 !important;
                padding: 2px 4px !important;
                border-radius: 4px !important;
            }
        `;
        
        const oldStyle = document.getElementById('autocomplete-fix-styles');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
        
        showNotification('✅ Correção de estilos aplicada!', '#27ae60');
    }
    
    function showNotification(message, color) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: ${color}; color: white;
            padding: 10px 20px; border-radius: 8px; z-index: 9999999;
            font-family: monospace; font-size: 13px; animation: fadeOut 3s ease forwards;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    // ==========================================================
    // VERIFICAÇÃO COM RETRY
    // ==========================================================
    function waitForAdminAndCheck() {
        const locationInput = findLocationInput();
        
        if (locationInput) {
            if (checkInterval) clearInterval(checkInterval);
            
            const isInit = locationInput.hasAttribute('data-autocomplete-initialized');
            if (isInit) {
                console.log('✅ [OK] Autocomplete nativo está funcionando!');
                console.log('💡 Clique no botão 🔍 (canto inferior esquerdo) para diagnóstico detalhado');
            } else {
                console.log('⚠️ Campo encontrado, mas autocomplete não inicializado ainda');
            }
            return true;
        }
        
        retryCount++;
        if (retryCount >= CONFIG.maxRetries) {
            if (checkInterval) clearInterval(checkInterval);
            console.log('ℹ️ [INFO] Campo #propLocation não encontrado. Ele só aparece quando o painel admin está aberto.');
            console.log('💡 Abra o painel admin (botão ⚙️ no canto inferior direito) e clique em 🔍 para diagnosticar.');
            return false;
        }
        
        return false;
    }
    
    // ==========================================================
    // BOTÃO FLUTUANTE
    // ==========================================================
    function createDiagnosticButton() {
        if (diagnosticButton) return;
        
        diagnosticButton = document.createElement('div');
        diagnosticButton.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; width: 52px; height: 52px;
            background: linear-gradient(135deg, #1a5276, #2980b9); color: white;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 999998; box-shadow: 0 4px 15px rgba(0,0,0,0.35);
            font-size: 24px; transition: all 0.3s ease; border: 2px solid rgba(255,255,255,0.25);
        `;
        diagnosticButton.innerHTML = '🔍';
        diagnosticButton.title = 'Diagnóstico do Autocomplete';
        
        diagnosticButton.addEventListener('click', () => runFullDiagnostic());
        diagnosticButton.addEventListener('mouseenter', () => {
            diagnosticButton.style.transform = 'scale(1.12)';
        });
        diagnosticButton.addEventListener('mouseleave', () => {
            diagnosticButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(diagnosticButton);
        console.log('✅ Botão 🔍 adicionado (canto inferior esquerdo)');
    }
    
    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================
    function init() {
        console.log('🔧 Inicializando diagnóstico do autocomplete nativo...');
        createDiagnosticButton();
        
        retryCount = 0;
        checkInterval = setInterval(waitForAdminAndCheck, CONFIG.retryDelay);
        
        // Timeout de segurança para limpar o interval
        setTimeout(() => {
            if (checkInterval) clearInterval(checkInterval);
        }, CONFIG.maxRetries * CONFIG.retryDelay + 5000);
    }
    
    // API Pública
    window.LocationAutocomplete = {
        runFullDiagnostic,
        testAutocompleteResponse,
        applyStyleFix,
        isActive: () => {
            const input = findLocationInput();
            return input?.hasAttribute('data-autocomplete-initialized') || false;
        },
        CONFIG
    };
    
    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ location-autocomplete.js v2.0.2 carregado');
    console.log('💡 IMPORTANTE: O diagnóstico só funciona com o painel admin ABERTO!');
    console.log('💡 Abra o painel admin (botão ⚙️ no canto inferior direito) e clique em 🔍');
})();
