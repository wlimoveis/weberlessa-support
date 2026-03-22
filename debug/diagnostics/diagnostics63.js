// weberlessa-support/debug/diagnostics/diagnostics63.js
// DIAGNÓSTICO DE ARQUIVOS ÓRFÃOS - PAINEL VISUAL COM BOTÕES
// Versão: 6.3.0 - Sistema completo de gestão de órfãos
console.log('🔍 [SUPORTE] diagnostics63.js - Painel de Gestão de Arquivos Órfãos');

(function() {
    'use strict';
    
    // Configuração do módulo
    const ORPHAN_MODULE = {
        version: '6.3.0',
        name: 'Gestão de Arquivos Órfãos',
        initialized: false,
        panelCreated: false
    };
    
    // Cache de dados
    let cachedReport = null;
    let isDiagnosing = false;
    let isCleaning = false;
    
    /**
     * ✅ CRIA O PAINEL VISUAL NO DIAGNOSTIC CONTAINER
     */
    function createOrphanPanel() {
        if (ORPHAN_MODULE.panelCreated) return;
        
        // Procurar container de diagnóstico
        const container = document.querySelector('.diagnostic-container, #diagnostic-panel, .system-diagnostics');
        if (!container) {
            console.warn('[Diagnostics63] Container de diagnóstico não encontrado');
            return;
        }
        
        // Criar seção de órfãos
        const orphanSection = document.createElement('div');
        orphanSection.className = 'orphan-diagnostic-section';
        orphanSection.style.cssText = `
            margin: 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 12px;
            border: 1px solid #00d9ff33;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        
        orphanSection.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #00d9ff; font-size: 1.2rem;">
                    🧹 GESTÃO DE ARQUIVOS ÓRFÃOS (Supabase Storage)
                </h3>
                <span id="orphan-status-badge" style="padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; background: #333; color: #ffd966;">
                    ⚠️ Aguardando diagnóstico
                </span>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                <button id="orphan-btn-diagnose" class="diagnostic-btn" style="background: #2c3e66; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    🔍 DIAGNOSTICAR (apenas leitura)
                </button>
                <button id="orphan-btn-test" class="diagnostic-btn" style="background: #e67e22; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    🧪 TESTAR LIMPEZA (1 arquivo)
                </button>
                <button id="orphan-btn-full" class="diagnostic-btn" style="background: #c0392b; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    ⚠️ LIMPEZA COMPLETA
                </button>
                <button id="orphan-btn-report" class="diagnostic-btn" style="background: #27ae60; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    📊 GERAR RELATÓRIO
                </button>
            </div>
            
            <div id="orphan-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px;">
                <div style="background: #0f0f1a; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.8rem; color: #888;">Total Storage</div>
                    <div id="stat-total" style="font-size: 1.5rem; font-weight: bold; color: #00d9ff;">-</div>
                </div>
                <div style="background: #0f0f1a; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.8rem; color: #888;">Em uso</div>
                    <div id="stat-used" style="font-size: 1.5rem; font-weight: bold; color: #27ae60;">-</div>
                </div>
                <div style="background: #0f0f1a; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.8rem; color: #888;">ÓRFÃOS</div>
                    <div id="stat-orphan" style="font-size: 1.5rem; font-weight: bold; color: #e74c3c;">-</div>
                </div>
                <div style="background: #0f0f1a; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.8rem; color: #888;">Espaço (MB)</div>
                    <div id="stat-size" style="font-size: 1.5rem; font-weight: bold; color: #f39c12;">-</div>
                </div>
            </div>
            
            <div id="orphan-details" style="background: #0f0f1a; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 0.8rem; max-height: 200px; overflow-y: auto; color: #a8e6cf;">
                <div style="color: #888; text-align: center;">Clique em "DIAGNOSTICAR" para iniciar a análise...</div>
            </div>
            
            <div id="orphan-progress" style="margin-top: 10px; display: none;">
                <div style="background: #2c3e66; border-radius: 10px; overflow: hidden;">
                    <div id="orphan-progress-bar" style="width: 0%; height: 4px; background: #00d9ff; transition: width 0.3s;"></div>
                </div>
                <div id="orphan-progress-text" style="font-size: 0.7rem; color: #888; margin-top: 5px; text-align: center;"></div>
            </div>
        `;
        
        container.appendChild(orphanSection);
        ORPHAN_MODULE.panelCreated = true;
        
        // Registrar eventos
        attachEventListeners();
    }
    
    /**
     * ✅ ANEXAR EVENT LISTENERS AOS BOTÕES
     */
    function attachEventListeners() {
        const btnDiagnose = document.getElementById('orphan-btn-diagnose');
        const btnTest = document.getElementById('orphan-btn-test');
        const btnFull = document.getElementById('orphan-btn-full');
        const btnReport = document.getElementById('orphan-btn-report');
        
        if (btnDiagnose) btnDiagnose.addEventListener('click', () => diagnoseOrphans());
        if (btnTest) btnTest.addEventListener('click', () => testCleanup());
        if (btnFull) btnFull.addEventListener('click', () => fullCleanup());
        if (btnReport) btnReport.addEventListener('click', () => generateReport());
    }
    
    /**
     * ✅ ATUALIZAR PAINEL COM RESULTADOS
     */
    function updatePanelWithResults(report) {
        const statTotal = document.getElementById('stat-total');
        const statUsed = document.getElementById('stat-used');
        const statOrphan = document.getElementById('stat-orphan');
        const statSize = document.getElementById('stat-size');
        const detailsDiv = document.getElementById('orphan-details');
        const statusBadge = document.getElementById('orphan-status-badge');
        
        if (statTotal) statTotal.textContent = report.total_in_storage || 0;
        if (statUsed) statUsed.textContent = report.used_files || 0;
        if (statOrphan) statOrphan.textContent = report.orphan_count || 0;
        if (statSize) statSize.textContent = report.total_size_mb || '0';
        
        if (statusBadge) {
            if (report.orphan_count === 0) {
                statusBadge.innerHTML = '✅ STORAGE LIMPO';
                statusBadge.style.background = '#27ae60';
                statusBadge.style.color = 'white';
            } else {
                statusBadge.innerHTML = `⚠️ ${report.orphan_count} ÓRFÃOS`;
                statusBadge.style.background = '#e74c3c';
                statusBadge.style.color = 'white';
            }
        }
        
        if (detailsDiv) {
            let html = '';
            
            if (report.orphan_count === 0) {
                html = '<div style="color: #27ae60;">🎉 Nenhum arquivo órfão encontrado! Storage está limpo.</div>';
            } else {
                html = `
                    <div style="margin-bottom: 10px;">
                        <strong>📂 Distribuição por tipo:</strong><br>
                        🖼️ Imagens: ${report.orphans_by_type?.images || 0}<br>
                        📄 PDFs: ${report.orphans_by_type?.pdfs || 0}<br>
                        🎬 Vídeos: ${report.orphans_by_type?.videos || 0}<br>
                        ❓ Outros: ${report.orphans_by_type?.other || 0}
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>📋 Amostra dos primeiros 5 arquivos:</strong>
                    </div>
                `;
                
                const samples = report.orphans?.slice(0, 5) || [];
                samples.forEach((file, i) => {
                    const sizeKB = file.size ? (file.size / 1024).toFixed(1) : '?';
                    html += `<div style="font-size: 0.7rem; color: #ff9999; margin-bottom: 4px;">${i+1}. ${file.name} (${sizeKB} KB)</div>`;
                });
                
                if (report.orphan_count > 5) {
                    html += `<div style="font-size: 0.7rem; color: #888; margin-top: 5px;">... e mais ${report.orphan_count - 5} arquivos</div>`;
                }
            }
            
            detailsDiv.innerHTML = html;
        }
    }
    
    /**
     * ✅ EXECUTAR DIAGNÓSTICO
     */
    async function diagnoseOrphans() {
        if (isDiagnosing) {
            console.warn('⚠️ Diagnóstico em andamento, aguarde...');
            return;
        }
        
        isDiagnosing = true;
        const detailsDiv = document.getElementById('orphan-details');
        const progressDiv = document.getElementById('orphan-progress');
        
        if (progressDiv) progressDiv.style.display = 'block';
        if (detailsDiv) detailsDiv.innerHTML = '<div style="color: #00d9ff;">🔍 Diagnosticando arquivos órfãos, aguarde...</div>';
        
        try {
            // Verificar se o MediaMigrationChecker está disponível
            if (!window.MediaMigrationChecker || typeof window.MediaMigrationChecker.diagnoseOrphanFiles !== 'function') {
                throw new Error('MediaMigrationChecker não disponível. Verifique se o suporte está carregado.');
            }
            
            const report = await window.MediaMigrationChecker.diagnoseOrphanFiles();
            
            if (report && report.success) {
                cachedReport = report;
                updatePanelWithResults(report);
                
                if (detailsDiv) {
                    detailsDiv.innerHTML += `<div style="color: #27ae60; margin-top: 10px;">✅ Diagnóstico concluído!</div>`;
                }
            } else {
                throw new Error(report?.reason || 'Falha no diagnóstico');
            }
            
        } catch (error) {
            console.error('Erro no diagnóstico:', error);
            if (detailsDiv) {
                detailsDiv.innerHTML = `<div style="color: #e74c3c;">❌ Erro: ${error.message}</div>`;
            }
        } finally {
            isDiagnosing = false;
            const progressDiv = document.getElementById('orphan-progress');
            if (progressDiv) progressDiv.style.display = 'none';
        }
    }
    
    /**
     * ✅ TESTE DE LIMPEZA (1 arquivo)
     */
    async function testCleanup() {
        if (!cachedReport) {
            alert('⚠️ Execute o diagnóstico primeiro para identificar os arquivos órfãos.');
            await diagnoseOrphans();
        }
        
        if (!cachedReport || cachedReport.orphan_count === 0) {
            alert('✅ Nenhum arquivo órfão encontrado para testar.');
            return;
        }
        
        const confirmMsg = `🧪 TESTE DE LIMPEZA\n\nSerá excluído APENAS 1 arquivo órfão para validação.\n\nArquivo de teste: ${cachedReport.orphans?.[0]?.name || 'desconhecido'}\n\nDeseja continuar?`;
        
        if (!confirm(confirmMsg)) return;
        
        const detailsDiv = document.getElementById('orphan-details');
        const progressDiv = document.getElementById('orphan-progress');
        const progressBar = document.getElementById('orphan-progress-bar');
        const progressText = document.getElementById('orphan-progress-text');
        
        if (progressDiv) progressDiv.style.display = 'block';
        if (progressBar) progressBar.style.width = '50%';
        if (progressText) progressText.textContent = 'Excluindo 1 arquivo de teste...';
        if (detailsDiv) detailsDiv.innerHTML = '<div style="color: #e67e22;">🧪 Executando teste de limpeza...</div>';
        
        try {
            const result = await window.MediaMigrationChecker.safeOrphanCleanup(1);
            
            if (progressBar) progressBar.style.width = '100%';
            
            if (result.success && result.deleted === 1) {
                if (detailsDiv) {
                    detailsDiv.innerHTML = `<div style="color: #27ae60;">✅ Teste concluído! 1 arquivo excluído com sucesso.</div>`;
                }
                alert('✅ Teste concluído! 1 arquivo órfão foi excluído com sucesso.');
                // Atualizar diagnóstico
                await diagnoseOrphans();
            } else {
                throw new Error(result.reason || 'Falha no teste');
            }
            
        } catch (error) {
            if (detailsDiv) {
                detailsDiv.innerHTML = `<div style="color: #e74c3c;">❌ Erro no teste: ${error.message}</div>`;
            }
            alert(`❌ Erro no teste: ${error.message}`);
        } finally {
            if (progressDiv) progressDiv.style.display = 'none';
        }
    }
    
    /**
     * ✅ LIMPEZA COMPLETA
     */
    async function fullCleanup() {
        if (!cachedReport) {
            alert('⚠️ Execute o diagnóstico primeiro para identificar os arquivos órfãos.');
            await diagnoseOrphans();
        }
        
        if (!cachedReport || cachedReport.orphan_count === 0) {
            alert('✅ Nenhum arquivo órfão encontrado para limpar.');
            return;
        }
        
        const confirmText = prompt(
            `⚠️ LIMPEZA COMPLETA - AÇÃO IRREVERSÍVEL ⚠️\n\n` +
            `Total de órfãos: ${cachedReport.orphan_count} arquivos\n` +
            `Espaço estimado: ${cachedReport.total_size_mb} MB\n\n` +
            `Digite "CONFIRMAR" para prosseguir com a exclusão PERMANENTE:`
        );
        
        if (confirmText !== 'CONFIRMAR') {
            alert('❌ Limpeza cancelada.');
            return;
        }
        
        const detailsDiv = document.getElementById('orphan-details');
        const progressDiv = document.getElementById('orphan-progress');
        const progressBar = document.getElementById('orphan-progress-bar');
        const progressText = document.getElementById('orphan-progress-text');
        
        if (progressDiv) progressDiv.style.display = 'block';
        if (progressBar) progressBar.style.width = '0%';
        if (progressText) progressText.textContent = 'Iniciando limpeza completa...';
        if (detailsDiv) detailsDiv.innerHTML = '<div style="color: #e67e22;">⏳ Executando limpeza completa, aguarde...</div>';
        
        try {
            const result = await window.MediaMigrationChecker.safeOrphanCleanup();
            
            if (progressBar) progressBar.style.width = '100%';
            
            if (result.success) {
                if (detailsDiv) {
                    detailsDiv.innerHTML = `
                        <div style="color: #27ae60;">✅ Limpeza concluída!</div>
                        <div>📊 ${result.deleted} arquivos excluídos</div>
                        ${result.failed ? `<div style="color: #e74c3c;">⚠️ ${result.failed} falhas</div>` : ''}
                    `;
                }
                alert(`✅ LIMPEZA CONCLUÍDA!\n\n${result.deleted} arquivos excluídos.\n${result.failed || 0} falhas.`);
                // Atualizar diagnóstico
                await diagnoseOrphans();
            } else {
                throw new Error(result.reason || 'Falha na limpeza');
            }
            
        } catch (error) {
            if (detailsDiv) {
                detailsDiv.innerHTML = `<div style="color: #e74c3c;">❌ Erro na limpeza: ${error.message}</div>`;
            }
            alert(`❌ Erro na limpeza: ${error.message}`);
        } finally {
            if (progressDiv) progressDiv.style.display = 'none';
        }
    }
    
    /**
     * ✅ GERAR RELATÓRIO DETALHADO
     */
    async function generateReport() {
        if (!cachedReport) {
            await diagnoseOrphans();
        }
        
        if (!cachedReport) {
            alert('⚠️ Não foi possível gerar relatório. Execute o diagnóstico primeiro.');
            return;
        }
        
        const report = cachedReport;
        
        const reportText = `
═══════════════════════════════════════════════════════════════
📊 RELATÓRIO DE ARQUIVOS ÓRFÃOS
═══════════════════════════════════════════════════════════════
📅 Data: ${new Date().toLocaleString()}
📁 Total no Storage: ${report.total_in_storage}
✅ Em uso: ${report.used_files}
🗑️ ÓRFÃOS: ${report.orphan_count}
💾 Espaço ocupado: ${report.total_size_mb} MB

📂 DISTRIBUIÇÃO:
   🖼️ Imagens: ${report.orphans_by_type?.images || 0}
   📄 PDFs: ${report.orphans_by_type?.pdfs || 0}
   🎬 Vídeos: ${report.orphans_by_type?.videos || 0}
   ❓ Outros: ${report.orphans_by_type?.other || 0}

${report.orphan_count > 0 ? '⚠️ Recomendação: Execute a limpeza para liberar espaço.' : '🎉 Storage limpo e organizado!'}
═══════════════════════════════════════════════════════════════
        `;
        
        console.log(reportText);
        
        // Criar modal com relatório
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a2e;
            border: 2px solid #00d9ff;
            border-radius: 12px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            z-index: 10000;
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
        `;
        modal.innerHTML = `
            <h3 style="color: #00d9ff; margin-top: 0;">📊 Relatório de Órfãos</h3>
            <pre style="background: #0f0f1a; padding: 10px; border-radius: 8px; overflow-x: auto; font-size: 0.7rem; max-height: 400px; overflow-y: auto;">${reportText}</pre>
            <button id="close-report-modal" style="margin-top: 10px; padding: 8px 20px; background: #00d9ff; border: none; border-radius: 6px; cursor: pointer;">Fechar</button>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('close-report-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Copiar para clipboard
        await navigator.clipboard.writeText(reportText);
        console.log('📋 Relatório copiado para a área de transferência!');
    }
    
    /**
     * ✅ INICIALIZAR MÓDULO
     */
    function init() {
        if (ORPHAN_MODULE.initialized) return;
        
        console.log(`🔧 [Diagnostics63] Inicializando ${ORPHAN_MODULE.name} v${ORPHAN_MODULE.version}`);
        
        // Aguardar DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createOrphanPanel, 500);
            });
        } else {
            setTimeout(createOrphanPanel, 500);
        }
        
        ORPHAN_MODULE.initialized = true;
    }
    
    // Exportar funções para uso no console
    window.OrphanDiagnostic = {
        diagnose: () => diagnoseOrphans(),
        testCleanup: () => testCleanup(),
        fullCleanup: () => fullCleanup(),
        report: () => generateReport(),
        getCache: () => cachedReport
    };
    
    // Inicializar
    init();
    
    console.log('✅ [Diagnostics63] Módulo carregado. Funções disponíveis:');
    console.log('   - window.OrphanDiagnostic.diagnose()  // Diagnosticar órfãos');
    console.log('   - window.OrphanDiagnostic.testCleanup() // Testar com 1 arquivo');
    console.log('   - window.OrphanDiagnostic.fullCleanup() // Limpeza completa');
    console.log('   - window.OrphanDiagnostic.report()     // Gerar relatório');
    
})();
