// weberlessa-support/debug/diagnostics/diagnostics63.js
// Versão 6.3.6 - Gestão de Arquivos Órfãos com teste direto de conexão
console.log('🎯 DIAGNOSTICS63 v6.3.6 CARREGADO');

window.OrphanManager = {
    version: '6.3.6',
    
// Função para listar buckets disponíveis (USANDO SERVICE_ROLE KEY)
async listBuckets() {
    console.group('🔍 LISTANDO BUCKETS DO SUPABASE');
    
    const SUPABASE_URL = 'https://wxdiowpswepsvklumgvx.supabase.co';
    // 🔧 USAR SERVICE_ROLE KEY (copiada do dashboard)
    const SUPABASE_KEY = 'SUA_SERVICE_ROLE_KEY_AQUI';  // ← COLE A KEY AQUI
    
    console.log(`🔗 URL: ${SUPABASE_URL}`);
    
    try {
        const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 Status: ${response.status}`);
        
        if (response.ok) {
            const buckets = await response.json();
            console.log(`📦 ${buckets.length} bucket(s) encontrado(s):`);
            console.table(buckets.map(b => ({ name: b.name, id: b.id, public: b.public })));
            
            if (buckets.length === 0) {
                console.warn('⚠️ Nenhum bucket encontrado.');
                this.showBucketsPanel({ success: true, buckets: [] });
            } else {
                this.showBucketsPanel({ success: true, buckets });
            }
            console.groupEnd();
            return { success: true, buckets };
        } else {
            const errorText = await response.text();
            console.error(`❌ Erro ${response.status}:`, errorText);
            this.showBucketsPanel({ error: 'list_failed', status: response.status, details: errorText });
            console.groupEnd();
            return { error: 'list_failed', status: response.status, details: errorText };
        }
    } catch (error) {
        console.error('❌ Erro na conexão:', error);
        this.showBucketsPanel({ error: 'connection_failed', details: error.message });
        console.groupEnd();
        return { error: 'connection_failed', details: error.message };
    }
},
    
// 🆕 FUNÇÃO CORRIGIDA: Testar conexão direta com o bucket properties
async testBucketConnection() {
    console.group('🧪 TESTE DIRETO DE CONEXÃO COM BUCKET');
    
    const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || window.SUPABASE_URL;
    const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || window.SUPABASE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('❌ Credenciais não encontradas');
        console.groupEnd();
        this.showTestResultPanel({ error: 'missing_credentials' });
        return { error: 'missing_credentials' };
    }
    
    const BUCKET_NAME = 'properties';
    
    // 🔧 CORREÇÃO 1: Usar o endpoint correto da API v2 do Supabase Storage
    const url = `${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`;
    
    console.log(`🔗 Testando URL: ${url}`);
    
    try {
        // 🔧 CORREÇÃO 2: Adicionar o cabeçalho Content-Type
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 Status: ${response.status}`);
        
        if (response.ok) {
            const files = await response.json();
            console.log(`✅ ${files.length} arquivos encontrados!`);
            console.table(files.slice(0, 10).map(f => ({ 
                name: f.name, 
                size: f.metadata?.size || 0,
                lastModified: f.metadata?.lastModified || 'N/A'
            })));
            
            let totalSize = 0;
            files.forEach(f => { if (f.metadata?.size) totalSize += f.metadata.size; });
            const totalMB = (totalSize / 1048576).toFixed(2);
            
            this.showTestResultPanel({ 
                success: true, 
                files: files.slice(0, 20),
                totalFiles: files.length,
                totalSizeMB: totalMB
            });
            console.groupEnd();
            return { success: true, files, totalFiles: files.length, totalSizeMB: totalMB };
        } else {
            const errorText = await response.text();
            console.error(`❌ Erro ${response.status}:`, errorText);
            
            // 🔧 CORREÇÃO 3: Tentar formato alternativo da API
            console.log('🔄 Tentando formato alternativo...');
            const altUrl = `${SUPABASE_URL}/storage/v1/bucket/${BUCKET_NAME}/objects/list`;
            const altResponse = await fetch(altUrl, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (altResponse.ok) {
                const files = await altResponse.json();
                console.log(`✅ ${files.length} arquivos encontrados (formato alternativo)!`);
                let totalSize = 0;
                files.forEach(f => { if (f.metadata?.size) totalSize += f.metadata.size; });
                const totalMB = (totalSize / 1048576).toFixed(2);
                
                this.showTestResultPanel({ 
                    success: true, 
                    files: files.slice(0, 20),
                    totalFiles: files.length,
                    totalSizeMB: totalMB,
                    altFormat: true
                });
                console.groupEnd();
                return { success: true, files, totalFiles: files.length, totalSizeMB: totalMB };
            }
            
            this.showTestResultPanel({ 
                error: 'list_failed', 
                status: response.status, 
                details: errorText 
            });
            console.groupEnd();
            return { error: 'list_failed', status: response.status, details: errorText };
        }
    } catch (error) {
        console.error('❌ Erro na conexão:', error);
        this.showTestResultPanel({ error: 'connection_failed', details: error.message });
        console.groupEnd();
        return { error: 'connection_failed', details: error.message };
    }
},
    
    // 🆕 Painel para exibir resultado do teste de conexão
    showTestResultPanel(data) {
        const existing = document.getElementById('test-result-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'test-result-panel';
        
        let content = '';
        if (data.error) {
            content = `
                <div style="color:#f00;">❌ Erro: ${data.error}</div>
                <div style="font-size:12px; margin-top:10px;">Status: ${data.status || 'N/A'}</div>
                <div style="font-size:12px; margin-top:5px;">Detalhes: ${data.details || ''}</div>
            `;
        } else if (data.success) {
            content = `
                <div style="color:#0f0; margin-bottom:15px;">✅ CONEXÃO BEM-SUCEDIDA!</div>
                <div style="margin-bottom:15px;">📁 Total de arquivos: <strong>${data.totalFiles}</strong></div>
                <div style="margin-bottom:15px;">💾 Espaço ocupado: <strong>${data.totalSizeMB} MB</strong></div>
                ${data.files && data.files.length > 0 ? `
                    <div style="margin-bottom:10px;">📋 PRIMEIROS ${data.files.length} ARQUIVOS:</div>
                    <div style="max-height:300px; overflow-y:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:11px;">
                            <tr style="background:#00aaff33;">
                                <th style="padding:5px; text-align:left;">Nome</th>
                                <th style="padding:5px; text-align:right;">Tamanho (KB)</th>
                            </tr>
                            ${data.files.map(f => `
                                <tr style="border-bottom:1px solid #333;">
                                    <td style="padding:5px;"><code style="color:#0af;">${f.name}</code></td>
                                    <td style="padding:5px; text-align:right;">${(f.size / 1024).toFixed(1)}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                ` : '<div>⚠️ Nenhum arquivo encontrado no bucket.</div>'}
                <div style="margin-top:15px; padding:10px; background:#00aaff22; border-radius:5px;">
                    💡 <strong>Bucket "properties" está funcionando!</strong> Use "diagnoseOrphanFiles()" para diagnosticar órfãos.
                </div>
            `;
        }
        
        panel.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
                        background:#0a0a2a; color:#0af; padding:20px; border-radius:10px; 
                        border:3px solid ${data.success ? '#0f0' : '#f00'}; 
                        z-index:1000001; min-width:500px; max-width:90%;
                        font-family:monospace; box-shadow:0 0 30px rgba(0,170,255,0.5);">
                <h3 style="margin:0 0 15px 0;">🧪 TESTE DE CONEXÃO - BUCKET "properties"</h3>
                ${content}
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button id="test-refresh" style="background:#0af; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">🔄 Repetir Teste</button>
                    <button id="test-close" style="background:#555; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        document.getElementById('test-refresh')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.testBucketConnection();
        });
        document.getElementById('test-close')?.addEventListener('click', () => panel.remove());
    },
    
    // Painel para exibir buckets encontrados
    showBucketsPanel(data) {
        const existing = document.getElementById('buckets-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'buckets-panel';
        
        let content = '';
        if (data.error) {
            content = `
                <div style="color:#f00;">❌ Erro: ${data.error}</div>
                <div style="font-size:12px; margin-top:10px;">${data.details || ''}</div>
            `;
        } else if (data.success && data.buckets.length === 0) {
            content = `<div style="color:#fa0;">⚠️ Nenhum bucket encontrado. Crie um bucket no Supabase Storage.</div>`;
        } else if (data.success) {
            content = `
                <div style="margin-bottom:15px;">📦 <strong>Buckets disponíveis:</strong></div>
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
                <div style="margin-top:15px; padding:10px; background:#00aaff22; border-radius:5px;">
                    💡 <strong>Instruções:</strong> Altere a linha <code>const BUCKET_NAME = 'properties';</code> no arquivo diagnostics63.js para um dos nomes acima.
                </div>
                <button id="copy-bucket-name" style="margin-top:10px; background:#0af; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">📋 Copiar nome do primeiro bucket</button>
            `;
        }
        
        panel.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
                        background:#0a0a2a; color:#0af; padding:20px; border-radius:10px; 
                        border:3px solid #0af; z-index:1000001; min-width:450px; 
                        font-family:monospace; box-shadow:0 0 30px rgba(0,170,255,0.5);">
                <h3 style="margin:0 0 15px 0;">📦 BUCKETS DO SUPABASE</h3>
                ${content}
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button id="buckets-refresh" style="background:#0af; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">🔄 Atualizar</button>
                    <button id="buckets-close" style="background:#555; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        document.getElementById('buckets-refresh')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.listBuckets();
        });
        document.getElementById('buckets-close')?.addEventListener('click', () => panel.remove());
        
        document.getElementById('copy-bucket-name')?.addEventListener('click', () => {
            if (data.buckets && data.buckets.length > 0) {
                navigator.clipboard.writeText(data.buckets[0].name);
                alert(`✅ Nome "${data.buckets[0].name}" copiado para a área de transferência!`);
            }
        });
    },
    
    async diagnose() {
        console.group('🔍 DIAGNÓSTICO DE ÓRFÃOS');
        
        if (!window.properties || window.properties.length === 0) {
            console.error('❌ Nenhum imóvel carregado');
            console.groupEnd();
            return { error: 'no_properties' };
        }
        
        const usedUrls = new Set();
        window.properties.forEach(p => {
            if (p.images && p.images !== 'EMPTY') {
                p.images.split(',').forEach(url => url && usedUrls.add(url.trim()));
            }
            if (p.pdfs && p.pdfs !== 'EMPTY') {
                p.pdfs.split(',').forEach(url => url && usedUrls.add(url.trim()));
            }
        });
        
        console.log(`📊 ${window.properties.length} imóveis, ${usedUrls.size} URLs em uso`);
        
        const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || window.SUPABASE_URL;
        const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || window.SUPABASE_KEY;
        
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.error('❌ Credenciais não encontradas');
            console.groupEnd();
            return { error: 'missing_credentials' };
        }
        
        // 🔧 IMPORTANTE: ALTERE O NOME DO BUCKET CONFORME O RESULTADO DO LISTAR BUCKETS
        const BUCKET_NAME = 'properties';  // ← ALTERE AQUI PARA O NOME CORRETO
        
        console.log(`🔗 Conectando ao Storage (bucket: ${BUCKET_NAME})...`);
        
        try {
            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            
            if (!response.ok) {
                console.error(`❌ Erro HTTP: ${response.status}`);
                const errorText = await response.text();
                console.error('Detalhes:', errorText);
                console.log('💡 Clique em "📦 LISTAR BUCKETS" no painel para ver os buckets disponíveis');
                console.groupEnd();
                return { error: 'list_failed', status: response.status, details: errorText };
            }
            
            const allFiles = await response.json();
            console.log(`📁 Total no Storage: ${allFiles.length}`);
            
            const orphans = allFiles.filter(file => {
                if (file.name.endsWith('/')) return false;
                const fileName = file.name.split('/').pop();
                return !Array.from(usedUrls).some(url => url.includes(fileName));
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
            
            console.log(`📊 RESULTADO: ${report.orphan_count} órfãos, ${report.total_size_mb} MB`);
            console.table({
                'Total Storage': report.total_in_storage,
                'Em Uso': report.used_files,
                'ÓRFÃOS': report.orphan_count,
                'Espaço (MB)': report.total_size_mb
            });
            
            console.groupEnd();
            return report;
            
        } catch (error) {
            console.error('❌ Erro na conexão:', error);
            console.groupEnd();
            return { error: 'connection_failed', details: error.message };
        }
    },
    
    showPanel(report) {
        const existing = document.getElementById('orphan-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'orphan-panel';
        panel.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
                        background:#0a0a2a; color:#0af; padding:20px; border-radius:10px; 
                        border:3px solid ${report.orphan_count > 0 ? '#fa0' : '#0f0'}; 
                        z-index:1000000; min-width:450px; font-family:monospace;">
                <h3 style="margin:0 0 15px 0;">🧹 ARQUIVOS ÓRFÃOS</h3>
                <table style="width:100%; margin:15px 0;">
                    <tr><td>📁 Total Storage:</td><td><b>${report.total_in_storage}</b></td></tr>
                    <tr><td>✅ Em uso:</td><td><b>${report.used_files}</b></td></tr>
                    <tr><td>🗑️ ÓRFÃOS:</td><td><b style="color:#fa0">${report.orphan_count}</b></td></tr>
                    <tr><td>💾 Espaço:</td><td><b>${report.total_size_mb} MB</b></td></tr>
                </table>
                <div style="display:flex; gap:10px; margin-top:15px; flex-wrap:wrap;">
                    <button id="orphan-refresh" style="background:#0af; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">🔍 Atualizar</button>
                    <button id="orphan-test-bucket" style="background:#2c3e66; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">🧪 TESTAR BUCKET</button>
                    <button id="orphan-list-buckets" style="background:#e67e22; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">📦 LISTAR BUCKETS</button>
                    <button id="orphan-close" style="background:#555; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        document.getElementById('orphan-refresh')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.diagnose().then(r => window.OrphanManager.showPanel(r));
        });
        document.getElementById('orphan-test-bucket')?.addEventListener('click', () => {
            window.OrphanManager.testBucketConnection();
        });
        document.getElementById('orphan-list-buckets')?.addEventListener('click', () => {
            window.OrphanManager.listBuckets();
        });
        document.getElementById('orphan-close')?.addEventListener('click', () => panel.remove());
    }
};

// Funções globais
window.listSupabaseBuckets = () => window.OrphanManager.listBuckets();
window.testBucketConnection = () => window.OrphanManager.testBucketConnection();
window.diagnoseOrphanFiles = () => window.OrphanManager.diagnose().then(r => window.OrphanManager.showPanel(r));
window.addOrphanButton = () => {
    if (document.getElementById('orphan-float-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'orphan-float-btn';
    btn.innerHTML = '🧹 ÓRFÃOS';
    btn.style.cssText = 'position:fixed; bottom:100px; right:20px; background:#e67e22; color:white; border:none; padding:12px 20px; border-radius:40px; font-weight:bold; cursor:pointer; z-index:1000020;';
    btn.onclick = () => window.OrphanManager.listBuckets();
    document.body.appendChild(btn);
};

// Auto-inicialização
if (window.location.search.includes('debug=true')) {
    setTimeout(window.addOrphanButton, 2000);
}

console.log('✅ DIAGNOSTICS63 v6.3.6 PRONTO');
console.log('💡 Use: listSupabaseBuckets() - Listar buckets disponíveis');
console.log('💡 Use: testBucketConnection() - Testar conexão com bucket "properties"');
console.log('💡 Use: diagnoseOrphanFiles() - Diagnóstico de órfãos');
console.log('💡 Botões disponíveis no painel: "📦 LISTAR BUCKETS" e "🧪 TESTAR BUCKET"');
