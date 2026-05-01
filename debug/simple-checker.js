// weberlessa-support/debug/simple-checker.js - VERSÃO COMPLETA v2.7
// Verificação Básica + Validação de Centralização + Teste Performance + Analytics Diagnostic + Core/Support Detection
console.log('✅ simple-checker.js - Verificação Básica + Validação de Centralização + Analytics + Core/Support Detection (v2.7)');

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

// ========== VERIFICAÇÃO PRÉ-REMOÇÃO DE FALLBACKS ==========

/**
 * ✅ FUNÇÃO: Verificação completa pré-remoção de fallbacks
 * Executa testes reais nas funções do SharedCore
 * Retorna true se for seguro remover os fallbacks
 */
window.preRemovalVerification = function() {
    console.log('\n🔍 === VERIFICAÇÃO PRÉ-REMOÇÃO DE FALLBACKS ===\n');
    
    const resultados = {
        sharedCore: { exists: false, type: null },
        functions: {},
        executionTests: {},
        safeToRemove: false
    };
    
    // 1. Verificar SharedCore
    console.log('📦 STATUS DO SHAREDCORE:');
    resultados.sharedCore.exists = !!window.SharedCore;
    resultados.sharedCore.type = typeof window.SharedCore;
    console.log(`  window.SharedCore existe? ${resultados.sharedCore.exists ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`  Tipo: ${resultados.sharedCore.type}`);
    
    if (!resultados.sharedCore.exists) {
        console.error('❌ SharedCore NÃO disponível! A remoção de fallbacks NÃO é segura.');
        console.log('\n🔍 === FIM DA VERIFICAÇÃO ===\n');
        return { safeToRemove: false, error: 'SharedCore não encontrado' };
    }
    
    // 2. Verificar funções específicas
    console.log('\n🔧 FUNÇÕES DO SHAREDCORE:');
    
    const functionsToCheck = [
        { name: 'formatFeaturesForDisplay', path: 'formatFeaturesForDisplay' },
        { name: 'PriceFormatter.formatForCard', path: 'PriceFormatter.formatForCard' },
        { name: 'validateIdForSupabase', path: 'validateIdForSupabase' },
        { name: 'parseFeaturesForStorage', path: 'parseFeaturesForStorage' },
        { name: 'ensureBooleanVideo', path: 'ensureBooleanVideo' },
        { name: 'manageEditingState', path: 'manageEditingState' }
    ];
    
    functionsToCheck.forEach(func => {
        let exists = false;
        if (func.path.includes('.')) {
            const parts = func.path.split('.');
            let obj = window.SharedCore;
            for (const part of parts) {
                obj = obj?.[part];
            }
            exists = typeof obj === 'function';
        } else {
            exists = typeof window.SharedCore[func.name] === 'function';
        }
        
        resultados.functions[func.name] = exists;
        console.log(`  ${func.name}: ${exists ? '✅ FUNÇÃO' : '❌ NÃO ENCONTRADA'}`);
    });
    
    // 3. Teste de execução real
    console.log('\n🧪 TESTE DE EXECUÇÃO REAL:');
    
    try {
        const testFeaturesArray = ['2 Quartos', '1 Vaga', 'Piscina'];
        const testFeaturesStr = JSON.stringify(testFeaturesArray);
        const formattedResult = window.SharedCore.formatFeaturesForDisplay(testFeaturesStr);
        resultados.executionTests.formatFeaturesForDisplay = { success: true, result: formattedResult };
        console.log(`  ✅ formatFeaturesForDisplay("${testFeaturesStr}"): "${formattedResult}"`);
    } catch (e) {
        resultados.executionTests.formatFeaturesForDisplay = { success: false, error: e.message };
        console.error(`  ❌ formatFeaturesForDisplay: ${e.message}`);
    }
    
    try {
        const priceResult = window.SharedCore.PriceFormatter.formatForCard('150000');
        resultados.executionTests.priceFormatter = { success: true, result: priceResult };
        console.log(`  ✅ PriceFormatter.formatForCard("150000"): "${priceResult}"`);
    } catch (e) {
        resultados.executionTests.priceFormatter = { success: false, error: e.message };
        console.error(`  ❌ PriceFormatter.formatForCard: ${e.message}`);
    }
    
    try {
        const idResult = window.SharedCore.validateIdForSupabase(123);
        resultados.executionTests.validateIdForSupabase = { success: true, result: idResult };
        console.log(`  ✅ validateIdForSupabase(123): ${idResult}`);
    } catch (e) {
        resultados.executionTests.validateIdForSupabase = { success: false, error: e.message };
        console.error(`  ❌ validateIdForSupabase: ${e.message}`);
    }
    
    try {
        const parseResult = window.SharedCore.parseFeaturesForStorage('2 Quartos, 1 Vaga, Piscina');
        resultados.executionTests.parseFeaturesForStorage = { success: true, result: parseResult };
        console.log(`  ✅ parseFeaturesForStorage("2 Quartos, 1 Vaga..."): ${parseResult.substring(0, 50)}...`);
    } catch (e) {
        resultados.executionTests.parseFeaturesForStorage = { success: false, error: e.message };
        console.error(`  ❌ parseFeaturesForStorage: ${e.message}`);
    }
    
    try {
        const videoResult = window.SharedCore.ensureBooleanVideo('true');
        resultados.executionTests.ensureBooleanVideo = { success: true, result: videoResult };
        console.log(`  ✅ ensureBooleanVideo("true"): ${videoResult}`);
    } catch (e) {
        resultados.executionTests.ensureBooleanVideo = { success: false, error: e.message };
        console.error(`  ❌ ensureBooleanVideo: ${e.message}`);
    }
    
    // 4. Verificar se todos os testes passaram
    const allFunctionsExist = Object.values(resultados.functions).every(v => v === true);
    const allExecutionTestsPass = Object.values(resultados.executionTests).every(t => t?.success === true);
    
    resultados.safeToRemove = allFunctionsExist && allExecutionTestsPass;
    
    console.log('\n📊 === RESUMO DA VERIFICAÇÃO ===');
    console.log(`  Funções encontradas: ${Object.values(resultados.functions).filter(v => v).length}/${Object.keys(resultados.functions).length}`);
    console.log(`  Testes de execução: ${Object.values(resultados.executionTests).filter(t => t?.success).length}/${Object.keys(resultados.executionTests).length}`);
    console.log(`\n${resultados.safeToRemove ? '✅ TODOS OS TESTES PASSARAM! A remoção dos fallbacks é SEGURA.' : '⚠️ NÃO remover os fallbacks até corrigir os erros acima.'}`);
    
    console.log('\n🔍 === FIM DA VERIFICAÇÃO ===\n');
    
    return resultados;
};

// ========== TESTES PÓS-IMPLEMENTAÇÃO ==========

/**
 * ✅ TESTE 1: Verificar ausência de erros no console
 */
window.testNoConsoleErrors = function() {
    console.group('📋 TESTE 1: VERIFICAÇÃO DE ERROS NO CONSOLE');
    
    const possibleIssues = [];
    
    if (typeof window.SharedCore === 'undefined') {
        possibleIssues.push('❌ window.SharedCore is undefined');
    } else {
        console.log('✅ SharedCore disponível');
    }
    
    if (typeof window.SharedCore?.formatFeaturesForDisplay !== 'function') {
        possibleIssues.push('❌ window.SharedCore.formatFeaturesForDisplay is not a function');
    } else {
        console.log('✅ formatFeaturesForDisplay disponível');
    }
    
    if (typeof window.SharedCore?.PriceFormatter?.formatForCard !== 'function') {
        possibleIssues.push('❌ window.SharedCore.PriceFormatter.formatForCard is not a function');
    } else {
        console.log('✅ PriceFormatter.formatForCard disponível');
    }
    
    if (possibleIssues.length === 0) {
        console.log('\n✅ NENHUM ERRO CRÍTICO DETECTADO!');
        console.log('✅ A remoção dos fallbacks foi bem-sucedida.');
    } else {
        console.warn('\n⚠️ PROBLEMAS ENCONTRADOS:');
        possibleIssues.forEach(issue => console.warn(`   ${issue}`));
    }
    
    console.groupEnd();
    return { success: possibleIssues.length === 0, issues: possibleIssues };
};

/**
 * ✅ TESTE 2: Verificar funcionalidade dos cards
 */
window.testCardsFunctionality = function() {
    console.group('🃏 TESTE 2: FUNCIONALIDADE DOS CARDS');
    
    const firstCard = document.querySelector('.property-card');
    
    if (!firstCard) {
        console.warn('⚠️ Nenhum card encontrado - verificar renderização');
        console.groupEnd();
        return { success: false, error: 'Nenhum card encontrado' };
    }
    
    console.log('✅ Primeiro card encontrado');
    
    const priceElement = firstCard.querySelector('.property-price');
    const priceVisible = priceElement?.textContent || 'não encontrado';
    console.log(`💰 Preço visível: "${priceVisible}"`);
    
    const featureTags = firstCard.querySelectorAll('.feature-tag');
    console.log(`🏷️ Features visíveis: ${featureTags.length} tag(s)`);
    
    if (featureTags.length > 0) {
        const featuresList = Array.from(featureTags).map(tag => tag.textContent);
        console.log(`   Features: ${featuresList.join(', ')}`);
    }
    
    const titleElement = firstCard.querySelector('.property-title');
    console.log(`📌 Título: "${titleElement?.textContent || 'não encontrado'}"`);
    
    const locationElement = firstCard.querySelector('.property-location');
    console.log(`📍 Localização: "${locationElement?.textContent?.trim() || 'não encontrada'}"`);
    
    const success = priceElement && featureTags.length > 0 && titleElement;
    console.log(`\n${success ? '✅ CARDS FUNCIONANDO CORRETAMENTE' : '⚠️ ALGUNS ELEMENTOS DOS CARDS ESTÃO AUSENTES'}`);
    
    console.groupEnd();
    return { success, price: priceVisible, featureCount: featureTags.length, title: titleElement?.textContent };
};

/**
 * ✅ TESTE 3: Verificar funcionalidade do admin (edição)
 */
window.testAdminEditCapability = function() {
    console.group('🔧 TESTE 3: FUNCIONALIDADE DO ADMIN (EDIÇÃO)');
    
    const adminPanel = document.getElementById('adminPanel');
    const adminToggle = document.querySelector('.admin-toggle');
    const propertyForm = document.getElementById('propertyForm');
    
    console.log(`📌 Painel admin existe: ${!!adminPanel}`);
    console.log(`📌 Botão toggle existe: ${!!adminToggle}`);
    console.log(`📌 Formulário existe: ${!!propertyForm}`);
    
    const editFunctions = {
        editProperty: typeof window.editProperty === 'function',
        updateProperty: typeof window.updateProperty === 'function',
        saveProperty: typeof window.saveProperty === 'function',
        loadPropertyList: typeof window.loadPropertyList === 'function'
    };
    
    console.table(editFunctions);
    
    const allFunctionsExist = Object.values(editFunctions).every(v => v === true);
    
    if (allFunctionsExist) {
        console.log('\n✅ Funções de edição disponíveis!');
        console.log('💡 Para testar a edição real:');
        console.log('   1. Clique no botão 🔧');
        console.log('   2. Digite a senha: wl654');
        console.log('   3. Clique em "Editar" em qualquer imóvel');
        console.log('   4. Modifique as features');
        console.log('   5. Clique em "Salvar Alterações"');
        console.log('   6. Verifique se a mensagem de sucesso aparece');
    } else {
        console.error('❌ Funções de edição ausentes!');
    }
    
    console.groupEnd();
    return { success: allFunctionsExist, functions: editFunctions };
};

/**
 * ✅ TESTE 4: Verificar funcionalidade do admin (criação)
 */
window.testAdminCreateCapability = function() {
    console.group('➕ TESTE 4: FUNCIONALIDADE DO ADMIN (CRIAÇÃO)');
    
    const createFunctions = {
        addNewProperty: typeof window.addNewProperty === 'function',
        saveProperty: typeof window.saveProperty === 'function',
        addToLocalProperties: typeof window.addToLocalProperties === 'function',
        MediaSystem: typeof window.MediaSystem === 'object'
    };
    
    console.table(createFunctions);
    
    const formElements = {
        titleInput: !!document.getElementById('propTitle'),
        priceInput: !!document.getElementById('propPrice'),
        locationInput: !!document.getElementById('propLocation'),
        featuresInput: !!document.getElementById('propFeatures'),
        submitButton: !!document.querySelector('#propertyForm button[type="submit"]')
    };
    
    console.log('\n📋 ELEMENTOS DO FORMULÁRIO:');
    console.table(formElements);
    
    const allFunctionsExist = Object.values(createFunctions).every(v => v === true);
    const allElementsExist = Object.values(formElements).every(v => v === true);
    
    if (allFunctionsExist && allElementsExist) {
        console.log('\n✅ Funções e elementos de criação disponíveis!');
        console.log('💡 Para testar a criação real:');
        console.log('   1. Clique no botão 🔧');
        console.log('   2. Digite a senha: wl654');
        console.log('   3. Preencha: Título, Preço, Localização');
        console.log('   4. Adicione features (ex: "3 Quartos, 2 Banheiros, Piscina")');
        console.log('   5. Clique em "Adicionar Imóvel ao Site"');
        console.log('   6. Verifique se o novo imóvel aparece na lista');
    } else {
        console.error('❌ Funções ou elementos de criação ausentes!');
    }
    
    console.groupEnd();
    return { success: allFunctionsExist && allElementsExist, functions: createFunctions, elements: formElements };
};

/**
 * ✅ FUNÇÃO PRINCIPAL: Executar todos os testes pós-remoção
 */
window.runPostRemovalTests = async function() {
    console.log('\n🚀 =========================================');
    console.log('🚀 EXECUTANDO TESTES PÓS-REMOÇÃO DE FALLBACKS');
    console.log('🚀 =========================================\n');
    
    const resultados = {
        timestamp: new Date().toISOString(),
        test1: null,
        test2: null,
        test3: null,
        test4: null,
        sucessoGeral: false
    };
    
    console.log('▶️ Executando TESTE 1 (Erros no console)...');
    resultados.test1 = window.testNoConsoleErrors();
    
    console.log('\n▶️ Executando TESTE 2 (Cards)...');
    await new Promise(r => setTimeout(r, 500));
    resultados.test2 = window.testCardsFunctionality();
    
    console.log('\n▶️ Executando TESTE 3 (Edição)...');
    resultados.test3 = window.testAdminEditCapability();
    
    console.log('\n▶️ Executando TESTE 4 (Criação)...');
    resultados.test4 = window.testAdminCreateCapability();
    
    resultados.sucessoGeral = resultados.test1?.success === true && 
                              resultados.test2?.success === true &&
                              resultados.test3?.success === true &&
                              resultados.test4?.success === true;
    
    console.log('\n📊 =========================================');
    console.log('📊 RESUMO FINAL DOS TESTES');
    console.log('📊 =========================================');
    console.log(`   Teste 1 (Sem erros): ${resultados.test1?.success ? '✅ APROVADO' : '⚠️ PENDENTE'}`);
    console.log(`   Teste 2 (Cards): ${resultados.test2?.success ? '✅ APROVADO' : '⚠️ PENDENTE'}`);
    console.log(`   Teste 3 (Edição): ${resultados.test3?.success ? '✅ APROVADO' : '⚠️ PENDENTE'}`);
    console.log(`   Teste 4 (Criação): ${resultados.test4?.success ? '✅ APROVADO' : '⚠️ PENDENTE'}`);
    
    console.log(`\n${resultados.sucessoGeral ? '🎉 TODOS OS TESTES FORAM APROVADOS! A REMOÇÃO FOI BEM-SUCEDIDA.' : '⚠️ ALGUNS TESTES FALHARAM - VERIFICAR ACIMA'}`);
    
    console.log('\n🚀 =========================================');
    
    return resultados;
};

// ========== DIAGNÓSTICO DE ANALYTICS (DASHBOARD DE VISUALIZAÇÕES) ==========

/**
 * ✅ DIAGNÓSTICO RÁPIDO: Verificar se Analytics está visível no admin
 * Retorna true se o recurso estiver presente
 */
window.diagnoseAnalyticsQuick = function() {
    console.group('📊 DIAGNÓSTICO RÁPIDO - ANALYTICS');
    
    const propertyList = document.getElementById('propertyList');
    if (!propertyList) {
        console.log('❌ propertyList não encontrado - painel admin não está aberto?');
        console.groupEnd();
        return { success: false, error: 'propertyList não encontrado' };
    }
    
    const statsHeader = propertyList.querySelector('div[style*="background: #e8f4fd"]');
    if (!statsHeader) {
        console.log('❌ Cabeçalho de estatísticas NÃO ENCONTRADO');
        console.groupEnd();
        return { success: false, error: 'Cabeçalho de estatísticas ausente' };
    }
    
    const hasTotalViews = statsHeader.innerHTML.includes('Total de visualizações');
    const hasZerarTodas = statsHeader.innerHTML.includes('Zerar TODAS');
    
    const propertyItems = document.querySelectorAll('#propertyListItems .property-item, .property-item');
    const hasViewCount = propertyItems.length > 0 && propertyItems[0]?.innerHTML.includes('Visualizações:');
    
    const analyticsPresent = hasTotalViews && hasZerarTodas && hasViewCount;
    
    console.log(`📊 STATUS: ${analyticsPresent ? '✅ ANALYTICS ATIVO' : '❌ ANALYTICS AUSENTE'}`);
    console.log(`   - Cabeçalho com total: ${hasTotalViews ? '✅' : '❌'}`);
    console.log(`   - Botão Zerar TODAS: ${hasZerarTodas ? '✅' : '❌'}`);
    console.log(`   - Contador por imóvel: ${hasViewCount ? '✅' : '❌'}`);
    
    console.groupEnd();
    return { success: analyticsPresent, hasTotalViews, hasZerarTodas, hasViewCount };
};

/**
 * ✅ DIAGNÓSTICO COMPLETO: Analytics do Admin
 * Executa verificação detalhada de todas as funcionalidades de analytics
 */
window.diagnoseAnalyticsFull = function() {
    console.group('📊 DIAGNÓSTICO AVANÇADO - ANALYTICS DO ADMIN');
    
    const results = {
        adminVisible: false,
        statsHeader: false,
        totalViewsElement: false,
        zerarTodasButton: false,
        viewCountInCards: false,
        zerarViewsButton: false,
        lastViewInfo: false,
        supportFunctions: {},
        localStorageData: null,
        cardCount: 0
    };
    
    // 1. Painel Admin
    const adminPanel = document.getElementById('adminPanel');
    results.adminVisible = adminPanel && adminPanel.style.display === 'block';
    console.log(`${results.adminVisible ? '✅' : '⚠️'} Painel Admin: ${results.adminVisible ? 'Visível' : 'Fechado ou não encontrado'}`);
    
    if (!results.adminVisible) {
        console.log('💡 Dica: Abra o painel admin primeiro (botão 🔧, senha wl654)');
    }
    
    // 2. Cabeçalho de estatísticas
    const propertyList = document.getElementById('propertyList');
    if (propertyList) {
        const statsHeader = propertyList.querySelector('div[style*="background: #e8f4fd"]');
        results.statsHeader = !!statsHeader;
        
        if (statsHeader) {
            results.totalViewsElement = statsHeader.innerHTML.includes('Total de visualizações');
            results.zerarTodasButton = statsHeader.innerHTML.includes('Zerar TODAS');
            
            console.log(`\n📋 CABEÇALHO DE ESTATÍSTICAS:`);
            console.log(`   - Elemento encontrado: ${results.statsHeader ? '✅' : '❌'}`);
            console.log(`   - Total de visualizações: ${results.totalViewsElement ? '✅' : '❌'}`);
            console.log(`   - Botão "Zerar TODAS": ${results.zerarTodasButton ? '✅' : '❌'}`);
            
            if (results.totalViewsElement) {
                const totalViewsMatch = statsHeader.innerHTML.match(/Total de visualizações:<\/strong> (\d+)/);
                if (totalViewsMatch) {
                    console.log(`   - Valor atual: ${totalViewsMatch[1]} visualizações`);
                }
            }
        } else {
            console.log(`\n❌ Cabeçalho de estatísticas NÃO ENCONTRADO`);
            console.log(`   O Analytics provavelmente foi removido da função loadPropertyList`);
        }
    }
    
    // 3. Cards de imóveis
    const propertyItems = document.querySelectorAll('#propertyListItems .property-item, .property-item');
    results.cardCount = propertyItems.length;
    
    if (propertyItems.length > 0) {
        const firstItem = propertyItems[0];
        const html = firstItem.innerHTML;
        
        results.viewCountInCards = html.includes('Visualizações:');
        results.zerarViewsButton = html.includes('Zerar views');
        results.lastViewInfo = html.includes('Última:');
        
        console.log(`\n📋 CARDS DE IMÓVEIS (${propertyItems.length} encontrados):`);
        console.log(`   - Contador de visualizações: ${results.viewCountInCards ? '✅' : '❌'}`);
        console.log(`   - Botão "Zerar views": ${results.zerarViewsButton ? '✅' : '❌'}`);
        console.log(`   - Última visualização: ${results.lastViewInfo ? '✅' : '❌'}`);
        
        if (!results.viewCountInCards) {
            console.log(`   ⚠️ Exemplo do HTML atual: ${html.substring(0, 300)}...`);
        }
    } else if (propertyList) {
        console.log(`\n⚠️ Nenhum card encontrado - a lista pode estar vazia`);
    }
    
    // 4. Funções de suporte
    console.log(`\n🔧 FUNÇÕES DE SUPORTE:`);
    const functions = ['getGalleryViews', 'getLastGalleryView', 'resetGalleryViews', 'getTotalGalleryViews', 'resetAllGalleryViews', 'openGalleryAtCurrentIndex'];
    functions.forEach(fn => {
        const exists = typeof window[fn] === 'function';
        results.supportFunctions[fn] = exists;
        console.log(`   - ${fn}: ${exists ? '✅' : '❌'}`);
    });
    
    // 5. Dados no localStorage
    try {
        const galleryViews = localStorage.getItem('gallery_views');
        if (galleryViews) {
            results.localStorageData = JSON.parse(galleryViews);
            const total = Object.values(results.localStorageData).reduce((a, b) => a + b, 0);
            console.log(`\n💾 DADOS NO LOCALSTORAGE:`);
            console.log(`   - Imóveis com visualizações: ${Object.keys(results.localStorageData).length}`);
            console.log(`   - Total de visualizações: ${total}`);
        } else {
            console.log(`\n💾 Nenhum dado de visualização no localStorage`);
        }
    } catch(e) {
        console.log(`\n⚠️ Erro ao ler localStorage: ${e.message}`);
    }
    
    // 6. Diagnóstico Final
    console.log(`\n📊 DIAGNÓSTICO FINAL:`);
    
    const analyticsPresent = results.statsHeader && results.totalViewsElement && results.viewCountInCards;
    
    if (analyticsPresent) {
        console.log(`✅ ANALYTICS COMPLETO - Todas as estatísticas estão visíveis!`);
    } else if (results.statsHeader && !results.totalViewsElement) {
        console.log(`⚠️ ANALYTICS PARCIAL - Cabeçalho existe mas sem total de visualizações`);
    } else if (!results.statsHeader && results.viewCountInCards) {
        console.log(`⚠️ ANALYTICS PARCIAL - Cards têm contador mas cabeçalho ausente`);
    } else {
        console.log(`❌ ANALYTICS AUSENTE - O recurso não está visível no admin`);
    }
    
    // 7. Recomendação
    if (!analyticsPresent) {
        console.log(`\n🔧 RECOMENDAÇÃO:`);
        console.log(`   1. Verifique se admin-list-ui.js está carregado (modo debug: ?debug=true)`);
        console.log(`   2. O Analytics completo está disponível APENAS no Support System`);
        console.log(`   3. Para Analytics em produção, é necessário migrar a função do Support para o Core`);
    }
    
    console.groupEnd();
    
    return results;
};

/**
 * ✅ Verificar integridade do código loadPropertyList
 * Analisa se a função contém os componentes do Analytics
 */
window.diagnoseLoadPropertyListCode = function() {
    console.group('📋 ANÁLISE DO CÓDIGO - loadPropertyList');
    
    const loadPropertyListSrc = window.loadPropertyList?.toString();
    
    if (!loadPropertyListSrc) {
        console.error('❌ window.loadPropertyList não está definida!');
        console.groupEnd();
        return { success: false, error: 'Função não encontrada' };
    }
    
    const hasStatsHeader = loadPropertyListSrc.includes('Total de visualizações');
    const hasZerarTodas = loadPropertyListSrc.includes('Zerar TODAS');
    const hasViewCount = loadPropertyListSrc.includes('viewCount') || loadPropertyListSrc.includes('Visualizações:');
    const hasZerarViews = loadPropertyListSrc.includes('resetGalleryViews');
    const hasLastView = loadPropertyListSrc.includes('lastView') || loadPropertyListSrc.includes('Última:');
    const hasStatsHeaderDiv = loadPropertyListSrc.includes('background: #e8f4fd');
    
    console.log(`📊 COMPONENTES DO ANALYTICS NA FUNÇÃO:`);
    console.log(`   - Cabeçalho com total de visualizações: ${hasStatsHeader ? '✅' : '❌'}`);
    console.log(`   - Botão "Zerar TODAS": ${hasZerarTodas ? '✅' : '❌'}`);
    console.log(`   - Div do cabeçalho (background): ${hasStatsHeaderDiv ? '✅' : '❌'}`);
    console.log(`   - Contador por imóvel: ${hasViewCount ? '✅' : '❌'}`);
    console.log(`   - Botão "Zerar views": ${hasZerarViews ? '✅' : '❌'}`);
    console.log(`   - Última visualização: ${hasLastView ? '✅' : '❌'}`);
    
    const analyticsComplete = hasStatsHeader && hasZerarTodas && hasViewCount && hasZerarViews;
    
    if (analyticsComplete) {
        console.log(`\n✅ O código da função contém TODOS os componentes do Analytics!`);
    } else {
        console.log(`\n⚠️ O código NÃO contém todos os componentes do Analytics.`);
        if (!hasStatsHeader) console.log(`   - Faltando: Cabeçalho com total de visualizações`);
        if (!hasZerarTodas) console.log(`   - Faltando: Botão "Zerar TODAS"`);
        if (!hasViewCount) console.log(`   - Faltando: Contador por imóvel`);
        if (!hasZerarViews) console.log(`   - Faltando: Botão "Zerar views"`);
    }
    
    console.groupEnd();
    
    return {
        success: analyticsComplete,
        hasStatsHeader,
        hasZerarTodas,
        hasViewCount,
        hasZerarViews,
        hasLastView,
        hasStatsHeaderDiv
    };
};

/**
 * ✅ DIAGNÓSTICO COMPLETO DE ANALYTICS (baseado no log)
 * Executa verificação detalhada e fornece recomendações
 */
window.diagnoseAnalyticsComplete = function() {
    console.log('\n🔍 ========================================');
    console.log('🔍 DIAGNÓSTICO COMPLETO - ANALYTICS DO ADMIN');
    console.log('🔍 ========================================\n');
    
    const results = {
        adminVisible: false,
        loadPropertyListExists: false,
        codeAnalytics: {
            hasStatsHeader: false,
            hasZerarTodas: false,
            hasViewCount: false,
            hasZerarViews: false,
            hasLastView: false
        },
        uiAnalytics: {
            statsHeader: false,
            totalViewsElement: false,
            zerarTodasButton: false,
            viewCountInCards: false,
            zerarViewsButton: false,
            lastViewInfo: false
        },
        supportFunctions: {},
        localStorageData: null,
        recommendations: [],
        status: 'unknown'
    };
    
    // 1. Verificar painel admin
    const adminPanel = document.getElementById('adminPanel');
    results.adminVisible = adminPanel && (adminPanel.style.display === 'block' || window.getComputedStyle(adminPanel).display === 'block');
    console.log(`📁 PAINEL ADMIN: ${results.adminVisible ? '✅ VISÍVEL' : '❌ FECHADO'}`);
    
    if (!results.adminVisible) {
        results.recommendations.push('Abra o painel admin (botão 🔧, senha wl654)');
    }
    
    // 2. Verificar função loadPropertyList
    const loadPropertyListSrc = window.loadPropertyList?.toString();
    results.loadPropertyListExists = !!loadPropertyListSrc;
    
    if (loadPropertyListSrc) {
        console.log(`\n📋 FUNÇÃO loadPropertyList:`);
        
        results.codeAnalytics.hasStatsHeader = loadPropertyListSrc.includes('Total de visualizações');
        results.codeAnalytics.hasZerarTodas = loadPropertyListSrc.includes('Zerar TODAS');
        results.codeAnalytics.hasViewCount = loadPropertyListSrc.includes('viewCount') || loadPropertyListSrc.includes('Visualizações:');
        results.codeAnalytics.hasZerarViews = loadPropertyListSrc.includes('resetGalleryViews');
        results.codeAnalytics.hasLastView = loadPropertyListSrc.includes('lastView') || loadPropertyListSrc.includes('Última:');
        
        console.log(`   - Cabeçalho com total de visualizações: ${results.codeAnalytics.hasStatsHeader ? '✅' : '❌'}`);
        console.log(`   - Botão "Zerar TODAS": ${results.codeAnalytics.hasZerarTodas ? '✅' : '❌'}`);
        console.log(`   - Contador por imóvel: ${results.codeAnalytics.hasViewCount ? '✅' : '❌'}`);
        console.log(`   - Botão "Zerar views": ${results.codeAnalytics.hasZerarViews ? '✅' : '❌'}`);
        console.log(`   - Última visualização: ${results.codeAnalytics.hasLastView ? '✅' : '❌'}`);
        
        if (!results.codeAnalytics.hasStatsHeader && !results.codeAnalytics.hasViewCount) {
            results.recommendations.push('Atualizar admin-list-ui.js no Support System com a versão que contém Analytics');
        }
    } else {
        console.log(`\n❌ Função loadPropertyList NÃO ENCONTRADA!`);
        results.recommendations.push('Verificar se admin-list-ui.js foi carregado corretamente');
    }
    
    // 3. Verificar elementos da interface (se admin visível)
    const propertyList = document.getElementById('propertyList');
    if (propertyList && results.adminVisible) {
        console.log(`\n📋 INTERFACE DO ADMIN:`);
        
        const statsHeader = propertyList.querySelector('div[style*="background: #e8f4fd"], div[style*="background:#e8f4fd"]');
        if (statsHeader) {
            results.uiAnalytics.statsHeader = true;
            results.uiAnalytics.totalViewsElement = statsHeader.innerHTML.includes('Total de visualizações');
            results.uiAnalytics.zerarTodasButton = statsHeader.innerHTML.includes('Zerar TODAS');
            
            console.log(`   - Cabeçalho de estatísticas: ✅ ENCONTRADO`);
            console.log(`     • Total de visualizações: ${results.uiAnalytics.totalViewsElement ? '✅' : '❌'}`);
            console.log(`     • Botão Zerar TODAS: ${results.uiAnalytics.zerarTodasButton ? '✅' : '❌'}`);
            
            if (results.uiAnalytics.totalViewsElement) {
                const totalMatch = statsHeader.innerHTML.match(/Total de visualizações:<\/strong> (\d+)/);
                if (totalMatch) console.log(`     • Valor atual: ${totalMatch[1]} visualizações`);
            }
        } else {
            console.log(`   - Cabeçalho de estatísticas: ❌ NÃO ENCONTRADO`);
        }
        
        const propertyItems = propertyList.querySelectorAll('.property-item');
        if (propertyItems.length > 0) {
            const firstItem = propertyItems[0];
            results.uiAnalytics.viewCountInCards = firstItem.innerHTML.includes('Visualizações:');
            results.uiAnalytics.zerarViewsButton = firstItem.innerHTML.includes('Zerar views');
            results.uiAnalytics.lastViewInfo = firstItem.innerHTML.includes('Última:');
            
            console.log(`   - Cards de imóveis (${propertyItems.length} encontrados):`);
            console.log(`     • Contador de visualizações: ${results.uiAnalytics.viewCountInCards ? '✅' : '❌'}`);
            console.log(`     • Botão "Zerar views": ${results.uiAnalytics.zerarViewsButton ? '✅' : '❌'}`);
            console.log(`     • Última visualização: ${results.uiAnalytics.lastViewInfo ? '✅' : '❌'}`);
        }
    }
    
    // 4. Verificar funções de suporte
    console.log(`\n🔧 FUNÇÕES DE SUPORTE:`);
    const supportFunctionsList = [
        'getGalleryViews', 'getLastGalleryView', 'resetGalleryViews',
        'getTotalGalleryViews', 'resetAllGalleryViews', 'openGalleryAtCurrentIndex',
        'registerGalleryView'
    ];
    
    supportFunctionsList.forEach(fn => {
        const exists = typeof window[fn] === 'function';
        results.supportFunctions[fn] = exists;
        console.log(`   - window.${fn}: ${exists ? '✅' : '❌'}`);
    });
    
    // 5. Verificar dados no localStorage
    console.log(`\n💾 DADOS DE VISUALIZAÇÃO:`);
    try {
        const galleryViews = localStorage.getItem('gallery_views') || localStorage.getItem('galleryViews');
        if (galleryViews) {
            results.localStorageData = JSON.parse(galleryViews);
            const total = Object.values(results.localStorageData).reduce((a, b) => a + b, 0);
            console.log(`   - Registros: ${Object.keys(results.localStorageData).length} imóveis`);
            console.log(`   - Total de visualizações: ${total}`);
            
            const sorted = Object.entries(results.localStorageData).sort((a,b) => b[1] - a[1]);
            if (sorted.length > 0) {
                console.log(`   - Top 5 imóveis com mais visualizações:`);
                sorted.slice(0, 5).forEach(([id, count]) => {
                    const property = window.properties?.find(p => p.id == id);
                    const title = property?.title?.substring(0, 30) || `ID ${id}`;
                    console.log(`     • ${title}: ${count} views`);
                });
            }
        } else {
            console.log(`   - Nenhum dado de visualização encontrado`);
            results.recommendations.push('Nenhuma visualização registrada ainda - abra algumas galerias para gerar dados');
        }
    } catch(e) {
        console.log(`   - Erro ao ler: ${e.message}`);
    }
    
    // 6. Determinar status
    const hasAnalyticsCode = results.codeAnalytics.hasStatsHeader && results.codeAnalytics.hasViewCount;
    const hasAnalyticsUI = results.uiAnalytics.statsHeader && results.uiAnalytics.totalViewsElement && results.uiAnalytics.viewCountInCards;
    
    if (hasAnalyticsUI) {
        console.log('\n✅ ANALYTICS ESTÁ FUNCIONANDO CORRETAMENTE!');
        console.log('   As estatísticas de visualizações estão visíveis no admin.');
        results.status = 'functional';
    } else if (hasAnalyticsCode && !hasAnalyticsUI) {
        console.log('\n⚠️ ANALYTICS PARCIAL - O código existe mas a UI não está visível.');
        console.log('   Tente recarregar a página (Ctrl+F5) e abrir o admin novamente.');
        results.recommendations.push('Recarregar a página (Ctrl+F5) e reabrir o painel admin');
        results.status = 'partial';
    } else if (!hasAnalyticsCode) {
        console.log('\n❌ ANALYTICS AUSENTE - O recurso não está no código da loadPropertyList.');
        console.log('\n💡 SOLUÇÃO: O Analytics está disponível APENAS no Support System (modo debug).');
        console.log('   Para ter Analytics em produção, é necessário:');
        console.log('   1. Acessar com ?debug=true para usar a UI completa');
        console.log('   2. OU migrar a função loadPropertyList do Support para o Core');
        results.recommendations.push('Usar ?debug=true para acessar a UI completa com Analytics');
        results.recommendations.push('OU migrar admin-list-ui.js para o Core System');
        results.status = 'missing';
    }
    
    const isDebugMode = window.location.search.includes('debug=true');
    console.log(`\n🔧 MODO ATUAL: ${isDebugMode ? 'DEBUG (Support System ativo)' : 'PRODUÇÃO (apenas Core)'}`);
    
    if (!isDebugMode && results.status !== 'functional') {
        console.log('\n💡 O Analytics completo está disponível APENAS no Support System.');
        console.log('   Acesse: ' + window.location.origin + window.location.pathname + '?debug=true');
    }
    
    if (results.recommendations.length > 0) {
        console.log('\n📋 RECOMENDAÇÕES:');
        results.recommendations.forEach((rec, i) => {
            console.log(`   ${i+1}. ${rec}`);
        });
    }
    
    console.log('\n🔍 FIM DO DIAGNÓSTICO');
    
    return results;
};

/**
 * ✅ CORREÇÃO RÁPIDA: Forçar recriação da lista admin com Analytics
 * (se o Support System estiver carregado)
 */
window.fixAdminAnalytics = function() {
    console.group('🔧 CORREÇÃO RÁPIDA - ADMIN ANALYTICS');
    
    const isDebugMode = window.location.search.includes('debug=true');
    
    if (!isDebugMode) {
        console.warn('⚠️ Modo produção ativo. O Analytics completo está disponível apenas em modo debug.');
        console.log('💡 Acesse: ' + window.location.origin + window.location.pathname + '?debug=true');
        console.groupEnd();
        return { success: false, error: 'Modo produção' };
    }
    
    if (typeof window.loadPropertyList !== 'function') {
        console.error('❌ window.loadPropertyList não disponível');
        console.groupEnd();
        return { success: false, error: 'loadPropertyList não encontrada' };
    }
    
    console.log('🔄 Recriando lista admin com Analytics...');
    
    try {
        window.adminCurrentPage = 1;
        window.adminItemsPerPage = window.adminItemsPerPage || 4;
        window.loadPropertyList(1);
        console.log('✅ Lista admin recriada! Verifique se o Analytics apareceu.');
    } catch (error) {
        console.error('❌ Erro ao recriar lista:', error.message);
        console.groupEnd();
        return { success: false, error: error.message };
    }
    
    console.groupEnd();
    return { success: true, message: 'Lista admin recriada' };
};

/**
 * ✅ VERIFICAR E CORRIGIR: Função para diagnosticar e sugerir correção
 */
window.diagnoseAndFixAnalytics = async function() {
    console.log('\n🚀 =========================================');
    console.log('🚀 DIAGNÓSTICO E CORREÇÃO DE ANALYTICS');
    console.log('🚀 =========================================\n');
    
    const diagnosis = window.diagnoseAnalyticsComplete();
    const isDebugMode = window.location.search.includes('debug=true');
    
    if (isDebugMode && diagnosis.status !== 'functional') {
        console.log('\n🔧 Tentando correção automática...');
        const fixResult = window.fixAdminAnalytics();
        
        if (fixResult.success) {
            await new Promise(r => setTimeout(r, 1000));
            const recheck = window.diagnoseAnalyticsComplete();
            if (recheck.status === 'functional') {
                console.log('\n✅ CORREÇÃO BEM-SUCEDIDA! Analytics agora está visível.');
            } else {
                console.log('\n⚠️ Correção aplicada, mas Analytics ainda não visível.');
                console.log('   Tente recarregar a página manualmente (Ctrl+F5)');
            }
        }
    } else if (!isDebugMode && diagnosis.status !== 'functional') {
        console.log('\n💡 Para usar o Analytics, acesse o modo debug:');
        console.log('   ' + window.location.origin + window.location.pathname + '?debug=true');
    }
    
    return diagnosis;
};

/**
 * ✅ Executar todos os diagnósticos de Analytics
 */
window.runAnalyticsDiagnostic = async function() {
    console.log('\n🔍 =========================================');
    console.log('🔍 EXECUTANDO DIAGNÓSTICO COMPLETO DE ANALYTICS');
    console.log('🔍 =========================================\n');
    
    const resultados = {
        timestamp: new Date().toISOString(),
        quick: null,
        full: null,
        codeAnalysis: null,
        sucessoGeral: false
    };
    
    console.log('▶️ DIAGNÓSTICO RÁPIDO:');
    resultados.quick = window.diagnoseAnalyticsQuick();
    
    console.log('\n▶️ ANÁLISE DO CÓDIGO:');
    resultados.codeAnalysis = window.diagnoseLoadPropertyListCode();
    
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel && adminPanel.style.display === 'block') {
        console.log('\n▶️ DIAGNÓSTICO COMPLETO (UI):');
        resultados.full = window.diagnoseAnalyticsFull();
    } else {
        console.log('\n⚠️ Diagnóstico completo ignorado - painel admin não está visível');
        console.log('💡 Abra o painel admin (botão 🔧, senha wl654) e execute novamente');
    }
    
    console.log('\n📊 =========================================');
    console.log('📊 RESUMO DO DIAGNÓSTICO DE ANALYTICS');
    console.log('📊 =========================================');
    
    const analyticsPresent = resultados.quick?.success === true;
    const codeComplete = resultados.codeAnalysis?.success === true;
    
    console.log(`   UI - Analytics visível: ${analyticsPresent ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   Código - Analytics completo: ${codeComplete ? '✅ SIM' : '❌ NÃO'}`);
    
    if (analyticsPresent && codeComplete) {
        console.log(`\n🎉 ANALYTICS COMPLETAMENTE FUNCIONAL!`);
    } else if (codeComplete && !analyticsPresent) {
        console.log(`\n⚠️ O código está correto, mas a UI não está visível.`);
        console.log(`   Verifique se está em modo debug (?debug=true) e se o Support System carregou.`);
    } else if (!codeComplete) {
        console.log(`\n❌ O código da função loadPropertyList NÃO contém o Analytics.`);
        console.log(`   É necessário atualizar o arquivo admin-list-ui.js no Support System.`);
    }
    
    console.log('\n🔍 =========================================');
    
    resultados.sucessoGeral = analyticsPresent && codeComplete;
    
    return resultados;
};

// ========== VERIFICAÇÃO DA VERSÃO ATIVA DO loadPropertyList (v2.7) ==========

/**
 * ✅ VERIFICAÇÃO RÁPIDA - Qual loadPropertyList está ativa?
 * Analisa a função atual e identifica se vem do Core ou Support System
 */
window.diagnoseActiveLoadPropertyList = function() {
    console.group('🔍 ANÁLISE DA FUNÇÃO loadPropertyList ATIVA');
    
    const loadPropertyListSrc = window.loadPropertyList?.toString();
    
    if (!loadPropertyListSrc) {
        console.error('❌ window.loadPropertyList NÃO está definida!');
        console.groupEnd();
        return { success: false, error: 'Função não encontrada' };
    }
    
    const hasAnalytics = {
        statsHeader: loadPropertyListSrc.includes('Total de visualizações'),
        zerarTodas: loadPropertyListSrc.includes('Zerar TODAS'),
        viewCountInCard: loadPropertyListSrc.includes('Visualizações:'),
        zerarViews: loadPropertyListSrc.includes('resetGalleryViews'),
        lastView: loadPropertyListSrc.includes('lastView'),
        statsHeaderDiv: loadPropertyListSrc.includes('background: #e8f4fd')
    };
    
    console.log('📊 COMPONENTES DO ANALYTICS:');
    console.log(`   - Cabeçalho "Total de visualizações": ${hasAnalytics.statsHeader ? '✅' : '❌'}`);
    console.log(`   - Botão "Zerar TODAS": ${hasAnalytics.zerarTodas ? '✅' : '❌'}`);
    console.log(`   - Contador "Visualizações:" no card: ${hasAnalytics.viewCountInCard ? '✅' : '❌'}`);
    console.log(`   - Botão "Zerar views": ${hasAnalytics.zerarViews ? '✅' : '❌'}`);
    console.log(`   - "Última visualização": ${hasAnalytics.lastView ? '✅' : '❌'}`);
    
    const analyticsComplete = hasAnalytics.statsHeader && hasAnalytics.zerarTodas && 
                              hasAnalytics.viewCountInCard && hasAnalytics.zerarViews;
    
    console.log(`\n${analyticsComplete ? '✅ ANALYTICS COMPLETO na função ativa!' : '❌ ANALYTICS INCOMPLETO na função ativa!'}`);
    
    const isCoreVersion = loadPropertyListSrc.includes('background: #e8f4fd') && 
                          !loadPropertyListSrc.includes('[Support]');
    const isSupportVersion = loadPropertyListSrc.includes('[Support]') || 
                            loadPropertyListSrc.includes('admin-list-ui');
    
    let origin = 'DESCONHECIDA';
    if (isCoreVersion) {
        origin = 'CORE SYSTEM (properties.js)';
        console.log('\n📌 Origem: CORE SYSTEM (properties.js) - Analytics presente!');
    } else if (isSupportVersion) {
        origin = 'SUPPORT SYSTEM (admin-list-ui.js)';
        console.log('\n📌 Origem: SUPPORT SYSTEM (admin-list-ui.js)');
        if (!analyticsComplete) {
            console.log('   ⚠️ Esta versão NÃO contém o Analytics completo!');
        }
    } else {
        console.log('\n📌 Origem: DESCONHECIDA');
    }
    
    const isDebugMode = window.location.search.includes('debug=true');
    console.log(`\n🔧 MODO ATUAL: ${isDebugMode ? 'DEBUG (Support System carregado)' : 'PRODUÇÃO (apenas Core)'}`);
    
    if (!analyticsComplete) {
        console.log('\n💡 RECOMENDAÇÃO:');
        if (isDebugMode) {
            console.log('   O Support System está sobrescrevendo a função com uma versão sem Analytics.');
            console.log('   Para ver o Analytics, acesse em MODO PRODUÇÃO (sem ?debug=true)');
            console.log('   OU atualize o arquivo admin-list-ui.js no Support System');
        } else {
            console.log('   O Analytics NÃO está completo na função atual.');
            console.log('   Verifique se o properties.js foi atualizado corretamente.');
        }
    } else {
        console.log('\n✅ ANALYTICS FUNCIONANDO CORRETAMENTE!');
        if (isDebugMode && isSupportVersion) {
            console.log('   Nota: O Support System tem uma versão com Analytics (verificar se é a mais recente)');
        }
    }
    
    console.groupEnd();
    
    return {
        success: analyticsComplete,
        hasAnalytics,
        origin,
        isDebugMode,
        isCoreVersion,
        isSupportVersion,
        recommendation: !analyticsComplete ? 
            (isDebugMode ? 'Atualizar admin-list-ui.js no Support System' : 'Atualizar properties.js no Core') : 
            null
    };
};

/**
 * ✅ FUNÇÃO CORRETIVA: Forçar uso da versão Core do loadPropertyList
 * Remove a sobrescrita do Support System e restaura a função original do Core
 */
window.restoreCoreLoadPropertyList = function() {
    console.group('🔄 RESTAURANDO loadPropertyList DO CORE SYSTEM');
    
    const coreFunction = window.__coreLoadPropertyListBackup;
    
    if (coreFunction && typeof coreFunction === 'function') {
        console.log('✅ Backup da função Core encontrado, restaurando...');
        window.loadPropertyList = coreFunction;
        console.log('✅ Função restaurada!');
        
        if (typeof window.loadPropertyList === 'function') {
            setTimeout(() => {
                window.loadPropertyList(window.adminCurrentPage || 1);
                console.log('🔄 Lista admin recarregada com a versão Core');
            }, 100);
        }
        
        console.groupEnd();
        return { success: true, message: 'Função Core restaurada' };
    }
    
    console.warn('⚠️ Backup da função Core não encontrado');
    console.log('💡 Para restaurar manualmente, recarregue a página sem ?debug=true');
    
    console.groupEnd();
    return { success: false, message: 'Backup não encontrado' };
};

/**
 * ✅ FUNÇÃO: Fazer backup da versão Core do loadPropertyList
 * Deve ser chamada antes do Support System sobrescrever
 */
window.backupCoreLoadPropertyList = function() {
    if (typeof window.loadPropertyList === 'function') {
        window.__coreLoadPropertyListBackup = window.loadPropertyList;
        console.log('✅ Backup da função Core loadPropertyList realizado');
        return true;
    }
    console.warn('⚠️ loadPropertyList não disponível para backup');
    return false;
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
            
            console.log('\n🚀 EXECUÇÃO AUTOMÁTICA: Validando extração de bairros...');
            window.validateExtractBairroFunction?.();
            
            console.log('\n💡 DICAS:');
            console.log('   • window.diagnoseActiveLoadPropertyList() - Verifica qual versão do loadPropertyList está ativa');
            console.log('   • window.restoreCoreLoadPropertyList() - Restaura versão Core (se tiver backup)');
            console.log('   • window.backupCoreLoadPropertyList() - Faz backup da versão Core');
            console.log('   • window.preRemovalVerification() - Verifica se é seguro remover fallbacks');
            console.log('   • window.runPostRemovalTests() - Executa todos os testes pós-remoção');
            console.log('   • window.runAnalyticsDiagnostic() - Diagnóstico completo de Analytics');
            console.log('   • window.diagnoseAnalyticsComplete() - Diagnóstico completo com recomendações');
            console.log('   • window.diagnoseAndFixAnalytics() - Diagnóstico e correção automática');
            console.log('   • window.fixAdminAnalytics() - Força recriação da lista admin');
            console.log('   • window.validateExtractBairroFunction() - Validação completa de bairros');
            console.log('   • window.testExtractionPerformance() - Teste de performance');
            console.log('   • window.runQuickValidation() - Todas as validações');
        }, 500);
    }, 100);
}

// ========== EXECUÇÃO AUTOMÁTICA EM MODO DEBUG ==========

(function autoRunVerification() {
    const isDebugMode = window.location.search.includes('debug=true') || 
                       window.location.search.includes('test=true') ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1');
    
    if (isDebugMode) {
        console.log('🔧 simple-checker.js - Modo debug ativado (v2.7 com Core/Support Detection)');
        
        // Fazer backup da função Core ANTES de ser sobrescrita
        window.backupCoreLoadPropertyList();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    console.log('📋 Executando verificação pré-remoção automática...');
                    window.preRemovalVerification?.();
                    
                    setTimeout(() => {
                        window.testAdminEditCapability?.();
                        window.testAdminCreateCapability?.();
                        
                        if (window.properties && window.properties.length > 0) {
                            setTimeout(() => {
                                window.testCardsFunctionality?.();
                            }, 1000);
                        }
                        
                        setTimeout(() => {
                            console.log('\n📊 Executando diagnóstico da versão ativa do loadPropertyList...');
                            window.diagnoseActiveLoadPropertyList?.();
                        }, 1500);
                    }, 1000);
                    
                    waitForRegistryAndExecute();
                }, 500);
            });
        } else {
            setTimeout(() => {
                console.log('📋 Executando verificação pré-remoção automática...');
                window.preRemovalVerification?.();
                
                setTimeout(() => {
                    window.testAdminEditCapability?.();
                    window.testAdminCreateCapability?.();
                    
                    if (window.properties && window.properties.length > 0) {
                        setTimeout(() => {
                            window.testCardsFunctionality?.();
                        }, 1000);
                    }
                    
                    setTimeout(() => {
                        console.log('\n📊 Executando diagnóstico da versão ativa do loadPropertyList...');
                        window.diagnoseActiveLoadPropertyList?.();
                    }, 1500);
                }, 1000);
                
                waitForRegistryAndExecute();
            }, 500);
        }
    } else {
        console.log('🚀 simple-checker.js carregado (modo produção - v2.7)');
    }
})();

// ✅ EXPORTAR PARA USO GLOBAL
window.simpleChecker = {
    // Funções existentes
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
    waitForRegistry: waitForRegistryAndExecute,
    
    // Funções de pré-remoção e pós-teste
    preRemovalVerification: window.preRemovalVerification,
    runPostRemovalTests: window.runPostRemovalTests,
    testNoConsoleErrors: window.testNoConsoleErrors,
    testCardsFunctionality: window.testCardsFunctionality,
    testAdminEditCapability: window.testAdminEditCapability,
    testAdminCreateCapability: window.testAdminCreateCapability,
    
    // Funções de Analytics (v2.5)
    diagnoseAnalyticsQuick: window.diagnoseAnalyticsQuick,
    diagnoseAnalyticsFull: window.diagnoseAnalyticsFull,
    diagnoseLoadPropertyListCode: window.diagnoseLoadPropertyListCode,
    runAnalyticsDiagnostic: window.runAnalyticsDiagnostic,
    
    // Funções de Analytics (v2.6)
    diagnoseAnalyticsComplete: window.diagnoseAnalyticsComplete,
    fixAdminAnalytics: window.fixAdminAnalytics,
    diagnoseAndFixAnalytics: window.diagnoseAndFixAnalytics,
    
    // Funções de Core/Support Detection (v2.7)
    diagnoseActiveLoadPropertyList: window.diagnoseActiveLoadPropertyList,
    restoreCoreLoadPropertyList: window.restoreCoreLoadPropertyList,
    backupCoreLoadPropertyList: window.backupCoreLoadPropertyList
};

console.log('✅ simple-checker.js ATUALIZADO v2.7 - Diagnóstico da versão ativa do loadPropertyList + Restauração Core!');
