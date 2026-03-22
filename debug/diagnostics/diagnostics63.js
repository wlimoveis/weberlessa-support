/* ================== MÓDULO DE GESTÃO DE ARQUIVOS ÓRFÃOS (DIAGNOSTICS63) ================== */
// Versão: 6.3.0 - ATUALIZADO: 22/03/2026
// ✅ Compatível com a arquitetura de dois repositórios.
// ✅ Painel visual com botões interativos.
// ✅ Integração com MediaMigrationChecker.
// ✅ Logs no console e comando global.

console.log('🎯 MÓDULO DE GESTÃO DE ÓRFÃOS v6.3.0 (DIAGNOSTICS63) CARREGADO');

// ================== INICIALIZAÇÃO GARANTIDA ==================
(function initializeOrphanManagementModule() {
    console.group('🚀 INICIALIZANDO GESTÃO DE ÓRFÃOS v6.3.0');

    // Registrar no painel (fallback seguro)
    if (typeof window.logToPanel === 'function') {
        window.logToPanel('✅ Módulo de gestão de órfãos v6.3.0 carregado', 'success');
    } else {
        window.logToPanel = function(message, type = 'info') {
            console.log(`[PAINEL] ${message}`);
        };
        window.logToPanel('✅ Módulo de gestão de órfãos v6.3.0 carregado', 'success');
    }

    if (typeof window.updateStatus === 'function') {
        window.updateStatus('Módulo de gestão de órfãos v6.3.0 pronto', 'success');
    }

    console.log('✅ Gestão de órfãos v6.3.0 inicializada');
    console.groupEnd();

    // Registrar versão
    window.DIAGNOSTICS_VERSION = window.DIAGNOSTICS_VERSION || {};
    window.DIAGNOSTICS_VERSION.orphanManagement = '6.3.0';
})();

// ================== FUNÇÃO PRINCIPAL DE DIAGNÓSTICO ==================
window.diagnoseOrphanFiles = async function() {
    console.group('🔍 DIAGNÓSTICO DE ARQUIVOS ÓRFÃOS (v6.3.0)');

    if (window.logToPanel) {
        window.logToPanel('🔍 Iniciando diagnóstico de arquivos órfãos...', 'info');
    }

    try {
        // Verificar se o MediaMigrationChecker está disponível
        if (!window.MediaMigrationChecker || typeof window.MediaMigrationChecker.diagnoseOrphanFiles !== 'function') {
            throw new Error('MediaMigrationChecker não disponível. Verifique se o suporte está carregado com ?debug=true');
        }

        const report = await window.MediaMigrationChecker.diagnoseOrphanFiles();

        if (report && report.success) {
            if (window.logToPanel) {
                if (report.orphan_count === 0) {
                    window.logToPanel(`✅ Diagnóstico: ${report.orphan_count} arquivos órfãos - STORAGE LIMPO!`, 'success');
                } else {
                    window.logToPanel(`⚠️ Diagnóstico: ${report.orphan_count} arquivos órfãos (${report.total_size_mb} MB)`, 'warning');
                }
            }
            
            // Exibir painel visual
            setTimeout(() => {
                showOrphanManagementPanel(report);
            }, 300);
            
            console.groupEnd();
            return report;
        } else {
            throw new Error(report?.reason || 'Falha no diagnóstico');
        }

    } catch (error) {
        console.error('❌ Erro no diagnóstico:', error);
        if (window.logToPanel) {
            window.logToPanel(`❌ Erro: ${error.message}`, 'error');
        }
        console.groupEnd();
        return { success: false, error: error.message };
    }
};

// ================== FUNÇÃO DE TESTE DE LIMPEZA ==================
window.testOrphanCleanup = async function() {
    console.group('🧪 TESTE DE LIMPEZA (1 arquivo)');

    if (window.logToPanel) {
        window.logToPanel('🧪 Iniciando teste de limpeza (1 arquivo)...', 'info');
    }

    try {
        // Primeiro, obter diagnóstico atual
        const report = await window.diagnoseOrphanFiles();
        
        if (!report.success) {
            throw new Error('Não foi possível obter diagnóstico');
        }
        
        if (report.orphan_count === 0) {
            window.logToPanel('✅ Nenhum arquivo órfão para testar', 'success');
            console.groupEnd();
            return;
        }
        
        const confirmMsg = `🧪 TESTE DE LIMPEZA\n\nSerá excluído APENAS 1 arquivo órfão para validação.\n\nArquivo de teste: ${report.orphans?.[0]?.name || 'desconhecido'}\n\nDeseja continuar?`;
        
        if (!confirm(confirmMsg)) {
            window.logToPanel('❌ Teste cancelado pelo usuário', 'warning');
            console.groupEnd();
            return;
        }
        
        if (window.logToPanel) {
            window.logToPanel('⏳ Executando exclusão de teste...', 'info');
        }
        
        const result = await window.MediaMigrationChecker.safeOrphanCleanup(1);
        
        if (result.success && result.deleted === 1) {
            window.logToPanel('✅ Teste concluído! 1 arquivo excluído com sucesso', 'success');
            setTimeout(() => window.diagnoseOrphanFiles(), 500);
        } else {
            throw new Error(result.reason || 'Falha no teste');
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
        if (window.logToPanel) {
            window.logToPanel(`❌ Erro: ${error.message}`, 'error');
        }
    }
    
    console.groupEnd();
};

// ================== FUNÇÃO DE LIMPEZA COMPLETA ==================
window.fullOrphanCleanup = async function() {
    console.group('⚠️ LIMPEZA COMPLETA DE ÓRFÃOS');

    if (window.logToPanel) {
        window.logToPanel('⚠️ Iniciando processo de limpeza completa...', 'warning');
    }

    try {
        const report = await window.diagnoseOrphanFiles();
        
        if (!report.success) {
            throw new Error('Não foi possível obter diagnóstico');
        }
        
        if (report.orphan_count === 0) {
            window.logToPanel('✅ Nenhum arquivo órfão para limpar', 'success');
            console.groupEnd();
            return;
        }
        
        const confirmText = prompt(
            `⚠️ LIMPEZA COMPLETA - AÇÃO IRREVERSÍVEL ⚠️\n\n` +
            `Total de órfãos: ${report.orphan_count} arquivos\n` +
            `Espaço estimado: ${report.total_size_mb} MB\n\n` +
            `Digite "CONFIRMAR" para prosseguir com a exclusão PERMANENTE:`
        );
        
        if (confirmText !== 'CONFIRMAR') {
            window.logToPanel('❌ Limpeza cancelada pelo usuário', 'warning');
            console.groupEnd();
            return;
        }
        
        if (window.logToPanel) {
            window.logToPanel(`⏳ Iniciando limpeza de ${report.orphan_count} arquivos...`, 'info');
        }
        
        const result = await window.MediaMigrationChecker.safeOrphanCleanup();
        
        if (result.success) {
            window.logToPanel(`✅ Limpeza concluída! ${result.deleted} arquivos excluídos`, 'success');
            if (result.failed) {
                window.logToPanel(`⚠️ ${result.failed} falhas durante a limpeza`, 'warning');
            }
            setTimeout(() => window.diagnoseOrphanFiles(), 500);
        } else {
            throw new Error(result.reason || 'Falha na limpeza');
        }
        
    } catch (error) {
        console.error('❌ Erro na limpeza:', error);
        if (window.logToPanel) {
            window.logToPanel(`❌ Erro: ${error.message}`, 'error');
        }
    }
    
    console.groupEnd();
};

// ================== PAINEL DE RELATÓRIO VISUAL ==================
function showOrphanManagementPanel(report) {
    const panelId = 'orphan-management-panel-v6-3-0';

    const existingPanel = document.getElementById(panelId);
    if (existingPanel) existingPanel.remove();

    const orphanCount = report?.orphan_count || 0;
    const totalSizeMB = report?.total_size_mb || '0';
    const imagesCount = report?.orphans_by_type?.images || 0;
    const pdfsCount = report?.orphans_by_type?.pdfs || 0;
    const videosCount = report?.orphans_by_type?.videos || 0;
    const otherCount = report?.orphans_by_type?.other || 0;
    const totalStorage = report?.total_in_storage || 0;
    const usedFiles = report?.used_files || 0;

    const panelDiv = document.createElement('div');
    panelDiv.id = panelId;
    panelDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #0a0a2a, #001a33);
        color: #00aaff;
        padding: 25px;
        border: 3px solid ${orphanCount > 0 ? '#ffaa00' : '#00ff9c'};
        border-radius: 10px;
        z-index: 1000010;
        max-width: 700px;
        width: 95%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(0, 170, 255, 0.5);
        font-family: monospace;
        backdrop-filter: blur(10px);
    `;

    panelDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 24px; color: #00aaff; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>🧹</span>
                <span>GESTÃO DE ARQUIVOS ÓRFÃOS</span>
            </div>
            <div style="font-size: 16px; color: #88aaff; margin-top: 5px;">
                Supabase Storage - v6.3.0
            </div>
            <div style="font-size: 12px; color: #4488ff; margin-top: 5px;">
                ${new Date().toLocaleString()}
            </div>
        </div>

        <div style="background: rgba(0, 170, 255, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid rgba(0, 170, 255, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">TOTAL STORAGE</div>
                    <div style="font-size: 28px; color: #00aaff;">${totalStorage}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">EM USO</div>
                    <div style="font-size: 28px; color: #00ff9c;">${usedFiles}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">ÓRFÃOS</div>
                    <div style="font-size: 28px; color: ${orphanCount > 0 ? '#ffaa00' : '#00ff9c'};">${orphanCount}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">ESPAÇO (MB)</div>
                    <div style="font-size: 28px; color: #ffaa88;">${totalSizeMB}</div>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <div style="color: #88aaff; font-size: 14px; margin-bottom: 10px;">📂 DISTRIBUIÇÃO DOS ÓRFÃOS:</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                <div style="background: rgba(0,170,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                    <div>🖼️ Imagens</div>
                    <div style="font-size: 20px; font-weight: bold;">${imagesCount}</div>
                </div>
                <div style="background: rgba(0,170,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                    <div>📄 PDFs</div>
                    <div style="font-size: 20px; font-weight: bold;">${pdfsCount}</div>
                </div>
                <div style="background: rgba(0,170,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                    <div>🎬 Vídeos</div>
                    <div style="font-size: 20px; font-weight: bold;">${videosCount}</div>
                </div>
                <div style="background: rgba(0,170,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                    <div>❓ Outros</div>
                    <div style="font-size: 20px; font-weight: bold;">${otherCount}</div>
                </div>
            </div>
        </div>

        ${orphanCount > 0 && report?.orphans?.length > 0 ? `
        <div style="margin-bottom: 20px;">
            <div style="color: #ffaa00; font-size: 14px; margin-bottom: 10px;">📋 AMOSTRA DOS PRIMEIROS 5 ARQUIVOS ÓRFÃOS:</div>
            <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 6px; max-height: 150px; overflow-y: auto;">
                ${report.orphans.slice(0, 5).map((file, i) => `
                    <div style="font-family: monospace; font-size: 11px; padding: 4px; border-bottom: 1px solid #333; color: #ff9999;">
                        ${i+1}. ${file.name} (${(file.size/1024).toFixed(1)} KB)
                    </div>
                `).join('')}
                ${orphanCount > 5 ? `<div style="color: #888; font-size: 10px; margin-top: 5px;">... e mais ${orphanCount - 5} arquivos</div>` : ''}
            </div>
        </div>
        ` : `
        <div style="margin-bottom: 20px; background: rgba(0,255,156,0.1); padding: 15px; border-radius: 6px; border: 1px solid #00ff9c; text-align: center;">
            <span style="color: #00ff9c; font-size: 18px;">🎉 STORAGE 100% LIMPO! Nenhum arquivo órfão encontrado.</span>
        </div>
        `}

        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
            <button id="refresh-diagnostic" style="
                background: linear-gradient(45deg, #00aaff, #0088cc); 
                color: white; border: none;
                padding: 12px 20px; cursor: pointer; border-radius: 5px;
                font-weight: bold;">
                🔍 ATUALIZAR
            </button>
            <button id="test-cleanup-btn" style="
                background: linear-gradient(45deg, #e67e22, #d35400); 
                color: white; border: none;
                padding: 12px 20px; cursor: pointer; border-radius: 5px;
                font-weight: bold;">
                🧪 TESTAR LIMPEZA (1 arquivo)
            </button>
            <button id="full-cleanup-btn" style="
                background: linear-gradient(45deg, #c0392b, #a93226); 
                color: white; border: none;
                padding: 12px 20px; cursor: pointer; border-radius: 5px;
                font-weight: bold;">
                ⚠️ LIMPEZA COMPLETA
            </button>
            <button id="close-panel" style="
                background: #555; color: white; border: none;
                padding: 12px 20px; cursor: pointer; border-radius: 5px;
                font-weight: bold;">
                FECHAR
            </button>
        </div>
        <div style="font-size: 10px; color: #88aaff; text-align: center; margin-top: 15px;">
            ⚠️ Limpeza completa é IRREVERSÍVEL. Use o botão de teste primeiro para validar.
        </div>
    `;

    document.body.appendChild(panelDiv);

    const btnRefresh = document.getElementById('refresh-diagnostic');
    const btnTest = document.getElementById('test-cleanup-btn');
    const btnFull = document.getElementById('full-cleanup-btn');
    const btnClose = document.getElementById('close-panel');

    if (btnRefresh) btnRefresh.addEventListener('click', () => { panelDiv.remove(); window.diagnoseOrphanFiles(); });
    if (btnTest) btnTest.addEventListener('click', () => { panelDiv.remove(); window.testOrphanCleanup(); });
    if (btnFull) btnFull.addEventListener('click', () => { panelDiv.remove(); window.fullOrphanCleanup(); });
    if (btnClose) btnClose.addEventListener('click', () => panelDiv.remove());

    console.log('✅ Painel de gestão de órfãos v6.3.0 exibido na tela');
}

// ================== BOTÃO FLUTUANTE ==================
function addFloatingOrphanButton() {
    if (document.getElementById('orphan-float-btn-v6-3-0')) return;

    console.log('🔧 Adicionando botão flutuante de gestão de órfãos...');

    const btn = document.createElement('button');
    btn.id = 'orphan-float-btn-v6-3-0';
    btn.innerHTML = '🧹 ÓRFÃOS v6.3.0';
    btn.style.cssText = `
        position: fixed;
        bottom: 160px;
        right: 20px;
        background: linear-gradient(145deg, #e67e22, #d35400);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 40px;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(230,126,34,0.5);
        cursor: pointer;
        z-index: 1000020;
        border: 2px solid white;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    btn.onmouseenter = () => { btn.style.transform = 'scale(1.05)'; btn.style.boxShadow = '0 6px 20px rgba(230,126,34,0.7)'; };
    btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 4px 15px rgba(230,126,34,0.5)'; };
    btn.onclick = () => { if (window.diagnoseOrphanFiles) window.diagnoseOrphanFiles(); };

    document.body.appendChild(btn);
    console.log('✅ Botão flutuante de gestão de órfãos adicionado.');

    if (window.logToPanel) {
        window.logToPanel('✅ Botão flutuante de órfãos v6.3.0 adicionado', 'success');
    }
}

// ================== COMANDOS RÁPIDOS (CONSOLE) ==================
console.log('%c🧹 COMANDOS DE GESTÃO DE ÓRFÃOS v6.3.0 DISPONÍVEIS:', 'color: #e67e22; font-weight: bold; font-size: 14px;');
console.log('%c• diagnoseOrphanFiles() - Diagnóstico completo (apenas leitura)', 'color: #ffaa88;');
console.log('%c• testOrphanCleanup() - Teste seguro (exclui 1 arquivo)', 'color: #ffaa88;');
console.log('%c• fullOrphanCleanup() - Limpeza completa (exige confirmação)', 'color: #ffaa88;');
console.log('%c• addOrphanButton() - Adiciona botão flutuante', 'color: #ffaa88;');

window.diagnoseOrphans = window.diagnoseOrphanFiles;
window.testCleanup = window.testOrphanCleanup;
window.fullCleanup = window.fullOrphanCleanup;
window.addOrphanButton = addFloatingOrphanButton;

// ================== EXECUÇÃO AUTOMÁTICA ==================
function autoInitializeOrphanModule() {
    console.log('📄 Inicializando gestão de órfãos v6.3.0...');

    if (window.location.search.includes('debug=true') || window.location.search.includes('diagnostics=true')) {
        setTimeout(addFloatingOrphanButton, 1500);
        setTimeout(() => {
    console.log('🔄 Executando diagnóstico automático de órfãos...');
    // Aguardar MediaMigrationChecker estar disponível
    const waitForChecker = setInterval(() => {
        if (window.MediaMigrationChecker && typeof window.MediaMigrationChecker.diagnoseOrphanFiles === 'function') {
            clearInterval(waitForChecker);
            if (window.diagnoseOrphanFiles) {
                window.diagnoseOrphanFiles();
            }
        } else {
            console.log('⏳ Aguardando MediaMigrationChecker...');
        }
    }, 500);
    
    // Timeout de segurança
    setTimeout(() => {
        clearInterval(waitForChecker);
        if (window.diagnoseOrphanFiles) {
            console.log('⚠️ MediaMigrationChecker não disponível, executando diagnóstico embutido');
            window.diagnoseOrphanFiles();
        }
    }, 5000);
}, 3000);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitializeOrphanModule);
} else {
    autoInitializeOrphanModule();
}

console.log('%c✅ DIAGNOSTICS63 v6.3.0 PRONTO - GESTÃO DE ARQUIVOS ÓRFÃOS', 
            'color: #ffaa88; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px; border-left: 5px solid #e67e22;');
