// weberlessa-support/debug/diagnostics/diagnostics63.js
// Versão 6.5.0 - Gestão de Arquivos Órfãos com Ferramenta de Limpeza
console.log('🎯 DIAGNOSTICS63 v6.5.0 CARREGADO');

window.OrphanManager = {
    version: '6.5.0',
    
    lastReport: null,
    isCleaning: false,
    
    // Obter cliente Supabase
    getSupabaseClient() {
        if (window.supabaseClient) return window.supabaseClient;
        if (window.supabase) return window.supabase;
        
        const SUPABASE_URL = 'https://wxdiowpswepsvklumgvx.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZGlvd3Bzd2Vwc3ZrbHVtZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MTExNzksImV4cCI6MjA4Nzk4NzE3OX0.QsUHE_w5m5-pz3LcwdREuwmwvCiX3Hz8FYv8SAwhD6U';
        
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return null;
    },
    
    // Função para listar buckets disponíveis
    async listBuckets() {
        console.group('🔍 LISTANDO BUCKETS DO SUPABASE');
        
        const supabase = this.getSupabaseClient();
        
        if (!supabase) {
            console.error('❌ Cliente Supabase não disponível');
            this.showUnifiedPanel({ error: 'supabase_not_available', activeTab: 'buckets' });
            console.groupEnd();
            return { error: 'supabase_not_available' };
        }
        
        try {
            const { data: buckets, error } = await supabase.storage.listBuckets();
            
            if (error) {
                console.error('❌ Erro:', error);
                this.showUnifiedPanel({ error: error.message, details: JSON.stringify(error), activeTab: 'buckets' });
                console.groupEnd();
                return { error: error.message };
            }
            
            console.log(`📦 ${buckets.length} bucket(s) encontrado(s):`);
            console.table(buckets.map(b => ({ name: b.name, id: b.id, public: b.public })));
            
            this.showUnifiedPanel({ buckets, activeTab: 'buckets' });
            console.groupEnd();
            return { success: true, buckets };
            
        } catch (error) {
            console.error('❌ Erro:', error);
            this.showUnifiedPanel({ error: error.message, activeTab: 'buckets' });
            console.groupEnd();
            return { error: error.message };
        }
    },
    
    // Função para testar conexão com o bucket
    async testBucketConnection() {
        console.group('🧪 TESTE DE CONEXÃO COM BUCKET');
        
        const supabase = this.getSupabaseClient();
        const BUCKET_NAME = 'properties';
        
        if (!supabase) {
            console.error('❌ Cliente Supabase não disponível');
            this.showUnifiedPanel({ error: 'supabase_not_available', activeTab: 'test' });
            console.groupEnd();
            return { error: 'supabase_not_available' };
        }
        
        try {
            const { data: files, error } = await supabase.storage
                .from(BUCKET_NAME)
                .list('', { limit: 10000 });
            
            if (error) {
                console.error('❌ Erro:', error);
                this.showUnifiedPanel({ error: error.message, details: JSON.stringify(error), activeTab: 'test' });
                console.groupEnd();
                return { error: error.message };
            }
            
            let totalSize = 0;
            files.forEach(f => { if (f.metadata?.size) totalSize += f.metadata.size; });
            const totalMB = (totalSize / 1048576).toFixed(2);
            
            console.log(`✅ ${files.length} arquivos, ${totalMB} MB`);
            
            this.showUnifiedPanel({ 
                testResult: { 
                    success: true, 
                    totalFiles: files.length, 
                    totalSizeMB: totalMB,
                    files: files.slice(0, 20)
                },
                activeTab: 'test'
            });
            console.groupEnd();
            return { success: true, files, totalFiles: files.length, totalSizeMB: totalMB };
            
        } catch (error) {
            console.error('❌ Erro na conexão:', error);
            this.showUnifiedPanel({ error: error.message, activeTab: 'test' });
            console.groupEnd();
            return { error: error.message };
        }
    },
    
    // Função para diagnosticar arquivos órfãos
    async diagnose() {
        console.group('🔍 DIAGNÓSTICO DE ÓRFÃOS');
        
        if (!window.properties || window.properties.length === 0) {
            console.error('❌ Nenhum imóvel carregado');
            this.showUnifiedPanel({ error: 'no_properties', activeTab: 'diagnose' });
            console.groupEnd();
            return { error: 'no_properties' };
        }
        
        // Coletar URLs em uso e nomes de arquivos
        const usedUrls = new Set();
        const usedFileNames = new Set();
        
        window.properties.forEach(p => {
            if (p.images && p.images !== 'EMPTY') {
                p.images.split(',').forEach(url => {
                    if (url && url.trim()) {
                        const cleanUrl = url.trim();
                        usedUrls.add(cleanUrl);
                        const fileName = cleanUrl.split('/').pop()?.split('?')[0];
                        if (fileName) usedFileNames.add(fileName);
                    }
                });
            }
            if (p.pdfs && p.pdfs !== 'EMPTY') {
                p.pdfs.split(',').forEach(url => {
                    if (url && url.trim()) {
                        const cleanUrl = url.trim();
                        usedUrls.add(cleanUrl);
                        const fileName = cleanUrl.split('/').pop()?.split('?')[0];
                        if (fileName) usedFileNames.add(fileName);
                    }
                });
            }
        });
        
        console.log(`📊 ${window.properties.length} imóveis, ${usedUrls.size} URLs em uso`);
        console.log(`📄 ${usedFileNames.size} nomes de arquivos em uso`);
        
        const supabase = this.getSupabaseClient();
        const BUCKET_NAME = 'properties';
        
        if (!supabase) {
            console.error('❌ Cliente Supabase não disponível');
            this.showUnifiedPanel({ error: 'supabase_not_available', activeTab: 'diagnose' });
            console.groupEnd();
            return { error: 'supabase_not_available' };
        }
        
        try {
            const { data: allFiles, error } = await supabase.storage
                .from(BUCKET_NAME)
                .list('', { limit: 10000 });
            
            if (error) {
                console.error('❌ Erro:', error);
                this.showUnifiedPanel({ error: error.message, activeTab: 'diagnose' });
                console.groupEnd();
                return { error: error.message };
            }
            
            console.log(`📁 Total no Storage: ${allFiles.length}`);
            
            // Identificar órfãos (excluindo .emptyFolderPlaceholder)
            const orphans = allFiles.filter(file => {
                if (file.name.endsWith('/')) return false;
                if (file.name === '.emptyFolderPlaceholder') return false;
                return !usedFileNames.has(file.name);
            });
            
            let totalSize = 0;
            orphans.forEach(f => { if (f.metadata?.size) totalSize += f.metadata.size; });
            
            const report = {
                total_in_storage: allFiles.length,
                used_files: usedUrls.size,
                used_file_names: usedFileNames.size,
                orphan_count: orphans.length,
                total_size_mb: (totalSize / 1048576).toFixed(2),
                orphans: orphans.slice(0, 50).map(f => ({ name: f.name, size: f.metadata?.size || 0 })),
                allOrphans: orphans
            };
            
            this.lastReport = report;
            console.log(`📊 RESULTADO: ${report.orphan_count} órfãos, ${report.total_size_mb} MB`);
            
            this.showUnifiedPanel({ 
                diagnoseResult: report,
                activeTab: 'diagnose'
            });
            console.groupEnd();
            return report;
            
        } catch (error) {
            console.error('❌ Erro no diagnóstico:', error);
            this.showUnifiedPanel({ error: error.message, activeTab: 'diagnose' });
            console.groupEnd();
            return { error: error.message };
        }
    },
    
    // 🆕 FUNÇÃO DE LIMPEZA DE ARQUIVOS ÓRFÃOS
    async cleanup() {
        if (this.isCleaning) {
            console.warn('⚠️ Limpeza já em andamento. Aguarde...');
            return;
        }
        
        console.group('🗑️ LIMPEZA DE ARQUIVOS ÓRFÃOS');
        
        // Primeiro, executar diagnóstico para ter dados atualizados
        const report = await this.diagnose();
        
        if (!report || report.error) {
            console.error('❌ Não foi possível realizar diagnóstico');
            this.showUnifiedPanel({ 
                cleanupResult: { error: 'diagnose_failed', message: 'Não foi possível realizar o diagnóstico' },
                activeTab: 'cleanup'
            });
            console.groupEnd();
            return;
        }
        
        if (report.orphan_count === 0) {
            console.log('✅ Nenhum arquivo órfão para limpar!');
            this.showUnifiedPanel({ 
                cleanupResult: { success: true, message: 'Nenhum arquivo órfão encontrado para limpar.' },
                activeTab: 'cleanup'
            });
            console.groupEnd();
            return;
        }
        
        // Confirmar com o usuário
        const confirmMessage = `⚠️ LIMPEZA DE ARQUIVOS ÓRFÃOS - AÇÃO IRREVERSÍVEL ⚠️\n\n` +
            `📁 Total de órfãos: ${report.orphan_count} arquivos\n` +
            `💾 Espaço ocupado: ${report.total_size_mb} MB\n\n` +
            `Deseja realmente excluir PERMANENTEMENTE estes arquivos?\n\n` +
            `Digite "CONFIRMAR" para prosseguir:`;
        
        const confirmation = prompt(confirmMessage);
        
        if (confirmation !== 'CONFIRMAR') {
            console.log('❌ Limpeza cancelada pelo usuário');
            this.showUnifiedPanel({ 
                cleanupResult: { cancelled: true, message: 'Limpeza cancelada pelo usuário.' },
                activeTab: 'cleanup'
            });
            console.groupEnd();
            return;
        }
        
        // Segunda confirmação
        const secondConfirm = confirm(`⚠️ ÚLTIMA CONFIRMAÇÃO!\n\nVocê está prestes a excluir ${report.orphan_count} arquivos permanentemente.\n\nEsta ação NÃO pode ser desfeita.\n\nClique em OK para prosseguir ou Cancelar para abortar.`);
        
        if (!secondConfirm) {
            console.log('❌ Limpeza cancelada na segunda confirmação');
            this.showUnifiedPanel({ 
                cleanupResult: { cancelled: true, message: 'Limpeza cancelada na confirmação final.' },
                activeTab: 'cleanup'
            });
            console.groupEnd();
            return;
        }
        
        this.isCleaning = true;
        
        // Mostrar painel de progresso
        this.showCleanupProgressPanel(report.orphan_count);
        
        const supabase = this.getSupabaseClient();
        const BUCKET_NAME = 'properties';
        
        if (!supabase) {
            console.error('❌ Cliente Supabase não disponível');
            this.showUnifiedPanel({ error: 'supabase_not_available', activeTab: 'cleanup' });
            this.isCleaning = false;
            console.groupEnd();
            return;
        }
        
        let deleted = 0;
        let failed = 0;
        const batchSize = 50;
        const orphans = report.allOrphans;
        
        console.log(`🗑️ Iniciando exclusão de ${orphans.length} arquivos...`);
        
        for (let i = 0; i < orphans.length; i += batchSize) {
            const batch = orphans.slice(i, i + batchSize);
            const batchNames = batch.map(f => f.name);
            
            try {
                const { error } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove(batchNames);
                
                if (error) {
                    console.error(`❌ Erro no lote ${i / batchSize + 1}:`, error);
                    failed += batch.length;
                } else {
                    deleted += batch.length;
                    console.log(`✅ Lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(orphans.length / batchSize)}: ${batch.length} arquivos excluídos (${deleted}/${orphans.length})`);
                }
                
                // Atualizar progresso no painel
                this.updateCleanupProgress(deleted, orphans.length);
                
                // Pequena pausa para não sobrecarregar
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`❌ Erro no lote ${i / batchSize + 1}:`, error);
                failed += batch.length;
            }
        }
        
        console.log(`\n📊 LIMPEZA CONCLUÍDA!`);
        console.log(`   ✅ Excluídos: ${deleted}`);
        console.log(`   ⚠️ Falhas: ${failed}`);
        
        this.isCleaning = false;
        
        // Mostrar resultado final
        this.showUnifiedPanel({ 
            cleanupResult: { 
                success: true, 
                deleted: deleted, 
                failed: failed,
                total: orphans.length,
                message: `Limpeza concluída! ${deleted} arquivos excluídos.${failed > 0 ? ` ${failed} falhas.` : ''}`
            },
            activeTab: 'cleanup'
        });
        
        console.groupEnd();
        
        // Atualizar diagnóstico após limpeza
        setTimeout(() => {
            console.log('🔄 Atualizando diagnóstico após limpeza...');
            this.diagnose();
        }, 2000);
    },
    
    // Painel de progresso da limpeza
    showCleanupProgressPanel(total) {
        const existing = document.getElementById('cleanup-progress-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'cleanup-progress-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #0a0a2a, #001a33);
            color: #00aaff;
            padding: 25px;
            border: 3px solid #e67e22;
            border-radius: 10px;
            z-index: 1000002;
            min-width: 400px;
            text-align: center;
            font-family: monospace;
            box-shadow: 0 0 40px rgba(230,126,34,0.5);
        `;
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0;">🗑️ LIMPANDO ARQUIVOS ÓRFÃOS</h3>
            <div style="margin-bottom: 15px;">Aguarde enquanto os arquivos são excluídos...</div>
            <div style="background: #1a1a2e; border-radius: 10px; overflow: hidden; margin-bottom: 10px;">
                <div id="cleanup-progress-bar" style="width: 0%; height: 20px; background: #e67e22; transition: width 0.3s;"></div>
            </div>
            <div id="cleanup-progress-text">0 / ${total} arquivos excluídos (0%)</div>
        `;
        
        document.body.appendChild(panel);
        
        this.cleanupProgressPanel = panel;
    },
    
    updateCleanupProgress(deleted, total) {
        if (!this.cleanupProgressPanel) return;
        
        const percent = (deleted / total) * 100;
        const progressBar = document.getElementById('cleanup-progress-bar');
        const progressText = document.getElementById('cleanup-progress-text');
        
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${deleted} / ${total} arquivos excluídos (${Math.round(percent)}%)`;
    },
    
    // Painel Unificado com todos os botões (incluindo limpeza)
    showUnifiedPanel(data) {
        // Fechar painel de progresso se existir
        if (this.cleanupProgressPanel) {
            this.cleanupProgressPanel.remove();
            this.cleanupProgressPanel = null;
        }
        
        const existing = document.getElementById('orphan-unified-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'orphan-unified-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #0a0a2a, #001a33);
            color: #00aaff;
            padding: 25px;
            border: 3px solid #00aaff;
            border-radius: 10px;
            z-index: 1000001;
            min-width: 550px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            font-family: monospace;
            box-shadow: 0 0 40px rgba(0, 170, 255, 0.5);
        `;
        
        let content = '';
        const activeTab = data.activeTab || 'welcome';
        
        // Cabeçalho com botões de navegação (incluindo o botão de limpeza)
        const navButtons = `
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; border-bottom: 1px solid #00aaff33; padding-bottom: 15px;">
                <button id="nav-buckets" style="background: ${activeTab === 'buckets' ? '#00aaff' : '#2c3e66'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">📦 LISTAR BUCKETS</button>
                <button id="nav-test" style="background: ${activeTab === 'test' ? '#00aaff' : '#2c3e66'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">🧪 TESTAR BUCKET</button>
                <button id="nav-diagnose" style="background: ${activeTab === 'diagnose' ? '#00aaff' : '#2c3e66'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">🔍 DIAGNOSTICAR</button>
                <button id="nav-cleanup" style="background: ${activeTab === 'cleanup' ? '#c0392b' : '#8b0000'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">🗑️ LIMPAR ÓRFÃOS</button>
                <button id="nav-close" style="background: #555; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">✖ FECHAR</button>
            </div>
        `;
        
        // Conteúdo baseado na aba ativa
        if (activeTab === 'buckets' && data.buckets) {
            content = `
                <h3 style="margin: 0 0 15px 0;">📦 BUCKETS DO SUPABASE</h3>
                <div style="background: rgba(0,170,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr style="background:#00aaff33;">
                            <th style="padding:8px; text-align:left;">Nome</th>
                            <th style="padding:8px; text-align:left;">ID</th>
                            <th style="padding:8px; text-align:left;">Público</th>
                        </tr>
                        ${data.buckets.map(b => `
                            <tr style="border-bottom:1px solid #333;">
                                <td style="padding:8px;"><code style="color:#0af;">${b.name}</code></td>
                                <td style="padding:8px; font-size:11px;">${b.id}</td>
                                <td style="padding:8px;">${b.public ? '✅ Sim' : '❌ Não'}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                <div style="padding:10px; background:#00aaff22; border-radius:5px;">
                    💡 Bucket atual: <strong>properties</strong> - Use os botões acima para testar ou diagnosticar.
                </div>
            `;
        } 
        else if (activeTab === 'test' && data.testResult) {
            content = `
                <h3 style="margin: 0 0 15px 0;">🧪 TESTE DE CONEXÃO</h3>
                <div style="background: rgba(0,170,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="color:#0f0; margin-bottom:15px;">✅ CONEXÃO BEM-SUCEDIDA!</div>
                    <div>📁 Total de arquivos: <strong>${data.testResult.totalFiles}</strong></div>
                    <div>💾 Espaço ocupado: <strong>${data.testResult.totalSizeMB} MB</strong></div>
                </div>
                ${data.testResult.files && data.testResult.files.length > 0 ? `
                    <div style="margin-top:15px;">
                        <div style="margin-bottom:10px;">📋 PRIMEIROS ${Math.min(10, data.testResult.files.length)} ARQUIVOS:</div>
                        <div style="max-height:300px; overflow-y:auto; background:rgba(0,0,0,0.3); border-radius:5px; padding:10px;">
                            ${data.testResult.files.slice(0,10).map(f => `
                                <div style="font-size:11px; padding:4px; border-bottom:1px solid #333; color:#ff9999;">
                                    📄 ${f.name} (${(f.metadata?.size / 1024).toFixed(1)} KB)
                                </div>
                            `).join('')}
                            ${data.testResult.files.length > 10 ? `<div style="color:#888; font-size:10px; margin-top:5px;">... e mais ${data.testResult.files.length - 10} arquivos</div>` : ''}
                        </div>
                    </div>
                ` : '<div>⚠️ Nenhum arquivo encontrado no bucket.</div>'}
            `;
        }
        else if (activeTab === 'diagnose' && data.diagnoseResult) {
            const r = data.diagnoseResult;
            content = `
                <h3 style="margin: 0 0 15px 0;">🧹 ARQUIVOS ÓRFÃOS</h3>
                <div style="background: rgba(0,170,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <table style="width:100%;">
                        <tr><td>📁 Total Storage:</td><td><strong>${r.total_in_storage}</strong></td>
                        <tr>
                        <tr><td>✅ Em uso:</td><td><strong>${r.used_files}</strong></td>
                        </tr>
                        <tr><td style="color:#fa0;">🗑️ ÓRFÃOS:</td><td><strong style="color:#fa0; font-size:1.2rem;">${r.orphan_count}</strong></td>
                        </tr>
                        <tr><td>💾 Espaço ocupado por órfãos:</td><td><strong>${r.total_size_mb} MB</strong></td>
                        </tr>
                    </table>
                </div>
                <div style="background: rgba(230,126,34,0.2); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    ⚠️ <strong>${r.orphan_count} arquivos órfãos ocupando ${r.total_size_mb} MB</strong>
                </div>
                ${r.orphans && r.orphans.length > 0 ? `
                    <div style="margin-top:15px;">
                        <div style="margin-bottom:10px;">📋 PRIMEIROS ${Math.min(10, r.orphans.length)} ARQUIVOS ÓRFÃOS:</div>
                        <div style="max-height:250px; overflow-y:auto; background:rgba(0,0,0,0.3); border-radius:5px; padding:10px;">
                            ${r.orphans.slice(0,10).map(f => `
                                <div style="font-size:11px; padding:4px; border-bottom:1px solid #333; color:#ff9999;">
                                    🗑️ ${f.name} (${(f.size / 1024).toFixed(1)} KB)
                                </div>
                            `).join('')}
                            ${r.orphans.length > 10 ? `<div style="color:#888; font-size:10px; margin-top:5px;">... e mais ${r.orphans.length - 10} arquivos</div>` : ''}
                        </div>
                    </div>
                ` : '<div style="color:#0f0;">🎉 Nenhum arquivo órfão encontrado!</div>'}
                <div style="margin-top:15px; padding:10px; background:#8b000033; border-radius:5px; border:1px solid #c0392b;">
                    💡 <strong>Para excluir estes arquivos, clique no botão "🗑️ LIMPAR ÓRFÃOS" acima.</strong>
                </div>
            `;
        }
        else if (activeTab === 'cleanup' && data.cleanupResult) {
            if (data.cleanupResult.cancelled) {
                content = `
                    <h3 style="margin: 0 0 15px 0;">🗑️ LIMPEZA DE ÓRFÃOS</h3>
                    <div style="background: rgba(255,170,0,0.2); padding: 15px; border-radius: 8px;">
                        <div style="color:#fa0;">⚠️ ${data.cleanupResult.message}</div>
                    </div>
                `;
            } else if (data.cleanupResult.error) {
                content = `
                    <h3 style="margin: 0 0 15px 0;">🗑️ LIMPEZA DE ÓRFÃOS</h3>
                    <div style="background: rgba(255,0,0,0.2); padding: 15px; border-radius: 8px;">
                        <div style="color:#f00;">❌ Erro: ${data.cleanupResult.message}</div>
                    </div>
                `;
            } else if (data.cleanupResult.success) {
                content = `
                    <h3 style="margin: 0 0 15px 0;">🗑️ LIMPEZA DE ÓRFÃOS</h3>
                    <div style="background: rgba(0,255,0,0.2); padding: 15px; border-radius: 8px;">
                        <div style="color:#0f0; margin-bottom:15px;">✅ LIMPEZA CONCLUÍDA!</div>
                        <div>📊 ${data.cleanupResult.deleted} arquivos excluídos</div>
                        ${data.cleanupResult.failed > 0 ? `<div style="color:#fa0;">⚠️ ${data.cleanupResult.failed} falhas</div>` : ''}
                        <div style="margin-top:15px;">${data.cleanupResult.message}</div>
                    </div>
                `;
            }
        }
        else if (data.error) {
            content = `
                <h3 style="margin: 0 0 15px 0;">⚠️ ERRO</h3>
                <div style="background: rgba(255,0,0,0.2); padding: 15px; border-radius: 8px;">
                    <div style="color:#f00;">❌ Erro: ${data.error}</div>
                    <div style="font-size:12px; margin-top:10px;">${data.details || ''}</div>
                </div>
            `;
        }
        else {
            content = `
                <h3 style="margin: 0 0 15px 0;">🧹 GESTÃO DE ARQUIVOS ÓRFÃOS</h3>
                <div style="background: rgba(0,170,255,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                    <p>Selecione uma opção acima para começar:</p>
                    <ul style="text-align: left; margin-top: 10px;">
                        <li>📦 <strong>LISTAR BUCKETS</strong> - Mostra todos os buckets disponíveis</li>
                        <li>🧪 <strong>TESTAR BUCKET</strong> - Testa conexão com bucket "properties"</li>
                        <li>🔍 <strong>DIAGNOSTICAR</strong> - Encontra arquivos órfãos no Storage</li>
                        <li style="color:#fa0;">🗑️ <strong>LIMPAR ÓRFÃOS</strong> - Exclui PERMANENTEMENTE arquivos órfãos</li>
                    </ul>
                </div>
            `;
        }
        
        panel.innerHTML = navButtons + content;
        document.body.appendChild(panel);
        
        // Eventos dos botões
        document.getElementById('nav-buckets')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.listBuckets();
        });
        document.getElementById('nav-test')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.testBucketConnection();
        });
        document.getElementById('nav-diagnose')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.diagnose();
        });
        document.getElementById('nav-cleanup')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.cleanup();
        });
        document.getElementById('nav-close')?.addEventListener('click', () => panel.remove());
    }
};

// Funções globais
window.listSupabaseBuckets = () => window.OrphanManager.listBuckets();
window.testBucketConnection = () => window.OrphanManager.testBucketConnection();
window.diagnoseOrphanFiles = () => window.OrphanManager.diagnose();
window.cleanupOrphanFiles = () => window.OrphanManager.cleanup();

// Botão flutuante
window.addOrphanButton = () => {
    if (document.getElementById('orphan-float-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'orphan-float-btn';
    btn.innerHTML = '🧹 ÓRFÃOS';
    btn.style.cssText = 'position:fixed; bottom:100px; right:20px; background:#e67e22; color:white; border:none; padding:12px 20px; border-radius:40px; font-weight:bold; cursor:pointer; z-index:1000020; box-shadow:0 4px 12px rgba(0,0,0,0.3);';
    btn.onclick = () => window.OrphanManager.showUnifiedPanel({ activeTab: 'welcome' });
    document.body.appendChild(btn);
};

// Auto-inicialização
if (window.location.search.includes('debug=true')) {
    setTimeout(window.addOrphanButton, 2000);
}

console.log('✅ DIAGNOSTICS63 v6.5.0 PRONTO');
console.log('💡 Clique no botão "🧹 ÓRFÃOS" no canto inferior direito');
console.log('💡 Botões disponíveis: 📦 LISTAR BUCKETS | 🧪 TESTAR BUCKET | 🔍 DIAGNOSTICAR | 🗑️ LIMPAR ÓRFÃOS');
