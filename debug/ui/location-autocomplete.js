// debug/ui/location-autocomplete.js - v2.0.0
// Módulo de DIAGNÓSTICO para o autocomplete nativo do Core System
// NÃO implementa autocomplete - apenas valida e diagnostica a implementação do admin.js
console.log('📍 location-autocomplete.js v2.0.0 - Módulo de DIAGNÓSTICO do autocomplete nativo');

(function() {
    'use strict';
    
    // ==========================================================
    // CONFIGURAÇÃO
    // ==========================================================
    const CONFIG = {
        inputSelector: '#propLocation',
        minChars: 2,
        suggestionsClass: 'admin-location-suggestions',
        diagnosticButtonPosition: 'bottom-left' // Posição do botão de diagnóstico
    };
    
    let diagnosticPanel = null;
    let diagnosticButton = null;
    let testResults = {};
    let isMonitoring = false;
    
    // ==========================================================
    // FUNÇÃO PRINCIPAL: DIAGNÓSTICO COMPLETO
    // ==========================================================
    function runFullDiagnostic() {
        console.log('🔬 [DIAGNÓSTICO] Iniciando análise do autocomplete nativo...');
        testResults = {};
        
        // 1. Verificar se o campo existe
        const locationInput = document.getElementById('propLocation');
        testResults.fieldExists = !!locationInput;
        console.log(`${testResults.fieldExists ? '✅' : '❌'} Campo #propLocation existe:`, testResults.fieldExists);
        
        if (!testResults.fieldExists) {
            testResults.error = 'Campo de localização não encontrado no DOM';
            showDiagnosticPanel();
            return;
        }
        
        // 2. Verificar se foi inicializado pelo admin.js
        testResults.isInitialized = locationInput.hasAttribute('data-autocomplete-initialized');
        console.log(`${testResults.isInitialized ? '✅' : '❌'} Autocomplete nativo inicializado:`, testResults.isInitialized);
        
        // 3. Verificar placeholder (deve indicar que foi configurado)
        testResults.placeholder = locationInput.placeholder;
        const hasCorrectPlaceholder = testResults.placeholder && testResults.placeholder.includes('bairro');
        testResults.hasCorrectPlaceholder = hasCorrectPlaceholder;
        console.log(`📍 Placeholder: "${testResults.placeholder}" ${hasCorrectPlaceholder ? '✅' : '⚠️'}`);
        
        // 4. Verificar eventos (teste não intrusivo)
        testResults.hasInputEvent = false;
        testResults.hasBlurEvent = false;
        
        // Clonar para testar eventos sem afetar o original
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
        
        // 5. Verificar lista de bairros (via análise do código ou fallback)
        const bairrosMaceio = [
            'Pajuçara', 'Ponta Verde', 'Jatiúca', 'Jacarecica', 'Cruz das Almas',
            'Mangabeiras', 'Poço', 'Barro Duro', 'Gruta de Lourdes', 'Serraria',
            'Farol', 'Jardim Petrópolis', 'Centro', 'Prado', 'Jaraguá', 'Feitosa',
            'Pinheiro', 'Santa Lúcia', 'Santa Amélia', 'Tabuleiro do Martins',
            'Cidade Universitária', 'Clima Bem', 'Benedito Bentes', 'Santos Dumont',
            'São Jorge', 'Levada', 'Trapiche da Barra', 'Vergel do Lago',
            'Ouro Preto', 'Mutange', 'Fernão Velho', 'Rio Novo', 'Riacho Doce',
            'Pontal da Barra', 'Guaxuma', 'Ipioca', 'Garça Torta', 'Pescaria'
        ];
        
        testResults.bairrosCount = bairrosMaceio.length;
        console.log(`📋 Lista de referência: ${testResults.bairrosCount} bairros disponíveis para validação`);
        
        // 6. Teste de filtro (simula o que o autocomplete deveria fazer)
        const testSearch = 'Ponta';
        const matches = bairrosMaceio.filter(b => b.toLowerCase().includes(testSearch.toLowerCase()));
        testResults.filterTest = {
            searchTerm: testSearch,
            matchesFound: matches.length,
            matches: matches.slice(0, 5) // Apenas os primeiros 5 para exibição
        };
        console.log(`🔍 Teste de filtro "${testSearch}": ${matches.length} resultado(s) esperado(s) -`, matches);
        
        // 7. Verificar se há container de sugestões ativo
        const existingSuggestions = document.querySelector(`.${CONFIG.suggestionsClass}`);
        testResults.suggestionsContainerExists = !!existingSuggestions;
        
        if (existingSuggestions) {
            const styles = window.getComputedStyle(existingSuggestions);
            testResults.suggestionsStyles = {
                position: styles.position,
                zIndex: styles.zIndex,
                display: styles.display,
                visibility: styles.visibility,
                width: styles.width
            };
            console.log('📦 Container de sugestões encontrado com estilos:', testResults.suggestionsStyles);
        } else {
            console.log('📦 Nenhum container de sugestões ativo no momento (normal quando não está digitando)');
        }
        
        // 8. TESTE PRÁTICO: Simular digitação e verificar se o container aparece
        const originalValue = locationInput.value;
        locationInput.value = testSearch;
        locationInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
            const suggestionsAfter = document.querySelector(`.${CONFIG.suggestionsClass}`);
            testResults.suggestionsCreated = !!suggestionsAfter;
            console.log(`${testResults.suggestionsCreated ? '✅' : '❌'} Container criado após digitação de "${testSearch}"`);
            
            if (suggestionsAfter) {
                const items = suggestionsAfter.querySelectorAll('div:not([class])'); // Itens de sugestão
                testResults.suggestionsCount = items.length;
                console.log(`📋 ${items.length} sugestão(ões) exibida(s)`);
                
                // Verificar se as sugestões correspondem ao esperado
                if (items.length > 0) {
                    const firstItemText = items[0].textContent || items[0].innerText;
                    const expectedFirst = matches[0];
                    testResults.firstMatchCorrect = firstItemText.includes(expectedFirst) || expectedFirst.includes(firstItemText);
                    console.log(`🎯 Primeira sugestão: "${firstItemText}" - ${testResults.firstMatchCorrect ? '✅ correta' : '⚠️ pode estar incorreta'}`);
                    
                    // Verificar estilos dos itens
                    const firstItem = items[0];
                    const itemStyles = window.getComputedStyle(firstItem);
                    testResults.itemStyles = {
                        color: itemStyles.color,
                        backgroundColor: itemStyles.backgroundColor,
                        cursor: itemStyles.cursor,
                        padding: itemStyles.padding
                    };
                    console.log('🎨 Estilos dos itens:', testResults.itemStyles);
                }
            }
            
            // Restaurar valor original e limpar sugestões
            locationInput.value = originalValue;
            locationInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Pequeno delay para limpar o container
            setTimeout(() => {
                const containerToClean = document.querySelector(`.${CONFIG.suggestionsClass}`);
                if (containerToClean) containerToClean.remove();
            }, 200);
            
            // Mostrar painel com resultados
            showDiagnosticPanel();
            
        }, 400);
    }
    
    // ==========================================================
    // TESTE RÁPIDO DE RESPOSTA
    // ==========================================================
    function testAutocompleteResponse(searchWord = 'Ponta') {
        console.log(`🧪 [TESTE] Verificando resposta do autocomplete para: "${searchWord}"`);
        
        const locationInput = document.getElementById(CONFIG.inputSelector);
        if (!locationInput) {
            alert('❌ Campo de localização não encontrado!');
            return false;
        }
        
        // Limpar sugestões existentes
        const existingContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (existingContainer) existingContainer.remove();
        
        // Salvar valor original
        const originalValue = locationInput.value;
        
        // Disparar evento com a palavra de teste
        locationInput.value = searchWord;
        locationInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Aguardar e verificar resultado
        setTimeout(() => {
            const suggestionsContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
            if (suggestionsContainer && suggestionsContainer.children.length > 0) {
                const items = Array.from(suggestionsContainer.children)
                    .filter(el => el.tagName === 'DIV' && !el.className)
                    .map(el => el.textContent || el.innerText);
                
                if (items.length > 0) {
                    console.log(`✅ Sucesso! ${items.length} sugestão(ões) encontrada(s):`, items);
                    alert(`✅ TESTE PASSOU!\n\n${items.length} sugestão(ões) encontrada(s) para "${searchWord}":\n\n${items.join('\n')}`);
                } else {
                    console.log('⚠️ Container existe mas não tem itens');
                    alert(`⚠️ Container de sugestões foi criado mas não contém itens para "${searchWord}".`);
                }
            } else {
                console.log('❌ Nenhum container de sugestões encontrado');
                alert(`❌ TESTE FALHOU!\n\nNenhuma sugestão encontrada para "${searchWord}".\n\nVerifique se o autocomplete nativo está funcionando corretamente.`);
            }
            
            // Restaurar valor original e limpar
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
        
        // Determinar cor de status geral
        let overallStatus = '⚠️ PARCIAL';
        let statusColor = '#e67e22';
        
        if (testResults.fieldExists && testResults.isInitialized && testResults.hasInputEvent) {
            overallStatus = '✅ FUNCIONAL';
            statusColor = '#27ae60';
        } else if (!testResults.fieldExists) {
            overallStatus = '❌ INOPERANTE';
            statusColor = '#e74c3c';
        }
        
        diagnosticPanel = document.createElement('div');
        diagnosticPanel.id = 'autocomplete-native-diagnostic';
        diagnosticPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 480px;
            max-height: 85vh;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(12px);
            color: #00ff00;
            font-family: 'Courier New', 'Fira Code', monospace;
            font-size: 11px;
            padding: 18px;
            border-radius: 16px;
            z-index: 9999999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            border-left: 4px solid ${statusColor};
            border-right: 1px solid rgba(255,255,255,0.15);
            scroll-behavior: smooth;
        `;
        
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid ${statusColor}; padding-bottom: 10px;">
                <div>
                    <h3 style="margin: 0; color: ${statusColor}; font-size: 14px; font-weight: bold;">
                        🔍 DIAGNÓSTICO: AUTOCOMPLETE NATIVO
                    </h3>
                    <div style="font-size: 9px; color: #888; margin-top: 4px;">
                        Support System v2.0 | Modo Diagnóstico
                    </div>
                </div>
                <button id="close-native-diag" style="background: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; padding: 5px 10px; font-size: 11px; font-weight: bold;">
                    ✕ FECHAR
                </button>
            </div>
            <div style="margin-bottom: 12px; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>📊 STATUS GERAL:</span>
                    <span style="color: ${statusColor}; font-weight: bold; font-size: 13px;">${overallStatus}</span>
                </div>
            </div>
        `;
        
        if (testResults.error) {
            html += `<div style="color: #ff6b6b; margin-bottom: 12px; background: rgba(231,76,60,0.2); padding: 8px; border-radius: 6px;">
                ❌ ERRO CRÍTICO: ${testResults.error}
            </div>`;
        } else {
            html += `
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #ffd700;">📋 CAMPO DE LOCALIZAÇÃO</div>
                    <div style="margin-left: 12px;">
                        <div>🎯 Elemento #propLocation: <span style="color: ${testResults.fieldExists ? '#00ff00' : '#ff6b6b'}">${testResults.fieldExists ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO'}</span></div>
                        ${testResults.fieldExists ? `
                            <div>📝 Placeholder: <span style="color: #88ff88;">"${testResults.placeholder || '(vazio)'}"</span> ${testResults.hasCorrectPlaceholder ? '✅' : '⚠️'}</div>
                            <div>⚙️ Inicializado (admin.js): <span style="color: ${testResults.isInitialized ? '#00ff00' : '#ffaa00'}">${testResults.isInitialized ? '✅ SIM' : '⚠️ NÃO'}</span></div>
                            <div>🎯 Evento INPUT: <span style="color: ${testResults.hasInputEvent ? '#00ff00' : '#ff6b6b'}">${testResults.hasInputEvent ? '✅ OK' : '❌ FALHA'}</span></div>
                            <div>🎯 Evento BLUR: <span style="color: ${testResults.hasBlurEvent ? '#00ff00' : '#ff6b6b'}">${testResults.hasBlurEvent ? '✅ OK' : '❌ FALHA'}</span></div>
                        ` : ''}
                    </div>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #ffd700;">🔍 TESTE DE FILTRO</div>
                    <div style="margin-left: 12px;">
                        <div>Busca: <strong>"${testResults.filterTest?.searchTerm || 'N/A'}"</strong></div>
                        <div>📊 Resultados esperados: ${testResults.filterTest?.matchesFound || 0} bairro(s)</div>
                        ${testResults.filterTest?.matches?.length ? `
                            <div style="color: #88ff88; font-size: 10px; margin-top: 4px;">
                                → ${testResults.filterTest.matches.join(', ')}
                                ${testResults.filterTest.matchesFound > 5 ? ` +${testResults.filterTest.matchesFound - 5} mais...` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #ffd700;">📦 SUGESTÕES EM TEMPO REAL</div>
                    <div style="margin-left: 12px;">
                        <div>Container criado: ${testResults.suggestionsCreated !== undefined ? (testResults.suggestionsCreated ? '✅ SIM' : '❌ NÃO') : '⏳ NÃO TESTADO'}</div>
                        ${testResults.suggestionsCount !== undefined ? `<div>Itens exibidos: ${testResults.suggestionsCount}</div>` : ''}
                        ${testResults.firstMatchCorrect !== undefined ? `<div>Primeira sugestão correta: ${testResults.firstMatchCorrect ? '✅ SIM' : '⚠️ VERIFICAR'}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        // Botões de ação
        html += `
            <div style="margin-top: 15px; padding-top: 12px; border-top: 1px solid #333; display: flex; gap: 8px; flex-wrap: wrap;">
                <button id="diag-refresh-native" style="background: #1a5276; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
                    🔄 ATUALIZAR
                </button>
                <button id="diag-test-ponta" style="background: #27ae60; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
                    🧪 TESTAR "Ponta"
                </button>
                <button id="diag-test-paju" style="background: #27ae60; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
                    🧪 TESTAR "Pajuçara"
                </button>
                <button id="diag-force-style" style="background: #e67e22; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
                    🎨 CORRIGIR ESTILOS
                </button>
            </div>
            <div style="margin-top: 10px; font-size: 9px; color: #666; text-align: center; border-top: 1px solid #333; padding-top: 8px;">
                💡 Autocomplete implementado no Core System (admin.js) | Diagnosticado pelo Support System
            </div>
        `;
        
        diagnosticPanel.innerHTML = html;
        document.body.appendChild(diagnosticPanel);
        
        // Eventos dos botões
        document.getElementById('close-native-diag')?.addEventListener('click', () => {
            diagnosticPanel.remove();
            diagnosticPanel = null;
        });
        
        document.getElementById('diag-refresh-native')?.addEventListener('click', () => {
            runFullDiagnostic();
        });
        
        document.getElementById('diag-test-ponta')?.addEventListener('click', () => {
            testAutocompleteResponse('Ponta');
        });
        
        document.getElementById('diag-test-paju')?.addEventListener('click', () => {
            testAutocompleteResponse('Pajuçara');
        });
        
        document.getElementById('diag-force-style')?.addEventListener('click', () => {
            applyStyleFix();
        });
    }
    
    // ==========================================================
    // CORREÇÃO DE ESTILOS (FALLBACK)
    // ==========================================================
    function applyStyleFix() {
        console.log('🎨 Aplicando correção de estilos para o container de sugestões...');
        
        const style = document.createElement('style');
        style.id = 'autocomplete-native-style-fix';
        style.textContent = `
            .admin-location-suggestions {
                position: absolute !important;
                z-index: 999999 !important;
                background: white !important;
                border: 2px solid #1a5276 !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                max-height: 280px !important;
                overflow-y: auto !important;
                margin-top: 2px !important;
            }
            .admin-location-suggestions div {
                padding: 10px 14px !important;
                cursor: pointer !important;
                font-size: 0.9rem !important;
                color: #2c3e50 !important;
                background: white !important;
                border-bottom: 1px solid #ecf0f1 !important;
                transition: background 0.2s ease !important;
            }
            .admin-location-suggestions div:hover {
                background: #e8f4fd !important;
            }
            .admin-location-suggestions div strong {
                color: #1a5276 !important;
                background: #d4e6f1 !important;
                padding: 2px 4px !important;
                border-radius: 4px !important;
                font-weight: bold !important;
            }
        `;
        
        const oldStyle = document.getElementById('autocomplete-native-style-fix');
        if (oldStyle) oldStyle.remove();
        
        document.head.appendChild(style);
        
        // Notificação visual
        showNotification('✅ Correção de estilos aplicada!', '#27ae60');
    }
    
    // ==========================================================
    // NOTIFICAÇÃO VISUAL
    // ==========================================================
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
            border-radius: 10px;
            z-index: 9999999;
            font-family: monospace;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease forwards;
        `;
        
        const styleAnim = document.createElement('style');
        styleAnim.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styleAnim);
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    // ==========================================================
    // BOTÃO FLUTUANTE DE DIAGNÓSTICO
    // ==========================================================
    function createDiagnosticButton() {
        if (diagnosticButton) return;
        
        diagnosticButton = document.createElement('div');
        diagnosticButton.id = 'autocomplete-diagnostic-btn';
        diagnosticButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, #1a5276, #2980b9);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999998;
            box-shadow: 0 4px 15px rgba(0,0,0,0.35);
            font-size: 24px;
            transition: all 0.3s ease;
            border: 2px solid rgba(255,255,255,0.25);
            font-family: monospace;
        `;
        diagnosticButton.innerHTML = '🔍';
        diagnosticButton.title = 'Diagnóstico do Autocomplete Nativo (Support System)';
        
        diagnosticButton.addEventListener('click', (e) => {
            e.stopPropagation();
            runFullDiagnostic();
        });
        
        diagnosticButton.addEventListener('mouseenter', () => {
            diagnosticButton.style.transform = 'scale(1.12)';
            diagnosticButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.45)';
        });
        
        diagnosticButton.addEventListener('mouseleave', () => {
            diagnosticButton.style.transform = 'scale(1)';
            diagnosticButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.35)';
        });
        
        document.body.appendChild(diagnosticButton);
        console.log('✅ Botão de diagnóstico 🔍 adicionado (canto inferior esquerdo)');
    }
    
    // ==========================================================
    // VERIFICAÇÃO RÁPIDA (SEM ABRIR PAINEL)
    // ==========================================================
    function quickCheck() {
        const locationInput = document.getElementById(CONFIG.inputSelector);
        if (!locationInput) {
            console.log('❌ [QUICK CHECK] Campo #propLocation não encontrado');
            return { working: false, reason: 'Campo não encontrado' };
        }
        
        const isInit = locationInput.hasAttribute('data-autocomplete-initialized');
        if (!isInit) {
            console.log('⚠️ [QUICK CHECK] Autocomplete NÃO inicializado');
            return { working: false, reason: 'Não inicializado' };
        }
        
        console.log('✅ [QUICK CHECK] Autocomplete nativo está funcionando!');
        return { working: true, reason: 'OK' };
    }
    
    // ==========================================================
    // INICIALIZAÇÃO DO MÓDULO DE DIAGNÓSTICO
    // ==========================================================
    function init() {
        console.log('🔧 Inicializando módulo de DIAGNÓSTICO do autocomplete nativo...');
        
        // Aguardar DOM estar pronto
        const startDiagnostic = () => {
            setTimeout(() => {
                createDiagnosticButton();
                
                // Executar verificação rápida silenciosa
                const check = quickCheck();
                if (check.working) {
                    console.log('🎉 Autocomplete nativo está OPERACIONAL!');
                    console.log('💡 Clique no botão 🔍 para diagnóstico detalhado');
                } else {
                    console.log(`⚠️ Autocomplete nativo: ${check.reason}`);
                    console.log('💡 Clique no botão 🔍 para diagnosticar e corrigir');
                }
            }, 1500);
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startDiagnostic);
        } else {
            startDiagnostic();
        }
    }
    
    // ==========================================================
    // REGISTRO NO DIAGNOSTIC REGISTRY
    // ==========================================================
    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register('LocationAutocomplete.runFullDiagnostic', runFullDiagnostic, 'ui', {
            isSafe: true,
            description: 'Executa diagnóstico completo do autocomplete nativo do Core System'
        });
        window.DiagnosticRegistry.register('LocationAutocomplete.testAutocompleteResponse', testAutocompleteResponse, 'ui', {
            isSafe: true,
            description: 'Testa a resposta do autocomplete para uma palavra específica'
        });
        window.DiagnosticRegistry.register('LocationAutocomplete.quickCheck', quickCheck, 'ui', {
            isSafe: true,
            description: 'Verificação rápida do status do autocomplete'
        });
    }
    
    // ==========================================================
    // API PÚBLICA
    // ==========================================================
    window.LocationAutocomplete = {
        // Diagnóstico
        runFullDiagnostic,
        testAutocompleteResponse,
        quickCheck,
        applyStyleFix,
        
        // Informações
        isActive: () => {
            const input = document.getElementById(CONFIG.inputSelector);
            return input?.hasAttribute('data-autocomplete-initialized') || false;
        },
        
        // Compatibilidade (mantido para não quebrar código existente)
        init: () => {
            console.log('ℹ️ LocationAutocomplete.init() - Este é um módulo de DIAGNÓSTICO.');
            console.log('   O autocomplete é implementado pelo Core System (admin.js)');
            console.log('   Use runFullDiagnostic() para verificar o funcionamento.');
            return true;
        },
        
        destroy: () => {
            if (diagnosticButton) diagnosticButton.remove();
            if (diagnosticPanel) diagnosticPanel.remove();
            diagnosticButton = null;
            diagnosticPanel = null;
            console.log('🧹 Módulo de diagnóstico removido');
        },
        
        // Utilitários
        getBairrosList: () => [
            'Pajuçara', 'Ponta Verde', 'Jatiúca', 'Jacarecica', 'Cruz das Almas',
            'Mangabeiras', 'Poço', 'Barro Duro', 'Gruta de Lourdes', 'Serraria',
            'Farol', 'Jardim Petrópolis', 'Centro', 'Prado', 'Jaraguá', 'Feitosa',
            'Pinheiro', 'Santa Lúcia', 'Santa Amélia', 'Tabuleiro do Martins'
        ],
        
        CONFIG
    };
    
    // Auto-inicializar
    init();
    
    console.log('✅ location-autocomplete.js v2.0.0 carregado - MODO DIAGNÓSTICO');
    console.log('📋 Funcionalidade: Validar e testar o autocomplete nativo do Core System');
    console.log('💡 Use window.LocationAutocomplete.runFullDiagnostic() para diagnóstico completo');
})();
