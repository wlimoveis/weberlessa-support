// debug/ui/location-autocomplete.js - v2.0.4
// Módulo de DIAGNÓSTICO e TESTE VISUAL para o autocomplete nativo
// ✅ COM CORREÇÃO MANUAL DE CORES E CONTAINER
console.log('📍 location-autocomplete.js v2.0.4 - Diagnóstico com Teste Visual e Correção de Cores');

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
    // CORREÇÃO MANUAL DE CORES DO CONTAINER
    // ==========================================================
    function forceContainerColors() {
        console.log('🎨 [CORES] Forçando cores no container de sugestões...');
        
        const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (!container) {
            console.log('❌ [CORES] Nenhum container encontrado! Execute o TESTE VISUAL primeiro.');
            showNotification('❌ Nenhum container encontrado! Execute o TESTE VISUAL primeiro.', '#e74c3c');
            return false;
        }
        
        // Forçar cores no container
        container.style.setProperty('background', '#ffffff', 'important');
        container.style.setProperty('background-color', '#ffffff', 'important');
        container.style.setProperty('border', '2px solid #1a5276', 'important');
        container.style.setProperty('border-radius', '8px', 'important');
        container.style.setProperty('box-shadow', '0 4px 20px rgba(0,0,0,0.3)', 'important');
        container.style.setProperty('display', 'block', 'important');
        container.style.setProperty('visibility', 'visible', 'important');
        container.style.setProperty('opacity', '1', 'important');
        
        // Forçar cores em todos os itens
        const items = container.querySelectorAll('div');
        let fixedCount = 0;
        
        items.forEach(item => {
            // Evitar estilizar elementos que não são itens de sugestão
            if (item.classList && item.classList.contains('location-suggestions-item')) {
                item.style.setProperty('color', '#1a5276', 'important');
                item.style.setProperty('background', '#ffffff', 'important');
                item.style.setProperty('background-color', '#ffffff', 'important');
                item.style.setProperty('padding', '10px 14px', 'important');
                item.style.setProperty('cursor', 'pointer', 'important');
                item.style.setProperty('border-bottom', '1px solid #ecf0f1', 'important');
                fixedCount++;
            } else if (item.tagName === 'DIV' && !item.classList.length) {
                // Itens de sugestão sem classe
                item.style.setProperty('color', '#1a5276', 'important');
                item.style.setProperty('background', '#ffffff', 'important');
                item.style.setProperty('background-color', '#ffffff', 'important');
                item.style.setProperty('padding', '10px 14px', 'important');
                item.style.setProperty('cursor', 'pointer', 'important');
                fixedCount++;
            }
        });
        
        // Destacar container para feedback visual
        const originalBorder = container.style.border;
        container.style.border = '3px solid #00ff00';
        setTimeout(() => {
            container.style.border = originalBorder;
        }, 1500);
        
        console.log(`✅ [CORES] ${fixedCount} item(ns) corrigido(s) visualmente`);
        showNotification(`✅ Cores corrigidas! ${fixedCount} sugestão(ões) agora visíveis.`, '#27ae60');
        
        return true;
    }
    
    // ==========================================================
    // CORREÇÃO COMPLETA DO CONTAINER (POSIÇÃO + CORES)
    // ==========================================================
    function fixContainerCompletely() {
        console.log('🔧 [FIX] Aplicando correção completa no container...');
        
        const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (!container) {
            console.log('❌ [FIX] Nenhum container encontrado!');
            showNotification('❌ Nenhum container encontrado! Execute o TESTE VISUAL primeiro.', '#e74c3c');
            return false;
        }
        
        const locationInput = document.querySelector(CONFIG.inputSelector);
        if (!locationInput) {
            console.log('❌ [FIX] Campo de localização não encontrado!');
            return false;
        }
        
        // Calcular posição correta
        const rect = locationInput.getBoundingClientRect();
        const newTop = rect.bottom + window.scrollY + 4;
        const newLeft = rect.left + window.scrollX;
        
        // Aplicar correção completa
        container.style.setProperty('position', 'absolute', 'important');
        container.style.setProperty('z-index', '999999', 'important');
        container.style.setProperty('background', '#ffffff', 'important');
        container.style.setProperty('background-color', '#ffffff', 'important');
        container.style.setProperty('border', '2px solid #1a5276', 'important');
        container.style.setProperty('border-radius', '8px', 'important');
        container.style.setProperty('box-shadow', '0 4px 20px rgba(0,0,0,0.3)', 'important');
        container.style.setProperty('display', 'block', 'important');
        container.style.setProperty('visibility', 'visible', 'important');
        container.style.setProperty('opacity', '1', 'important');
        container.style.setProperty('top', `${newTop}px`, 'important');
        container.style.setProperty('left', `${newLeft}px`, 'important');
        container.style.setProperty('width', `${rect.width}px`, 'important');
        
        // Corrigir itens
        const items = container.querySelectorAll('div');
        items.forEach(item => {
            if (item.tagName === 'DIV') {
                item.style.setProperty('color', '#1a5276', 'important');
                item.style.setProperty('background', '#ffffff', 'important');
                item.style.setProperty('background-color', '#ffffff', 'important');
                item.style.setProperty('padding', '10px 14px', 'important');
                item.style.setProperty('cursor', 'pointer', 'important');
            }
        });
        
        console.log(`✅ [FIX] Container reposicionado para (${newTop}, ${newLeft})`);
        showNotification('✅ Container corrigido (posição + cores)!', '#27ae60');
        
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
    // TESTE VISUAL DO AUTOCOMPLETE COM CORREÇÃO AUTOMÁTICA
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
                                const items = suggestionsContainer.querySelectorAll('div');
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
                                
                                // PERGUNTAR se quer corrigir as cores
                                const shouldFixColors = confirm(`✅ SUCESSO! ${itemsCount} sugestão(ões) encontrada(s):\n\n${itemsText.join('\n')}\n\nAs sugestões estão VISÍVEIS?\n\n• Se SIM, clique em CANCELAR\n• Se NÃO (invisíveis/branco), clique em OK para CORRIGIR CORES`);
                                
                                if (shouldFixColors) {
                                    forceContainerColors();
                                }
                                
                            } else {
                                console.error('❌ Nenhum container de sugestões foi criado!');
                                
                                alert(`❌ TESTE FALHOU!\n\nNenhuma sugestão apareceu para "Ponta".\n\nPossíveis causas:\n1. O autocomplete nativo não está respondendo\n2. O CSS pode estar ocultando o container\n3. O JavaScript pode ter erro\n\nClique em OK para tentar CORREÇÃO DE ESTILOS.`);
                                
                                // Aplicar correção de estilos automaticamente
                                applyStyleFix();
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
                zIndex: containerStyles.zIndex,
                background: containerStyles.backgroundColor
            };
            console.log('📦 Container encontrado com estilos:', testResults.containerStyles);
            
            // Verificar se o container está visível
            const isVisible = containerStyles.display !== 'none' && 
                             containerStyles.visibility !== 'hidden' &&
                             existingContainer.offsetParent !== null;
            testResults.containerVisible = isVisible;
            
            // Verificar cores (texto pode estar invisível)
            const firstItem = existingContainer.querySelector('div');
            if (firstItem) {
                const itemStyles = window.getComputedStyle(firstItem);
                const textColor = itemStyles.color;
                const bgColor = itemStyles.backgroundColor;
                testResults.textColor = textColor;
                testResults.bgColor = bgColor;
                testResults.hasColorConflict = textColor === bgColor || textColor === 'rgba(0, 0, 0, 0)';
            }
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
            if (testResults.containerVisible === true && !testResults.hasColorConflict) {
                overallStatus = '✅ FUNCIONAL';
                statusColor = '#27ae60';
            } else if (testResults.containerVisible === true && testResults.hasColorConflict) {
                overallStatus = '⚠️ INVISÍVEL (CORES)';
                statusColor = '#e67e22';
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
            width: 560px;
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
                <h3 style="margin: 0; color: ${statusColor}; font-size: 14px;">🔍 DIAGNÓSTICO AUTOCOMPLETE v2.0.4</h3>
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
                        ${testResults.containerExists ? `<div>Visível: ${testResults.containerVisible ? '✅ SIM' : '❌ NÃO'}</div>` : ''}
                        ${testResults.hasColorConflict ? `<div style="color: #ffaa00;">🎨 CONFLITO DE CORES detectado!</div>` : ''}
                        ${testResults.containerStyles ? `<div style="font-size: 9px; color: #aaa;">Position: ${testResults.containerStyles.position}, Z-index: ${testResults.containerStyles.zIndex}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        html += `
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333; display: flex; gap: 8px; flex-wrap: wrap;">
                <button id="diag-refresh" style="background: #1a5276; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🔄 ATUALIZAR</button>
                <button id="diag-test-visual" style="background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">🎯 TESTE VISUAL "Ponta"</button>
                <button id="diag-fix-colors" style="background: #8e44ad; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🎨 CORRIGIR CORES</button>
                <button id="diag-fix-full" style="background: #e67e22; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🔧 CORREÇÃO COMPLETA</button>
                <button id="diag-open-panel" style="background: #2980b9; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">📂 ABRIR PAINEL</button>
            </div>
            <div style="margin-top: 10px; font-size: 9px; color: #666; text-align: center; border-top: 1px solid #333; padding-top: 8px;">
                💡 Dicas:<br>
                • "TESTE VISUAL" → Simula digitação "Ponta"<br>
                • "CORRIGIR CORES" → Força texto AZUL em fundo BRANCO<br>
                • "CORREÇÃO COMPLETA" → Reposiciona + corrige cores
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
        document.getElementById('diag-fix-colors')?.addEventListener('click', () => {
            forceContainerColors();
        });
        document.getElementById('diag-fix-full')?.addEventListener('click', () => {
            fixContainerCompletely();
        });
        document.getElementById('diag-open-panel')?.addEventListener('click', () => {
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) {
                adminPanel.style.display = 'block';
                adminPanel.scrollIntoView({ behavior: 'smooth' });
                showNotification('✅ Painel admin aberto!', '#27ae60');
            } else {
                alert('❌ Painel admin não encontrado!');
            }
            diagnosticPanel.remove();
        });
    }
    
    // ==========================================================
    // CORREÇÃO DE ESTILOS FORÇADA (CSS GLOBAL)
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
                background-color: white !important;
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
                color: #1a5276 !important;
                background: white !important;
                background-color: white !important;
                border-bottom: 1px solid #ecf0f1 !important;
                display: block !important;
            }
            .admin-location-suggestions div:hover {
                background: #e8f4fd !important;
                background-color: #e8f4fd !important;
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
            forceContainerColors();
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
    }
    
    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================
    function init() {
        console.log('🔧 Inicializando diagnóstico do autocomplete nativo v2.0.4...');
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
        forceContainerColors,
        fixContainerCompletely,
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
    
    console.log('✅ location-autocomplete.js v2.0.4 carregado');
    console.log('🎯 FUNÇÕES DISPONÍVEIS:');
    console.log('   - window.LocationAutocomplete.testVisualAutocomplete() → Teste visual');
    console.log('   - window.LocationAutocomplete.forceContainerColors() → Corrigir cores');
    console.log('   - window.LocationAutocomplete.fixContainerCompletely() → Correção completa');
})();
