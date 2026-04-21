// debug/ui/location-autocomplete.js - v2.0.5
// Módulo de DIAGNÓSTICO com CORREÇÃO AUTOMÁTICA de cores
console.log('📍 location-autocomplete.js v2.0.5 - Diagnóstico com Correção Automática de Cores');

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
    let colorFixObserver = null; // Observer para correção automática
    
    // ==========================================================
    // CORREÇÃO AUTOMÁTICA DE CORES (OBSERVER)
    // ==========================================================
    function startColorFixObserver() {
        if (colorFixObserver) return;
        
        console.log('🎨 Iniciando observer de correção automática de cores...');
        
        // Observer para detectar quando o container é criado
        colorFixObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList && node.classList.contains(CONFIG.suggestionsClass)) {
                            console.log('🎯 Container detectado! Aplicando correção de cores...');
                            applyColorFixToContainer(node);
                        }
                    });
                }
            });
        });
        
        colorFixObserver.observe(document.body, { childList: true, subtree: true });
    }
    
    function applyColorFixToContainer(container) {
        if (!container) return;
        
        console.log('🎨 [CORES] Aplicando correção no container:', container);
        
        // Forçar estilos no container
        container.style.setProperty('background', '#ffffff', 'important');
        container.style.setProperty('background-color', '#ffffff', 'important');
        container.style.setProperty('border', '2px solid #1a5276', 'important');
        container.style.setProperty('border-top', 'none', 'important');
        container.style.setProperty('box-shadow', '0 4px 15px rgba(0,0,0,0.3)', 'important');
        container.style.setProperty('z-index', '9999999', 'important');
        
        // Corrigir todos os itens existentes
        const items = container.querySelectorAll('div');
        items.forEach((item, index) => {
            applyColorFixToItem(item);
        });
        
        // Observer para novos itens adicionados dinamicamente
        const itemObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.tagName === 'DIV') {
                            applyColorFixToItem(node);
                        }
                    });
                }
            });
        });
        itemObserver.observe(container, { childList: true, subtree: true });
        
        console.log(`✅ [CORES] Container corrigido com ${items.length} itens`);
    }
    
    function applyColorFixToItem(item) {
        if (!item) return;
        
        // Forçar cores do texto
        item.style.setProperty('color', '#1a5276', 'important');
        item.style.setProperty('background-color', '#ffffff', 'important');
        item.style.setProperty('background', '#ffffff', 'important');
        item.style.setProperty('padding', '10px 14px', 'important');
        item.style.setProperty('cursor', 'pointer', 'important');
        item.style.setProperty('border-bottom', '1px solid #e0e0e0', 'important');
        item.style.setProperty('display', 'block', 'important');
        item.style.setProperty('font-size', '0.9rem', 'important');
        
        // Corrigir o strong dentro do item (destaque)
        const strong = item.querySelector('strong');
        if (strong) {
            strong.style.setProperty('color', '#c0392b', 'important');
            strong.style.setProperty('background', '#fdebd0', 'important');
            strong.style.setProperty('padding', '2px 4px', 'important');
            strong.style.setProperty('border-radius', '4px', 'important');
        }
        
        // Adicionar hover
        item.addEventListener('mouseenter', () => {
            item.style.setProperty('background-color', '#e8f4fd', 'important');
            item.style.setProperty('background', '#e8f4fd', 'important');
        });
        item.addEventListener('mouseleave', () => {
            item.style.setProperty('background-color', '#ffffff', 'important');
            item.style.setProperty('background', '#ffffff', 'important');
        });
    }
    
    // ==========================================================
    // CORREÇÃO MANUAL FORÇADA
    // ==========================================================
    function forceColorFix() {
        console.log('🔧 [FIX] Aplicando correção manual de cores...');
        
        const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (container) {
            applyColorFixToContainer(container);
            
            // Verificar se funcionou
            const firstItem = container.querySelector('div');
            if (firstItem) {
                const textColor = window.getComputedStyle(firstItem).color;
                console.log(`🎨 Texto agora está: ${textColor}`);
                if (textColor === 'rgb(26, 82, 118)' || textColor === '#1a5276') {
                    alert('✅ CORES CORRIGIDAS! As sugestões agora devem estar visíveis.\n\nTexto: Azul escuro (#1a5276)\nFundo: Branco (#ffffff)');
                } else {
                    alert(`⚠️ Ainda com problema. Cor do texto: ${textColor}\n\nTente rolar a página ou fechar/abrir o painel admin.`);
                }
            }
        } else {
            alert('❌ Nenhum container de sugestões encontrado!\n\nDigite "Ponta" no campo Localização primeiro, depois clique em CORRIGIR.');
        }
    }
    
    // ==========================================================
    // TESTE VISUAL COM CORREÇÃO AUTOMÁTICA
    // ==========================================================
    function testVisualAutocomplete() {
        console.log('🎯 [TESTE VISUAL] Iniciando teste do autocomplete...');
        
        const locationInput = findLocationInput();
        if (!locationInput) {
            alert('❌ Campo de localização não encontrado! Abra o painel admin primeiro.');
            return false;
        }
        
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel && adminPanel.style.display !== 'block') {
            adminPanel.style.display = 'block';
            console.log('📂 Painel admin aberto automaticamente');
        }
        
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        locationInput.focus();
        
        const existingContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (existingContainer) existingContainer.remove();
        
        const originalValue = locationInput.value;
        
        // Simular digitação
        locationInput.value = '';
        
        setTimeout(() => {
            locationInput.value = 'P';
            locationInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                locationInput.value = 'Po';
                locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    locationInput.value = 'Pont';
                    locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => {
                        locationInput.value = 'Ponta';
                        locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        setTimeout(() => {
                            const suggestionsContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
                            
                            if (suggestionsContainer) {
                                const items = suggestionsContainer.querySelectorAll('div');
                                const itemsText = Array.from(items).map(el => el.textContent || el.innerText);
                                
                                console.log(`✅ Container encontrado! ${items.length} sugestão(ões):`, itemsText);
                                
                                // APLICAR CORREÇÃO DE CORES AUTOMATICAMENTE
                                applyColorFixToContainer(suggestionsContainer);
                                
                                // Destacar visualmente
                                suggestionsContainer.style.border = '3px solid #00ff00';
                                setTimeout(() => {
                                    suggestionsContainer.style.border = '';
                                }, 2000);
                                
                                alert(`✅ SUCESSO! ${items.length} sugestão(ões) encontrada(s):\n\n${itemsText.join('\n')}\n\n✅ CORES CORRIGIDAS AUTOMATICAMENTE! As sugestões agora devem estar visíveis em AZUL sobre fundo BRANCO.`);
                            } else {
                                console.error('❌ Nenhum container de sugestões foi criado!');
                                alert('❌ TESTE FALHOU!\n\nNenhuma sugestão apareceu. Verifique se o autocomplete está configurado corretamente.');
                            }
                            
                            locationInput.value = originalValue;
                            locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                            
                            setTimeout(() => {
                                const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
                                if (container) container.remove();
                            }, 1000);
                            
                        }, 400);
                    }, 300);
                }, 300);
            }, 300);
        }, 300);
        
        return true;
    }
    
    // ==========================================================
    // FUNÇÃO DE BUSCA ROBUSTA
    // ==========================================================
    function findLocationInput() {
        let input = document.getElementById('propLocation');
        if (input) return input;
        input = document.querySelector('#propLocation');
        if (input) return input;
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            const adminInput = adminPanel.querySelector('input[placeholder*="bairro"], input[placeholder*="Localização"]');
            if (adminInput) return adminInput;
        }
        return null;
    }
    
    // ==========================================================
    // DIAGNÓSTICO COMPLETO
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
        
        testResults.isInitialized = locationInput.hasAttribute('data-autocomplete-initialized');
        testResults.placeholder = locationInput.placeholder;
        
        const adminPanel = document.getElementById('adminPanel');
        testResults.adminPanelVisible = adminPanel && adminPanel.style.display === 'block';
        
        const existingContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
        testResults.containerExists = !!existingContainer;
        
        if (existingContainer) {
            const containerStyles = window.getComputedStyle(existingContainer);
            testResults.containerStyles = {
                display: containerStyles.display,
                position: containerStyles.position,
                background: containerStyles.backgroundColor
            };
            
            // Verificar cor do texto do primeiro item
            const firstItem = existingContainer.querySelector('div');
            if (firstItem) {
                const itemStyles = window.getComputedStyle(firstItem);
                testResults.textColor = itemStyles.color;
                testResults.textVisible = testResults.textColor !== 'rgba(0, 0, 0, 0)' && 
                                          testResults.textColor !== 'transparent' &&
                                          testResults.textColor !== 'rgb(255, 255, 255)';
            }
        }
        
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
        
        showDiagnosticPanel();
    }
    
    // ==========================================================
    // PAINEL DE DIAGNÓSTICO
    // ==========================================================
    function showDiagnosticPanel() {
        if (diagnosticPanel) diagnosticPanel.remove();
        
        let overallStatus = '⚠️ PARCIAL';
        let statusColor = '#e67e22';
        
        if (testResults.fieldExists && testResults.isInitialized) {
            if (testResults.textVisible === true) {
                overallStatus = '✅ FUNCIONAL';
                statusColor = '#27ae60';
            } else if (testResults.containerExists) {
                overallStatus = '⚠️ COR INVISÍVEL';
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
            border-left: 4px solid ${statusColor};
        `;
        
        let html = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid ${statusColor}; padding-bottom: 10px;">
                <h3 style="margin: 0; color: ${statusColor}; font-size: 14px;">🔍 DIAGNÓSTICO AUTOCOMPLETE v2.0.5</h3>
                <button id="close-diag" style="background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 4px 10px;">✕</button>
            </div>
            <div style="margin-bottom: 12px; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 6px;">
                📊 STATUS: <span style="color: ${statusColor}; font-weight: bold;">${overallStatus}</span>
            </div>
        `;
        
        if (testResults.fieldExists) {
            html += `
                <div style="margin-bottom: 10px;">
                    <div>📋 CAMPO: ✅</div>
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
                    ${testResults.filterTest?.matches?.length ? `<br>→ ${testResults.filterTest.matches.slice(0, 3).join(', ')}` : ''}
                </div>
            </div>
        `;
        
        if (testResults.containerExists !== undefined) {
            html += `
                <div style="margin-bottom: 10px;">
                    <div>📦 CONTAINER DE SUGESTÕES:</div>
                    <div style="margin-left: 12px;">
                        <div>Existe: ${testResults.containerExists ? '✅' : '❌'}</div>
                        ${testResults.textColor ? `<div>Cor do texto: <span style="color: ${testResults.textColor};">${testResults.textColor}</span> ${testResults.textVisible ? '✅ VISÍVEL' : '❌ INVISÍVEL'}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        html += `
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333; display: flex; gap: 8px; flex-wrap: wrap;">
                <button id="diag-refresh" style="background: #1a5276; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🔄 ATUALIZAR</button>
                <button id="diag-test-visual" style="background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">🎯 TESTE VISUAL</button>
                <button id="diag-force-fix" style="background: #e67e22; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">🔧 CORRIGIR CORES</button>
            </div>
            <div style="margin-top: 10px; font-size: 9px; color: #888; text-align: center; border-top: 1px solid #333; padding-top: 8px;">
                💡 Clique em "TESTE VISUAL" → O sistema vai FORÇAR as cores automaticamente!
            </div>
        `;
        
        diagnosticPanel.innerHTML = html;
        document.body.appendChild(diagnosticPanel);
        
        document.getElementById('close-diag')?.addEventListener('click', () => diagnosticPanel.remove());
        document.getElementById('diag-refresh')?.addEventListener('click', () => {
            diagnosticPanel.remove();
            runFullDiagnostic();
        });
        document.getElementById('diag-test-visual')?.addEventListener('click', () => {
            diagnosticPanel.remove();
            testVisualAutocomplete();
        });
        document.getElementById('diag-force-fix')?.addEventListener('click', () => {
            forceColorFix();
        });
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
                console.log('💡 Clique no botão 🔍 e depois em "TESTE VISUAL"');
            }
            return true;
        }
        retryCount++;
        if (retryCount >= CONFIG.maxRetries) {
            if (checkInterval) clearInterval(checkInterval);
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
            runFullDiagnostic();
            setTimeout(() => {
                if (confirm('🔍 Diagnóstico concluído!\n\nDeseja executar o TESTE VISUAL agora?\n\nIsso vai simular a digitação "Ponta" e FORÇAR as cores corretas.')) {
                    testVisualAutocomplete();
                }
            }, 500);
        });
        
        document.body.appendChild(diagnosticButton);
        console.log('✅ Botão 🔍 adicionado (canto inferior esquerdo)');
    }
    
    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================
    function init() {
        console.log('🔧 Inicializando diagnóstico com correção automática de cores...');
        createDiagnosticButton();
        startColorFixObserver(); // Inicia observer para correção automática!
        
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
        forceColorFix,
        isActive: () => {
            const input = findLocationInput();
            return input?.hasAttribute('data-autocomplete-initialized') || false;
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ location-autocomplete.js v2.0.5 carregado');
    console.log('🎯 CORREÇÃO AUTOMÁTICA ATIVA! O sistema vai FORÇAR as cores das sugestões.');
    console.log('💡 Clique em 🔍 → "TESTE VISUAL" para ver as sugestões com cores corrigidas');
})();
