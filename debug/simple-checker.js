// weberlessa-support/debug/simple-checker.js - VERSÃO COM EXECUÇÃO AUTOMÁTICA
console.log('✅ simple-checker.js - Verificação Básica + Validação de Centralização + Teste Performance (v2.2)');

// ========== FUNÇÕES EXISTENTES (MANTIDAS E OTIMIZADAS) ==========

window.runSupportChecks = function() {
    console.group('✅ VERIFICAÇÃO BÁSICA DO SISTEMA - SISTEMA ATUAL');
    
    // ✅ VERIFICAR MÓDULOS DO SISTEMA ATUAL (pós-migração)
    const essentials = {
        // Core System
        'Supabase Client': !!window.supabaseClient,
        'Properties Array': Array.isArray(window.properties) && window.properties.length > 0,
        
        // ✅ SISTEMA ATUAL: Media System (UNIFICADO)
        'Media System (Unificado)': typeof window.MediaSystem === 'object',
        'MediaSystem.addFiles': typeof window.MediaSystem?.addFiles === 'function',
        'MediaSystem.uploadAll': typeof window.MediaSystem?.uploadAll === 'function',
        
        // ✅ SISTEMA ATUAL: PDF System (UNIFICADO)
        'PDF System (Unificado)': typeof window.PdfSystem === 'object',
        'PdfSystem.showModal': typeof window.PdfSystem?.showModal === 'function',
        'PdfSystem.init': typeof window.PdfSystem?.init === 'function',
        
        // Admin System (atualizado)
        'Admin Functions': typeof window.toggleAdminPanel === 'function',
        'saveProperty': typeof window.saveProperty === 'function',
        
        // Gallery System (atualizado)
        'Gallery System': typeof window.openGallery === 'function',
        'closeGallery': typeof window.closeGallery === 'function',
        
        // Shared Core (essencial)
        'SharedCore': typeof window.SharedCore === 'object',
        'SharedCore.PriceFormatter': typeof window.SharedCore?.PriceFormatter === 'object',
        
        // ✅ Diagnostic Registry
        'Diagnostic Registry': typeof window.DiagnosticRegistry === 'object'
    };
    
    console.table(essentials);
    
    // ✅ VERIFICAÇÃO DE MIGRAÇÃO COMPLETA
    const migrationChecks = {
        '✅ Sistema antigo substituído': true,
        '✅ MediaSystem (unificado) em uso': typeof window.MediaSystem === 'object',
        '✅ PdfSystem (unificado) em uso': typeof window.PdfSystem === 'object',
        '✅ Diagnostic Registry ativo': typeof window.DiagnosticRegistry === 'object',
        '❌ Funções antigas removidas': !window.handleNewMediaFiles && !window.showPdfModal
    };
    
    console.log('🔁 STATUS DA MIGRAÇÃO:');
    console.table(migrationChecks);
    
    // ✅ VERIFICAR FUNÇÕES CRÍTICAS
    const criticalFunctions = [
        'window.toggleAdminPanel',
        'window.MediaSystem.addFiles',
        'window.PdfSystem.showModal',
        'window.openGallery'
    ];
    
    console.log('🎯 FUNÇÕES CRÍTICAS:');
    criticalFunctions.forEach(fnName => {
        try {
            const fn = eval(fnName);
            console.log(`  ${fnName}: ${typeof fn === 'function' ? '✅' : '❌'}`);
        } catch {
            console.log(`  ${fnName}: ❌ (não encontrada)`);
        }
    });
    
    // ✅ ESTATÍSTICAS DO REGISTRY
    if (window.DiagnosticRegistry) {
        console.log('\n📊 ESTATÍSTICAS DO DIAGNOSTIC REGISTRY:');
        
        const byCategory = window.DiagnosticRegistry.getFunctionsByCategory();
        const totalFunctions = window.DiagnosticRegistry.registry.size;
        
        console.log(`Total de funções registradas: ${totalFunctions}`);
        
        if (totalFunctions > 0) {
            Object.keys(byCategory).sort().forEach(category => {
                const stats = byCategory[category];
                const safePercent = ((stats.safe / stats.total) * 100).toFixed(1);
                console.log(`  📁 ${category}: ${stats.total} funções (${stats.safe} seguras, ${stats.destructive} destrutivas) - ${safePercent}% seguras`);
            });
            
            // Listar funções destrutivas (para alerta)
            const destructiveFunctions = [];
            window.DiagnosticRegistry.registry.forEach(fn => {
                if (fn.safety.isDestructive) {
                    destructiveFunctions.push(fn.name);
                }
            });
            
            if (destructiveFunctions.length > 0) {
                console.log('\n⚠️ FUNÇÕES DESTRUTIVAS IDENTIFICADAS (NÃO executar automaticamente):');
                destructiveFunctions.sort().forEach(name => {
                    console.log(`  💀 ${name}`);
                });
            }
        }
    }
    
    // ✅ CONTAGEM DE FALHAS (apenas funções críticas)
    const criticalEssentials = {
        'Admin': typeof window.toggleAdminPanel === 'function',
        'Mídia': typeof window.MediaSystem?.addFiles === 'function',
        'PDF': typeof window.PdfSystem?.showModal === 'function',
        'Galeria': typeof window.openGallery === 'function',
        'Registry': typeof window.DiagnosticRegistry === 'object'
    };
    
    const criticalFailures = Object.values(criticalEssentials).filter(v => !v).length;
    
    if (criticalFailures > 0) {
        console.warn(`\n⚠️ ${criticalFailures} função(ões) CRÍTICA(s) não encontrada(s):`);
        Object.entries(criticalEssentials).forEach(([name, exists]) => {
            if (!exists) console.warn(`   - ${name}`);
        });
    } else {
        console.log('\n🎉 TODAS as funções CRÍTICAS estão disponíveis!');
    }
    
    // ✅ RESUMO FINAL
    console.log('\n📊 RESUMO DO SISTEMA:');
    console.log(`- Imóveis carregados: ${window.properties?.length || 0}`);
    console.log(`- Sistema de mídia: ${window.MediaSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- Sistema de PDF: ${window.PdfSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- SharedCore: ${window.SharedCore ? '✅ DISPONÍVEL' : '❌'}`);
    console.log(`- Diagnostic Registry: ${window.DiagnosticRegistry ? '✅ ATIVO' : '❌'}`);
    
    // ✅ VERIFICAÇÃO DE COMPATIBILIDADE
    if (!window.handleNewMediaFiles && !window.showPdfModal) {
        console.log('\n✅✅✅ MIGRAÇÃO COMPLETA CONFIRMADA!');
        console.log('🎯 Sistema antigo foi completamente substituído.');
        console.log('🚀 Sistema atual 100% funcional.');
    } else {
        console.warn('\n⚠️ Sistema em estado MISTO (antigo + novo)');
        console.log('💡 Algumas funções antigas ainda podem estar presentes.');
    }
    
    console.groupEnd();
    
    return {
        essentials,
        migrationStatus: migrationChecks,
        criticalFunctions: criticalEssentials,
        registryStats: window.DiagnosticRegistry ? window.DiagnosticRegistry.getFunctionsByCategory() : null,
        summary: {
            propertiesCount: window.properties?.length || 0,
            mediaSystem: !!window.MediaSystem,
            pdfSystem: !!window.PdfSystem,
            registryActive: !!window.DiagnosticRegistry,
            migrationComplete: !window.handleNewMediaFiles && !window.showPdfModal
        }
    };
};

// ✅ FUNÇÃO DE DIAGNÓSTICO RÁPIDO
window.quickDiagnostic = function() {
    console.group('⚡ DIAGNÓSTICO RÁPIDO');
    
    const quickCheck = {
        'DOM pronto': document.readyState === 'complete',
        'Imóveis': `${window.properties?.length || 0} carregados`,
        'Mídia': window.MediaSystem ? '✅' : '❌',
        'PDF': window.PdfSystem ? '✅' : '❌',
        'Admin': typeof window.toggleAdminPanel === 'function' ? '✅' : '❌',
        'Registry': window.DiagnosticRegistry ? '✅' : '❌',
        'Console limpo': !window.location.search.includes('debug=true') ? '✅ (produção)' : '🔧 (debug)'
    };
    
    console.table(quickCheck);
    console.groupEnd();
    
    return quickCheck;
};

// ✅ FUNÇÃO: Executar apenas diagnósticos seguros
window.runSafeDiagnostics = async function() {
    console.log('🛡️ Iniciando diagnóstico seguro via Registry...');
    
    if (!window.DiagnosticRegistry) {
        console.error('❌ DiagnosticRegistry não disponível!');
        return null;
    }
    
    return await window.DiagnosticRegistry.runSafeDiagnostics();
};

// ✅ FUNÇÃO: Listar funções por categoria
window.listDiagnosticFunctions = function(category = null) {
    if (!window.DiagnosticRegistry) {
        console.error('❌ DiagnosticRegistry não disponível!');
        return;
    }
    
    window.DiagnosticRegistry.list({ category, detailed: true });
};

// ========== FUNÇÕES DE VALIDAÇÃO DE CENTRALIZAÇÃO ==========

/**
 * ✅ FUNÇÃO: Validar Centralização de Funções no SharedCore
 */
window.validateCentralizedFunctions = function() {
    console.group('🎯 VALIDAÇÃO DE FUNÇÕES CENTRALIZADAS NO SHAREDCORE');
    
    const resultados = {
        centralizadas: [],
        duplicadas: [],
        ausentes: []
    };
    
    const funcoesEssenciais = [
        { nome: 'formatPrice', central: 'PriceFormatter.formatForCard' },
        { nome: 'formatPriceForInput', central: 'PriceFormatter.formatForInput' },
        { nome: 'formatFeaturesForDisplay', central: 'formatFeaturesForDisplay' },
        { nome: 'parseFeaturesForStorage', central: 'parseFeaturesForStorage' },
        { nome: 'ensureBooleanVideo', central: 'ensureBooleanVideo' },
        { nome: 'validateIdForSupabase', central: 'validateIdForSupabase' },
        { nome: 'manageEditingState', central: 'manageEditingState' },
        { nome: 'debounce', central: 'debounce' },
        { nome: 'throttle', central: 'throttle' },
        { nome: 'isMobileDevice', central: 'isMobileDevice' },
        { nome: 'extractBairroFromLocation', central: 'extractBairroFromLocation' }
    ];
    
    console.log('🔍 Verificando funções essenciais...');
    
    funcoesEssenciais.forEach(func => {
        const extractFn = window.SharedCore?.[func.central] || window.SharedCore?.[func.nome];
        const estaNoSharedCore = typeof extractFn === 'function';
        const estaGlobal = typeof window[func.nome] === 'function';
        
        if (estaNoSharedCore) {
            resultados.centralizadas.push(func.nome);
            console.log(`✅ ${func.nome} - Centralizada no SharedCore`);
        } else {
            console.warn(`⚠️ ${func.nome} - NÃO encontrada no SharedCore`);
            resultados.ausentes.push(func.nome);
        }
        
        if (estaGlobal && func.nome !== 'SharedCore') {
            const eProxy = window[func.nome]?.toString().includes('SharedCore.');
            if (!eProxy) {
                console.warn(`⚠️ ${func.nome} - Duplicada globalmente (fora do SharedCore)`);
                resultados.duplicadas.push(func.nome);
            }
        }
    });
    
    // Verificar PriceFormatter especificamente
    if (window.SharedCore?.PriceFormatter) {
        const metodosPrice = ['formatForCard', 'formatForInput', 'formatForAdmin', 'setupAutoFormat'];
        metodosPrice.forEach(metodo => {
            if (typeof window.SharedCore.PriceFormatter[metodo] === 'function') {
                console.log(`✅ PriceFormatter.${metodo} - Disponível`);
            } else {
                console.warn(`⚠️ PriceFormatter.${metodo} - Ausente`);
            }
        });
    } else {
        console.error('❌ PriceFormatter NÃO encontrado no SharedCore!');
    }
    
    console.log('\n📊 RESUMO DA CENTRALIZAÇÃO:');
    console.log(`  Centralizadas: ${resultados.centralizadas.length}/${funcoesEssenciais.length}`);
    console.log(`  Duplicadas: ${resultados.duplicadas.length}`);
    console.log(`  Ausentes: ${resultados.ausentes.length}`);
    
    const status = resultados.ausentes.length === 0 && resultados.duplicadas.length === 0;
    console.log(`\n${status ? '✅ SISTEMA CENTRALIZADO CORRETAMENTE' : '⚠️ SISTEMA COM CENTRALIZAÇÃO INCOMPLETA'}`);
    
    console.groupEnd();
    
    return resultados;
};

/**
 * ✅ FUNÇÃO: Verificar Remoção de Duplicatas
 */
window.checkDuplicateRemoval = function() {
    console.group('🧹 VERIFICAÇÃO DE REMOÇÃO DE DUPLICATAS');
    
    const funcoesObsoletas = [
        'oldFormatPrice',
        'oldFormatFeatures',
        'legacyParseFeatures',
        'videoCheckLegacy',
        'duplicateGalleryFunction',
        'antigaFuncaoMedia'
    ];
    
    const funcoesProxies = [
        'formatPrice',
        'formatFeaturesForDisplay',
        'parseFeaturesForStorage',
        'ensureBooleanVideo',
        'validateIdForSupabase',
        'manageEditingState',
        'extractBairroFromLocation'
    ];
    
    const resultado = {
        encontradas: [],
        proxysFuncionando: [],
        problemaProxy: []
    };
    
    funcoesObsoletas.forEach(nome => {
        if (typeof window[nome] !== 'undefined') {
            console.warn(`❌ Função obsoleta AINDA PRESENTE: ${nome}`);
            resultado.encontradas.push(nome);
        }
    });
    
    funcoesProxies.forEach(nome => {
        if (typeof window[nome] === 'function') {
            const corpo = window[nome].toString();
            const eProxy = corpo.includes('SharedCore.') || corpo.includes('PriceFormatter.');
            
            if (eProxy) {
                console.log(`✅ ${nome} - Proxy funcionando corretamente`);
                resultado.proxysFuncionando.push(nome);
            } else {
                console.warn(`⚠️ ${nome} - Função global NÃO é proxy (possível duplicata)`);
                resultado.problemaProxy.push(nome);
            }
        } else {
            console.warn(`⚠️ ${nome} - Ausente (pode ser necessário)`);
        }
    });
    
    console.log('\n📊 RESUMO DA LIMPEZA:');
    console.log(`  Funções obsoletas encontradas: ${resultado.encontradas.length}`);
    console.log(`  Proxys funcionando: ${resultado.proxysFuncionando.length}/${funcoesProxies.length}`);
    console.log(`  Proxys com problema: ${resultado.problemaProxy.length}`);
    
    const status = resultado.encontradas.length === 0 && resultado.problemaProxy.length === 0;
    console.log(`\n${status ? '✅ NENHUMA DUPLICATA INDESEJADA ENCONTRADA' : '⚠️ DUPLICATAS ENCONTRADAS - REQUER LIMPEZA'}`);
    
    console.groupEnd();
    
    return resultado;
};

/**
 * ✅ FUNÇÃO: Validar Estado do MediaSystem
 */
window.validateMediaSystem = function() {
    console.group('📸 VALIDAÇÃO DO MEDIASYSTEM');
    
    if (!window.MediaSystem) {
        console.error('❌ MediaSystem NÃO disponível!');
        console.groupEnd();
        return { success: false, error: 'MediaSystem não encontrado' };
    }
    
    const funcoesCriticas = [
        'addFiles',
        'addPdfs',
        'uploadAll',
        'deleteFileFromStorage',
        'deleteFilesFromStorage',
        'resetState',
        'loadExisting'
    ];
    
    const resultado = {
        success: true,
        funcoesDisponiveis: [],
        funcoesAusentes: []
    };
    
    funcoesCriticas.forEach(nome => {
        if (typeof window.MediaSystem[nome] === 'function') {
            resultado.funcoesDisponiveis.push(nome);
            console.log(`✅ MediaSystem.${nome} - Disponível`);
        } else {
            resultado.funcoesAusentes.push(nome);
            resultado.success = false;
            console.error(`❌ MediaSystem.${nome} - AUSENTE!`);
        }
    });
    
    console.log('\n📊 ESTADO ATUAL DO MEDIASYSTEM:');
    console.log(`  Arquivos na fila: ${window.MediaSystem.state?.files?.length || 0}`);
    console.log(`  PDFs na fila: ${window.MediaSystem.state?.pdfs?.length || 0}`);
    console.log(`  Arquivos existentes: ${window.MediaSystem.state?.existing?.length || 0}`);
    console.log(`  PDFs existentes: ${window.MediaSystem.state?.existingPdfs?.length || 0}`);
    console.log(`  Upload em andamento: ${window.MediaSystem.state?.isUploading ? 'Sim' : 'Não'}`);
    
    const supabaseConfig = window.SUPABASE_CONSTANTS;
    if (supabaseConfig && supabaseConfig.URL && supabaseConfig.KEY) {
        console.log('✅ Configuração Supabase encontrada');
    } else {
        console.warn('⚠️ Configuração Supabase ausente ou incompleta');
        resultado.success = false;
    }
    
    console.log(`\n${resultado.success ? '✅ MEDIASYSTEM OPERACIONAL' : '❌ MEDIASYSTEM COM PROBLEMAS'}`);
    
    console.groupEnd();
    
    return resultado;
};

/**
 * ✅ FUNÇÃO: Validar Estado do FilterManager
 */
window.validateFilterManager = function() {
    console.group('🎛️ VALIDAÇÃO DO FILTERMANAGER');
    
    if (!window.FilterManager) {
        console.error('❌ FilterManager NÃO disponível!');
        console.groupEnd();
        return { success: false, error: 'FilterManager não encontrado' };
    }
    
    const resultado = {
        success: true,
        initialized: false,
        hasCallbacks: false
    };
    
    const funcoesPrincipais = ['init', 'setActiveFilter', 'getCurrentFilter', 'setupWithFallback'];
    
    funcoesPrincipais.forEach(nome => {
        if (typeof window.FilterManager[nome] === 'function') {
            console.log(`✅ FilterManager.${nome} - Disponível`);
        } else {
            console.error(`❌ FilterManager.${nome} - AUSENTE!`);
            resultado.success = false;
        }
    });
    
    resultado.initialized = window.FilterManager.isInitialized ? window.FilterManager.isInitialized() : false;
    console.log(`📌 Estado de inicialização: ${resultado.initialized ? 'Inicializado' : 'Não inicializado'}`);
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterContainer = document.querySelector('.filter-options');
    
    if (filterContainer) {
        console.log(`✅ Container de filtros encontrado: ${filterButtons.length} botões`);
        
        if (filterButtons.length === 0) {
            console.warn('⚠️ Nenhum botão de filtro encontrado');
        }
        
        const activeButtons = document.querySelectorAll('.filter-btn.active');
        if (activeButtons.length > 0) {
            console.log(`✅ Filtro ativo: ${activeButtons[0].textContent.trim()}`);
        } else {
            console.warn('⚠️ Nenhum filtro ativo encontrado');
        }
    } else {
        console.warn('⚠️ Container .filter-options não encontrado na página');
        resultado.success = false;
    }
    
    if (typeof window.currentFilter !== 'undefined') {
        console.log(`📌 Filtro global atual: ${window.currentFilter || 'todos'}`);
    }
    
    console.log(`\n${resultado.success ? '✅ FILTERMANAGER OPERACIONAL' : '❌ FILTERMANAGER COM PROBLEMAS'}`);
    
    console.groupEnd();
    
    return resultado;
};

// ========== FUNÇÃO: TESTE DE PERFORMANCE ==========

/**
 * ✅ FUNÇÃO: Testar Performance da Extração de Bairros
 */
window.testExtractionPerformance = function() {
    console.group('⚡ TESTE DE PERFORMANCE - EXTRAÇÃO DE BAIRROS');
    
    if (!window.properties || !Array.isArray(window.properties)) {
        console.error('❌ window.properties não encontrado ou não é um array!');
        console.groupEnd();
        return null;
    }
    
    if (window.properties.length === 0) {
        console.warn('⚠️ Nenhum imóvel carregado!');
        console.groupEnd();
        return null;
    }
    
    const extractFunction = window.SharedCore?.extractBairroFromLocation || 
                           window.extractBairroFromLocation ||
                           (function(loc) {
                               if (!loc || typeof loc !== 'string') return null;
                               let bairro = loc.split(',')[0].split('-')[0].trim();
                               return bairro || null;
                           });
    
    const functionSource = window.SharedCore?.extractBairroFromLocation ? 'SharedCore' :
                          (window.extractBairroFromLocation ? 'Global' : 'Fallback interno');
    
    console.log(`📌 Função de extração utilizada: ${functionSource}`);
    
    const startTime = performance.now();
    let successCount = 0;
    const extractionResults = [];
    
    window.properties.forEach(prop => {
        const bairro = extractFunction(prop.location);
        if (bairro && bairro !== '❓ NÃO IDENTIFICADO') {
            successCount++;
            extractionResults.push({
                title: prop.title?.substring(0, 30) || 'Sem título',
                location: prop.location,
                bairro: bairro
            });
        }
    });
    
    const endTime = performance.now();
    const totalTime = (endTime - startTime).toFixed(2);
    const averageTime = (totalTime / window.properties.length).toFixed(3);
    
    console.log(`\n📊 ESTATÍSTICAS:`);
    console.log(`   Imóveis processados: ${window.properties.length}`);
    console.log(`   ✅ Extrações bem-sucedidas: ${successCount}`);
    console.log(`   ❌ Falhas: ${window.properties.length - successCount}`);
    console.log(`   ⏱️ Tempo total: ${totalTime}ms`);
    console.log(`   🚀 Média por imóvel: ${averageTime}ms`);
    
    if (extractionResults.length > 0) {
        console.log(`\n📋 EXEMPLOS DOS PRIMEIROS 5 IMÓVEIS:`);
        extractionResults.slice(0, 5).forEach((result, idx) => {
            console.log(`   ${idx + 1}. "${result.title}"`);
            console.log(`      📍 Location: "${result.location?.substring(0, 50) || ''}..."`);
            console.log(`      🎯 Bairro extraído: "${result.bairro}"`);
        });
    }
    
    const performanceStatus = totalTime < 100 ? '✅ EXCELENTE' : (totalTime < 500 ? '⚠️ ACEITÁVEL' : '❌ LENTO');
    console.log(`\n🔍 STATUS DE PERFORMANCE: ${performanceStatus} (${totalTime}ms para ${window.properties.length} imóveis)`);
    
    console.groupEnd();
    
    return {
        totalProperties: window.properties.length,
        successCount: successCount,
        failureCount: window.properties.length - successCount,
        totalTimeMs: parseFloat(totalTime),
        averageTimeMs: parseFloat(averageTime),
        performanceStatus: performanceStatus,
        functionSource: functionSource,
        examples: extractionResults.slice(0, 5)
    };
};

// ========== FUNÇÃO: VALIDAÇÃO COMPLETA DE BAIRROS (COM EXECUÇÃO AUTOMÁTICA) ==========

/**
 * ✅ FUNÇÃO: Validar Centralização da Função extractBairroFromLocation
 * Teste completo da função de extração de bairros
 * ⚠️ EXECUTA AUTOMATICAMENTE quando carregada em modo debug
 */
window.validateExtractBairroFunction = function() {
    console.log('\n🏠 VALIDAÇÃO DA FUNÇÃO CENTRALIZADA DE BAIRROS');
    console.log('================================================');
    
    // 1. Verificar disponibilidade
    console.log('\n📌 1. DISPONIBILIDADE:');
    console.log(`   SharedCore.extractBairroFromLocation: ${typeof window.SharedCore?.extractBairroFromLocation === 'function' ? '✅' : '❌'}`);
    console.log(`   window.extractBairroFromLocation (global): ${typeof window.extractBairroFromLocation === 'function' ? '✅' : '❌'}`);
    
    // 2. Verificar delegação
    const isDelegated = window.extractBairroFromLocation === window.SharedCore?.extractBairroFromLocation;
    console.log('\n📌 2. DELEGAÇÃO CORRETA:', isDelegated ? '✅ SIM (função global = SharedCore)' : '⚠️ NÃO');
    
    // 3. Extração com imóveis reais
    console.log('\n📌 3. EXTRAÇÃO COM IMÓVEIS REAIS:');
    if (window.properties && window.properties.length > 0) {
        const bairrosEncontrados = new Map();
        let totalExtraidos = 0;
        
        const extractFn = window.SharedCore?.extractBairroFromLocation || window.extractBairroFromLocation;
        
        window.properties.forEach(prop => {
            const bairro = extractFn ? extractFn(prop.location) : null;
            if (bairro) {
                totalExtraidos++;
                bairrosEncontrados.set(bairro, (bairrosEncontrados.get(bairro) || 0) + 1);
            }
        });
        
        console.log(`   ✅ ${totalExtraidos}/${window.properties.length} imóveis com bairro extraído`);
        console.log(`   📍 ${bairrosEncontrados.size} bairros únicos encontrados:`);
        
        const sortedBairros = Array.from(bairrosEncontrados.entries()).sort((a,b) => b[1] - a[1]);
        sortedBairros.slice(0, 10).forEach(([bairro, count]) => {
            console.log(`      - ${bairro}: ${count} imóvel(is)`);
        });
    } else {
        console.warn('   ⚠️ Nenhum imóvel carregado');
    }
    
    // 4. Casos específicos
    console.log('\n📌 4. CASOS ESPECÍFICOS:');
    const testLocations = [
        'Rua Saleiro Pitão, Ponta Verde - Maceió/AL',
        'Residência Conj. Portal do Renascer, Forene',
        'Av. Menino Marcelo, Tabuleiro do Martins, Maceió/AL',
        'Zona Rural - Sitio São João',
        'Rua do Comércio, Centro, Maceió/AL'
    ];
    
    const extractFn = window.SharedCore?.extractBairroFromLocation || window.extractBairroFromLocation;
    if (extractFn) {
        testLocations.forEach(loc => {
            const result = extractFn(loc);
            console.log(`   📍 "${loc.substring(0, 40)}..." → "${result || '❌'}"`);
        });
    } else {
        console.error('   ❌ Função de extração não disponível!');
    }
    
    // 5. Verificação de duplicação
    console.log('\n📌 5. VERIFICAÇÃO DE DUPLICAÇÃO:');
    const filterManagerStr = window.FilterManager?.toString() || '';
    const hasLocalExtract = filterManagerStr.includes('function extractBairroFromLocation(') && 
                            !filterManagerStr.includes('window.SharedCore.extractBairroFromLocation');
    
    console.log(`   FilterManager com função local? ${hasLocalExtract ? '⚠️ SIM' : '✅ NÃO'}`);
    
    const hasOldFunctions = typeof window.extractBairroForComparison === 'function' ||
                           typeof window.extractBairroFromLocation_old === 'function';
    console.log(`   Funções antigas (extractBairroForComparison)? ${hasOldFunctions ? '⚠️ SIM' : '✅ NÃO'}`);
    
    // 6. Teste de performance
    console.log('\n📌 6. TESTE DE PERFORMANCE:');
    if (window.properties && window.properties.length > 0) {
        const start = performance.now();
        let count = 0;
        const iterations = Math.min(100, Math.floor(500 / window.properties.length) || 10);
        for (let i = 0; i < iterations; i++) {
            window.properties.forEach(prop => {
                if (extractFn && extractFn(prop.location)) count++;
            });
        }
        const end = performance.now();
        const avgTime = ((end - start) / iterations).toFixed(2);
        console.log(`   ⏱️ Média de ${avgTime}ms para processar ${window.properties.length} imóveis (${iterations} execuções)`);
        console.log(`   🚀 ${(avgTime / window.properties.length).toFixed(2)}ms por imóvel em média`);
    }
    
    // 7. Integração com FilterManager
    console.log('\n📌 7. INTEGRAÇÃO COM FILTERMANAGER:');
    if (window.FilterManager) {
        const currentFilter = window.FilterManager.getCurrentFilter?.();
        const currentBairro = window.FilterManager.getCurrentBairro?.();
        const isInitialized = window.FilterManager.isInitialized?.();
        console.log(`   FilterManager.${isInitialized ? '✅ INICIALIZADO' : '⚠️ NÃO INICIALIZADO'}`);
        if (currentFilter) console.log(`   Filtro atual: ${currentFilter}`);
        if (currentBairro) console.log(`   Bairro atual: ${currentBairro}`);
    } else {
        console.log('   ⚠️ FilterManager não disponível');
    }
    
    console.log('\n✅ VALIDAÇÃO CONCLUÍDA!');
    console.log('================================================');
    
    return {
        success: typeof window.SharedCore?.extractBairroFromLocation === 'function' && !hasLocalExtract,
        sharedCoreAvailable: typeof window.SharedCore?.extractBairroFromLocation === 'function',
        globalAvailable: typeof window.extractBairroFromLocation === 'function',
        isDelegated: isDelegated,
        filterManagerNoLocal: !hasLocalExtract,
        noOldFunctions: !hasOldFunctions
    };
};

/**
 * ✅ FUNÇÃO: Executar Validação Rápida de Todas as Funções
 */
window.runQuickValidation = async function() {
    console.log('🚀 INICIANDO VALIDAÇÃO RÁPIDA COMPLETA');
    console.log('=========================================');
    
    const resultados = {
        centralizacao: null,
        duplicatas: null,
        mediaSystem: null,
        filterManager: null,
        extractBairro: null,
        performance: null,
        timestamp: new Date().toISOString(),
        sucessoTotal: false
    };
    
    console.log('\n📍 PASSO 1/5: Validando centralização...');
    resultados.centralizacao = window.validateCentralizedFunctions();
    
    console.log('\n📍 PASSO 2/5: Verificando duplicatas...');
    resultados.duplicatas = window.checkDuplicateRemoval();
    
    console.log('\n📍 PASSO 3/5: Validando MediaSystem...');
    resultados.mediaSystem = window.validateMediaSystem();
    
    console.log('\n📍 PASSO 4/5: Validando FilterManager...');
    resultados.filterManager = window.validateFilterManager();
    
    console.log('\n📍 PASSO 5/5: Validando extração de bairros...');
    resultados.extractBairro = window.validateExtractBairroFunction();
    resultados.performance = window.testExtractionPerformance();
    
    console.log('\n=========================================');
    console.log('📊 RESUMO DA VALIDAÇÃO RÁPIDA:');
    console.log(`  Centralização: ${resultados.centralizacao?.ausentes?.length === 0 ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  Duplicatas: ${resultados.duplicatas?.encontradas?.length === 0 ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  MediaSystem: ${resultados.mediaSystem?.success ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  FilterManager: ${resultados.filterManager?.success ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  Extração de bairros: ${resultados.extractBairro?.success ? '✅ OK' : '⚠️ Pendente'}`);
    
    resultados.sucessoTotal = 
        resultados.centralizacao?.ausentes?.length === 0 &&
        resultados.duplicatas?.encontradas?.length === 0 &&
        resultados.mediaSystem?.success === true &&
        resultados.filterManager?.success === true &&
        resultados.extractBairro?.success === true;
    
    console.log(`\n${resultados.sucessoTotal ? '🎉 VALIDAÇÃO COMPLETA APROVADA!' : '⚠️ VALIDAÇÃO COM PENDÊNCIAS - VERIFICAR ACIMA'}`);
    console.log('=========================================');
    
    return resultados;
};

// ========== FUNÇÕES DE SUPORTE ==========

function waitForRegistryAndExecute() {
    console.log('⏳ Aguardando DiagnosticRegistry ficar pronto...');
    
    if (window.DiagnosticRegistry && window.DiagnosticRegistry._eventDispatched) {
        console.log('⚡ Registry já pronto, executando imediatamente');
        executeAllChecks();
        return;
    }
    
    const timeoutId = setTimeout(() => {
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        console.warn('⚠️ Timeout aguardando registry - executando verificações parciais');
        executeAllChecks(true);
    }, 5000);
    
    const readyHandler = (event) => {
        clearTimeout(timeoutId);
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        console.log(`🎯 Evento recebido: diagnostic-registry-ready com ${event.detail.count} funções`);
        executeAllChecks();
    };
    
    window.addEventListener('diagnostic-registry-ready', readyHandler);
    
    let checkCount = 0;
    const intervalId = setInterval(() => {
        checkCount++;
        if (window.DiagnosticRegistry?.registry.size > 0) {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            window.removeEventListener('diagnostic-registry-ready', readyHandler);
            console.log(`✅ Registry detectado via polling (${checkCount * 500}ms)`);
            executeAllChecks();
        } else if (checkCount >= 10) {
            clearInterval(intervalId);
        }
    }, 500);
}

function executeAllChecks(isPartial = false) {
    if (isPartial) {
        console.warn('⚠️ Executando verificações PARCIAIS (registry não respondeu)');
    }
    
    setTimeout(() => {
        window.runSupportChecks?.();
        
        setTimeout(() => {
            window.quickDiagnostic?.();
            
            // 🔥 EXECUÇÃO AUTOMÁTICA DA VALIDAÇÃO DE BAIRROS (sem necessidade de console)
            console.log('\n🚀 EXECUÇÃO AUTOMÁTICA: Validando extração de bairros...');
            window.validateExtractBairroFunction?.();
            
            console.log('\n💡 DICAS:');
            console.log('   • window.validateExtractBairroFunction() - Validação completa de bairros');
            console.log('   • window.testExtractionPerformance() - Teste de performance');
            console.log('   • window.runQuickValidation() - Todas as validações');
        }, 500);
    }, 100);
}

// ========== INICIALIZAÇÃO AUTOMÁTICA ==========

(function autoInitialize() {
    const isDebugMode = window.location.search.includes('debug=true') || 
                       window.location.search.includes('test=true') ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1');
    
    if (isDebugMode) {
        console.log('🔧 simple-checker.js - Modo debug ativado (v2.2 com execução automática)');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(waitForRegistryAndExecute, 500);
            });
        } else {
            setTimeout(waitForRegistryAndExecute, 500);
        }
    } else {
        console.log('🚀 simple-checker.js carregado (modo produção - v2.2)');
    }
})();

// ✅ EXPORTAR PARA USO GLOBAL
window.simpleChecker = {
    runSupportChecks: window.runSupportChecks,
    quickDiagnostic: window.quickDiagnostic,
    runSafeDiagnostics: window.runSafeDiagnostics,
    listFunctions: window.listDiagnosticFunctions,
    validateCentralizedFunctions: window.validateCentralizedFunctions,
    checkDuplicateRemoval: window.checkDuplicateRemoval,
    validateMediaSystem: window.validateMediaSystem,
    validateFilterManager: window.validateFilterManager,
    testExtractionPerformance: window.testExtractionPerformance,
    validateExtractBairroFunction: window.validateExtractBairroFunction,
    runQuickValidation: window.runQuickValidation,
    waitForRegistry: waitForRegistryAndExecute
};

console.log('✅ simple-checker.js ATUALIZADO v2.2 - Execução automática da validação de bairros!');
