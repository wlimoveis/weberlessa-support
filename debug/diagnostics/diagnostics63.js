// weberlessa-support/debug/diagnostics/diagnostics63.js
// Versão 6.3.3 - Gestão de Arquivos Órfãos
console.log('🎯 DIAGNOSTICS63 v6.3.3 CARREGADO');

window.OrphanManager = {
    version: '6.3.3',
    
    async diagnose() {
        console.group('🔍 DIAGNÓSTICO DE ÓRFÃOS');
        
        if (!window.properties || window.properties.length === 0) {
            console.error('❌ Nenhum imóvel carregado');
            console.groupEnd();
            return { error: 'no_properties' };
        }
        
        // Coletar URLs em uso
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
        
        // Usar a configuração do Supabase
        const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || 'https://wxdiowpswepsvklumgvx.supabase.co';
        const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZGlvd3Bzd2Vwc3ZrbHVtZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MTExNzksImV4cCI6MjA4Nzk4NzE3OX0.QsUHE_w5m5-pz3LcwdREuwmwvCiX3Hz8FYv8SAwhD6U';
        
        // 🔧 CORREÇÃO: Usar o formato correto da API do Storage
        const bucket = 'properties';
        
        // Opção 1: Usar a API do Storage via fetch (recomendado)
        const storageUrl = `${SUPABASE_URL}/storage/v1/object/list/${bucket}`;
        
        console.log('🔗 Conectando ao Storage:', storageUrl);
        
        try {
            const response = await fetch(storageUrl, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            
            if (!response.ok) {
                console.error(`❌ Erro HTTP: ${response.status}`);
                const errorText = await response.text();
                console.error('Detalhes:', errorText);
                
                // Tentar formato alternativo da API
                console.log('🔄 Tentando formato alternativo...');
                const altUrl = `${SUPABASE_URL}/storage/v1/bucket/${bucket}/objects/list`;
                const altResponse = await fetch(altUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    }
                });
                
                if (!altResponse.ok) {
                    throw new Error(`Ambos formatos falharam: ${response.status} e ${altResponse.status}`);
                }
                
                const allFiles = await altResponse.json();
                return processFiles(allFiles, usedUrls);
            }
            
            const allFiles = await response.json();
            return processFiles(allFiles, usedUrls);
            
        } catch (error) {
            console.error('❌ Erro na conexão:', error);
            console.groupEnd();
            return { error: 'connection_failed', details: error.message };
        }
        
        function processFiles(allFiles, usedUrls) {
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
                        z-index:1000000; min-width:400px; font-family:monospace;">
                <h3>🧹 ARQUIVOS ÓRFÃOS</h3>
                <table style="width:100%; margin:15px 0;">
                    <tr><td>📁 Total Storage:</td><td><b>${report.total_in_storage}</b></td></tr>
                    <tr><td>✅ Em uso:</td><td><b>${report.used_files}</b></td></tr>
                    <tr><td>🗑️ ÓRFÃOS:</td><td><b style="color:#fa0">${report.orphan_count}</b></td></tr>
                    <tr><td>💾 Espaço:</td><td><b>${report.total_size_mb} MB</b></td></tr>
                </table>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <button id="orphan-refresh" style="background:#0af; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">🔍 Atualizar</button>
                    <button id="orphan-close" style="background:#555; padding:8px 16px; border:none; border-radius:5px; cursor:pointer;">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        document.getElementById('orphan-refresh')?.addEventListener('click', () => {
            panel.remove();
            window.OrphanManager.diagnose().then(r => window.OrphanManager.showPanel(r));
        });
        document.getElementById('orphan-close')?.addEventListener('click', () => panel.remove());
    }
};

window.diagnoseOrphanFiles = () => window.OrphanManager.diagnose().then(r => window.OrphanManager.showPanel(r));
window.addOrphanButton = () => {
    if (document.getElementById('orphan-float-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'orphan-float-btn';
    btn.innerHTML = '🧹 ÓRFÃOS';
    btn.style.cssText = 'position:fixed; bottom:100px; right:20px; background:#e67e22; color:white; border:none; padding:12px 20px; border-radius:40px; font-weight:bold; cursor:pointer; z-index:1000020;';
    btn.onclick = () => window.diagnoseOrphanFiles();
    document.body.appendChild(btn);
};

if (window.location.search.includes('debug=true')) {
    setTimeout(window.addOrphanButton, 2000);
}

// Função para listar buckets disponíveis
window.listSupabaseBuckets = async function() {
    console.group('🔍 LISTANDO BUCKETS DO SUPABASE');
    
    const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || window.SUPABASE_URL;
    const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || window.SUPABASE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('❌ Credenciais não encontradas');
        console.groupEnd();
        return;
    }
    
    try {
        const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (response.ok) {
            const buckets = await response.json();
            console.log('📦 Buckets encontrados:');
            console.table(buckets.map(b => ({ 
                id: b.id, 
                name: b.name, 
                public: b.public 
            })));
            
            if (buckets.length === 0) {
                console.warn('⚠️ Nenhum bucket encontrado. Crie um bucket no Supabase Storage.');
            } else {
                console.log('💡 Use um dos nomes acima no lugar de "properties"');
            }
        } else {
            console.error(`❌ Erro: ${response.status}`);
            const text = await response.text();
            console.log('Detalhes:', text);
        }
    } catch (error) {
        console.error('❌ Erro na conexão:', error);
    }
    
    console.groupEnd();
};

console.log('💡 Use: listSupabaseBuckets() - Listar buckets disponíveis');

console.log('✅ DIAGNOSTICS63 v6.3.3 PRONTO');
console.log('💡 Use: diagnoseOrphanFiles() - Diagnóstico de órfãos');
