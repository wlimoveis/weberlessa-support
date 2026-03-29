// weberlessa-support/debug/diagnostics/diagnostics63.js
// Versão 6.4.0 - Usando cliente Supabase em vez de fetch direto
console.log('🎯 DIAGNOSTICS63 v6.4.0 CARREGADO');

window.OrphanManager = {
    version: '6.4.0',
    
    lastReport: null,
    
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
            // Usar a API do Storage do Supabase
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
    
    // Função para testar conexão com o bucket (usando cliente Supabase)
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
            // Usar a API do Storage do Supabase para listar arquivos
            const { data: files, error } = await supabase.storage
                .from(BUCKET_NAME)
                .list('', { limit: 1000 });
            
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
            console.table(files.slice(0, 10).map(f => ({ name: f.name, size: f.metadata?.size || 0 })));
            
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
    
    // Função para diagnosticar arquivos órfãos (usando cliente Supabase)
    async diagnose() {
        console.group('🔍 DIAGNÓSTICO DE ÓRFÃOS');
        
        if (!window.properties || window.properties.length === 0) {
            console.error('❌ Nenhum imóvel carregado');
            this.showUnifiedPanel({ error: 'no_properties', activeTab: 'diagnose' });
            console.groupEnd();
            return { error: 'no_properties' };
        }
        
        // Coletar URLs em uso
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
            // Listar todos os arquivos no bucket
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
            
            // Identificar órfãos
            const orphans = allFiles.filter(file => {
                if (file.name.endsWith('/')) return false;
                const fileName = file.name;
                return !usedFileNames.has(fileName);
            });
            
            let totalSize = 0;
            orphans.forEach(f => { if (f.metadata?.size) totalSize += f.metadata.size; });
            
            const report = {
                total_in_storage: allFiles.length,
                used_files: usedUrls.size,
                orphan_count: orphans.length,
                total_size_mb: (totalSize / 1048576).toFixed(2),
                orphans: orphans.slice(0, 50).map(f => ({ name: f.name, size: f.metadata?.size || 0 }))
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
    
    // Painel Unificado
    showUnifiedPanel(data) {
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
        
        const navButtons = `
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; border-bottom: 1px solid #00aaff33; padding-bottom: 15px;">
                <button id="nav-buckets" style="background: ${activeTab === 'buckets' ? '#00aaff' : '#2c3e66'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">📦 LISTAR BUCKETS</button>
                <button id="nav-test" style="background: ${activeTab === 'test' ? '#00aaff' : '#2c3e66'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">🧪 TESTAR BUCKET</button>
                <button id="nav-diagnose" style="background: ${activeTab === 'diagnose' ? '#00aaff' : '#2c3e66'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">🔍 DIAGNOSTICAR</button>
                <button id="nav-close" style="background: #555; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">✖ FECHAR</button>
            </div>
        `;
        
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
                        <tr><td>📁 Total Storage:</td><td><strong>${r.total_in_storage}</strong></td></tr>
                        <tr><td>✅ Em uso:</td><td><strong>${r.used_files}</strong></td></tr>
                        <tr><td>🗑️ ÓRFÃOS:</td><td><strong style="color:#fa0">${r.orphan_count}</strong></td></tr>
                        <tr><td>💾 Espaço:</td><td><strong>${r.total_size_mb} MB</strong></td></tr>
                    </table>
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
            `;
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
                    </ul>
                </div>
            `;
        }
        
        panel.innerHTML = navButtons + content;
        document.body.appendChild(panel);
        
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
        document.getElementById('nav-close')?.addEventListener('click', () => panel.remove());
    }
};

// Funções globais
window.listSupabaseBuckets = () => window.OrphanManager.listBuckets();
window.testBucketConnection = () => window.OrphanManager.testBucketConnection();
window.diagnoseOrphanFiles = () => window.OrphanManager.diagnose();

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

console.log('✅ DIAGNOSTICS63 v6.4.0 PRONTO');
console.log('💡 Clique no botão "🧹 ÓRFÃOS" no canto inferior direito');
console.log('💡 Agora usando o cliente Supabase em vez de fetch direto');
