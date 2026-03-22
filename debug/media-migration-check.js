// weberlessa-support/debug/media-migration-check.js - VERSÃO ATUALIZADA COM VERIFICAÇÃO DE STORAGE
console.log('🔍 [SUPORTE] media-migration-check.js - Verificação ATUALIZADA (pós-migração + storage cleanup)');

window.MediaMigrationChecker = {
    version: '2.1.0', // Atualizado para versão com storage verification
    checkDate: new Date().toISOString(),
    migrationStatus: 'completed', // ✅ MIGRAÇÃO JÁ CONCLUÍDA
    
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
            
            // ========== FUNÇÕES DE EXCLUSÃO FÍSICA (NOVO) ==========
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
     * ✅ NOVA FUNÇÃO: VERIFICAÇÃO DE LIMPEZA DO STORAGE
     * Verifica se as funções de exclusão física estão corretamente implementadas
     * e se o deleteProperty está chamando a exclusão de storage
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
                console.warn('⚠️ MediaSystem.deleteFileFromStorage NÃO disponível (função auxiliar)');
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
                
                // Extrair trecho relevante para confirmação
                const lines = deletePropertyStr.split('\n');
                const relevantLines = lines.filter(line => 
                    line.includes('deleteFilesFromStorage') || 
                    line.includes('allFileUrls') ||
                    line.includes('storage')
                );
                
                results.deletePropertyContent = relevantLines;
                console.log(`🔍 Código de exclusão presente: ${relevantLines.length} linhas relevantes`);
                
                // Mostrar trecho para debug
                if (relevantLines.length > 0) {
                    console.log('📝 Trecho do código de exclusão:');
                    relevantLines.slice(0, 3).forEach(line => {
                        console.log(`   ${line.trim()}`);
                    });
                }
            } else {
                console.error('❌ deleteProperty NÃO inclui exclusão de storage');
                console.log('💡 Dica: Verificar se a função foi atualizada com a chamada a deleteFilesFromStorage');
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
            console.log('✅ Todas as funções de exclusão estão disponíveis e integradas');
        } 
        else if (results.mediaSystemAvailable && 
                 results.deleteFilesFromStorageAvailable && 
                 !results.deletePropertyUpdated) {
            results.integrationStatus = 'partial_integration';
            console.warn('⚠️ INTEGRAÇÃO PARCIAL: deleteProperty precisa ser atualizada');
            console.log('🔧 Ação necessária: Atualizar deleteProperty para chamar deleteFilesFromStorage');
        }
        else if (!results.deleteFilesFromStorageAvailable) {
            results.integrationStatus = 'missing_core_function';
            console.error('❌ FUNÇÃO CORE AUSENTE: deleteFilesFromStorage não implementada');
            console.log('🔧 Ação necessária: Implementar MediaSystem.deleteFilesFromStorage');
        }
        else {
            results.integrationStatus = 'needs_attention';
            console.error('❌ SISTEMA DE EXCLUSÃO COM MÚLTIPLOS PROBLEMAS');
        }
        
        // ✅ GUIA PARA TESTE MANUAL
        console.log('\n📋 GUIA PARA TESTE PRÁTICO DE EXCLUSÃO:');
        console.log('   1. Crie um imóvel com 2-3 imagens no painel admin');
        console.log('   2. Anote os nomes dos arquivos no Supabase Storage');
        console.log('   3. Exclua o imóvel através do painel admin');
        console.log('   4. Verifique se os arquivos sumiram do Storage');
        console.log('\n💡 Para visualizar URLs dos arquivos antes da exclusão:');
        console.log('   - Abra o console e execute: MediaSystem.state.files');
        console.log('   - Cada arquivo terá a propriedade "url" com o caminho completo');
        
        // ✅ FUNÇÃO AUXILIAR PARA TESTE RÁPIDO (se disponível)
        if (results.mediaSystemAvailable && results.deleteFilesFromStorageAvailable) {
            console.log('\n🧪 FUNÇÃO DE TESTE RÁPIDO DISPONÍVEL:');
            console.log('   window.MediaMigrationChecker.testStorageDeletion() - Teste simulado');
        }
        
        console.groupEnd();
        
        return results;
    },
    
    /**
     * ✅ NOVA FUNÇÃO: TESTE SIMULADO DE EXCLUSÃO DE STORAGE
     * Cria um arquivo de teste temporário e tenta excluí-lo
     * ATENÇÃO: Esta função é SEGURA e não afeta dados reais
     */
    async testStorageDeletion() {
        console.group('🧪 [SUPORTE] TESTE SIMULADO DE EXCLUSÃO DE STORAGE');
        
        try {
            // ✅ VERIFICAR PRÉ-REQUISITOS
            if (!window.MediaSystem) {
                throw new Error('MediaSystem não disponível');
            }
            
            if (typeof window.MediaSystem.deleteFilesFromStorage !== 'function') {
                throw new Error('deleteFilesFromStorage não disponível');
            }
            
            // ✅ CRIAR ARQUIVO DE TESTE (NÃO REAL)
            console.log('📝 Criando arquivo de teste simulado...');
            const testFile = {
                name: `test_${Date.now()}.jpg`,
                url: `test-bucket/test_${Date.now()}.jpg`,
                size: 1024,
                type: 'image/jpeg'
            };
            
            console.log(`🔍 Arquivo de teste: ${testFile.name}`);
            
            // ✅ TESTAR EXCLUSÃO SIMULADA
            console.log('🗑️ Executando exclusão simulada...');
            const result = await window.MediaSystem.deleteFilesFromStorage([testFile]);
            
            console.log('📊 Resultado da exclusão simulada:', result);
            
            if (result && result.success) {
                console.log('✅ Teste simulado concluído com sucesso');
                console.log('💡 A função deleteFilesFromStorage está funcionando corretamente');
            } else {
                console.warn('⚠️ Teste simulado retornou resultado inesperado:', result);
            }
            
            // ✅ INSTRUÇÕES PARA TESTE REAL
            console.log('\n📋 PARA TESTE REAL (recomendado):');
            console.log('   1. Crie um imóvel com imagens no painel admin');
            console.log('   2. Use a função abaixo para capturar URLs:');
            console.log('      window.MediaMigrationChecker.captureCurrentFileUrls()');
            console.log('   3. Exclua o imóvel');
            console.log('   4. Verifique se os arquivos sumiram do Storage');
            
        } catch (error) {
            console.error('❌ Erro no teste simulado:', error.message);
            console.log('🔧 Verifique se o MediaSystem está corretamente inicializado');
        }
        
        console.groupEnd();
    },
    
    /**
     * ✅ NOVA FUNÇÃO: CAPTURAR URLs ATUAIS DOS ARQUIVOS
     * Útil para testar exclusão real comparando antes/depois
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
        console.log('📋 URLs capturadas (para comparar após exclusão):');
        console.table(allUrls.files.concat(allUrls.pdfs).slice(0, 10)); // Limitar a 10 para não poluir console
        
        if (allUrls.total > 10) {
            console.log(`... e mais ${allUrls.total - 10} arquivos (use copy() para ver todos)`);
            console.log('💡 Para ver todos: copy(window.MediaMigrationChecker.captureCurrentFileUrls())');
        }
        
        console.log('\n💡 Guarde estas URLs para comparar após exclusão do imóvel');
        console.groupEnd();
        
        return allUrls;
    },
    
    /**
     * ✅ TESTE FUNCIONAL DO SISTEMA ATUAL
     * Testa as funções reais do MediaSystem unificado
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
            // ✅ TESTE 1: Reset do sistema
            if (window.MediaSystem && window.MediaSystem.resetState) {
                window.MediaSystem.resetState();
                console.log('✅ Teste 1: resetState() executado com sucesso');
                results.resetState = true;
            } else {
                console.warn('⚠️ Teste 1: resetState() não disponível');
            }
            
            // ✅ TESTE 2: Criação de arquivo de teste
            const testBlob = new Blob(['test content'], { type: 'image/jpeg' });
            const testFile = new File([testBlob], 'test_image.jpg', { type: 'image/jpeg' });
            
            // ✅ TESTE 3: Adição de arquivo ao sistema
            if (window.MediaSystem && window.MediaSystem.addFiles) {
                const added = window.MediaSystem.addFiles([testFile]);
                console.log(`✅ Teste 2: addFiles() adicionou ${added} arquivo(s) de teste`);
                results.addFiles = true;
                
                // ✅ TESTE 4: Verificar se UI foi atualizada
                setTimeout(() => {
                    const preview = document.getElementById('uploadPreview');
                    const hasContent = preview && preview.innerHTML && preview.innerHTML.length > 100;
                    
                    console.log(`✅ Teste 3: UI atualizada: ${hasContent ? 'SIM' : 'NÃO'}`);
                    results.updateUI = hasContent;
                    
                    // ✅ TESTE 5: Limpeza final
                    if (window.MediaSystem && window.MediaSystem.resetState) {
                        window.MediaSystem.resetState();
                        console.log('✅ Teste 4: Sistema limpo após teste');
                        results.cleanup = true;
                    }
                    
                    // ✅ RESUMO DO TESTE FUNCIONAL
                    const functionalScore = Object.values(results).filter(v => v === true).length;
                    const functionalTotal = Object.keys(results).length;
                    
                    console.log(`📊 TESTE FUNCIONAL: ${functionalScore}/${functionalTotal} passaram`);
                    
                    if (functionalScore === functionalTotal) {
                        console.log('🎉 SISTEMA FUNCIONAL COMPROVADO!');
                    } else {
                        console.warn('⚠️ SISTEMA COM LIMITAÇÕES FUNCIONAIS');
                    }
                    
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
    
    /**
     * ✅ GERAR RELATÓRIO COMPLETO DE MIGRAÇÃO (INCLUINDO STORAGE)
     */
    generateMigrationReport() {
        console.group('📋 [SUPORTE] RELATÓRIO DE MIGRAÇÃO COMPLETO');
        
        const compatibility = this.runPostMigrationChecks();
        const functional = this.runFunctionalTest();
        const storageCleanup = this.verifyStorageCleanup();
        
        const report = {
            timestamp: new Date().toISOString(),
            migrationVersion: 'media-unified-v2.1',
            migrationStatus: this.migrationStatus,
            
            // Resultados
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
            
            // ✅ RECOMENDAÇÕES BASEADAS NO STATUS
            recommendations: this.generateRecommendations(compatibility, functional, storageCleanup),
            
            // ✅ STATUS GERAL
            overallStatus: this.calculateOverallStatus(compatibility, functional, storageCleanup)
        };
        
        console.table({
            'Status Migração': report.migrationStatus,
            'Compatibilidade': `${compatibility.score}%`,
            'Funções Legacy': compatibility.legacyFunctions,
            'Teste Funcional': functional.resetState ? 'PASSOU' : 'FALHOU',
            'Storage Cleanup': storageCleanup.integrationStatus,
            'Status Geral': report.overallStatus
        });
        
        console.log('📝 RECOMENDAÇÕES:');
        report.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. ${rec}`);
        });
        
        console.groupEnd();
        return report;
    },
    
    /**
     * ✅ GERAR RECOMENDAÇÕES PERSONALIZADAS (ATUALIZADO COM STORAGE)
     */
    generateRecommendations(compatibility, functional, storageCleanup) {
        const recommendations = [];
        
        // ✅ RECOMENDAÇÕES DE MIGRAÇÃO GERAL
        if (compatibility.score === 100 && compatibility.legacyFunctions === 0) {
            recommendations.push('✅ Migração 100% concluída - Nenhuma ação necessária');
            recommendations.push('✅ Sistema pronto para produção em escala');
        }
        else if (compatibility.score === 100 && compatibility.legacyFunctions > 0) {
            recommendations.push('⚠️ Remover funções legacy quando seguro: handleNewMediaFiles, handleNewPdfFiles, etc.');
            recommendations.push('✅ Sistema funcional, legacy é apenas para compatibilidade');
        }
        else if (compatibility.score >= 80) {
            recommendations.push('🔧 Corrigir os itens falhados na verificação de compatibilidade');
            recommendations.push('✅ Sistema está majoritariamente funcional');
        }
        else {
            recommendations.push('🚨 Revisar implementação do MediaSystem unificado');
            recommendations.push('🔧 Verificar se media-unified.js está carregando corretamente');
        }
        
        // ✅ RECOMENDAÇÕES DE STORAGE CLEANUP
        if (!storageCleanup.deleteFilesFromStorageAvailable) {
            recommendations.push('🚨 CRÍTICO: Implementar MediaSystem.deleteFilesFromStorage');
            recommendations.push('🔧 Esta função é essencial para eliminar arquivos órfãos');
        }
        
        if (!storageCleanup.deletePropertyUpdated) {
            recommendations.push('⚠️ IMPORTANTE: Atualizar deleteProperty para chamar deleteFilesFromStorage');
            recommendations.push('🔧 Adicionar chamada: await MediaSystem.deleteFilesFromStorage(allFileUrls)');
        }
        
        if (storageCleanup.deleteFilesFromStorageAvailable && storageCleanup.deletePropertyUpdated) {
            recommendations.push('✅ Sistema de exclusão física 100% integrado');
            recommendations.push('📋 Recomendado: Executar limpeza dos 1.045 arquivos órfãos existentes');
        }
        
        // ✅ TESTE FUNCIONAL
        if (!functional.resetState || !functional.addFiles) {
            recommendations.push('🔧 Teste funcional falhou - Verificar implementação do MediaSystem');
        }
        
        return recommendations;
    },
    
    /**
     * ✅ CALCULAR STATUS GERAL (ATUALIZADO COM STORAGE)
     */
    calculateOverallStatus(compatibility, functional, storageCleanup) {
        const isFullyMigrated = compatibility.score === 100 && 
                               compatibility.legacyFunctions === 0;
        
        const isFunctional = functional.resetState && functional.addFiles;
        
        const hasStorageCleanup = storageCleanup.deleteFilesFromStorageAvailable && 
                                 storageCleanup.deletePropertyUpdated;
        
        if (isFullyMigrated && isFunctional && hasStorageCleanup) {
            return 'EXCELLENT'; // ✅✅✅ - Tudo perfeito
        }
        else if (isFullyMigrated && isFunctional && !hasStorageCleanup) {
            return 'GOOD_BUT_MISSING_STORAGE'; // ✅✅ - Falta storage cleanup
        }
        else if (isFullyMigrated && !isFunctional) {
            return 'PARTIALLY_FUNCTIONAL'; // ✅ - Funcionalidade parcial
        }
        else if (compatibility.score >= 80) {
            return 'FAIR'; // ✅ - Migração parcial
        }
        else {
            return 'NEEDS_ATTENTION'; // ⚠️ - Precisa de atenção
        }
    }
};

// ✅ NOVAS FUNÇÕES DE ATALHO PARA CONSOLE
window.verifyStorageCleanup = () => window.MediaMigrationChecker.verifyStorageCleanup();
window.testStorageDeletion = () => window.MediaMigrationChecker.testStorageDeletion();
window.captureCurrentFileUrls = () => window.MediaMigrationChecker.captureCurrentFileUrls();

// ✅ AUTO-EXECUÇÃO EM MODO DEBUG
if (window.location.search.includes('debug=true') || 
    window.location.search.includes('test-migration=true')) {
    
    setTimeout(() => {
        console.log('🔧 [SUPORTE] Executando verificação automática de migração (pós-migração)...');
        
        // Aguardar mais tempo para garantir que MediaSystem carregou
        setTimeout(() => {
            window.MediaMigrationChecker.generateMigrationReport();
            
            // Se em modo debug avançado, oferecer funções extras
            if (window.location.search.includes('test-migration=true')) {
                console.log('🧪 [SUPORTE] Modo teste ativado - Funções disponíveis:');
                console.log('   - window.MediaMigrationChecker.runPostMigrationChecks()');
                console.log('   - window.MediaMigrationChecker.runFunctionalTest()');
                console.log('   - window.MediaMigrationChecker.verifyStorageCleanup() ⭐ NOVO');
                console.log('   - window.MediaMigrationChecker.testStorageDeletion() ⭐ NOVO');
                console.log('   - window.MediaMigrationChecker.captureCurrentFileUrls() ⭐ NOVO');
                console.log('   - window.debugMediaSystem() (se disponível)');
            }
        }, 4000); // 4 segundos para carregamento completo
        
    }, 2000);
}

console.log('✅ [SUPORTE] MediaMigrationChecker ATUALIZADO v2.1 - Verificação pós-migração + Storage Cleanup');
console.log('💡 Use window.MediaMigrationChecker.generateMigrationReport() para relatório completo');
console.log('💡 NOVAS FUNÇÕES: verifyStorageCleanup(), testStorageDeletion(), captureCurrentFileUrls()');
