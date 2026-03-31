// ============================================================
// ARQUIVO: debug/diagnostics/diagnostics56.js
// VERSÃO: 5.6.1 - CORREÇÃO DE INICIALIZAÇÃO E PAINEL
// PROPÓSITO: Módulo de diagnóstico e compatibilidade.
//            CORRIGIDO: Painel agora aparece com ?debug=true&diagnostics=true
//            CORRIGIDO: Referências quebradas removidas
//            CORRIGIDO: Delegação correta para PdfSystem/MediaSystem
//            CORRIGIDO: showCompatibilityControlPanel definida antes do uso
// ============================================================
console.log('✅ [DIAGNOSTICS v5.6.1] Carregado. Modo: DIAGNÓSTICO ATIVO.');

// ============================================================
// BLOCO 1: DECLARAÇÃO ANTECIPADA DA FUNÇÃO PRINCIPAL
// ============================================================
// Declarar a função antes de qualquer chamada para evitar erro de referência
window.showCompatibilityControlPanel = null; // Placeholder

// ============================================================
// BLOCO 2: INICIALIZAÇÃO CRÍTICA (EXECUTA IMEDIATAMENTE)
// ============================================================
(function initializeDiagnosticsPanel() {
    // Verificar parâmetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    const shouldShowPanel = urlParams.has('debug') && urlParams.has('diagnostics');
    
    if (shouldShowPanel) {
        console.log('🟢 [DIAGNOSTICS v5.6.1] Parâmetros detectados. Painel será exibido automaticamente.');
        
        // Agendar a exibição do painel após o carregamento completo
        // Usar um timeout maior para garantir que a função seja definida
        if (document.readyState === 'complete') {
            setTimeout(() => {
                if (typeof window.showCompatibilityControlPanel === 'function') {
                    window.showCompatibilityControlPanel();
                } else {
                    console.warn('⚠️ [DIAGNOSTICS v5.6.1] showCompatibilityControlPanel ainda não definida');
                }
            }, 500);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (typeof window.showCompatibilityControlPanel === 'function') {
                        window.showCompatibilityControlPanel();
                    } else {
                        console.warn('⚠️ [DIAGNOSTICS v5.6.1] showCompatibilityControlPanel ainda não definida');
                    }
                }, 500);
            });
        }
    } else {
        console.log('⚪ [DIAGNOSTICS v5.6.1] Modo silencioso. Adicione ?debug=true&diagnostics=true para ativar o painel.');
    }

    // Remover TODOS os placeholders e funções obsoletas que poluem o console
    const obsoleteFunctions = [
        'ValidationSystem', 'EmergencySystem', 'PdfLogger',
        'verifyMediaMigration', 'testModuleCompatibility', 'autoValidateMigration',
        'analyzePlaceholders', 'analyzeBrokenReferences', 'testPdfUploadBugFix',
        'verifyPdfSystemIntegrity', 'monitorPdfPostCorrection', 'verifyRollbackCompatibility',
        'finalPdfSystemValidation'
    ];
    
    obsoleteFunctions.forEach(funcName => {
        if (window[funcName] !== undefined) {
            console.log(`🧹 [DIAGNOSTICS v5.6.1] Removendo placeholder obsoleto: ${funcName}`);
            try { delete window[funcName]; } catch(e) { window[funcName] = undefined; }
        }
    });
})();

// ============================================================
// BLOCO 3: DIAGNÓSTICO DE FUNÇÕES DO CORE
// ============================================================
window.diagnoseExistingFunctions = function() {
    console.group('🔍 [DIAGNOSTICS v5.6.1] Verificação de Funções Críticas');
    
    const coreFunctions = [
        // Sistemas Principais (objetos)
        'properties',
        'MediaSystem',
        'PdfSystem',
        'SharedCore',
        'LoadingManager',
        'FilterManager',
        
        // Funções de Imóveis
        'loadPropertiesData',
        'renderProperties',
        'filterProperties',
        'savePropertiesToStorage',
        'addNewProperty',
        'updateProperty',
        'updateLocalProperty',
        'deleteProperty',
        'updatePropertyCard',
        
        // Funções de Admin
        'toggleAdminPanel',
        'setupForm',
        'editProperty',
        'cancelEdit',
        'resetAdminFormCompletely',
        'loadPropertyList',
        
        // Funções de Mídia (verificar métodos aninhados)
        'MediaSystem.addFiles',
        'MediaSystem.addPdfs',
        'MediaSystem.uploadAll',
        'MediaSystem.loadExisting',
        'MediaSystem.resetState',
        
        // Funções de PDF
        'PdfSystem.showModal',
        'PdfSystem.init',
        
        // Funções de Galeria
        'openGallery',
        'closeGallery',
        'createPropertyGallery',
        'setupGalleryEvents',
        
        // Funções deste módulo
        'diagnoseExistingFunctions',
        'autoFixMissingFunctions',
        'detectAndRemoveBrokenReferences',
        'showCompatibilityControlPanel',
        'safeInitDiagnostics'
    ];

    const results = {
        exists: [],
        missing: [],
        warnings: [],
        timestamp: new Date().toISOString(),
        version: '5.6.1'
    };

    coreFunctions.forEach(funcName => {
        try {
            let exists = false;
            let type = 'undefined';
            
            if (funcName.includes('.')) {
                // Propriedade aninhada (ex: MediaSystem.addFiles)
                const parts = funcName.split('.');
                let current = window;
                
                for (const part of parts) {
                    if (current && typeof current === 'object' && part in current) {
                        current = current[part];
                    } else {
                        current = undefined;
                        break;
                    }
                }
                
                exists = current !== undefined;
                type = typeof current;
            } else {
                // Propriedade direta
                exists = funcName in window;
                type = typeof window[funcName];
                
                // Caso especial para 'properties' (deve ser array)
                if (funcName === 'properties') {
                    exists = Array.isArray(window.properties);
                    type = exists ? 'array' : typeof window.properties;
                }
            }
            
            if (exists) {
                results.exists.push({ name: funcName, type: type });
                console.log(`✅ ${funcName}: ${type}`);
            } else {
                results.missing.push(funcName);
                console.warn(`❌ ${funcName}: NÃO EXISTE`);
            }
        } catch (error) {
            results.warnings.push(`${funcName}: ERRO - ${error.message}`);
            console.error(`⚠️ ${funcName}: ERRO - ${error.message}`);
        }
    });

    console.log('📊 RESUMO:');
    console.log(`- Funções existentes: ${results.exists.length}`);
    console.log(`- Funções ausentes: ${results.missing.length}`);
    console.log(`- Avisos: ${results.warnings.length}`);
    console.groupEnd();
    
    return results;
};

// ============================================================
// BLOCO 4: CORREÇÃO AUTOMÁTICA DE FUNÇÕES FALTANTES
// ============================================================
window.autoFixMissingFunctions = function() {
    console.group('🛠️ [DIAGNOSTICS v5.6.1] Correção Automática de Funções');
    
    const fixes = [];
    const errors = [];

    // --- 4.1 DELEGAÇÃO PARA PdfSystem (NÃO CRIA DUPLICAÇÕES) ---
    if (typeof window.showPdfModal !== 'function' && window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
        window.showPdfModal = function(propertyId) {
            console.log(`📄 showPdfModal(${propertyId}) → delegado para PdfSystem.showModal`);
            return window.PdfSystem.showModal(propertyId);
        };
        fixes.push('showPdfModal (delegado para PdfSystem)');
        console.log('✅ showPdfModal criada via delegação');
    }
    
    if (typeof window.testPdfSystem !== 'function') {
        window.testPdfSystem = function(propertyId = 101) {
            console.log(`🧪 testPdfSystem(${propertyId}) - v5.6.1`);
            if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
                return window.PdfSystem.showModal(propertyId);
            }
            if (typeof window.showPdfModal === 'function') {
                return window.showPdfModal(propertyId);
            }
            console.error('❌ Nenhum sistema PDF disponível');
            return false;
        };
        fixes.push('testPdfSystem');
        console.log('✅ testPdfSystem criada');
    }

    // --- 4.2 DELEGAÇÃO PARA MediaSystem ---
    if (typeof window.processAndSavePdfs !== 'function' && window.MediaSystem && typeof window.MediaSystem.processAndSavePdfs === 'function') {
        window.processAndSavePdfs = function(propertyId, propertyTitle) {
            console.log(`📤 processAndSavePdfs → delegado para MediaSystem`);
            return window.MediaSystem.processAndSavePdfs(propertyId, propertyTitle);
        };
        fixes.push('processAndSavePdfs (delegado para MediaSystem)');
        console.log('✅ processAndSavePdfs criada via delegação');
    }
    
    if (typeof window.clearAllPdfs !== 'function' && window.MediaSystem && typeof window.MediaSystem.clearAllPdfs === 'function') {
        window.clearAllPdfs = function() {
            console.log(`🗑️ clearAllPdfs → delegado para MediaSystem`);
            return window.MediaSystem.clearAllPdfs();
        };
        fixes.push('clearAllPdfs (delegado para MediaSystem)');
        console.log('✅ clearAllPdfs criada via delegação');
    }
    
    if (typeof window.loadExistingPdfsForEdit !== 'function' && window.MediaSystem && typeof window.MediaSystem.loadExistingPdfsForEdit === 'function') {
        window.loadExistingPdfsForEdit = function(property) {
            console.log(`📋 loadExistingPdfsForEdit → delegado para MediaSystem`);
            return window.MediaSystem.loadExistingPdfsForEdit(property);
        };
        fixes.push('loadExistingPdfsForEdit (delegado para MediaSystem)');
        console.log('✅ loadExistingPdfsForEdit criada via delegação');
    }

    // --- 4.3 DELEGAÇÃO PARA SharedCore ---
    if (typeof window.formatPriceForInput !== 'function' && window.SharedCore && window.SharedCore.PriceFormatter && typeof window.SharedCore.PriceFormatter.formatForInput === 'function') {
        window.formatPriceForInput = function(value) {
            return window.SharedCore.PriceFormatter.formatForInput(value);
        };
        fixes.push('formatPriceForInput (delegado para SharedCore)');
    }
    
    if (typeof window.ensureBooleanVideo !== 'function' && window.SharedCore && typeof window.SharedCore.ensureBooleanVideo === 'function') {
        window.ensureBooleanVideo = function(value) {
            return window.SharedCore.ensureBooleanVideo(value);
        };
        fixes.push('ensureBooleanVideo (delegado para SharedCore)');
    }
    
    if (typeof window.formatFeaturesForDisplay !== 'function' && window.SharedCore && typeof window.SharedCore.formatFeaturesForDisplay === 'function') {
        window.formatFeaturesForDisplay = function(features) {
            return window.SharedCore.formatFeaturesForDisplay(features);
        };
        fixes.push('formatFeaturesForDisplay (delegado para SharedCore)');
    }

    // --- 4.4 FUNÇÕES INTERATIVAS (criar apenas se não existirem) ---
    if (typeof window.interactivePdfTest !== 'function') {
        window.interactivePdfTest = function() {
            console.log('🎮 interactivePdfTest() - v5.6.1');
            return window.showCompatibilityControlPanel ? window.showCompatibilityControlPanel() : false;
        };
        fixes.push('interactivePdfTest');
    }

    console.log(`📊 Correções aplicadas: ${fixes.length}`);
    if (fixes.length > 0) {
        console.log('✅ Funções corrigidas:', fixes.join(', '));
    }
    
    if (errors.length > 0) {
        console.error('❌ Erros:', errors);
    }
    
    console.groupEnd();
    
    return {
        fixesApplied: fixes,
        errors: errors,
        timestamp: new Date().toISOString(),
        version: '5.6.1'
    };
};

// ============================================================
// BLOCO 5: DETECÇÃO DE REFERÊNCIAS QUEBRADAS
// ============================================================
window.detectAndRemoveBrokenReferences = function() {
    console.group('🔗 [DIAGNOSTICS v5.6.1] Detectando Referências Quebradas');
    
    const brokenRefs = [];
    const recommendations = [];
    
    // Verificar sistemas principais
    if (!window.properties || !Array.isArray(window.properties)) {
        brokenRefs.push('window.properties (não é array)');
        recommendations.push('Executar window.loadPropertiesData() para restaurar dados');
    }
    
    if (!window.MediaSystem || typeof window.MediaSystem.uploadAll !== 'function') {
        brokenRefs.push('MediaSystem.uploadAll');
        recommendations.push('Verificar se media-unified.js foi carregado');
    }
    
    if (!window.PdfSystem || typeof window.PdfSystem.showModal !== 'function') {
        brokenRefs.push('PdfSystem.showModal');
        recommendations.push('Verificar se pdf-unified.js foi carregado');
    }
    
    if (!window.SharedCore || typeof window.SharedCore.ensureBooleanVideo !== 'function') {
        brokenRefs.push('SharedCore.ensureBooleanVideo');
        recommendations.push('Verificar se SharedCore.js foi carregado');
    }
    
    // Verificar botão admin (problema comum)
    const adminBtn = document.querySelector('.admin-toggle');
    if (adminBtn) {
        const hasOnClick = typeof adminBtn.onclick === 'function' || adminBtn.getAttribute('onclick');
        if (!hasOnClick) {
            console.warn('⚠️ Botão admin sem evento de clique. Reaplicando...');
            adminBtn.onclick = function(e) {
                e.preventDefault();
                if (typeof window.toggleAdminPanel === 'function') {
                    window.toggleAdminPanel();
                } else {
                    console.error('❌ toggleAdminPanel não disponível');
                }
            };
            brokenRefs.push('admin-toggle.onclick (reparado)');
            recommendations.push('Evento do botão admin restaurado');
        }
    }
    
    if (brokenRefs.length > 0) {
        console.warn(`⚠️ ${brokenRefs.length} referência(s) quebrada(s) detectada(s):`);
        brokenRefs.forEach(ref => console.warn(`  - ${ref}`));
    } else {
        console.log('✅ Nenhuma referência quebrada crítica encontrada.');
    }
    
    if (recommendations.length > 0) {
        console.log('💡 RECOMENDAÇÕES:');
        recommendations.forEach((rec, i) => console.log(`  ${i+1}. ${rec}`));
    }
    
    console.groupEnd();
    
    return {
        brokenRefs: brokenRefs,
        recommendations: recommendations,
        timestamp: new Date().toISOString(),
        version: '5.6.1'
    };
};

// ============================================================
// BLOCO 6: PAINEL DE CONTROLE DE COMPATIBILIDADE (CORRIGIDO)
// ============================================================
window.showCompatibilityControlPanel = function() {
    console.log('🎛️ [DIAGNOSTICS v5.6.1] Exibindo painel de controle...');
    
    // Remover painel anterior se existir
    const existingPanel = document.getElementById('compatibility-control-panel-v5-6-1');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Executar diagnóstico rápido para obter estatísticas
    const diagnosis = typeof window.diagnoseExistingFunctions === 'function' 
        ? window.diagnoseExistingFunctions() 
        : { exists: [], missing: [], warnings: [] };
    
    const missingCount = diagnosis.missing ? diagnosis.missing.length : 0;
    const existsCount = diagnosis.exists ? diagnosis.exists.length : 0;
    const warningsCount = diagnosis.warnings ? diagnosis.warnings.length : 0;
    
    // CRIAR PAINEL COM CSS INLINE (GARANTIDO)
    const panel = document.createElement('div');
    panel.id = 'compatibility-control-panel-v5-6-1';
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        max-width: 95vw;
        background: linear-gradient(145deg, #0a1a2f, #0e2a3a);
        color: #e0f0ff;
        border: 2px solid #00aaff;
        border-radius: 12px;
        padding: 20px;
        font-family: 'Segoe UI', 'Courier New', monospace;
        font-size: 13px;
        z-index: 2147483647;
        box-shadow: 0 10px 40px rgba(0, 170, 255, 0.5);
        backdrop-filter: blur(8px);
        line-height: 1.5;
    `;
    
    // Determinar status do sistema
    const systemStatus = missingCount === 0 ? '✅ ÍNTEGRO' : '⚠️ INCOMPLETO';
    const statusColor = missingCount === 0 ? '#00ff9c' : '#ffaa00';
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #3388ff; padding-bottom: 10px;">
            <span style="font-size: 16px; font-weight: bold; color: #88ddff;">
                🔧 DIAGNÓSTICO v5.6.1
            </span>
            <span style="background: ${statusColor}; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px;">
                ${systemStatus}
            </span>
        </div>
        
        <!-- CARD DE ESTATÍSTICAS -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; background: #11223380; padding: 12px; border-radius: 10px;">
            <div style="text-align: center;">
                <div style="font-size: 11px; color: #aaddff;">FUNÇÕES OK</div>
                <div style="font-size: 26px; font-weight: bold; color: #00ff9c;">${existsCount}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 11px; color: #aaddff;">AUSENTES</div>
                <div style="font-size: 26px; font-weight: bold; color: #ff8888;">${missingCount}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 11px; color: #aaddff;">AVISOS</div>
                <div style="font-size: 26px; font-weight: bold; color: #ffaa00;">${warningsCount}</div>
            </div>
        </div>
        
        <!-- BOTÕES DE AÇÃO -->
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: #aaddff; margin-bottom: 8px;">⚡ AÇÕES RÁPIDAS</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button id="diag-btn-diagnose" style="
                    background: #006688;
                    color: white;
                    border: none;
                    padding: 10px 5px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                ">
                    🔍 DIAGNOSTICAR
                </button>
                <button id="diag-btn-fix" ${missingCount === 0 ? 'disabled' : ''} style="
                    background: ${missingCount === 0 ? '#555' : '#ff8800'};
                    color: white;
                    border: none;
                    padding: 10px 5px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: ${missingCount === 0 ? 'not-allowed' : 'pointer'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    opacity: ${missingCount === 0 ? '0.6' : '1'};
                ">
                    🛠️ CORRIGIR (${missingCount})
                </button>
                <button id="diag-btn-refs" style="
                    background: #445588;
                    color: white;
                    border: none;
                    padding: 10px 5px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                ">
                    🔗 VERIFICAR REFS
                </button>
                <button id="diag-btn-testpdf" style="
                    background: #226688;
                    color: white;
                    border: none;
                    padding: 10px 5px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                ">
                    📄 TESTAR PDF
                </button>
            </div>
        </div>
        
        <!-- ÁREA DE LOG -->
        <div id="diag-log-container" style="
            background: #001524;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 15px;
            max-height: 120px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 11px;
            border: 1px solid #336688;
        ">
            <div style="color: #88aaff;">📋 Clique nos botões acima para executar ações.</div>
        </div>
        
        <!-- RODAPÉ -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #88aaff;">
                ${new Date().toLocaleTimeString()} | v5.6.1 FINAL
            </span>
            <button id="diag-btn-close" style="
                background: #aa4455;
                color: white;
                border: none;
                padding: 6px 16px;
                border-radius: 20px;
                font-weight: bold;
                cursor: pointer;
                font-size: 12px;
            ">
                FECHAR
            </button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // === CONFIGURAR EVENTOS ===
    const logContainer = document.getElementById('diag-log-container');
    
    function addLog(message, type = 'info') {
        if (!logContainer) return;
        const entry = document.createElement('div');
        entry.style.cssText = `
            margin-bottom: 4px;
            color: ${type === 'error' ? '#ff8888' : type === 'success' ? '#88ff88' : type === 'warning' ? '#ffaa88' : '#aaddff'};
            border-bottom: 1px solid #33558820;
            padding-bottom: 2px;
        `;
        entry.textContent = `> ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // Botão Diagnosticar
    const diagnoseBtn = document.getElementById('diag-btn-diagnose');
    if (diagnoseBtn) {
        diagnoseBtn.onclick = function(e) {
            e.preventDefault();
            addLog('🔍 Executando diagnóstico completo...');
            const result = window.diagnoseExistingFunctions ? window.diagnoseExistingFunctions() : null;
            if (result) {
                addLog(`✅ OK: ${result.exists?.length || 0} | ❌ Ausentes: ${result.missing?.length || 0}`, 
                       result.missing?.length ? 'warning' : 'success');
            } else {
                addLog('❌ Falha ao executar diagnose', 'error');
            }
        };
    }
    
    // Botão Corrigir
    const fixBtn = document.getElementById('diag-btn-fix');
    if (fixBtn) {
        fixBtn.onclick = function(e) {
            e.preventDefault();
            addLog('🛠️ Aplicando correções automáticas...');
            const result = window.autoFixMissingFunctions ? window.autoFixMissingFunctions() : null;
            if (result) {
                addLog(`✅ ${result.fixesApplied?.length || 0} correção(ões) aplicada(s)`, 'success');
                // Atualizar painel após 2 segundos
                setTimeout(() => {
                    panel.remove();
                    window.showCompatibilityControlPanel();
                }, 1500);
            } else {
                addLog('❌ Falha na correção automática', 'error');
            }
        };
    }
    
    // Botão Verificar Referências
    const refsBtn = document.getElementById('diag-btn-refs');
    if (refsBtn) {
        refsBtn.onclick = function(e) {
            e.preventDefault();
            addLog('🔗 Verificando referências quebradas...');
            const result = window.detectAndRemoveBrokenReferences ? window.detectAndRemoveBrokenReferences() : null;
            if (result) {
                if (result.brokenRefs?.length) {
                    addLog(`⚠️ ${result.brokenRefs.length} referência(s) quebrada(s)`, 'error');
                    result.brokenRefs.slice(0, 3).forEach(ref => addLog(`   - ${ref}`, 'error'));
                } else {
                    addLog('✅ Nenhuma referência quebrada encontrada', 'success');
                }
            }
        };
    }
    
    // Botão Testar PDF
    const pdfBtn = document.getElementById('diag-btn-testpdf');
    if (pdfBtn) {
        pdfBtn.onclick = function(e) {
            e.preventDefault();
            addLog('📄 Testando sistema PDF (imóvel ID: 101)...');
            
            if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
                window.PdfSystem.showModal(101);
                addLog('✅ PdfSystem.showModal(101) executado', 'success');
            } else if (typeof window.showPdfModal === 'function') {
                window.showPdfModal(101);
                addLog('⚠️ Usando showPdfModal fallback', 'warning');
            } else {
                addLog('❌ Nenhum sistema PDF disponível!', 'error');
            }
        };
    }
    
    // Botão Fechar
    const closeBtn = document.getElementById('diag-btn-close');
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            panel.style.opacity = '0';
            panel.style.transition = 'opacity 0.3s';
            setTimeout(() => panel.remove(), 300);
            addLog('❌ Painel fechado');
        };
    }
    
    console.log('✅ [DIAGNOSTICS v5.6.1] Painel de controle exibido com sucesso');
    return panel;
};

// ============================================================
// BLOCO 7: INICIALIZAÇÃO SEGURA
// ============================================================
window.safeInitDiagnostics = function() {
    console.group('🚀 [DIAGNOSTICS v5.6.1] Inicialização Segura');
    
    try {
        // 1. Diagnosticar funções existentes
        const diagnosis = window.diagnoseExistingFunctions ? window.diagnoseExistingFunctions() : null;
        
        // 2. Corrigir funções faltantes se necessário
        if (diagnosis && diagnosis.missing && diagnosis.missing.length > 0) {
            console.log(`⚠️ ${diagnosis.missing.length} função(ões) ausentes. Aplicando correções...`);
            window.autoFixMissingFunctions ? window.autoFixMissingFunctions() : null;
        }
        
        // 3. Detectar referências quebradas
        window.detectAndRemoveBrokenReferences ? window.detectAndRemoveBrokenReferences() : null;
        
        // 4. Verificar se deve mostrar painel automaticamente
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug') && urlParams.has('diagnostics')) {
            setTimeout(() => {
                if (typeof window.showCompatibilityControlPanel === 'function') {
                    window.showCompatibilityControlPanel();
                } else {
                    console.warn('⚠️ showCompatibilityControlPanel não disponível após inicialização');
                }
            }, 1000);
        }
        
        console.log('✅ Inicialização segura concluída');
        
    } catch (error) {
        console.error('❌ Erro na inicialização segura:', error);
    }
    
    console.groupEnd();
    
    return {
        success: true,
        timestamp: new Date().toISOString(),
        version: '5.6.1'
    };
};

// ============================================================
// BLOCO 8: INTEGRAÇÃO COM SISTEMA EXISTENTE
// ============================================================
(function integrateCompatibilityModule() {
    console.log('🔗 [DIAGNOSTICS v5.6.1] Integrando módulo de compatibilidade...');
    
    // Adicionar ao objeto diag se existir
    if (window.diag) {
        window.diag.compat = window.diag.compat || {};
        window.diag.compat.diagnose = window.diagnoseExistingFunctions;
        window.diag.compat.fix = window.autoFixMissingFunctions;
        window.diag.compat.detect = window.detectAndRemoveBrokenReferences;
        window.diag.compat.panel = window.showCompatibilityControlPanel;
        window.diag.compat.init = window.safeInitDiagnostics;
        console.log('✅ Módulo integrado a window.diag.compat');
    }
    
    // Adicionar ao console.diag se existir
    if (console.diag) {
        console.diag.compat = console.diag.compat || {};
        console.diag.compat.v561 = {
            diagnose: window.diagnoseExistingFunctions,
            fix: window.autoFixMissingFunctions,
            detect: window.detectAndRemoveBrokenReferences,
            panel: window.showCompatibilityControlPanel
        };
    }
})();

// ============================================================
// BLOCO 9: EXECUÇÃO AUTOMÁTICA
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.safeInitDiagnostics, 800);
    });
} else {
    setTimeout(window.safeInitDiagnostics, 800);
}

// ============================================================
// EXPORTAÇÃO DE COMANDOS PARA CONSOLE
// ============================================================
console.log('✅ [DIAGNOSTICS v5.6.1 FINAL] Comandos disponíveis:');
console.log('   🔍 window.diagnoseExistingFunctions() - Diagnosticar funções');
console.log('   🛠️  window.autoFixMissingFunctions() - Corrigir funções ausentes');
console.log('   🔗 window.detectAndRemoveBrokenReferences() - Detectar referências quebradas');
console.log('   🎛️  window.showCompatibilityControlPanel() - Exibir painel de controle');
console.log('   🚀 window.safeInitDiagnostics() - Inicialização segura completa');
console.log('   📋 window.diag.compat - Acesso via objeto diag');

// ============================================================
// FIM DO ARQUIVO diagnostics56.js v5.6.1 FINAL
// ============================================================
