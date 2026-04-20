// debug/ui/location-autocomplete.js - v2.0.3
// Módulo de DIAGNÓSTICO e TESTE VISUAL para o autocomplete nativo
console.log('📍 location-autocomplete.js v2.0.3 - Diagnóstico com Teste Visual');

(function() {
    'use strict';
    
    const CONFIG = {
        inputSelector: '#propLocation',
        suggestionsClass: 'admin-location-suggestions',
        maxRetries: 10,
        retryDelay: 500
    };
    
    let diagnosticPanel = null;
    let diagnosticButton = null;
    let testResults = {};
    let retryCount = 0;
    let checkInterval = null;
    
    // ==========================================================
    // FUNÇÃO DE BUSCA ROBUSTA
    // ==========================================================
    function findLocationInput() {
        let input = document.getElementById('propLocation');
        if (input) return input;
        
        input = document.querySelector('#propLocation');
        if (input) return input;
        
        const allInputs = document.querySelectorAll('input');
        for (let inp of allInputs) {
            if (inp.id && inp.id.toLowerCase().includes('location')) return inp;
        }
        
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            const adminInput = adminPanel.querySelector('input[placeholder*="bairro"], input[placeholder*="Localização"]');
            if (adminInput) return adminInput;
        }
        
        return null;
    }
    
    // ==========================================================
    // TESTE VISUAL DO AUTOCOMPLETE
    // ==========================================================
    function testVisualAutocomplete() {
        console.log('🎯 [TESTE VISUAL] Iniciando teste do autocomplete...');
        
        const locationInput = findLocationInput();
        if (!locationInput) {
            alert('❌ Campo de localização não encontrado! Abra o painel admin primeiro.');
            return false;
        }
        
        // Garantir que o painel admin está visível
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel && adminPanel.style.display !== 'block') {
            adminPanel.style.display = 'block';
            console.log('📂 Painel admin aberto automaticamente para teste');
        }
        
        // Rolar até o campo
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Limpar sugestões existentes
        const existingContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (existingContainer) existingContainer.remove();
        
        // Salvar valor original
        const originalValue = locationInput.value;
        
        // Simular digitação "Ponta"
        locationInput.value = '';
        locationInput.focus();
        
        setTimeout(() => {
            console.log('📝 Digitando "P"...');
            locationInput.value = 'P';
            locationInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                console.log('📝 Digitando "Po" (2 caracteres - threshold mínimo)...');
                locationInput.value = 'Po';
                locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    console.log('📝 Digitando "Pont" (4 caracteres - deve ativar)...');
                    locationInput.value = 'Pont';
                    locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    setTimeout(() => {
                        console.log('📝 Digitando "Ponta" (completo)...');
                        locationInput.value = 'Ponta';
                        locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        setTimeout(() => {
                            const suggestionsContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
                            
                            if (suggestionsContainer) {
                                const items = suggestionsContainer.querySelectorAll('div:not([class])');
                                const itemsCount = items.length;
                                const itemsText = Array.from(items).map(el => el.textContent || el.innerText);
                                
                                console.log(`✅ Container encontrado! ${itemsCount} sugestão(ões):`, itemsText);
                                
                                // Destacar o container visualmente
                                suggestionsContainer.style.border = '3px solid #00ff00';
                                suggestionsContainer.style.boxShadow = '0 0 15px rgba(0,255,0,0.5)';
                                
                                setTimeout(() => {
                                    suggestionsContainer.style.border = '';
                                    suggestionsContainer.style.boxShadow = '';
                                }, 2000);
                                
                                alert(`✅ SUCESSO! ${itemsCount} sugestão(ões) encontrada(s):\n\n${itemsText.join('\n')}\n\nO autocomplete está funcionando!`);
                            } else {
                                console.error('❌ Nenhum container de sugestões foi criado!');
                                
                                // Verificar estilos que podem estar bloqueando
                                const allStyles = document.querySelectorAll('style');
                                let hasBlockingStyles = false;
                                
                                alert(`❌ TESTE FALHOU!\n\nNenhuma sugestão apareceu para "Ponta".\n\nPossíveis causas:\n1. O CSS do container pode estar oculto (display:none)\n2. O container pode estar fora da tela (position/overflow)\n3. O JavaScript do autocomplete pode não estar respondendo\n\nClique em "CORRIGIR ESTILOS" no painel de diagnóstico.`);
                            }
                            
                            // Restaurar valor original
                            locationInput.value = originalValue;
                            locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                            
                            setTimeout(() => {
                                const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
                                if (container) container.remove();
                            }, 500);
                            
                        }, 400);
                    }, 300);
                }, 300);
            }, 300);
        }, 300);
        
        return true;
    }
    
    // ==========================================================
    // DIAGNÓSTICO COMPLETO COM VERIFICAÇÃO VISUAL
    // ==========================================================
    function runFullDiagnostic() {
        console.log('🔬 [DIAGNÓSTICO] Iniciando análise completa...');
        testResults = {};
        
        const locationInput = findLocationInput();
        testResults.fieldExists = !!locationInput;
        
        if (!locationInput) {
            testResults.error = 'Campo não encontrado. Abra o painel admin primeiro (botão ⚙️)';
            showDiagnosticPanel();
            return;
        }
        
        // Verificar inicialização
        testResults.isInitialized = locationInput.hasAttribute('data-autocomplete-initialized');
        testResults.placeholder = locationInput.placeholder;
        
        // Verificar se o painel admin está visível
        const adminPanel = document.getElementById('adminPanel');
        testResults.adminPanelVisible = adminPanel && adminPanel.style.display === 'block';
        
        // Verificar estilos do campo
        const inputStyles = window.getComputedStyle(locationInput);
        testResults.inputStyles = {
            position: inputStyles.position,
            zIndex: inputStyles.zIndex,
            visibility: inputStyles.visibility,
            display: inputStyles.display
        };
        
        // Verificar se existe container de sugestões (pode estar oculto)
        const existingContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
        testResults.containerExists = !!existingContainer;
        
        if (existingContainer) {
            const containerStyles = window.getComputedStyle(existingContainer);
            testResults.containerStyles = {
                display: containerStyles.display,
                visibility: containerStyles.visibility,
                position: containerStyles.position,
                top: containerStyles.top,
                left: containerStyles.left,
                zIndex: containerStyles.zIndex
            };
            console.log('📦 Container encontrado com estilos:', testResults.containerStyles);
            
            // Verificar se o container está visível
            const isVisible = containerStyles.display !== 'none' && 
                             containerStyles.visibility !== 'hidden' &&
                             existingContainer.offsetParent !== null;
            testResults.containerVisible = isVisible;
        } else {
            testResults.containerVisible = false;
        }
        
        // Teste de filtro da lista de bairros
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
        
        const testSearch = 'Ponta';
        const matches = bairrosMaceio.filter(b => b.toLowerCase().includes(testSearch.toLowerCase()));
        testResults.filterTest = {
            searchTerm: testSearch,
            matchesFound: matches.length,
            matches: matches
        };
        
        console.log(`🔍 Filtro "${testSearch}": ${matches.length} resultados esperados`);
        
        showDiagnosticPanel();
    }
    
    // ==========================================================
    // PAINEL DE DIAGNÓSTICO COM TESTE VISUAL
    // ==========================================================
    function showDiagnosticPanel() {
        if (diagnosticPanel) diagnosticPanel.remove();
        
        let overallStatus = '⚠️ PARCIAL';
        let statusColor = '#e67e22';
        
        if (testResults.fieldExists && testResults.isInitialized) {
            if (testResults.containerVisible === true) {
                overallStatus = '✅ FUNCIONAL';
                statusColor = '#27ae60';
            } else if (testResults.containerVisible === false && testResults.containerExists) {
                overallStatus = '⚠️ OCULTO (CSS)';
                statusColor = '#e67e22';
            } else {
                overallStatus = '⚠️ AGUARDANDO TESTE';
                statusColor = '#3498db';
            }
        } else if (!testResults.fieldExists) {
            overallStatus = '❓ ABRA O PAINEL';
            statusColor = '#e74c3c';
        }
        
        diagnosticPanel = document.createElement('div');
        diagnosticPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 520px;
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
                ⚠️ ${testResults.error}
            </div>`;
        }
        
        if (testResults.fieldExists) {
            html += `
                <div style="margin-bottom: 10px;">
                    <div>📋 CAMPO: ${testResults.fieldExists ? '✅' : '❌'}</div>
                    <div style="margin-left: 12px;">
                        <div>🔧 Inicializado: ${testResults.isInitialized ? '✅ SIM' : '⚠️ NÃO'}</div>
                        <div>📝 Placeholder: "${testResults.placeholder || ''}"</div>
                        <div>🪟 Painel Admin: ${testResults.adminPanelVisible ? '✅ VISÍVEL' : '⚠️ FECHADO'}</div>
                    </div>
                </div>
            `;
        }
        
        html += `
            <div style="margin-bottom: 10px;">
                <div>🔍 TESTE DE FILTRO "${testResults.filterTest?.searchTerm}":</div>
                <div style="margin-left: 12px; color: #88ff88;">
                    → ${testResults.filterTest?.matchesFound || 0} resultado(s) esperados
                    ${testResults.filterTest?.matches?.length ? `<br>→ ${testResults.filterTest.matches.slice(0, 3).join(', ')}${testResults.filterTest.matches.length > 3 ? '...' : ''}` : ''}
                </div>
            </div>
        `;
        
        if (testResults.containerExists !== undefined) {
            html += `
                <div style="margin-bottom: 10px;">
                    <div>📦 CONTAINER DE SUGESTÕES:</div>
                    <div style="margin-left: 12px;">
                        <div>Existe: ${testResults.containerExists ? '✅' : '❌'}</div>
                        ${testResults.containerExists ? `<div>Visível: ${testResults.containerVisible ? '✅ SIM' : '❌ NÃO (CSS pode estar ocultando)'}</div>` : ''}
                        ${testResults.containerStyles ? `<div style="font-size: 9px; color: #aaa;">Position: ${testResults.containerStyles.position}, Z-index: ${testResults.containerStyles.zIndex}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        html += `
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333; display: flex; gap: 8px; flex-wrap: wrap;">
                <button id="diag-refresh" style="background: #1a5276; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🔄 ATUALIZAR</button>
                <button id="diag-test-visual" style="background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">🎯 TESTE VISUAL "Ponta"</button>
                <button id="diag-fix-style" style="background: #e67e22; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🎨 CORRIGIR ESTILOS</button>
                <button id="diag-open-panel" style="background: #8e44ad; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">📂 ABRIR PAINEL</button>
            </div>
            <div style="margin-top: 10px; font-size: 9px; color: #666; text-align: center; border-top: 1px solid #333; padding-top: 8px;">
                💡 Clique em "TESTE VISUAL" para simular digitação e ver as sugestões aparecerem
            </div>
        `;
        
        diagnosticPanel.innerHTML = html;
        document.body.appendChild(diagnosticPanel);
        
        // Eventos dos botões
        document.getElementById('close-diag')?.addEventListener('click', () => diagnosticPanel.remove());
        document.getElementById('diag-refresh')?.addEventListener('click', () => {
            diagnosticPanel.remove();
            runFullDiagnostic();
        });
        document.getElementById('diag-test-visual')?.addEventListener('click', () => {
            diagnosticPanel.remove();
            testVisualAutocomplete();
        });
        document.getElementById('diag-fix-style')?.addEventListener('click', applyStyleFix);
        document.getElementById('diag-open-panel')?.addEventListener('click', () => {
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) {
                adminPanel.style.display = 'block';
                adminPanel.scrollIntoView({ behavior: 'smooth' });
                alert('✅ Painel admin aberto! Agora clique em "TESTE VISUAL"');
            } else {
                alert('❌ Painel admin não encontrado!');
            }
            diagnosticPanel.remove();
        });
    }
    
    // ==========================================================
    // CORREÇÃO DE ESTILOS FORÇADA
    // ==========================================================
    function applyStyleFix() {
        console.log('🎨 Aplicando correção de estilos...');
        
        // Remover estilos conflitantes
        const style = document.createElement('style');
        style.id = 'autocomplete-force-fix';
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
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                margin-top: 2px !important;
            }
            .admin-location-suggestions div {
                padding: 10px 14px !important;
                cursor: pointer !important;
                font-size: 0.9rem !important;
                color: #2c3e50 !important;
                background: white !important;
                border-bottom: 1px solid #ecf0f1 !important;
                display: block !important;
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
        
        const oldStyle = document.getElementById('autocomplete-force-fix');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
        
        // Também corrigir o container se existir
        const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (container) {
            container.style.cssText = `
                position: absolute !important;
                z-index: 999999 !important;
                background: white !important;
                border: 2px solid #1a5276 !important;
                border-radius: 8px !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            console.log('✅ Container reestilizado diretamente');
        }
        
        showNotification('✅ Correção de estilos aplicada! Faça o TESTE VISUAL agora.', '#27ae60');
    }
    
    function showNotification(message, color) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: ${color}; color: white;
            padding: 12px 20px; border-radius: 8px; z-index: 9999999;
            font-family: monospace; font-size: 13px; font-weight: bold;
            animation: slideIn 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    // ==========================================================
    // VERIFICAÇÃO INICIAL
    // ==========================================================
    function waitForAdminAndCheck() {
        const locationInput = findLocationInput();
        
        if (locationInput) {
            if (checkInterval) clearInterval(checkInterval);
            
            const isInit = locationInput.hasAttribute('data-autocomplete-initialized');
            if (isInit) {
                console.log('✅ Autocomplete nativo está funcionando!');
                console.log('💡 Clique no botão 🔍 e depois em "TESTE VISUAL" para ver as sugestões');
            }
            return true;
        }
        
        retryCount++;
        if (retryCount >= CONFIG.maxRetries) {
            if (checkInterval) clearInterval(checkInterval);
            console.log('ℹ️ Campo não encontrado. Abra o painel admin (botão ⚙️)');
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
        diagnosticButton.title = 'Diagnóstico do Autocomplete - Clique para TESTE VISUAL';
        
        diagnosticButton.addEventListener('click', () => {
            // Abrir diagnóstico e já sugerir teste visual
            runFullDiagnostic();
            setTimeout(() => {
                if (confirm('🔍 Diagnóstico concluído!\n\nDeseja executar o TESTE VISUAL agora?\n\nIsso vai simular a digitação "Ponta" e mostrar as sugestões.')) {
                    testVisualAutocomplete();
                }
            }, 500);
        });
        
        diagnosticButton.addEventListener('mouseenter', () => {
            diagnosticButton.style.transform = 'scale(1.12)';
        });
        diagnosticButton.addEventListener('mouseleave', () => {
            diagnosticButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(diagnosticButton);
        console.log('✅ Botão 🔍 adicionado (canto inferior esquerdo)');
        console.log('💡 Clique no botão e depois em "TESTE VISUAL" para ver as sugestões aparecerem!');
    }
    
    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================
    function init() {
        console.log('🔧 Inicializando diagnóstico do autocomplete nativo...');
        createDiagnosticButton();
        
        retryCount = 0;
        checkInterval = setInterval(waitForAdminAndCheck, CONFIG.retryDelay);
        
        setTimeout(() => {
            if (checkInterval) clearInterval(checkInterval);
        }, CONFIG.maxRetries * CONFIG.retryDelay + 5000);
    }
    
    // API Pública
    window.LocationAutocomplete = {
        runFullDiagnostic,
        testVisualAutocomplete,
        applyStyleFix,
        isActive: () => {
            const input = findLocationInput();
            return input?.hasAttribute('data-autocomplete-initialized') || false;
        }
    };
    
    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ location-autocomplete.js v2.0.3 carregado');
    console.log('🎯 FUNÇÃO PRINCIPAL: Clique em 🔍 → "TESTE VISUAL" para ver as sugestões');
})();
