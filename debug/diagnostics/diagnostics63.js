/* ================== MÓDULO DE GESTÃO DE ARQUIVOS ÓRFÃOS (DIAGNOSTICS63) ================== */
// Versão: 6.3.2 - ATUALIZADO: 22/03/2026
// ✅ Compatível com a arquitetura de dois repositórios.
// ✅ Painel visual com botões interativos.
// ✅ Integração com MediaMigrationChecker.

console.log('🎯 MÓDULO DE GESTÃO DE ÓRFÃOS v6.3.2 (DIAGNOSTICS63) CARREGADO');

// ================== INICIALIZAÇÃO GARANTIDA ==================
(function initializeOrphanManagementModule() {
    console.group('🚀 INICIALIZANDO GESTÃO DE ÓRFÃOS v6.3.2');

    if (typeof window.logToPanel === 'function') {
        window.logToPanel('✅ Módulo de gestão de órfãos v6.3.2 carregado', 'success');
    } else {
        window.logToPanel = function(message, type = 'info') {
            console.log(`[PAINEL] ${message}`);
        };
        window.logToPanel('✅ Módulo de gestão de órfãos v6.3.2 carregado', 'success');
    }

    if (typeof window.updateStatus === 'function') {
        window.updateStatus('Módulo de gestão de órfãos v6.3.2 pronto', 'success');
    }

    console.log('✅ Gestão de órfãos v6.3.2 inicializada');
    console.groupEnd();

    window.DIAGNOSTICS_VERSION = window.DIAGNOSTICS_VERSION || {};
    window.DIAGNOSTICS_VERSION.orphanManagement = '6.3.2';
})();

// ================== FUNÇÃO PRINCIPAL DE DIAGNÓSTICO ==================
window.diagnoseOrphanFiles = async function() {
    console.group('🔍 DIAGNÓSTICO DE ARQUIVOS ÓRFÃOS (v6.3.2)');

    if (window.logToPanel) {
        window.logToPanel('🔍 Iniciando diagnóstico de arquivos órfãos...', 'info');
    }

    try {
        // Usar MediaMigrationChecker se disponível
        if (window.MediaMigrationChecker && typeof window.MediaMigrationChecker.diagnoseOrphanFiles === 'function') {
            const report = await window.MediaMigrationChecker.diagnoseOrphanFiles();
            if (report && report.success) {
                if (window.logToPanel) {
                    if (report.orphan_count === 0) {
                        window.logToPanel(`✅ Diagnóstico: STORAGE LIMPO!`, 'success');
                    } else {
                        window.logToPanel(`⚠️ Diagnóstico: ${report.orphan_count} arquivos órfãos (${report.total_size_mb} MB)`, 'warning');
                    }
                }
                setTimeout(() => showOrphanManagementPanel(report), 300);
                console.groupEnd();
                return report;
            }
            throw new Error(report?.reason || 'Falha no diagnóstico');
        }
        
        // Fallback: diagnóstico embutido
        console.log('⚠️ MediaMigrationChecker não disponível, usando diagnóstico embutido');
        const fallbackReport = await embeddedDiagnoseOrphans();
        if (fallbackReport && fallbackReport.success) {
            setTimeout(() => showOrphanManagementPanel(fallbackReport), 300);
            console.groupEnd();
            return fallbackReport;
        }
        throw new Error('Nenhum método de diagnóstico disponível');

    } catch (error) {
        console.error('❌ Erro no diagnóstico:', error);
        if (window.logToPanel) {
            window.logToPanel(`❌ Erro: ${error.message}`, 'error');
        }
        console.groupEnd();
        return { success: false, error: error.message };
    }
};

// Diagnóstico embutido (fallback)
async function embeddedDiagnoseOrphans() {
    console.group('🔍 DIAGNÓSTICO EMBUTIDO (FALLBACK)');
    
    try {
        if (!window.properties || window.properties.length === 0) {
            console.warn('⚠️ Nenhum imóvel carregado');
            return { success: false, reason: 'no_properties' };
        }
        
        console.log(`📊 Total de imóveis: ${window.properties.length}`);
        
        const usedUrls = new Set();
        window.properties.forEach(property => {
            if (property.images && property.images !== 'EMPTY') {
                property.images.split(',').forEach(url => { 
                    if (url && url.trim()) usedUrls.add(url.trim()); 
                });
            }
            if (property.pdfs && property.pdfs !== 'EMPTY') {
                property.pdfs.split(',').forEach(url => { 
                    if (url && url.trim()) usedUrls.add(url.trim()); 
                });
            }
        });
        
        console.log(`📋 URLs em uso: ${usedUrls.size}`);
        
        const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || window.SUPABASE_URL;
        const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || window.SUPABASE_KEY;
        
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.error('❌ Credenciais Supabase não encontradas');
            return { success: false, reason: 'missing_credentials' };
        }
        
        console.log('🔗 Conectando ao Supabase Storage...');
        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/properties`, {
            headers: { 
                'Authorization': `Bearer ${SUPABASE_KEY}`, 
                'apikey': SUPABASE_KEY 
            }
        });
        
        if (!response.ok) {
            console.error(`❌ Erro ao listar: ${response.status}`);
            return { success: false, reason: 'list_failed' };
        }
        
        const allFiles = await response.json();
        console.log(`📁 Total no Storage: ${allFiles.length}`);
        
        const orphanFiles = allFiles.filter(file => {
            if (file.name.endsWith('/')) return false;
            const fileName = file.name.split('/').pop();
            return !Array.from(usedUrls).some(url => url.includes(fileName) || url.includes(file.name));
        });
        
        const byType = {
            images: orphanFiles.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length,
            pdfs: orphanFiles.filter(f => f.name.match(/\.pdf$/i)).length,
            videos: orphanFiles.filter(f => f.name.match(/\.(mp4|mov|avi|webm)$/i)).length,
            other: orphanFiles.filter(f => !f.name.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm|pdf)$/i)).length
        };
        
        let totalSize = 0;
        orphanFiles.forEach(f => { if (f.metadata?.size) totalSize += f.metadata.size; });
        
        const report = {
            success: true,
            total_in_storage: allFiles.length,
            used_files: usedUrls.size,
            orphan_count: orphanFiles.length,
            total_size_mb: (totalSize / (1024 * 1024)).toFixed(2),
            orphans_by_type: byType,
            orphans: orphanFiles.slice(0, 100).map(f => ({ name: f.name, size: f.metadata?.size || 0 }))
        };
        
        console.log(`✅ Diagnóstico concluído: ${report.orphan_count} órfãos, ${report.total_size_mb} MB`);
        console.groupEnd();
        return report;
        
    } catch (error) {
        console.error('❌ Erro no diagnóstico embutido:', error);
        console.groupEnd();
        return { success: false, error: error.message };
    }
}

// ================== FUNÇÃO DE TESTE DE LIMPEZA ==================
window.testOrphanCleanup = async function() {
    console.group('🧪 TESTE DE LIMPEZA (1 arquivo)');
    if (window.logToPanel) window.logToPanel('🧪 Iniciando teste de limpeza (1 arquivo)...', 'info');

    try {
        const report = await window.diagnoseOrphanFiles();
        if (!report.success) throw new Error('Não foi possível obter diagnóstico');
        if (report.orphan_count === 0) {
            window.logToPanel('✅ Nenhum arquivo órfão para testar', 'success');
            console.groupEnd();
            return;
        }
        
        const confirmMsg = `🧪 TESTE DE LIMPEZA\n\nSerá excluído APENAS 1 arquivo órfão.\n\nArquivo: ${report.orphans?.[0]?.name || 'desconhecido'}\n\nDeseja continuar?`;
        if (!confirm(confirmMsg)) {
            window.logToPanel('❌ Teste cancelado', 'warning');
            console.groupEnd();
            return;
        }
        
        if (window.MediaMigrationChecker?.safeOrphanCleanup) {
            const result = await window.MediaMigrationChecker.safeOrphanCleanup(1);
            if (result.success && result.deleted === 1) {
                window.logToPanel('✅ Teste concluído! 1 arquivo excluído', 'success');
                setTimeout(() => window.diagnoseOrphanFiles(), 500);
            } else {
                throw new Error(result.reason || 'Falha no teste');
            }
        } else {
            window.logToPanel('⚠️ Função de limpeza não disponível', 'warning');
        }
    } catch (error) {
        console.error('❌ Erro no teste:', error);
        if (window.logToPanel) window.logToPanel(`❌ Erro: ${error.message}`, 'error');
    }
    console.groupEnd();
};

// ================== FUNÇÃO DE LIMPEZA COMPLETA ==================
window.fullOrphanCleanup = async function() {
    console.group('⚠️ LIMPEZA COMPLETA DE ÓRFÃOS');
    if (window.logToPanel) window.logToPanel('⚠️ Iniciando processo de limpeza completa...', 'warning');

    try {
        const report = await window.diagnoseOrphanFiles();
        if (!report.success) throw new Error('Não foi possível obter diagnóstico');
        if (report.orphan_count === 0) {
            window.logToPanel('✅ Nenhum arquivo órfão para limpar', 'success');
            console.groupEnd();
            return;
        }
        
        const confirmText = prompt(
            `⚠️ LIMPEZA COMPLETA - AÇÃO IRREVERSÍVEL ⚠️\n\n` +
            `Total de órfãos: ${report.orphan_count} arquivos\n` +
            `Espaço: ${report.total_size_mb} MB\n\n` +
            `Digite "CONFIRMAR" para prosseguir:`
        );
        
        if (confirmText !== 'CONFIRMAR') {
            window.logToPanel('❌ Limpeza cancelada', 'warning');
            console.groupEnd();
            return;
        }
        
        if (window.MediaMigrationChecker?.safeOrphanCleanup) {
            const result = await window.MediaMigrationChecker.safeOrphanCleanup();
            if (result.success) {
                window.logToPanel(`✅ Limpeza concluída! ${result.deleted} arquivos excluídos`, 'success');
                if (result.failed) window.logToPanel(`⚠️ ${result.failed} falhas`, 'warning');
                setTimeout(() => window.diagnoseOrphanFiles(), 500);
            } else {
                throw new Error(result.reason || 'Falha na limpeza');
            }
        } else {
            window.logToPanel('⚠️ Função de limpeza não disponível', 'warning');
        }
    } catch (error) {
        console.error('❌ Erro na limpeza:', error);
        if (window.logToPanel) window.logToPanel(`❌ Erro: ${error.message}`, 'error');
    }
    console.groupEnd();
};

// ================== PAINEL VISUAL ==================
function showOrphanManagementPanel(report) {
    const panelId = 'orphan-management-panel-v6-3-2';
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
            <div style="font-size: 24px; color: #00aaff;">🧹 GESTÃO DE ARQUIVOS ÓRFÃOS</div>
            <div style="font-size: 12px; color: #4488ff;">${new Date().toLocaleString()}</div>
        </div>
        <div style="background: rgba(0,170,255,0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                <div style="text-align: center;"><div style="font-size: 11px;">TOTAL</div><div style="font-size: 28px;">${totalStorage}</div></div>
                <div style="text-align: center;"><div style="font-size: 11px;">EM USO</div><div style="font-size: 28px; color:#00ff9c;">${usedFiles}</div></div>
                <div style="text-align: center;"><div style="font-size: 11px;">ÓRFÃOS</div><div style="font-size: 28px; color:${orphanCount>0?'#ffaa00':'#00ff9c'};">${orphanCount}</div></div>
                <div style="text-align: center;"><div style="font-size: 11px;">ESPAÇO(MB)</div><div style="font-size: 28px;">${totalSizeMB}</div></div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4,1fr); gap:10px; margin-bottom:20px; text-align:center;">
            <div><div>🖼️</div><div>${imagesCount}</div></div>
            <div><div>📄</div><div>${pdfsCount}</div></div>
            <div><div>🎬</div><div>${videosCount}</div></div>
            <div><div>❓</div><div>${otherCount}</div></div>
        </div>
        ${orphanCount > 0 && report?.orphans?.length > 0 ? `
        <div style="margin-bottom:20px;">
            <div style="color:#ffaa00;">📋 AMOSTRA (primeiros 5):</div>
            <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:6px; max-height:120px; overflow-y:auto;">
                ${report.orphans.slice(0,5).map((f,i) => `<div style="font-size:11px; color:#ff9999;">${i+1}. ${f.name} (${(f.size/1024).toFixed(1)} KB)</div>`).join('')}
                ${orphanCount > 5 ? `<div style="color:#888; font-size:10px;">... e mais ${orphanCount-5} arquivos</div>` : ''}
            </div>
        </div>
        ` : `
        <div style="margin-bottom:20px; background:rgba(0,255,156,0.1); padding:15px; border-radius:6px; text-align:center;">
            <span style="color:#00ff9c;">🎉 STORAGE 100% LIMPO!</span>
        </div>
        `}
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button id="refresh-diagnostic" style="background:#00aaff; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">🔍 ATUALIZAR</button>
            <button id="test-cleanup-btn" style="background:#e67e22; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">🧪 TESTAR (1 arquivo)</button>
            <button id="full-cleanup-btn" style="background:#c0392b; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">⚠️ LIMPEZA TOTAL</button>
            <button id="close-panel" style="background:#555; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">FECHAR</button>
        </div>
        <div style="font-size:10px; text-align:center; margin-top:15px; color:#88aaff;">
            ⚠️ Limpeza completa é IRREVERSÍVEL. Teste primeiro!
        </div>
    `;

    document.body.appendChild(panelDiv);

    document.getElementById('refresh-diagnostic')?.addEventListener('click', () => { panelDiv.remove(); window.diagnoseOrphanFiles(); });
    document.getElementById('test-cleanup-btn')?.addEventListener('click', () => { panelDiv.remove(); window.testOrphanCleanup(); });
    document.getElementById('full-cleanup-btn')?.addEventListener('click', () => { panelDiv.remove(); window.fullOrphanCleanup(); });
    document.getElementById('close-panel')?.addEventListener('click', () => panelDiv.remove());
}

// ================== BOTÃO FLUTUANTE ==================
function addFloatingOrphanButton() {
    if (document.getElementById('orphan-float-btn-v6-3-2')) return;
    const btn = document.createElement('button');
    btn.id = 'orphan-float-btn-v6-3-2';
    btn.innerHTML = '🧹 ÓRFÃOS v6.3.2';
    btn.style.cssText = `position:fixed; bottom:160px; right:20px; background:#e67e22; color:white; border:none; padding:12px 20px; border-radius:40px; font-weight:bold; cursor:pointer; z-index:1000020; border:2px solid white;`;
    btn.onclick = () => window.diagnoseOrphanFiles();
    document.body.appendChild(btn);
    console.log('✅ Botão flutuante adicionado');
}

// ================== COMANDOS CONSOLE ==================
console.log('%c🧹 COMANDOS DISPONÍVEIS:', 'color:#e67e22;font-weight:bold');
console.log('• diagnoseOrphanFiles() - Diagnóstico');
console.log('• testOrphanCleanup() - Teste (1 arquivo)');
console.log('• fullOrphanCleanup() - Limpeza completa');

window.diagnoseOrphans = window.diagnoseOrphanFiles;
window.testCleanup = window.testOrphanCleanup;
window.fullCleanup = window.fullOrphanCleanup;
window.addOrphanButton = addFloatingOrphanButton;

// ================== AUTO-INICIALIZAÇÃO ==================
function autoInitializeOrphanModule() {
    console.log('📄 Inicializando gestão de órfãos v6.3.2...');
    if (window.location.search.includes('debug=true') || window.location.search.includes('diagnostics=true')) {
        setTimeout(addFloatingOrphanButton, 1500);
        setTimeout(() => {
            console.log('🔄 Executando diagnóstico automático...');
            if (window.diagnoseOrphanFiles) window.diagnoseOrphanFiles();
        }, 4000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitializeOrphanModule);
} else {
    autoInitializeOrphanModule();
}

console.log('%c✅ DIAGNOSTICS63 v6.3.2 PRONTO', 'color:#ffaa88;font-weight:bold;background:#001a33;padding:5px;');
