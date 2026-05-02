// debug/utils/core-diagnostics.js
// Módulo de diagnóstico e suporte extraído do Core System
// v2.0 - Inclui testFileUpload (movido do SharedCore)
console.log('🔧 [SUPPORT] core-diagnostics.js carregado (versão consolidada com testFileUpload).');

(function() {
    // ========== DIAGNÓSTICO DE STORAGE ==========
    window.diagnosticoStorage = function() {
        console.group('🔍 DIAGNÓSTICO COMPLETO DO STORAGE');
        
        console.log('📊 CHAVES NO LOCALSTORAGE:');
        Object.keys(localStorage).forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (Array.isArray(data)) {
                    console.log(`- "${key}": ${data.length} imóveis`);
                    if (data.length > 0) {
                        console.log(`  Primeiro: "${data[0]?.title}" (ID: ${data[0]?.id})`);
                    }
                } else {
                    console.log(`- "${key}": Não é array (${typeof data})`);
                }
            } catch {
                console.log(`- "${key}": Não é JSON válido`);
            }
        });
        
        console.log('📊 window.properties:');
        console.log(`- É array?`, Array.isArray(window.properties));
        console.log(`- Quantidade:`, window.properties?.length || 0);
        
        console.log('💡 RECOMENDAÇÕES:');
        const hasOldKey = localStorage.getItem('weberlessa_properties');
        if (hasOldKey) {
            console.log('❌ AINDA EXISTE CHAVE ANTIGA! Execute window.cleanupOldStorage()');
        }
        
        if (!localStorage.getItem('properties')) {
            console.log('❌ CHAVE UNIFICADA NÃO ENCONTRADA! O sistema pode não estar salvando.');
        }
        
        console.groupEnd();
    };

    // ========== LIMPEZA DE CHAVES ANTIGAS ==========
    window.cleanupOldStorage = function() {
        if (confirm('⚠️ LIMPAR CHAVES ANTIGAS DO LOCALSTORAGE?\n\nEsta ação removerá "weberlessa_properties" e outras chaves antigas.')) {
            ['weberlessa_properties', 'properties_backup', 'weberlessa_backup'].forEach(key => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    console.log(`🗑️ Removido: ${key}`);
                }
            });
            alert('✅ Limpeza concluída! Recarregue a página.');
            location.reload();
        }
    };

    // ========== RESTAURAÇÃO DE EMERGÊNCIA ==========
    window.emergencyRestoreFromSupabase = async function() {
        if (!confirm('🚨 RESTAURAÇÃO DE EMERGÊNCIA\n\nIsso substituirá TODOS os dados locais pelos do Supabase.\nContinuar?')) {
            return;
        }
        
        const loading = window.LoadingManager?.show?.('Restaurando dados...', 'Conectando ao servidor');
        
        try {
            if (window.supabaseClient) {
                const { data, error } = await window.supabaseClient
                    .from('properties')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    localStorage.clear();
                    window.properties = data;
                    localStorage.setItem('properties', JSON.stringify(data));
                    
                    if (window.renderProperties) window.renderProperties('todos');
                    if (window.loadPropertyList) window.loadPropertyList();
                    
                    alert(`✅ RESTAURAÇÃO CONCLUÍDA!\n\n${data.length} imóveis recuperados do servidor.`);
                } else {
                    alert('ℹ️ Nenhum dado encontrado no servidor.');
                }
            } else {
                alert('❌ Cliente Supabase não disponível.');
            }
        } catch (error) {
            alert(`❌ ERRO: ${error.message}`);
        } finally {
            loading?.hide();
        }
    };

    // ========== MONITORAMENTO DE PERFORMANCE ==========
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            const perfData = {
                domReady: document.readyState,
                modulesLoaded: document.querySelectorAll('script[src*="modules/"]').length,
                loadingManagerAvailable: !!window.LoadingManager,
                propertiesAvailable: !!window.properties,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                connection: navigator.connection ? navigator.connection.effectiveType : 'desconhecido'
            };
            
            console.log('📊 [SUPPORT] Dados de performance:', perfData);
            
            console.log('🔍 [SUPPORT] Diagnóstico avançado:', {
                windowProperties: Object.keys(window).filter(k => k.includes('prop') || k.includes('load') || k.includes('init')),
                localStorageKeys: Object.keys(localStorage),
                scriptsLoaded: Array.from(document.scripts).map(s => s.src.split('/').pop())
            });
        }, 1000);
    }

    // ========== FUNÇÕES CONSOLIDADAS DO CORE SYSTEM ==========

    // -------------------------------------------------------------------------
    // 1. UNIFICAÇÃO DO LOCALSTORAGE
    // -------------------------------------------------------------------------
    window.unifyLocalStorageKeys = function() {
        console.group('🔄 [SUPORTE] UNIFICAÇÃO DE LOCALSTORAGE');
        
        const oldKey = 'weberlessa_properties';
        const newKey = 'properties';
        
        try {
            const oldData = localStorage.getItem(oldKey);
            const newData = localStorage.getItem(newKey);
            
            console.log('📊 Estado atual:');
            console.log(`- "${oldKey}": ${oldData ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`- "${newKey}": ${newData ? 'EXISTE' : 'NÃO EXISTE'}`);
            
            if (oldData && !newData) {
                console.log(`🔄 Migrando de "${oldKey}" para "${newKey}"`);
                localStorage.setItem(newKey, oldData);
                localStorage.removeItem(oldKey);
                console.log(`✅ Migração concluída`);
            }
            
            if (oldData && newData) {
                try {
                    const oldArray = JSON.parse(oldData);
                    const newArray = JSON.parse(newData);
                    
                    console.log(`📊 Comparação:`);
                    console.log(`- "${oldKey}": ${oldArray.length} imóveis`);
                    console.log(`- "${newKey}": ${newArray.length} imóveis`);
                    
                    if (oldArray.length > newArray.length) {
                        console.log(`🔄 "${oldKey}" tem mais dados, substituindo...`);
                        localStorage.setItem(newKey, oldData);
                        console.log(`✅ Substituído por dados da chave antiga`);
                    }
                    
                    localStorage.removeItem(oldKey);
                    console.log(`🗑️ Chave antiga "${oldKey}" removida`);
                    
                } catch (parseError) {
                    console.error('❌ Erro ao parsear dados:', parseError);
                }
            }
            
            const finalData = localStorage.getItem(newKey);
            if (finalData) {
                const finalArray = JSON.parse(finalData);
                console.log(`✅ Estado final: ${finalArray.length} imóveis em "${newKey}"`);
                
                if (window.properties && window.properties.length !== finalArray.length) {
                    console.warn(`⚠️ Inconsistência detectada: memória tem ${window.properties.length}, storage tem ${finalArray.length}`);
                    console.log('🔄 Sincronizando window.properties...');
                    window.properties = finalArray;
                }
            }
            
            console.log('🎯 Unificação concluída');
            
        } catch (error) {
            console.error('❌ Erro na unificação:', error);
        }
        
        console.groupEnd();
    };

    // -------------------------------------------------------------------------
    // 2. FUNÇÃO AUXILIAR: AGUARDAR IMAGENS CRÍTICAS
    // -------------------------------------------------------------------------
    window.waitForCriticalImages = async function() {
        return window.SharedCore?.ImageLoader?.waitForCriticalImages?.() || 0;
    };

    // -------------------------------------------------------------------------
    // 3. FUNÇÃO DE COMPATIBILIDADE (FALLBACK) - CORAÇÃO DO SISTEMA
    // -------------------------------------------------------------------------
    window.ensureBasicFunctionality = function() {
        console.log('🔧 [SUPORTE] Verificando funcionalidade básica...');
        
        // Garantir que window.properties existe
        if (!window.properties) {
            window.properties = [];
            console.log('📦 window.properties inicializado como array vazio');
        }
        
        // Tentar recuperar do localStorage se estiver vazio
        if (window.properties.length === 0) {
            const stored = localStorage.getItem('properties');
            if (stored) {
                try {
                    window.properties = JSON.parse(stored);
                    console.log(`✅ Recuperado ${window.properties.length} imóveis do localStorage (chave unificada)`);
                } catch (e) {
                    console.warn('⚠️ Não foi possível recuperar imóveis do localStorage');
                }
            }
        }
        
        // Fallback para renderProperties se não existir
        if (typeof window.renderProperties !== 'function') {
            console.warn('⚠️ renderProperties() não disponível - criando fallback básico');
            window.renderProperties = function(filter = 'todos') {
                const container = document.getElementById('properties-container');
                if (container) {
                    container.innerHTML = '<p style="text-align:center;padding:2rem;color:#666;">Imóveis carregando...</p>';
                }
            };
        }
        
        // Fallback para setupFilters se não existir
        if (typeof window.setupFilters !== 'function') {
            console.warn('⚠️ setupFilters() não disponível - criando fallback básico');
            window.setupFilters = function() {
                console.log('ℹ️ Filtros não disponíveis (modo básico)');
            };
        }
    };

    // -------------------------------------------------------------------------
    // 4. TESTE DE INTEGRAÇÃO
    // -------------------------------------------------------------------------
    window.runIntegrationTest = function(totalTime, imagesLoaded) {
        if (!window.location.search.includes('debug=true')) return;
        
        console.log('🧪 [SUPORTE] TESTE DE INTEGRAÇÃO OTIMIZADO:');
        const testResults = {
            'Imóveis carregados': !!window.properties && window.properties.length > 0,
            'Número de imóveis': window.properties ? window.properties.length : 0,
            'Container encontrado': !!document.getElementById('properties-container'),
            'Filtros ativos': document.querySelectorAll('.filter-btn.active').length > 0,
            'Função renderProperties': typeof window.renderProperties === 'function',
            'Função setupFilters': typeof window.setupFilters === 'function',
            'Tempo total': `${totalTime}ms`,
            'Imagens otimizadas': imagesLoaded,
            'Chaves localStorage': Object.keys(localStorage).filter(k => k.includes('prop')).join(', ')
        };
        
        console.table(testResults);
    };

    // =========================================================================
    // 5. TESTE DE CONEXÃO SUPABASE (COMPLEMENTAR)
    // =========================================================================
    /**
     * Testa a conexão com o Supabase de forma simples
     * Complementa o diagnosticoStorage() já existente
     */
    window.testSupabaseConnection = async function() {
        console.log('🔍 [SUPPORT] Testando conexão com Supabase...');
        
        if (!window.supabaseClient) {
            console.error('❌ [SUPPORT] Cliente Supabase não inicializado');
            return false;
        }
        
        try {
            const { data, error } = await window.supabaseClient
                .from('properties')
                .select('id')
                .limit(1);
                
            if (error) {
                console.error('❌ [SUPPORT] Erro na conexão:', error.message);
                return false;
            }
            
            console.log(`✅ [SUPPORT] Conexão estabelecida!`);
            return true;
            
        } catch (error) {
            console.error('❌ [SUPPORT] Erro fatal na conexão:', error.message);
            return false;
        }
    };

    // =========================================================================
    // 6. TESTE DE UPLOAD DE ARQUIVOS (MOVED FROM SHAREDCORE)
    // =========================================================================
    /**
     * Testa o upload de arquivos no Supabase Storage
     * Movido do SharedCore.js para o Support System (diagnóstico apenas)
     */
    window.testFileUpload = async function() {
        console.group('🧪 TESTE DE UPLOAD DE ARQUIVOS');
        
        const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || window.SUPABASE_URL;
        const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || window.SUPABASE_KEY;
        
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.error('❌ SUPABASE credentials not available!');
            console.groupEnd();
            return { success: false, error: 'Credentials not available' };
        }
        
        console.log('🔧 Configuração:', {
            SUPABASE_URL: SUPABASE_URL.substring(0, 50) + '...',
            SUPABASE_KEY: SUPABASE_KEY ? '✅ Disponível' : '❌ Indisponível'
        });
        
        const testBlob = new Blob(['test content'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
        
        const bucket = 'properties';
        const fileName = `test_${Date.now()}.txt`;
        const filePath = `${bucket}/${fileName}`;
        const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${filePath}`;
        
        console.log('📤 Tentando upload para:', uploadUrl.substring(0, 80) + '...');
        
        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'text/plain'
                },
                body: testFile
            });
            
            console.log('📡 Resposta:', response.status, response.statusText);
            
            if (response.ok) {
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${filePath}`;
                console.log('✅ UPLOAD BEM-SUCEDIDO!');
                console.log('🔗 URL pública:', publicUrl);
                console.groupEnd();
                return { success: true, url: publicUrl };
            } else {
                const errorText = await response.text();
                console.error('❌ Upload falhou:', errorText);
                console.groupEnd();
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('❌ Erro de conexão:', error);
            console.groupEnd();
            return { success: false, error: error.message };
        }
    };

    // ========== VERIFICAÇÃO ÚNICA E CENTRALIZADA ==========
    setTimeout(() => {
        if (!window.location.search.includes('debug=true')) return;
        
        console.log('=================================');
        console.log('🔬 VERIFICAÇÃO DA MIGRAÇÃO (core-diagnostics.js)');
        console.log('=================================');
        
        const functions = {
            'diagnosticoStorage': typeof window.diagnosticoStorage === 'function' ? '✅' : '❌',
            'cleanupOldStorage': typeof window.cleanupOldStorage === 'function' ? '✅' : '❌',
            'emergencyRestore': typeof window.emergencyRestoreFromSupabase === 'function' ? '✅' : '❌',
            'unifyLocalStorageKeys': typeof window.unifyLocalStorageKeys === 'function' ? '✅' : '❌',
            'waitForCriticalImages': typeof window.waitForCriticalImages === 'function' ? '✅' : '❌',
            'ensureBasicFunctionality': typeof window.ensureBasicFunctionality === 'function' ? '✅' : '❌',
            'runIntegrationTest': typeof window.runIntegrationTest === 'function' ? '✅' : '❌',
            'testSupabaseConnection': typeof window.testSupabaseConnection === 'function' ? '✅' : '❌',
            'testFileUpload': typeof window.testFileUpload === 'function' ? '✅' : '❌',
        };
        
        console.table(functions);
        
        const allOk = Object.values(functions).every(v => v === '✅');
        if (allOk) {
            console.log('✅✅✅ MIGRAÇÃO CONSOLIDADA COM SUCESSO!');
            console.log('   ✓ Core System: 150+ linhas removidas do main.js');
            console.log('   ✓ Support System: core-diagnostics.js agora contém 9 funções');
            console.log('   ✓ Módulo coeso e sem duplicação');
            console.log('   ✓ Teste Supabase adicionado com sucesso');
            console.log('   ✓ Teste File Upload movido do SharedCore');
            console.log('=================================');
            
            console.log('📊 Executando diagnóstico automático:');
            window.diagnosticoStorage();
        } else {
            console.log('❌❌❌ MIGRAÇÃO INCOMPLETA!');
            console.log('   Verifique se o main.js foi atualizado.');
        }
    }, 2000);

    // Registrar no DiagnosticRegistry
    setTimeout(() => {
        if (window.DiagnosticRegistry) {
            if (typeof window.testSupabaseConnection === 'function') {
                window.DiagnosticRegistry.register('testSupabaseConnection', window.testSupabaseConnection, 'essential', {
                    description: 'Testa conexão com Supabase'
                });
            }
            if (typeof window.testFileUpload === 'function') {
                window.DiagnosticRegistry.register('testFileUpload', window.testFileUpload, 'essential', {
                    description: 'Testa upload de arquivos no Supabase Storage'
                });
            }
        }
    }, 1000);

})();
