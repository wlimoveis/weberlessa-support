// weberlessa-support/debug/media-migration-check.js - VERSÃO 2.2.0
// FUNCIONALIDADES: Migração, Storage Cleanup, Diagnóstico de Órfãos, Limpeza Segura
console.log('🔍 [SUPORTE] media-migration-check.js v2.2.0 - Sistema completo de diagnóstico e limpeza');

window.MediaMigrationChecker = {
    version: '2.2.0',
    checkDate: new Date().toISOString(),
    migrationStatus: 'completed', // ✅ MIGRAÇÃO JÁ CONCLUÍDA
    
    // ==================== FUNÇÕES EXISTENTES (v2.1.0) ====================
    
    /**
     * ✅ VERIFICAÇÃO DO SISTEMA ATUAL (pós-migração)
     * Verifica se o MediaSystem unificado está 100% funcional
     */
    runPostMigrationChecks() {
        console.group('✅ [SUPORTE] VERIFICAÇÃO PÓS-MIGRAÇÃO - SISTEMA UNIFICADO');
        
        // ✅ TESTES DO SISTEMA ATUAL (MediaSystem unificado)
        const tests = {
            // ========== SISTEMA UNIFICADO DISPONÍVEL ==========
            '✅ MediaSystem disponível': typeof window.MediaSystem === 'object',
            '✅ MediaSystem.init função': window.MediaSystem && typeof window.MediaSystem.init === 'function',
            
            // ========== FUNÇÕES CRÍTICAS DO SISTEMA NOVO ==========
            '✅ MediaSystem.addFiles': window.MediaSystem && typeof window.MediaSystem.addFiles === 'function',
            '✅ MediaSystem.addPdfs': window.MediaSystem && typeof window.MediaSystem.addPdfs === 'function',
            '✅ MediaSystem.uploadAll': window.MediaSystem && typeof window.MediaSystem.uploadAll === 'function',
            '✅ MediaSystem.loadExisting': window.MediaSystem && typeof window.MediaSystem.loadExisting === 'function',
            '✅ MediaSystem.updateUI': window.MediaSystem && typeof window.MediaSystem.updateUI === 'function',
            '✅ MediaSystem.resetState': window.MediaSystem && typeof window.MediaSystem.resetState === 'function',
            
            // ========== FUNÇÕES DE EXCLUSÃO FÍSICA ==========
            '✅ MediaSystem.deleteFilesFromStorage': window.MediaSystem && typeof window.MediaSystem.deleteFilesFromStorage === 'function',
            '✅ MediaSystem.deleteFileFromStorage': window.MediaSystem && typeof window.MediaSystem.deleteFileFromStorage === 'function',
            
            // ========== ESTADO DO SISTEMA ==========
            '✅ Arrays de estado inicializados': window.MediaSystem ? 
                (Array.isArray(window.MediaSystem.state.files) && 
                 Array.isArray(window.MediaSystem.state.pdfs)) : false,
            
            // ========== ELEMENTOS DOM CRÍTICOS ==========
            '✅ uploadArea existe': !!document.getElementById('uploadArea'),
            '✅ pdfUploadArea existe': !!document.getElementById('pdfUploadArea'),
            '✅ uploadPreview existe': !!document.getElementById('uploadPreview'),
            '✅ pdfUploadPreview existe': !!document.getElementById('pdfUploadPreview'),
            
            // ========== CONFIGURAÇÃO CORRETA ==========
            '✅ Sistema configurado como "vendas"': window.MediaSystem ? 
                window.MediaSystem.config.currentSystem === 'vendas' : false,
                
            // ========== FUNÇÕES DE SUPORTE ==========
            '✅ debugMediaSystem disponível': typeof window.debugMediaSystem === 'function',
            '✅ testMediaUpload disponível': typeof window.testMediaUpload === 'function'
        };
        
        console.table(tests);
        
        // ✅ VERIFICAÇÃO DE FUNÇÕES ANTIGAS (NÃO DEVEM EXISTIR)
        const legacyFunctions = {
            '❌ handleNewMediaFiles (DEVE SER REMOVIDO)': typeof window.handleNewMediaFiles !== 'function',
            '❌ handleNewPdfFiles (DEVE SER REMOVIDO)': typeof window.handleNewPdfFiles !== 'function',
            '❌ clearMediaSystem (DEVE SER REMOVIDO)': typeof window.clearMediaSystem !== 'function',
            '❌ updateMediaPreview (DEVE SER REMOVIDO)': typeof window.updateMediaPreview !== 'function',
            '❌ initMediaSystem (DEVE SER REMOVIDO)': typeof window.initMediaSystem !== 'function'
        };
        
        console.log('🔁 STATUS DAS FUNÇÕES ANTIGAS (devem ser FALSE):');
        console.table(legacyFunctions);
        
        // ✅ CONTAGEM DE RESULTADOS
        const passedCount = Object.values(tests).filter(test => test === true).length;
        const totalTests = Object.keys(tests).length;
        const score = Math.round((passedCount / totalTests) * 100);
        
        // ✅ CONTAGEM DE FUNÇÕES ANTIGAS (devem ser 0)
        const legacyStillExists = Object.values(legacyFunctions).filter(v => v === false).length;
        
        console.log(`📊 RESULTADO DO SISTEMA ATUAL: ${passedCount}/${totalTests} testes passaram (${score}%)`);
        console.log(`📊 FUNÇÕES ANTIGAS RESTANTES: ${legacyStillExists} (deve ser 0)`);
        
        // ✅ AVALIAÇÃO FINAL
        if (score === 100 && legacyStillExists === 0) {
            console.log('🎉🎉🎉 MIGRAÇÃO 100% CONCLUÍDA E VALIDADA!');
            console.log('✅ Sistema unificado está 100% funcional');
            console.log('✅ Todas as funções antigas foram removidas');
            console.log('✅ Sistema pronto para produção');
        } 
        else if (score === 100 && legacyStillExists > 0) {
            console.log('⚠️ SISTEMA FUNCIONAL, MAS COM LEGACY');
            console.log('✅ MediaSystem unificado está 100% funcional');
            console.log(`⚠️ ${legacyStillExists} função(ões) antiga(s) ainda presente(s) (apenas compatibilidade)`);
            console.log('💡 Recomendação: Remover funções legacy quando seguro');
        }
        else if (score >= 80) {
            console.log('⚠️ SISTEMA PARCIALMENTE MIGRADO');
            console.log(`✅ ${score}% do sistema novo está funcional`);
            console.log(`⚠️ ${100 - score}% precisa de atenção`);
        }
        else {
            console.error('❌ MIGRAÇÃO INCOMPLETA OU COM PROBLEMAS');
            console.log(`🚨 Apenas ${score}% do sistema novo está funcional`);
            console.log('🔧 Recomendação: Revisar a implementação do MediaSystem');
        }
        
        // ✅ DETALHES PARA DEBUG
        console.log('🔍 DETALHES DO MEDIASYSTEM ATUAL:');
        if (window.MediaSystem) {
            console.log('- Configuração:', window.MediaSystem.config);
            console.log('- Estado:', {
                files: window.MediaSystem.state.files.length,
                pdfs: window.MediaSystem.state.pdfs.length,
                isUploading: window.MediaSystem.state.isUploading
            });
            console.log('- Funções disponíveis:', 
                Object.keys(window.MediaSystem).filter(k => typeof window.MediaSystem[k] === 'function')
            );
        } else {
            console.log('- MediaSystem: NÃO ENCONTRADO');
        }
        
        console.groupEnd();
        
        return {
            score,
            passed: passedCount,
            total: totalTests,
            legacyFunctions: legacyStillExists,
            systemStatus: score === 100 ? 'fully_migrated' : 
                         score >= 80 ? 'partially_migrated' : 'migration_problems',
            details: tests,
            legacy: legacyFunctions
        };
    },
    
    /**
     * ✅ VERIFICAÇÃO DE LIMPEZA DO STORAGE
     * Verifica se as funções de exclusão física estão corretamente implementadas
     */
    verifyStorageCleanup() {
        console.group('🧪 [SUPORTE] VERIFICAÇÃO DE LIMPEZA DO STORAGE');
        
        const results = {
            mediaSystemAvailable: false,
            deleteFilesFromStorageAvailable: false,
            deleteFileFromStorageAvailable: false,
            deletePropertyUpdated: false,
            deletePropertyContent: null,
            integrationStatus: 'unknown'
        };
        
        // ✅ VERIFICAÇÃO 1: MediaSystem disponível
        if (typeof window.MediaSystem === 'object') {
            results.mediaSystemAvailable = true;
            console.log('✅ MediaSystem disponível');
        } else {
            console.error('❌ MediaSystem NÃO disponível');
        }
        
        // ✅ VERIFICAÇÃO 2: Funções de exclusão disponíveis
        if (window.MediaSystem) {
            if (typeof window.MediaSystem.deleteFilesFromStorage === 'function') {
                results.deleteFilesFromStorageAvailable = true;
                console.log('✅ MediaSystem.deleteFilesFromStorage disponível');
            } else {
                console.warn('⚠️ MediaSystem.deleteFilesFromStorage NÃO disponível');
            }
            
            if (typeof window.MediaSystem.deleteFileFromStorage === 'function') {
                results.deleteFileFromStorageAvailable = true;
                console.log('✅ MediaSystem.deleteFileFromStorage disponível');
            } else {
                console.warn('⚠️ MediaSystem.deleteFileFromStorage NÃO disponível');
            }
        }
        
        // ✅ VERIFICAÇÃO 3: deleteProperty atualizada
        if (typeof window.deleteProperty === 'function') {
            const deletePropertyStr = window.deleteProperty.toString();
            const hasStorageDeletion = deletePropertyStr.includes('deleteFilesFromStorage');
            const hasAllFileUrls = deletePropertyStr.includes('allFileUrls');
            
            if (hasStorageDeletion) {
                results.deletePropertyUpdated = true;
                console.log('✅ deleteProperty atualizada com exclusão de storage');
                
                const lines = deletePropertyStr.split('\n');
                const relevantLines = lines.filter(line => 
                    line.includes('deleteFilesFromStorage') || 
                    line.includes('allFileUrls') ||
                    line.includes('storage')
                );
                
                results.deletePropertyContent = relevantLines;
                console.log(`🔍 Código de exclusão presente: ${relevantLines.length} linhas relevantes`);
            } else {
                console.error('❌ deleteProperty NÃO inclui exclusão de storage');
            }
        } else {
            console.error('❌ deleteProperty NÃO disponível');
        }
        
        // ✅ VERIFICAÇÃO 4: Integração do sistema
        if (results.mediaSystemAvailable && 
            results.deleteFilesFromStorageAvailable && 
            results.deletePropertyUpdated) {
            results.integrationStatus = 'fully_integrated';
            console.log('🎉 SISTEMA DE EXCLUSÃO FÍSICA 100% INTEGRADO!');
        } 
        else if (results.mediaSystemAvailable && 
                 results.deleteFilesFromStorageAvailable && 
                 !results.deletePropertyUpdated) {
            results.integrationStatus = 'partial_integration';
            console.warn('⚠️ INTEGRAÇÃO PARCIAL: deleteProperty precisa ser atualizada');
        }
        else if (!results.deleteFilesFromStorageAvailable) {
            results.integrationStatus = 'missing_core_function';
            console.error('❌ FUNÇÃO CORE AUSENTE: deleteFilesFromStorage não implementada');
        }
        
        console.groupEnd();
        return results;
    },
    
    /**
     * ✅ TESTE SIMULADO DE EXCLUSÃO DE STORAGE
     * Cria um arquivo de teste temporário e tenta excluí-lo
     */
    async testStorageDeletion() {
        console.group('🧪 [SUPORTE] TESTE SIMULADO DE EXCLUSÃO DE STORAGE');
        
        try {
            if (!window.MediaSystem) {
                throw new Error('MediaSystem não disponível');
            }
            
            if (typeof window.MediaSystem.deleteFilesFromStorage !== 'function') {
                throw new Error('deleteFilesFromStorage não disponível');
            }
            
            console.log('📝 Criando arquivo de teste simulado...');
            const testFile = {
                name: `test_${Date.now()}.jpg`,
                url: `test-bucket/test_${Date.now()}.jpg`,
                size: 1024,
                type: 'image/jpeg'
            };
            
            console.log(`🔍 Arquivo de teste: ${testFile.name}`);
            console.log('🗑️ Executando exclusão simulada...');
            const result = await window.MediaSystem.deleteFilesFromStorage([testFile]);
            
            console.log('📊 Resultado da exclusão simulada:', result);
            
            if (result && result.success) {
                console.log('✅ Teste simulado concluído com sucesso');
            } else {
                console.warn('⚠️ Teste simulado retornou resultado inesperado:', result);
            }
            
        } catch (error) {
            console.error('❌ Erro no teste simulado:', error.message);
        }
        
        console.groupEnd();
    },
    
    /**
     * ✅ CAPTURAR URLs ATUAIS DOS ARQUIVOS
     */
    captureCurrentFileUrls() {
        if (!window.MediaSystem || !window.MediaSystem.state) {
            console.error('❌ MediaSystem.state não disponível');
            return null;
        }
        
        const files = window.MediaSystem.state.files || [];
        const pdfs = window.MediaSystem.state.pdfs || [];
        
        const allUrls = {
            timestamp: new Date().toISOString(),
            files: files.map(f => ({
                name: f.name,
                url: f.url,
                path: f.path || f.url
            })),
            pdfs: pdfs.map(p => ({
                name: p.name,
                url: p.url,
                path: p.path || p.url
            })),
            total: files.length + pdfs.length
        };
        
        console.group('📸 [SUPORTE] CAPTURA DE URLs ATUAIS');
        console.log(`✅ Capturadas ${allUrls.total} URLs (${files.length} imagens, ${pdfs.length} PDFs)`);
        console.table(allUrls.files.concat(allUrls.pdfs).slice(0, 10));
        
        if (allUrls.total > 10) {
            console.log(`... e mais ${allUrls.total - 10} arquivos`);
        }
        console.groupEnd();
        
        return allUrls;
    },
    
    /**
     * ✅ TESTE FUNCIONAL DO SISTEMA ATUAL
     */
    runFunctionalTest() {
        console.group('🚀 [SUPORTE] TESTE FUNCIONAL DO SISTEMA UNIFICADO');
        
        const results = {
            resetState: false,
            addFiles: false,
            updateUI: false,
            cleanup: false
        };
        
        try {
            if (window.MediaSystem && window.MediaSystem.resetState) {
                window.MediaSystem.resetState();
                console.log('✅ Teste 1: resetState() executado com sucesso');
                results.resetState = true;
            } else {
                console.warn('⚠️ Teste 1: resetState() não disponível');
            }
            
            const testBlob = new Blob(['test content'], { type: 'image/jpeg' });
            const testFile = new File([testBlob], 'test_image.jpg', { type: 'image/jpeg' });
            
            if (window.MediaSystem && window.MediaSystem.addFiles) {
                const added = window.MediaSystem.addFiles([testFile]);
                console.log(`✅ Teste 2: addFiles() adicionou ${added} arquivo(s) de teste`);
                results.addFiles = true;
                
                setTimeout(() => {
                    const preview = document.getElementById('uploadPreview');
                    const hasContent = preview && preview.innerHTML && preview.innerHTML.length > 100;
                    console.log(`✅ Teste 3: UI atualizada: ${hasContent ? 'SIM' : 'NÃO'}`);
                    results.updateUI = hasContent;
                    
                    if (window.MediaSystem && window.MediaSystem.resetState) {
                        window.MediaSystem.resetState();
                        console.log('✅ Teste 4: Sistema limpo após teste');
                        results.cleanup = true;
                    }
                    
                    const functionalScore = Object.values(results).filter(v => v === true).length;
                    console.log(`📊 TESTE FUNCIONAL: ${functionalScore}/4 passaram`);
                    console.groupEnd();
                }, 300);
            } else {
                console.error('❌ Teste 2: addFiles() não disponível');
                console.groupEnd();
            }
            
        } catch (error) {
            console.error('❌ Erro no teste funcional:', error);
            console.groupEnd();
            results.error = error.message;
        }
        
        return results;
    },
    
    // ==================== NOVAS FUNÇÕES (v2.2.0) ====================
    
    /**
     * ✅ DIAGNÓSTICO COMPLETO DE ARQUIVOS ÓRFÃOS
     * Modo apenas leitura - NENHUMA EXCLUSÃO
     */
    async diagnoseOrphanFiles() {
        console.group('🔍 [MediaMigration] DIAGNÓSTICO DE ARQUIVOS ÓRFÃOS');
        console.log('⚠️ MODO APENAS LEITURA - NENHUMA EXCLUSÃO SERÁ REALIZADA');
        
        try {
            // 1. Verificar imóveis carregados
            if (!window.properties || window.properties.length === 0) {
                console.error('❌ Nenhum imóvel carregado');
                console.groupEnd();
                return { success: false, reason: 'no_properties' };
            }
            
            console.log(`📊 Total de imóveis carregados: ${window.properties.length}`);
            
            // 2. Coletar URLs em uso
            const usedUrls = new Set();
            const usedFileNames = new Set();
            
            window.properties.forEach(property => {
                if (property.images && property.images !== 'EMPTY') {
                    property.images.split(',').forEach(url => {
                        if (url && url.trim()) {
                            const cleanUrl = url.trim();
                            usedUrls.add(cleanUrl);
                            const fileName = cleanUrl.split('/').pop()?.split('?')[0];
                            if (fileName) usedFileNames.add(fileName);
                        }
                    });
                }
                if (property.pdfs && property.pdfs !== 'EMPTY') {
                    property.pdfs.split(',').forEach(url => {
                        if (url && url.trim()) {
                            const cleanUrl = url.trim();
                            usedUrls.add(cleanUrl);
                            const fileName = cleanUrl.split('/').pop()?.split('?')[0];
                            if (fileName) usedFileNames.add(fileName);
                        }
                    });
                }
            });
            
            console.log(`📋 URLs em uso: ${usedUrls.size}`);
            console.log(`📄 Nomes de arquivos em uso: ${usedFileNames.size}`);
            
            // 3. Obter credenciais Supabase
            const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || window.SUPABASE_URL;
            const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || window.SUPABASE_KEY;
            const bucket = 'properties';
            
            if (!SUPABASE_URL || !SUPABASE_KEY) {
                console.error('❌ Credenciais Supabase não encontradas');
                console.groupEnd();
                return { success: false, reason: 'missing_credentials' };
            }
            
            // 4. Listar arquivos no Storage
            console.log(`🔗 Conectando ao Supabase Storage...`);
            const bucket = 'properties';
            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${bucket}`, {
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'apikey': SUPABASE_KEY
                }
            });
            
            if (!listResponse.ok) {
                console.error(`❌ Erro ao listar arquivos: ${listResponse.status}`);
                console.groupEnd();
                return { success: false, reason: 'list_failed', status: listResponse.status };
            }
            
            const allFiles = await listResponse.json();
            console.log(`📁 TOTAL DE ARQUIVOS NO STORAGE: ${allFiles.length}`);
            
            // 5. Analisar cada arquivo
            const orphanFiles = [];
            const usedFiles = [];
            
            for (const file of allFiles) {
                const fileName = file.name;
                if (fileName.endsWith('/')) continue;
                
                const isUsed = usedFileNames.has(fileName);
                const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
                const isUrlUsed = usedUrls.has(fullUrl);
                
                if (isUsed || isUrlUsed) {
                    usedFiles.push(fileName);
                } else {
                    const isFromRecentDeletion = fileName.match(/\d{13}/) && 
                        Date.now() - parseInt(fileName.match(/\d{13}/)[0]) < 86400000;
                    
                    orphanFiles.push({
                        name: fileName,
                        size: file.metadata?.size || 0,
                        lastModified: file.metadata?.lastModified,
                        suspicious: isFromRecentDeletion,
                        url: fullUrl
                    });
                }
            }
            
            // 6. Agrupar por tipo
            const byType = {
                images: orphanFiles.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)),
                videos: orphanFiles.filter(f => f.name.match(/\.(mp4|mov|avi|webm)$/i)),
                pdfs: orphanFiles.filter(f => f.name.match(/\.pdf$/i)),
                other: orphanFiles.filter(f => !f.name.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm|pdf)$/i))
            };
            
            // 7. Calcular espaço total
            let totalSize = 0;
            orphanFiles.forEach(file => { totalSize += file.size; });
            const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
            
            // 8. Exibir relatório
            console.log('\n📊 RELATÓRIO DETALHADO:');
            console.log('═'.repeat(50));
            console.log(`✅ Arquivos em uso: ${usedFiles.length}`);
            console.log(`🗑️ Arquivos órfãos: ${orphanFiles.length}`);
            console.log(`💾 Espaço ocupado: ${totalSizeMB} MB`);
            console.log(`\n📂 DISTRIBUIÇÃO POR TIPO:`);
            console.log(`   🖼️ Imagens: ${byType.images.length}`);
            console.log(`   🎬 Vídeos: ${byType.videos.length}`);
            console.log(`   📄 PDFs: ${byType.pdfs.length}`);
            console.log(`   ❓ Outros: ${byType.other.length}`);
            
            if (orphanFiles.length > 0) {
                console.log('\n📋 AMOSTRA DOS ARQUIVOS ÓRFÃOS (primeiros 20):');
                orphanFiles.slice(0, 20).forEach((file, index) => {
                    const sizeKB = (file.size / 1024).toFixed(1);
                    console.log(`${index + 1}. ${file.name} (${sizeKB} KB)`);
                    if (file.suspicious) console.log(`   ⚠️ Possível arquivo de exclusão recente`);
                });
                if (orphanFiles.length > 20) {
                    console.log(`\n... e mais ${orphanFiles.length - 20} arquivos`);
                }
            }
            
            const report = {
                success: true,
                total_in_storage: allFiles.length,
                urls_in_use: usedUrls.size,
                used_files: usedFiles.length,
                orphan_count: orphanFiles.length,
                total_size_mb: totalSizeMB,
                orphans_by_type: {
                    images: byType.images.length,
                    videos: byType.videos.length,
                    pdfs: byType.pdfs.length,
                    other: byType.other.length
                },
                suspicious_count: orphanFiles.filter(f => f.suspicious).length,
                orphans: orphanFiles
            };
            
            window.orphanFilesReport = report;
            console.log('\n📦 Relatório salvo em: window.orphanFilesReport');
            console.groupEnd();
            
            return report;
            
        } catch (error) {
            console.error('❌ Erro durante diagnóstico:', error);
            console.groupEnd();
            return { success: false, reason: 'error', error: error.message };
        }
    },
    
    /**
     * ✅ LIMPEZA SEGURA DE ARQUIVOS ÓRFÃOS
     * @param {number|null} limit - Se especificado, limpa apenas N arquivos (modo teste)
     */
    async safeOrphanCleanup(limit = null) {
        console.group('🧹 [MediaMigration] LIMPEZA SEGURA DE ARQUIVOS ÓRFÃOS');
        
        try {
            // 1. Executar diagnóstico primeiro
            const report = await this.diagnoseOrphanFiles();
            
            if (!report.success) {
                console.error('❌ Falha no diagnóstico, abortando limpeza');
                console.groupEnd();
                return { success: false, reason: 'diagnostic_failed' };
            }
            
            if (report.orphan_count === 0) {
                console.log('✅ Nenhum arquivo órfão encontrado!');
                console.groupEnd();
                return { success: true, deleted: 0, message: 'No orphan files found' };
            }
            
            // 2. Determinar arquivos a limpar
            const toClean = limit ? report.orphans.slice(0, limit) : report.orphans;
            
            console.log(`⚠️ ${toClean.length} arquivo(s) serão excluídos`);
            console.log('Arquivos a serem excluídos:');
            toClean.slice(0, 10).forEach((file, i) => {
                console.log(`  ${i+1}. ${file.name} (${(file.size/1024).toFixed(1)} KB)`);
            });
            if (toClean.length > 10) {
                console.log(`  ... e mais ${toClean.length - 10} arquivos`);
            }
            
            // 3. Confirmação do usuário
            const confirmMsg = limit 
                ? `⚠️ TESTE: Excluir APENAS ${limit} arquivo(s) órfão(s)?\n\nIsso é um teste. Os arquivos serão removidos PERMANENTEMENTE.`
                : `⚠️ Excluir TODOS os ${report.orphan_count} arquivos órfãos?\n\nEspaço estimado: ${report.total_size_mb} MB\n\nIsso é IRREVERSÍVEL.`;
            
            if (!confirm(confirmMsg)) {
                console.log('❌ Limpeza cancelada pelo usuário');
                console.groupEnd();
                return { success: false, cancelled: true };
            }
            
            // 4. Executar exclusão
            const SUPABASE_URL = window.SUPABASE_CONSTANTS?.URL || window.SUPABASE_URL;
            const SUPABASE_KEY = window.SUPABASE_CONSTANTS?.KEY || window.SUPABASE_KEY;
            const bucket = 'properties';
            
            let deleted = 0;
            let failed = 0;
            const errors = [];
            
            for (let i = 0; i < toClean.length; i++) {
                const file = toClean[i];
                try {
                    const deleteUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${file.name}`;
                    const response = await fetch(deleteUrl, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'apikey': SUPABASE_KEY
                        }
                    });
                    
                    if (response.ok) {
                        deleted++;
                        if (deleted % 50 === 0) {
                            console.log(`✅ Progresso: ${deleted}/${toClean.length} excluídos`);
                        }
                    } else {
                        failed++;
                        errors.push({ name: file.name, status: response.status });
                        console.warn(`⚠️ Falha: ${file.name} (${response.status})`);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 50));
                    
                } catch (error) {
                    failed++;
                    errors.push({ name: file.name, error: error.message });
                    console.error(`❌ Erro: ${file.name}`, error.message);
                }
            }
            
            console.log(`\n📊 RESULTADO DA LIMPEZA:`);
            console.log(`   ✅ Excluídos: ${deleted}`);
            console.log(`   ⚠️ Falhas: ${failed}`);
            console.log(`   📁 Total processados: ${toClean.length}`);
            
            alert(`✅ LIMPEZA CONCLUÍDA!\n\n${deleted} arquivos órfãos removidos.\n${failed} falhas.\n\nVerifique o console para detalhes.`);
            
            console.groupEnd();
            
            return {
                success: true,
                deleted,
                failed,
                total: toClean.length,
                errors: errors.length > 0 ? errors : undefined
            };
            
        } catch (error) {
            console.error('❌ Erro durante limpeza:', error);
            console.groupEnd();
            return { success: false, reason: 'error', error: error.message };
        }
    },
    
    /**
     * ✅ GERAR RELATÓRIO DE ÓRFÃOS
     */
    async generateOrphanReport() {
        console.group('📊 [MediaMigration] RELATÓRIO DE ARQUIVOS ÓRFÃOS');
        
        const report = await this.diagnoseOrphanFiles();
        
        if (report.success) {
            console.log('\n📊 RESUMO EXECUTIVO:');
            console.log(`   📁 Total no Storage: ${report.total_in_storage}`);
            console.log(`   📊 URLs em uso: ${report.urls_in_use}`);
            console.log(`   🗑️ Arquivos órfãos: ${report.orphan_count}`);
            console.log(`   💾 Espaço ocupado: ${report.total_size_mb} MB`);
            console.log(`   🖼️ Imagens: ${report.orphans_by_type.images}`);
            console.log(`   📄 PDFs: ${report.orphans_by_type.pdfs}`);
            console.log(`   🎬 Vídeos: ${report.orphans_by_type.videos}`);
            console.log(`   ⚠️ Suspeitos (últimas 24h): ${report.suspicious_count}`);
            
            if (report.orphan_count > 0) {
                console.log('\n💡 PARA EXECUTAR LIMPEZA:');
                console.log('   // Teste com 1 arquivo:');
                console.log('   await window.MediaMigrationChecker.safeOrphanCleanup(1)');
                console.log('   // Limpeza completa:');
                console.log('   await window.MediaMigrationChecker.safeOrphanCleanup()');
            }
        }
        
        console.groupEnd();
        return report;
    },
    
    /**
     * ✅ GERAR RELATÓRIO COMPLETO DE MIGRAÇÃO (INCLUINDO STORAGE)
     */
    async generateMigrationReport() {
        console.group('📋 [SUPORTE] RELATÓRIO DE MIGRAÇÃO COMPLETO');
        
        const compatibility = this.runPostMigrationChecks();
        const functional = this.runFunctionalTest();
        const storageCleanup = this.verifyStorageCleanup();
        const orphanReport = await this.diagnoseOrphanFiles();
        
        const report = {
            timestamp: new Date().toISOString(),
            migrationVersion: this.version,
            migrationStatus: this.migrationStatus,
            
            compatibility: {
                score: compatibility.score,
                status: compatibility.systemStatus,
                legacyFunctions: compatibility.legacyFunctions
            },
            
            functionalTest: {
                passed: functional.resetState && functional.addFiles,
                details: functional
            },
            
            storageCleanup: {
                status: storageCleanup.integrationStatus,
                functionsAvailable: {
                    deleteFilesFromStorage: storageCleanup.deleteFilesFromStorageAvailable,
                    deleteFileFromStorage: storageCleanup.deleteFileFromStorageAvailable
                },
                deletePropertyUpdated: storageCleanup.deletePropertyUpdated
            },
            
            orphanFiles: orphanReport.success ? {
                total: orphanReport.orphan_count,
                totalSizeMB: orphanReport.total_size_mb,
                byType: orphanReport.orphans_by_type,
                suspicious: orphanReport.suspicious_count
            } : { error: 'Failed to diagnose' },
            
            overallStatus: this.calculateOverallStatus(compatibility, functional, storageCleanup, orphanReport)
        };
        
        console.table({
            'Status Migração': report.migrationStatus,
            'Compatibilidade': `${compatibility.score}%`,
            'Funções Legacy': compatibility.legacyFunctions,
            'Teste Funcional': functional.resetState ? 'PASSOU' : 'FALHOU',
            'Storage Cleanup': storageCleanup.integrationStatus,
            'Arquivos Órfãos': report.orphanFiles.total || 'N/A',
            'Status Geral': report.overallStatus
        });
        
        console.groupEnd();
        return report;
    },
    
    /**
     * ✅ CALCULAR STATUS GERAL
     */
    calculateOverallStatus(compatibility, functional, storageCleanup, orphanReport) {
        const isFullyMigrated = compatibility.score === 100 && compatibility.legacyFunctions === 0;
        const isFunctional = functional.resetState && functional.addFiles;
        const hasStorageCleanup = storageCleanup.deleteFilesFromStorageAvailable && storageCleanup.deletePropertyUpdated;
        const hasOrphans = orphanReport.success && orphanReport.orphan_count > 0;
        
        if (isFullyMigrated && isFunctional && hasStorageCleanup && !hasOrphans) {
            return 'EXCELLENT'; // Tudo perfeito
        }
        else if (isFullyMigrated && isFunctional && hasStorageCleanup && hasOrphans) {
            return 'GOOD_NEEDS_CLEANUP'; // Sistema ok, mas precisa limpar órfãos
        }
        else if (isFullyMigrated && isFunctional && !hasStorageCleanup) {
            return 'GOOD_BUT_MISSING_STORAGE'; // Falta storage cleanup
        }
        else if (compatibility.score >= 80) {
            return 'FAIR';
        }
        else {
            return 'NEEDS_ATTENTION';
        }
    }
};

// ==================== FUNÇÕES DE ATALHO ====================
window.verifyStorageCleanup = () => window.MediaMigrationChecker.verifyStorageCleanup();
window.testStorageDeletion = () => window.MediaMigrationChecker.testStorageDeletion();
window.captureCurrentFileUrls = () => window.MediaMigrationChecker.captureCurrentFileUrls();
window.diagnoseOrphanFiles = () => window.MediaMigrationChecker.diagnoseOrphanFiles();
window.cleanupOrphanFiles = (limit) => window.MediaMigrationChecker.safeOrphanCleanup(limit);
window.generateOrphanReport = () => window.MediaMigrationChecker.generateOrphanReport();

// ==================== REGISTRO NO DIAGNOSTIC REGISTRY ====================
if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.register === 'function') {
    console.log('📋 [MediaMigration] Registrando funções no DiagnosticRegistry...');
    
    const methods = [
        { name: 'runPostMigrationChecks', category: 'migration', isSafe: true, isDestructive: false, desc: 'Verifica estado pós-migração do MediaSystem' },
        { name: 'runFunctionalTest', category: 'media', isSafe: true, isDestructive: false, desc: 'Testa funcionalidades básicas do MediaSystem' },
        { name: 'verifyStorageCleanup', category: 'media', isSafe: true, isDestructive: false, desc: 'Verifica integração das funções de exclusão física' },
        { name: 'testStorageDeletion', category: 'media', isSafe: true, isDestructive: false, desc: 'Teste simulado de exclusão de storage' },
        { name: 'captureCurrentFileUrls', category: 'media', isSafe: true, isDestructive: false, desc: 'Captura URLs atuais dos arquivos' },
        { name: 'generateMigrationReport', category: 'migration', isSafe: true, isDestructive: false, desc: 'Gera relatório completo de migração' },
        { name: 'diagnoseOrphanFiles', category: 'migration', isSafe: true, isDestructive: false, desc: 'Diagnostica arquivos órfãos no storage (apenas leitura)' },
        { name: 'safeOrphanCleanup', category: 'migration', isSafe: false, isDestructive: true, desc: 'Limpa arquivos órfãos com confirmação (DESTRUTIVO)' },
        { name: 'generateOrphanReport', category: 'migration', isSafe: true, isDestructive: false, desc: 'Gera relatório detalhado de arquivos órfãos' }
    ];
    
    methods.forEach(method => {
        const fn = window.MediaMigrationChecker[method.name];
        if (typeof fn === 'function') {
            const wrappedFn = fn.bind(window.MediaMigrationChecker);
            
            window.DiagnosticRegistry.register(
                `MediaMigrationChecker.${method.name}`,
                wrappedFn,
                method.category,
                {
                    description: method.desc,
                    version: window.MediaMigrationChecker.version,
                    safety: { isSafe: method.isSafe, isDestructive: method.isDestructive }
                }
            );
        }
    });
    
    console.log('✅ [MediaMigration] Funções registradas no DiagnosticRegistry');
}

// ==================== AUTO-EXECUÇÃO EM MODO DEBUG ====================
if (window.location.search.includes('debug=true') || 
    window.location.search.includes('test-migration=true') ||
    window.location.hostname.includes('localhost')) {
    
    setTimeout(() => {
        console.log('🔧 [SUPORTE] Executando verificação automática de migração...');
        
        setTimeout(async () => {
            const report = await window.MediaMigrationChecker.generateMigrationReport();
            
            if (window.location.search.includes('test-migration=true')) {
                console.log('🧪 [SUPORTE] Modo teste ativado - Funções disponíveis:');
                console.log('   📋 DIAGNÓSTICO:');
                console.log('   - window.MediaMigrationChecker.runPostMigrationChecks()');
                console.log('   - window.MediaMigrationChecker.runFunctionalTest()');
                console.log('   - window.MediaMigrationChecker.verifyStorageCleanup()');
                console.log('   - window.MediaMigrationChecker.diagnoseOrphanFiles() ⭐ NOVO');
                console.log('   🧹 LIMPEZA:');
                console.log('   - window.MediaMigrationChecker.safeOrphanCleanup(1)  // Teste com 1 arquivo');
                console.log('   - window.MediaMigrationChecker.safeOrphanCleanup()    // Limpeza completa');
                console.log('   📊 RELATÓRIOS:');
                console.log('   - window.MediaMigrationChecker.generateMigrationReport()');
                console.log('   - window.MediaMigrationChecker.generateOrphanReport() ⭐ NOVO');
                console.log('   🔧 ATALHOS:');
                console.log('   - window.diagnoseOrphanFiles()');
                console.log('   - window.cleanupOrphanFiles(1)  // Teste seguro');
                
                if (report.orphanFiles && report.orphanFiles.total > 0) {
                    console.log(`\n⚠️ ATENÇÃO: ${report.orphanFiles.total} arquivos órfãos detectados!`);
                    console.log(`💾 Espaço ocupado: ${report.orphanFiles.totalSizeMB} MB`);
                    console.log('💡 Execute: window.cleanupOrphanFiles(1) para testar limpeza');
                }
            }
        }, 1000);
        
    }, 500);
}

console.log('✅ [SUPORTE] MediaMigrationChecker v2.2.0 carregado');
console.log('💡 NOVAS FUNÇÕES: diagnoseOrphanFiles(), safeOrphanCleanup(), generateOrphanReport()');
console.log('💡 Atalhos: window.diagnoseOrphanFiles(), window.cleanupOrphanFiles(1)');
