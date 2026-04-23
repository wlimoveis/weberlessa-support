// debug/ui/location-autocomplete.js - v2.0.7
// Módulo de DIAGNÓSTICO com CORREÇÃO AUTOMÁTICA de cores, POSICIONAMENTO e API de Inicialização
console.log('📍 location-autocomplete.js v2.0.7 - Diagnóstico com Correção de Posicionamento e Cores + API init()');

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
    let colorFixObserver = null;
    
    // ==========================================================
    // DIAGNÓSTICO DE POSICIONAMENTO DO CAMPO
    // ==========================================================
    function diagnoseFieldPosition() {
        console.log('📐 [POSITION] Diagnosticando posicionamento do campo...');
        
        const input = document.getElementById('propLocation');
        if (!input) {
            console.log('❌ [POSITION] Campo não encontrado!');
            return null;
        }
        
        const diagnosis = {
            fieldFound: true,
            offsetTop: input.offsetTop,
            offsetLeft: input.offsetLeft,
            offsetParent: input.offsetParent?.tagName || 'null',
            boundingRect: input.getBoundingClientRect(),
            scrollY: window.scrollY,
            parentTree: [],
            issues: []
        };
        
        console.log('=== DIAGNÓSTICO DE POSICIONAMENTO ===');
        console.log('📋 Campo:', input);
        console.log(`📏 offsetTop: ${diagnosis.offsetTop}`);
        console.log(`📏 offsetLeft: ${diagnosis.offsetLeft}`);
        console.log(`📁 offsetParent: ${diagnosis.offsetParent}`);
        console.log(`📐 getBoundingClientRect():`, {
            top: diagnosis.boundingRect.top,
            left: diagnosis.boundingRect.left,
            bottom: diagnosis.boundingRect.bottom,
            right: diagnosis.boundingRect.right,
            width: diagnosis.boundingRect.width,
            height: diagnosis.boundingRect.height
        });
        console.log(`📜 window.scrollY: ${diagnosis.scrollY}`);
        
        // Percorrer árvore de pais
        let parent = input.parentElement;
        let level = 0;
        let hasAbsoluteParent = false;
        let hasFixedParent = false;
        let hasRelativeParent = false;
        
        while (parent && parent !== document.body) {
            const position = window.getComputedStyle(parent).position;
            const overflow = window.getComputedStyle(parent).overflow;
            const parentInfo = {
                tag: parent.tagName,
                className: parent.className || '(sem classe)',
                position: position,
                overflow: overflow,
                offsetTop: parent.offsetTop,
                offsetLeft: parent.offsetLeft
            };
            
            diagnosis.parentTree.push(parentInfo);
            
            console.log(`📁 Nível ${level}: ${parent.tagName}`, parentInfo);
            
            if (position === 'absolute') hasAbsoluteParent = true;
            if (position === 'fixed') hasFixedParent = true;
            if (position === 'relative') hasRelativeParent = true;
            if (overflow === 'hidden') {
                diagnosis.issues.push(`⚠️ Pai com overflow:hidden: ${parent.tagName}`);
            }
            
            parent = parent.parentElement;
            level++;
            if (level > 20) break;
        }
        
        diagnosis.hasAbsoluteParent = hasAbsoluteParent;
        diagnosis.hasFixedParent = hasFixedParent;
        diagnosis.hasRelativeParent = hasRelativeParent;
        
        // Verificar problemas comuns
        if (diagnosis.boundingRect.top < 0) {
            diagnosis.issues.push('⚠️ Campo está fora da tela (topo negativo)');
        }
        if (diagnosis.boundingRect.bottom > window.innerHeight) {
            diagnosis.issues.push('⚠️ Campo está abaixo da tela (precisa rolar)');
        }
        if (hasAbsoluteParent) {
            diagnosis.issues.push('⚠️ Campo tem pai com position:absolute - pode afetar posicionamento do dropdown');
        }
        
        console.log('🔍 [POSITION] Problemas detectados:', diagnosis.issues.length || 'Nenhum');
        diagnosis.issues.forEach(issue => console.log(`   ${issue}`));
        
        return diagnosis;
    }
    
    // ==========================================================
    // CORREÇÃO DE POSICIONAMENTO DO CONTAINER
    // ==========================================================
    function fixContainerPosition() {
        console.log('🔧 [POSITION] Corrigindo posicionamento do container...');
        
        const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (!container) {
            console.log('❌ [POSITION] Nenhum container encontrado!');
            return false;
        }
        
        const input = document.getElementById('propLocation');
        if (!input) {
            console.log('❌ [POSITION] Campo não encontrado!');
            return false;
        }
        
        // Calcular posição correta
        const rect = input.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        const newTop = rect.bottom + scrollY + 4;
        const newLeft = rect.left + scrollX;
        
        console.log(`📐 [POSITION] Reposicionando container:`);
        console.log(`   - Input top: ${rect.top}, bottom: ${rect.bottom}`);
        console.log(`   - Scroll Y: ${scrollY}`);
        console.log(`   - Novo top: ${newTop}`);
        console.log(`   - Nova left: ${newLeft}`);
        
        container.style.setProperty('position', 'absolute', 'important');
        container.style.setProperty('top', `${newTop}px`, 'important');
        container.style.setProperty('left', `${newLeft}px`, 'important');
        container.style.setProperty('width', `${rect.width}px`, 'important');
        container.style.setProperty('z-index', '9999999', 'important');
        
        // Verificar se está visível
        const containerRect = container.getBoundingClientRect();
        const isVisible = containerRect.top >= 0 && containerRect.bottom <= window.innerHeight;
        
        if (isVisible) {
            console.log('✅ [POSITION] Container agora está visível!');
            showNotification('✅ Container reposicionado e visível!', '#27ae60');
        } else {
            console.log('⚠️ [POSITION] Container ainda fora da tela. Altura:', containerRect.height);
            // Tentar posicionar acima do campo se não couber abaixo
            const newTopAbove = rect.top + scrollY - containerRect.height - 4;
            if (newTopAbove > 0) {
                container.style.setProperty('top', `${newTopAbove}px`, 'important');
                console.log(`   Tentando posicionar acima: ${newTopAbove}px`);
                showNotification('⚠️ Container reposicionado acima do campo', '#e67e22');
            }
        }
        
        return true;
    }
    
    // ==========================================================
    // CORREÇÃO AUTOMÁTICA DE CORES (OBSERVER)
    // ==========================================================
    function startColorFixObserver() {
        if (colorFixObserver) return;
        
        console.log('🎨 Iniciando observer de correção automática de cores...');
        
        colorFixObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList && node.classList.contains(CONFIG.suggestionsClass)) {
                            console.log('🎯 Container detectado! Aplicando correção de cores...');
                            applyColorFixToContainer(node);
                            // Também corrigir posição automaticamente
                            setTimeout(() => fixContainerPosition(), 50);
                        }
                    });
                }
            });
        });
        
        colorFixObserver.observe(document.body, { childList: true, subtree: true });
    }
    
    function applyColorFixToContainer(container) {
        if (!container) return;
        
        console.log('🎨 [CORES] Aplicando correção no container');
        
        container.style.setProperty('background', '#ffffff', 'important');
        container.style.setProperty('background-color', '#ffffff', 'important');
        container.style.setProperty('border', '2px solid #1a5276', 'important');
        container.style.setProperty('border-top', 'none', 'important');
        container.style.setProperty('box-shadow', '0 4px 15px rgba(0,0,0,0.3)', 'important');
        container.style.setProperty('z-index', '9999999', 'important');
        
        const items = container.querySelectorAll('div');
        items.forEach((item) => applyColorFixToItem(item));
        
        // Observer para novos itens
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
        
        item.style.setProperty('color', '#1a5276', 'important');
        item.style.setProperty('background-color', '#ffffff', 'important');
        item.style.setProperty('background', '#ffffff', 'important');
        item.style.setProperty('padding', '10px 14px', 'important');
        item.style.setProperty('cursor', 'pointer', 'important');
        item.style.setProperty('border-bottom', '1px solid #e0e0e0', 'important');
        item.style.setProperty('display', 'block', 'important');
        item.style.setProperty('font-size', '0.9rem', 'important');
        
        const strong = item.querySelector('strong');
        if (strong) {
            strong.style.setProperty('color', '#c0392b', 'important');
            strong.style.setProperty('background', '#fdebd0', 'important');
            strong.style.setProperty('padding', '2px 4px', 'important');
            strong.style.setProperty('border-radius', '4px', 'important');
        }
        
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
        console.log('🔧 [FIX] Aplicando correção manual...');
        
        const container = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (container) {
            applyColorFixToContainer(container);
            fixContainerPosition();
            
            const firstItem = container.querySelector('div');
            if (firstItem) {
                const textColor = window.getComputedStyle(firstItem).color;
                if (textColor === 'rgb(26, 82, 118)' || textColor === '#1a5276') {
                    alert('✅ CORES E POSIÇÃO CORRIGIDOS! As sugestões agora devem estar visíveis.');
                } else {
                    alert(`⚠️ Cor do texto: ${textColor}. Pode precisar rolar a página.`);
                }
            }
        } else {
            alert('❌ Nenhum container encontrado! Digite "Ponta" no campo primeiro.');
        }
    }
    
    // ==========================================================
    // TESTE VISUAL COM CORREÇÃO AUTOMÁTICA
    // ==========================================================
    function testVisualAutocomplete() {
        console.log('🎯 [TESTE VISUAL] Iniciando teste...');
        
        // Primeiro, diagnosticar posicionamento
        const positionDiagnosis = diagnoseFieldPosition();
        
        const locationInput = findLocationInput();
        if (!locationInput) {
            alert('❌ Campo de localização não encontrado! Abra o painel admin primeiro.');
            return false;
        }
        
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel && adminPanel.style.display !== 'block') {
            adminPanel.style.display = 'block';
        }
        
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        locationInput.focus();
        
        const existingContainer = document.querySelector(`.${CONFIG.suggestionsClass}`);
        if (existingContainer) existingContainer.remove();
        
        const originalValue = locationInput.value;
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
                                
                                console.log(`✅ Container encontrado! ${items.length} sugestões`);
                                
                                // Aplicar correções
                                applyColorFixToContainer(suggestionsContainer);
                                fixContainerPosition();
                                
                                // Destacar visualmente
                                suggestionsContainer.style.border = '3px solid #00ff00';
                                setTimeout(() => {
                                    suggestionsContainer.style.border = '';
                                }, 2000);
                                
                                // Mostrar resultado com informações de posição
                                let positionInfo = '';
                                const containerRect = suggestionsContainer.getBoundingClientRect();
                                if (containerRect.top < 0) {
                                    positionInfo = '\n\n⚠️ O container está fora da tela (topo negativo). Tente rolar a página para cima.';
                                } else if (containerRect.bottom > window.innerHeight) {
                                    positionInfo = '\n\n⚠️ O container está abaixo da tela. Tente rolar a página para baixo.';
                                } else {
                                    positionInfo = '\n\n✅ O container está visível na tela!';
                                }
                                
                                alert(`✅ SUCESSO! ${items.length} sugestão(ões):\n\n${itemsText.join('\n')}\n\n✅ CORES CORRIGIDAS!${positionInfo}`);
                            } else {
                                console.error('❌ Nenhum container foi criado!');
                                alert('❌ TESTE FALHOU!\n\nNenhuma sugestão apareceu.\n\nVerifique se o autocomplete está configurado corretamente no sistema.');
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
        
        // Executar diagnóstico de posicionamento
        const positionDiagnosis = diagnoseFieldPosition();
        testResults.positionDiagnosis = positionDiagnosis;
        
        const locationInput = findLocationInput();
        testResults.fieldExists = !!locationInput;
        
        if (!locationInput) {
            testResults.error = 'Campo não encontrado. Abra o painel admin primeiro.';
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
                top: containerStyles.top,
                left: containerStyles.left
            };
            
            const firstItem = existingContainer.querySelector('div');
            if (firstItem) {
                const itemStyles = window.getComputedStyle(firstItem);
                testResults.textColor = itemStyles.color;
                testResults.textVisible = testResults.textColor !== 'rgba(0, 0, 0, 0)' && 
                                          testResults.textColor !== 'transparent';
            }
        }
        
        const bairrosMaceio = [
        'Pajuçara, Maceió/AL', 'Ponta Verde, Maceió/AL', 'Jatiúca, Maceió/AL', 'Jacarecica, Maceió/AL', 'Cruz das Almas, Maceió/AL',
        'Mangabeiras, Maceió/AL', 'Poço, Maceió/AL', 'Barro Duro, Maceió/AL', 'Gruta de Lourdes, Maceió/AL', 'Serraria, Maceió/AL',
        'Farol, Maceió/AL', 'Jardim Petrópolis, Maceió/AL', 'Centro, Maceió/AL', 'Prado, Maceió/AL', 'Jaraguá, Maceió/AL', 'Feitosa, Maceió/AL',
        'Pinheiro, Maceió/AL', 'Santa Lúcia, Maceió/AL', 'Santa Amélia, Maceió/AL', 'Tabuleiro do Martins, Maceió/AL',
        'Cidade Universitária, Maceió/AL', 'Clima Bom, Maceió/AL', 'Benedito Bentes, Maceió/AL', 'Santos Dumont, Maceió/AL',
        'São Jorge, Maceió/AL', 'Levada, Maceió/AL', 'Trapiche da Barra, Maceió/AL', 'Vergel do Lago, Maceió/AL',
        'Ouro Preto, Maceió/AL', 'Mutange, Maceió/AL', 'Fernão Velho', 'Rio Novo', 'Riacho Doce', 'Pontal da Barra, Maceió/AL', 'Guaxuma',
        'Ipioca', 'Garça Torta', 'Pescaria', 'Ponta da Terra, Maceió/AL', 'Barra de São Miguel', 'Murilopes, Maceió/AL',
        'Barra de São Miguel', 'Boa Viagem, Recife/PE', 'São Miguel dos Milagres',
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
            border-left: 4px solid ${statusColor};
        `;
        
        let issuesHtml = '';
        if (testResults.positionDiagnosis?.issues?.length > 0) {
            issuesHtml = `
                <div style="margin-bottom: 10px; background: rgba(255,85,0,0.2); padding: 8px; border-radius: 6px;">
                    <div style="color: #ffaa00;">⚠️ PROBLEMAS DE POSICIONAMENTO:</div>
                    ${testResults.positionDiagnosis.issues.map(issue => `<div style="margin-left: 12px; font-size: 10px;">${issue}</div>`).join('')}
                </div>
            `;
        }
        
        let html = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid ${statusColor}; padding-bottom: 10px;">
                <h3 style="margin: 0; color: ${statusColor}; font-size: 14px;">🔍 DIAGNÓSTICO AUTOCOMPLETE v2.0.7</h3>
                <button id="close-diag" style="background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 4px 10px;">✕</button>
            </div>
            <div style="margin-bottom: 12px; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 6px;">
                📊 STATUS: <span style="color: ${statusColor}; font-weight: bold;">${overallStatus}</span>
            </div>
            ${issuesHtml}
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
        
        if (testResults.positionDiagnosis) {
            html += `
                <div style="margin-bottom: 10px;">
                    <div>📐 POSIÇÃO DO CAMPO:</div>
                    <div style="margin-left: 12px; font-size: 10px;">
                        <div>Top: ${Math.round(testResults.positionDiagnosis.boundingRect?.top || 0)}px</div>
                        <div>Left: ${Math.round(testResults.positionDiagnosis.boundingRect?.left || 0)}px</div>
                        <div>Bottom: ${Math.round(testResults.positionDiagnosis.boundingRect?.bottom || 0)}px</div>
                        <div>Scroll Y: ${testResults.positionDiagnosis.scrollY}px</div>
                    </div>
                </div>
            `;
        }
        
        html += `
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333; display: flex; gap: 8px; flex-wrap: wrap;">
                <button id="diag-refresh" style="background: #1a5276; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🔄 ATUALIZAR</button>
                <button id="diag-test-visual" style="background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">🎯 TESTE VISUAL</button>
                <button id="diag-force-fix" style="background: #e67e22; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">🔧 CORRIGIR TUDO</button>
                <button id="diag-diagnose-pos" style="background: #8e44ad; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">📐 DIAGN. POSIÇÃO</button>
            </div>
            <div style="margin-top: 10px; font-size: 9px; color: #888; text-align: center;">
                💡 O sistema corrige AUTOMATICAMENTE cores e posição!
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
        document.getElementById('diag-diagnose-pos')?.addEventListener('click', () => {
            const diagnosis = diagnoseFieldPosition();
            alert(`📐 DIAGNÓSTICO DE POSIÇÃO:\n\n` +
                  `Campo Top: ${Math.round(diagnosis.boundingRect?.top || 0)}px\n` +
                  `Campo Bottom: ${Math.round(diagnosis.boundingRect?.bottom || 0)}px\n` +
                  `Scroll Y: ${diagnosis.scrollY}px\n` +
                  `Problemas: ${diagnosis.issues.length || 'Nenhum'}\n\n` +
                  `${diagnosis.issues.join('\n') || '✅ Posição parece OK!'}`);
        });
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
        diagnosticButton.title = 'Diagnóstico do Autocomplete';
        
        diagnosticButton.addEventListener('click', () => {
            runFullDiagnostic();
            setTimeout(() => {
                if (confirm('🔍 Diagnóstico concluído!\n\nDeseja executar o TESTE VISUAL agora?\n\nO sistema vai FORÇAR cores e posição corretas.')) {
                    testVisualAutocomplete();
                }
            }, 500);
        });
        
        document.body.appendChild(diagnosticButton);
        console.log('✅ Botão 🔍 adicionado');
    }
    
    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================
    function init() {
        console.log('🔧 Inicializando diagnóstico v2.0.7...');
        createDiagnosticButton();
        startColorFixObserver();
        
        retryCount = 0;
        checkInterval = setInterval(waitForAdminAndCheck, CONFIG.retryDelay);
        setTimeout(() => {
            if (checkInterval) clearInterval(checkInterval);
        }, CONFIG.maxRetries * CONFIG.retryDelay + 5000);
    }
    
    // API Pública - VERSÃO CORRIGIDA COM init()
    window.LocationAutocomplete = {
        runFullDiagnostic,
        testVisualAutocomplete,
        forceColorFix,
        diagnoseFieldPosition,
        fixContainerPosition,
        isActive: () => {
            const input = findLocationInput();
            return input?.hasAttribute('data-autocomplete-initialized') || false;
        },
        // ✅ NOVA FUNÇÃO EXPORTADA CONFORME RECOMENDAÇÃO
        init: function() {
            console.log('🔧 [Autocomplete] Inicialização forçada via API');
            // Forçar a verificação e inicialização
            const input = findLocationInput();
            const adminPanel = document.getElementById('adminPanel');
            
            if (input && adminPanel && adminPanel.style.display === 'block') {
                // Simular que o campo foi encontrado com painel visível
                if (checkInterval) clearInterval(checkInterval);
                setTimeout(() => {
                    // Disparar evento para forçar criação do container
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('✅ [Autocomplete] Inicialização forçada concluída');
                }, 100);
                return true;
            }
            console.warn('⚠️ [Autocomplete] Não foi possível inicializar - painel ou campo não disponível');
            return false;
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ location-autocomplete.js v2.0.7 carregado com API init()');
    console.log('🎯 CORREÇÃO AUTOMÁTICA: cores, posição E inicialização sob demanda!');
})();
