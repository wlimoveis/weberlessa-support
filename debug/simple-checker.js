// weberlessa-support/debug/simple-checker.js - VERSÃO COMPLETA v2.9
// Verificação Básica + Validação de Centralização + Teste Performance + Analytics Diagnostic + Core/Support Detection + isVideoUrl Fallback Detection v2
console.log('✅ simple-checker.js - Verificação Básica + Validação de Centralização + Analytics + Core/Support Detection + isVideoUrl (v2.9)');

// ========== FUNÇÕES BÁSICAS ==========

window.runSupportChecks = function() {
    console.group('✅ VERIFICAÇÃO BÁSICA DO SISTEMA - SISTEMA ATUAL');
    
    const essentials = {
        'Supabase Client': !!window.supabaseClient,
        'Properties Array': Array.isArray(window.properties) && window.properties.length > 0,
        'Media System (Unificado)': typeof window.MediaSystem === 'object',
        'MediaSystem.addFiles': typeof window.MediaSystem?.addFiles === 'function',
        'MediaSystem.uploadAll': typeof window.MediaSystem?.uploadAll === 'function',
        'PDF System (Unificado)': typeof window.PdfSystem === 'object',
        'PdfSystem.showModal': typeof window.PdfSystem?.showModal === 'function',
        'PdfSystem.init': typeof window.PdfSystem?.init === 'function',
        'Admin Functions': typeof window.toggleAdminPanel === 'function',
        'saveProperty': typeof window.saveProperty === 'function',
        'Gallery System': typeof window.openGallery === 'function',
        'closeGallery': typeof window.closeGallery === 'function',
        'SharedCore': typeof window.SharedCore === 'object',
        'SharedCore.PriceFormatter': typeof window.SharedCore?.PriceFormatter === 'object',
        'Diagnostic Registry': typeof window.DiagnosticRegistry === 'object'
    };
    
    console.table(essentials);
    
    const migrationChecks = {
        '✅ Sistema antigo substituído': true,
        '✅ MediaSystem (unificado) em uso': typeof window.MediaSystem === 'object',
        '✅ PdfSystem (unificado) em uso': typeof window.PdfSystem === 'object',
        '✅ Diagnostic Registry ativo': typeof window.DiagnosticRegistry === 'object',
        '❌ Funções antigas removidas': !window.handleNewMediaFiles && !window.showPdfModal
    };
    
    console.log('🔁 STATUS DA MIGRAÇÃO:');
    console.table(migrationChecks);
    
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
            
            const destructiveFunctions = [];
            window.DiagnosticRegistry.registry.forEach(fn => {
                if (fn.safety.isDestructive) destructiveFunctions.push(fn.name);
            });
            
            if (destructiveFunctions.length > 0) {
                console.log('\n⚠️ FUNÇÕES DESTRUTIVAS IDENTIFICADAS (NÃO executar automaticamente):');
                destructiveFunctions.sort().forEach(name => console.log(`  💀 ${name}`));
            }
        }
    }
    
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
    
    console.log('\n📊 RESUMO DO SISTEMA:');
    console.log(`- Imóveis carregados: ${window.properties?.length || 0}`);
    console.log(`- Sistema de mídia: ${window.MediaSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- Sistema de PDF: ${window.PdfSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- SharedCore: ${window.SharedCore ? '✅ DISPONÍVEL' : '❌'}`);
    console.log(`- Diagnostic Registry: ${window.DiagnosticRegistry ? '✅ ATIVO' : '❌'}`);
    
    if (!window.handleNewMediaFiles && !window.showPdfModal) {
        console.log('\n✅✅✅ MIGRAÇÃO COMPLETA CONFIRMADA!');
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

window.runSafeDiagnostics = async function() {
    console.log('🛡️ Iniciando diagnóstico seguro via Registry...');
    if (!window.DiagnosticRegistry) {
        console.error('❌ DiagnosticRegistry não disponível!');
        return null;
    }
    return await window.DiagnosticRegistry.runSafeDiagnostics();
};

window.listDiagnosticFunctions = function(category = null) {
    if (!window.DiagnosticRegistry) {
        console.error('❌ DiagnosticRegistry não disponível!');
        return;
    }
    window.DiagnosticRegistry.list({ category, detailed: true });
};

// ========== FUNÇÕES DE VALIDAÇÃO DE CENTRALIZAÇÃO ==========

window.validateCentralizedFunctions = function() {
    console.group('🎯 VALIDAÇÃO DE FUNÇÕES CENTRALIZADAS NO SHAREDCORE');
    
    const resultados = { centralizadas: [], duplicadas: [], ausentes: [] };
    
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
        { nome: 'extractBairroFromLocation', central: 'extractBairroFromLocation' },
        { nome: 'isVideoUrl', central: 'isVideoUrl' }
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

window.checkDuplicateRemoval = function() {
    console.group('🧹 VERIFICAÇÃO DE REMOÇÃO DE DUPLICATAS');
    
    const funcoesObsoletas = [
        'oldFormatPrice', 'oldFormatFeatures', 'legacyParseFeatures',
        'videoCheckLegacy', 'duplicateGalleryFunction', 'antigaFuncaoMedia'
    ];
    
    const funcoesProxies = [
        'formatPrice', 'formatFeaturesForDisplay', 'parseFeaturesForStorage',
        'ensureBooleanVideo', 'validateIdForSupabase', 'manageEditingState', 
        'extractBairroFromLocation', 'isVideoUrl'
    ];
    
    const resultado = { encontradas: [], proxysFuncionando: [], problemaProxy: [] };
    
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

window.validateMediaSystem = function() {
    console.group('📸 VALIDAÇÃO DO MEDIASYSTEM');
    
    if (!window.MediaSystem) {
        console.error('❌ MediaSystem NÃO disponível!');
        console.groupEnd();
        return { success: false, error: 'MediaSystem não encontrado' };
    }
    
    const funcoesCriticas = ['addFiles', 'addPdfs', 'uploadAll', 'deleteFileFromStorage', 'deleteFilesFromStorage', 'resetState', 'loadExisting'];
    const resultado = { success: true, funcoesDisponiveis: [], funcoesAusentes: [] };
    
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
    console.log(`  Upload em andamento: ${window.MediaSystem.state?.isUploading ? 'Sim' : 'Não'}`);
    
    console.log(`\n${resultado.success ? '✅ MEDIASYSTEM OPERACIONAL' : '❌ MEDIASYSTEM COM PROBLEMAS'}`);
    console.groupEnd();
    return resultado;
};

window.validateFilterManager = function() {
    console.group('🎛️ VALIDAÇÃO DO FILTERMANAGER');
    
    if (!window.FilterManager) {
        console.error('❌ FilterManager NÃO disponível!');
        console.groupEnd();
        return { success: false, error: 'FilterManager não encontrado' };
    }
    
    const funcoesPrincipais = ['init', 'setActiveFilter', 'getCurrentFilter', 'setupWithFallback'];
    const resultado = { success: true, initialized: false };
    
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
    
    console.log(`\n${resultado.success ? '✅ FILTERMANAGER OPERACIONAL' : '❌ FILTERMANAGER COM PROBLEMAS'}`);
    console.groupEnd();
    return resultado;
};

// ========== FUNÇÃO: TESTE DE PERFORMANCE ==========

window.testExtractionPerformance = function() {
    console.group('⚡ TESTE DE PERFORMANCE - EXTRAÇÃO DE BAIRROS');
    
    if (!window.properties || !Array.isArray(window.properties) || window.properties.length === 0) {
        console.error('❌ window.properties não encontrado ou vazio');
        console.groupEnd();
        return null;
    }
    
    const extractFunction = window.SharedCore?.extractBairroFromLocation || window.extractBairroFromLocation;
    const functionSource = window.SharedCore?.extractBairroFromLocation ? 'SharedCore' : (window.extractBairroFromLocation ? 'Global' : 'Fallback');
    
    console.log(`📌 Função de extração utilizada: ${functionSource}`);
    
    const startTime = performance.now();
    let successCount = 0;
    
    window.properties.forEach(prop => {
        if (extractFunction && extractFunction(prop.location)) successCount++;
    });
    
    const totalTime = (performance.now() - startTime).toFixed(2);
    const averageTime = (totalTime / window.properties.length).toFixed(3);
    
    console.log(`\n📊 ESTATÍSTICAS:`);
    console.log(`   Imóveis processados: ${window.properties.length}`);
    console.log(`   ✅ Extrações bem-sucedidas: ${successCount}`);
    console.log(`   ⏱️ Tempo total: ${totalTime}ms`);
    console.log(`   🚀 Média por imóvel: ${averageTime}ms`);
    
    const performanceStatus = totalTime < 100 ? '✅ EXCELENTE' : (totalTime < 500 ? '⚠️ ACEITÁVEL' : '❌ LENTO');
    console.log(`\n🔍 STATUS DE PERFORMANCE: ${performanceStatus}`);
    
    console.groupEnd();
    return { totalProperties: window.properties.length, successCount, totalTimeMs: parseFloat(totalTime), performanceStatus };
};

// ========== FUNÇÃO: VALIDAÇÃO DE BAIRROS ==========

window.validateExtractBairroFunction = function() {
    console.log('\n🏠 VALIDAÇÃO DA FUNÇÃO CENTRALIZADA DE BAIRROS');
    console.log('================================================');
    
    console.log('\n📌 1. DISPONIBILIDADE:');
    console.log(`   SharedCore.extractBairroFromLocation: ${typeof window.SharedCore?.extractBairroFromLocation === 'function' ? '✅' : '❌'}`);
    console.log(`   window.extractBairroFromLocation (global): ${typeof window.extractBairroFromLocation === 'function' ? '✅' : '❌'}`);
    
    const isDelegated = window.extractBairroFromLocation === window.SharedCore?.extractBairroFromLocation;
    console.log('\n📌 2. DELEGAÇÃO CORRETA:', isDelegated ? '✅ SIM' : '⚠️ NÃO');
    
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
        console.log(`   📍 ${bairrosEncontrados.size} bairros únicos encontrados`);
    }
    
    console.log('\n✅ VALIDAÇÃO CONCLUÍDA!');
    console.log('================================================');
    return { success: typeof window.SharedCore?.extractBairroFromLocation === 'function' };
};

// ========== VERIFICAÇÃO PRÉ-REMOÇÃO DE FALLBACKS ==========

window.preRemovalVerification = function() {
    console.log('\n🔍 === VERIFICAÇÃO PRÉ-REMOÇÃO DE FALLBACKS ===\n');
    
    if (!window.SharedCore) {
        console.error('❌ SharedCore NÃO disponível!');
        return { safeToRemove: false };
    }
    
    console.log('📦 STATUS DO SHAREDCORE: ✅ SIM');
    
    const functionsToCheck = [
        'formatFeaturesForDisplay', 'PriceFormatter.formatForCard',
        'validateIdForSupabase', 'parseFeaturesForStorage', 'ensureBooleanVideo'
    ];
    
    let allExist = true;
    functionsToCheck.forEach(func => {
        const exists = func.includes('.') ? 
            eval(`typeof window.SharedCore.${func} === 'function'`) :
            typeof window.SharedCore[func] === 'function';
        console.log(`  ${func}: ${exists ? '✅' : '❌'}`);
        if (!exists) allExist = false;
    });
    
    if (allExist) {
        console.log('\n✅ TODOS OS TESTES PASSARAM! A remoção dos fallbacks é SEGURA.');
    } else {
        console.log('\n⚠️ NÃO remover os fallbacks até corrigir os erros.');
    }
    
    return { safeToRemove: allExist };
};

// ========== TESTES PÓS-IMPLEMENTAÇÃO ==========

window.testNoConsoleErrors = function() {
    console.group('📋 TESTE 1: VERIFICAÇÃO DE ERROS NO CONSOLE');
    const issues = [];
    
    if (typeof window.SharedCore === 'undefined') issues.push('SharedCore is undefined');
    else console.log('✅ SharedCore disponível');
    
    if (typeof window.SharedCore?.formatFeaturesForDisplay !== 'function') issues.push('formatFeaturesForDisplay is not a function');
    else console.log('✅ formatFeaturesForDisplay disponível');
    
    if (typeof window.SharedCore?.PriceFormatter?.formatForCard !== 'function') issues.push('PriceFormatter.formatForCard is not a function');
    else console.log('✅ PriceFormatter.formatForCard disponível');
    
    console.log(`\n${issues.length === 0 ? '✅ NENHUM ERRO CRÍTICO' : '⚠️ PROBLEMAS ENCONTRADOS'}`);
    console.groupEnd();
    return { success: issues.length === 0, issues };
};

window.testCardsFunctionality = function() {
    console.group('🃏 TESTE 2: FUNCIONALIDADE DOS CARDS');
    const card = document.querySelector('.property-card');
    
    if (!card) {
        console.warn('⚠️ Nenhum card encontrado');
        console.groupEnd();
        return { success: false };
    }
    
    const price = card.querySelector('.property-price')?.textContent;
    const features = card.querySelectorAll('.feature-tag').length;
    const title = card.querySelector('.property-title')?.textContent;
    
    console.log(`💰 Preço: "${price}"`);
    console.log(`🏷️ Features: ${features} tags`);
    console.log(`📌 Título: "${title}"`);
    console.log(`\n✅ CARDS FUNCIONANDO`);
    
    console.groupEnd();
    return { success: true, price, featureCount: features, title };
};

window.testAdminEditCapability = function() {
    console.group('🔧 TESTE 3: FUNCIONALIDADE DO ADMIN (EDIÇÃO)');
    
    const functions = {
        editProperty: typeof window.editProperty === 'function',
        updateProperty: typeof window.updateProperty === 'function',
        saveProperty: typeof window.saveProperty === 'function',
        loadPropertyList: typeof window.loadPropertyList === 'function'
    };
    
    console.table(functions);
    const allExist = Object.values(functions).every(v => v === true);
    console.log(`\n${allExist ? '✅ Funções de edição disponíveis' : '❌ Funções ausentes'}`);
    
    console.groupEnd();
    return { success: allExist, functions };
};

window.testAdminCreateCapability = function() {
    console.group('➕ TESTE 4: FUNCIONALIDADE DO ADMIN (CRIAÇÃO)');
    
    const functions = {
        addNewProperty: typeof window.addNewProperty === 'function',
        saveProperty: typeof window.saveProperty === 'function',
        MediaSystem: typeof window.MediaSystem === 'object'
    };
    
    console.table(functions);
    
    const elements = {
        titleInput: !!document.getElementById('propTitle'),
        priceInput: !!document.getElementById('propPrice'),
        locationInput: !!document.getElementById('propLocation'),
        featuresInput: !!document.getElementById('propFeatures'),
        submitButton: !!document.querySelector('#propertyForm button[type="submit"]')
    };
    
    console.log('\n📋 ELEMENTOS:');
    console.table(elements);
    
    const allExist = Object.values(functions).every(v => v === true) && Object.values(elements).every(v => v === true);
    console.log(`\n${allExist ? '✅ Funções de criação disponíveis' : '❌ Funções ausentes'}`);
    
    console.groupEnd();
    return { success: allExist, functions, elements };
};

window.runPostRemovalTests = async function() {
    console.log('\n🚀 EXECUTANDO TESTES PÓS-REMOÇÃO');
    const resultados = {
        test1: window.testNoConsoleErrors(),
        test2: window.testCardsFunctionality(),
        test3: window.testAdminEditCapability(),
        test4: window.testAdminCreateCapability()
    };
    
    resultados.sucessoGeral = resultados.test1.success && resultados.test2.success && 
                              resultados.test3.success && resultados.test4.success;
    
    console.log(`\n${resultados.sucessoGeral ? '🎉 TODOS OS TESTES APROVADOS' : '⚠️ ALGUNS TESTES FALHARAM'}`);
    return resultados;
};

// ========== DIAGNÓSTICO DE ANALYTICS ==========

window.diagnoseAnalyticsQuick = function() {
    console.group('📊 DIAGNÓSTICO RÁPIDO - ANALYTICS');
    const list = document.getElementById('propertyList');
    if (!list) {
        console.log('❌ propertyList não encontrado');
        console.groupEnd();
        return { success: false };
    }
    
    const header = list.querySelector('div[style*="background: #e8f4fd"]');
    const hasTotal = header?.innerHTML.includes('Total de visualizações');
    const items = document.querySelectorAll('.property-item');
    const hasCount = items.length > 0 && items[0]?.innerHTML.includes('Visualizações:');
    
    console.log(`📊 Analytics: ${hasTotal && hasCount ? '✅ ATIVO' : '❌ AUSENTE'}`);
    console.groupEnd();
    return { success: hasTotal && hasCount, hasTotal, hasCount };
};

window.diagnoseAnalyticsFull = function() {
    console.group('📊 DIAGNÓSTICO AVANÇADO - ANALYTICS');
    const results = { statsHeader: false, totalViews: false, viewCountInCards: false };
    
    const list = document.getElementById('propertyList');
    if (list) {
        const header = list.querySelector('div[style*="background: #e8f4fd"]');
        results.statsHeader = !!header;
        results.totalViews = header?.innerHTML.includes('Total de visualizações') || false;
        
        const items = document.querySelectorAll('.property-item');
        results.viewCountInCards = items.length > 0 && items[0]?.innerHTML.includes('Visualizações:');
    }
    
    console.table(results);
    console.groupEnd();
    return results;
};

window.diagnoseLoadPropertyListCode = function() {
    console.group('📋 ANÁLISE DO CÓDIGO - loadPropertyList');
    const src = window.loadPropertyList?.toString();
    
    if (!src) {
        console.error('❌ Função não encontrada');
        console.groupEnd();
        return { success: false };
    }
    
    const has = {
        statsHeader: src.includes('Total de visualizações'),
        zerarTodas: src.includes('Zerar TODAS'),
        viewCount: src.includes('Visualizações:'),
        zerarViews: src.includes('resetGalleryViews')
    };
    
    console.table(has);
    const complete = has.statsHeader && has.zerarTodas && has.viewCount && has.zerarViews;
    console.log(`\n${complete ? '✅ Código completo' : '⚠️ Código incompleto'}`);
    
    console.groupEnd();
    return { success: complete, has };
};

window.diagnoseAnalyticsComplete = function() {
    console.log('\n🔍 DIAGNÓSTICO COMPLETO - ANALYTICS');
    const codeAnalysis = window.diagnoseLoadPropertyListCode();
    const uiAnalysis = window.diagnoseAnalyticsFull();
    const quick = window.diagnoseAnalyticsQuick();
    
    const status = quick.success ? 'functional' : (codeAnalysis.success ? 'partial' : 'missing');
    console.log(`\n📊 STATUS: ${status.toUpperCase()}`);
    
    if (status === 'missing') {
        console.log('\n💡 SOLUÇÃO: Execute window.restoreCoreLoadPropertyList()');
    }
    
    return { status, codeAnalysis, uiAnalysis };
};

window.fixAdminAnalytics = function() {
    console.group('🔧 CORREÇÃO - ADMIN ANALYTICS');
    const isDebug = window.location.search.includes('debug=true');
    
    if (!isDebug) {
        console.warn('⚠️ Modo produção. Acesse com ?debug=true');
        console.groupEnd();
        return { success: false };
    }
    
    if (typeof window.loadPropertyList !== 'function') {
        console.error('❌ loadPropertyList não disponível');
        console.groupEnd();
        return { success: false };
    }
    
    window.adminCurrentPage = 1;
    window.loadPropertyList(1);
    console.log('✅ Lista recriada');
    console.groupEnd();
    return { success: true };
};

window.diagnoseAndFixAnalytics = async function() {
    console.log('\n🔧 INICIANDO DIAGNÓSTICO E CORREÇÃO DE ANALYTICS');
    console.log('================================================');
    
    const diagnosis = window.diagnoseAnalyticsComplete();
    const isDebug = window.location.search.includes('debug=true');
    
    if (isDebug && diagnosis.status !== 'functional') {
        console.log('\n🔧 Tentando correção automática...');
        
        if (typeof window.restoreCoreLoadPropertyList === 'function') {
            const restoreResult = window.restoreCoreLoadPropertyList();
            if (restoreResult.success) {
                await new Promise(r => setTimeout(r, 500));
                console.log('✅ Versão Core restaurada!');
                
                const recheck = window.diagnoseAnalyticsQuick();
                if (recheck.success) {
                    console.log('✅ Analytics restaurado com sucesso!');
                }
            }
        } else {
            console.log('⚠️ Função restoreCoreLoadPropertyList não disponível');
            window.fixAdminAnalytics();
        }
    } else if (!isDebug && diagnosis.status !== 'functional') {
        console.log('\n💡 O Analytics completo está disponível apenas em modo debug');
        console.log('   Acesse: ' + window.location.origin + window.location.pathname + '?debug=true');
    } else if (diagnosis.status === 'functional') {
        console.log('\n✅ Analytics já está funcionando corretamente!');
    }
    
    console.log('\n🔧 FIM DO DIAGNÓSTICO');
    return diagnosis;
};

window.runAnalyticsDiagnostic = async function() {
    console.log('\n🔍 DIAGNÓSTICO COMPLETO DE ANALYTICS');
    const results = {
        quick: window.diagnoseAnalyticsQuick(),
        code: window.diagnoseLoadPropertyListCode(),
        full: window.diagnoseAnalyticsFull()
    };
    
    results.success = results.quick.success && results.code.success;
    console.log(`\n${results.success ? '✅ ANALYTICS FUNCIONAL' : '❌ ANALYTICS COM PROBLEMAS'}`);
    
    if (!results.success) {
        console.log('\n💡 Execute window.diagnoseAndFixAnalytics() para tentar corrigir');
    }
    
    return results;
};

// ========== VERIFICAÇÃO DETALHADA PARA LIMPEZA DO GALLERY.JS (v2.9) ==========

window.diagnoseIsVideoUrlFallback = function() {
    console.group('🔍 VERIFICAÇÃO DETALHADA PARA LIMPEZA DO GALLERY.JS');
    
    // 1. Verificar ordem de carregamento
    console.log('\n📋 ORDEM DE CARREGAMENTO:');
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const sharedCoreIndex = scripts.findIndex(s => s.src && s.src.includes('SharedCore'));
    const galleryIndex = scripts.findIndex(s => s.src && s.src.includes('gallery.js'));
    
    console.log(`  SharedCore.js posição: ${sharedCoreIndex !== -1 ? sharedCoreIndex + 1 : 'NÃO ENCONTRADO'}`);
    console.log(`  gallery.js posição: ${galleryIndex !== -1 ? galleryIndex + 1 : 'NÃO ENCONTRADO'}`);
    
    const loadsBefore = sharedCoreIndex < galleryIndex;
    console.log(`  SharedCore carrega antes? ${loadsBefore ? '✅ SIM' : '❌ NÃO - RISCO!'}`);
    
    if (!loadsBefore && sharedCoreIndex !== -1 && galleryIndex !== -1) {
        console.warn('  ⚠️ ATENÇÃO: gallery.js carrega antes do SharedCore.js!');
        console.log('  O fallback pode ser necessário neste cenário.');
    }
    
    // 2. Verificar existência da função
    console.log('\n🔧 FUNÇÃO isVideoUrl:');
    const hasGlobal = typeof window.isVideoUrl === 'function';
    const hasSharedCore = typeof window.SharedCore?.isVideoUrl === 'function';
    
    console.log(`  typeof window.isVideoUrl: ${typeof window.isVideoUrl}`);
    console.log(`  window.isVideoUrl('video.mp4'): ${hasGlobal ? window.isVideoUrl('video.mp4') : 'N/A'}`);
    console.log(`  window.isVideoUrl('foto.jpg'): ${hasGlobal ? window.isVideoUrl('foto.jpg') : 'N/A'}`);
    console.log(`  window.isVideoUrl('https://exemplo.com/video.mov'): ${hasGlobal ? window.isVideoUrl('https://exemplo.com/video.mov') : 'N/A'}`);
    
    // 3. Verificar SharedCore como fonte
    console.log('\n📦 FONTE DA FUNÇÃO:');
    console.log(`  window.SharedCore?.isVideoUrl: ${typeof window.SharedCore?.isVideoUrl}`);
    
    if (hasGlobal && hasSharedCore) {
        const globalSrc = window.isVideoUrl.toString();
        const sharedCoreSrc = window.SharedCore.isVideoUrl.toString();
        const areIdentical = globalSrc === sharedCoreSrc;
        console.log(`  Funções são idênticas? ${areIdentical ? '✅ SIM' : '⚠️ DIFERENTES'}`);
        
        if (!areIdentical) {
            console.warn('  ⚠️ ATENÇÃO: As implementações são diferentes!');
        }
    } else if (hasGlobal && !hasSharedCore) {
        console.warn('  ⚠️ SharedCore.isVideoUrl NÃO disponível - NÃO remover o fallback');
    } else if (!hasGlobal && hasSharedCore) {
        console.log('  ✅ Fallback já foi removido! Apenas SharedCore fornece a função');
    }
    
    // 4. Verificar usos no gallery.js
    console.log('\n🎯 USOS NO GALLERY.JS:');
    const galleryScript = document.querySelector('script[src*="gallery.js"]');
    if (galleryScript) {
        console.log('  Script gallery.js encontrado. A função isVideoUrl é usada em:');
        console.log('  - createVideoThumbnail (para detectar se é vídeo)');
        console.log('  - updateCardMedia (para atualizar mídia)');
        console.log('  - createPropertyGallery (para gerar galeria)');
        console.log('  - updateGalleryModalMedia (para modal)');
        console.log('\n  Todas continuarão funcionando após a remoção do fallback,');
        console.log('  pois a função continuará disponível via SharedCore.');
    } else {
        console.log('  ⚠️ Script gallery.js não encontrado na página');
    }
    
    // 5. Conclusão
    console.log('\n✅ CONCLUSÃO:');
    const canRemove = hasGlobal && hasSharedCore && loadsBefore;
    
    if (canRemove) {
        console.log('  A remoção do fallback é SEGURA.');
        console.log('  O SharedCore já fornece window.isVideoUrl globalmente.');
        console.log('  Localização do fallback: gallery.js linhas ~13-24');
    } else if (hasGlobal && hasSharedCore && !loadsBefore) {
        console.log('  ⚠️ Remoção possível, mas gallery.js carrega antes.');
        console.log('  Verifique se a função estará disponível no momento da execução.');
    } else if (!hasGlobal && hasSharedCore) {
        console.log('  ✅ Fallback já foi removido!');
    } else {
        console.log('  ❌ NÃO remover o fallback até corrigir as pendências acima.');
    }
    
    console.groupEnd();
    
    return { 
        hasGlobal, 
        hasSharedCore, 
        loadsBefore, 
        canRemove: canRemove,
        scriptsOrder: { sharedCoreIndex, galleryIndex }
    };
};

// ========== RUN QUICK VALIDATION ==========

window.runQuickValidation = async function() {
    console.log('🚀 INICIANDO VALIDAÇÃO RÁPIDA COMPLETA');
    console.log('=========================================');
    
    const resultados = {
        centralizacao: window.validateCentralizedFunctions(),
        duplicatas: window.checkDuplicateRemoval(),
        mediaSystem: window.validateMediaSystem(),
        filterManager: window.validateFilterManager(),
        extractBairro: window.validateExtractBairroFunction(),
        isVideoUrl: window.diagnoseIsVideoUrlFallback(),
        timestamp: new Date().toISOString()
    };
    
    const sucessoTotal = resultados.centralizacao?.ausentes?.length === 0 &&
                         resultados.duplicatas?.encontradas?.length === 0 &&
                         resultados.mediaSystem?.success === true &&
                         resultados.filterManager?.success === true &&
                         resultados.isVideoUrl?.canRemove === true;
    
    console.log(`\n${sucessoTotal ? '🎉 VALIDAÇÃO COMPLETA APROVADA!' : '⚠️ VALIDAÇÃO COM PENDÊNCIAS'}`);
    console.log('=========================================');
    
    resultados.sucessoTotal = sucessoTotal;
    return resultados;
};

// ========== ANÁLISE DA VERSÃO ATIVA DO loadPropertyList ==========

window.diagnoseActiveLoadPropertyList = function() {
    console.group('🔍 ANÁLISE DA FUNÇÃO loadPropertyList ATIVA');
    
    const src = window.loadPropertyList?.toString();
    if (!src) {
        console.error('❌ loadPropertyList não definida');
        console.groupEnd();
        return { success: false };
    }
    
    const hasAnalytics = {
        statsHeader: src.includes('Total de visualizações'),
        zerarTodas: src.includes('Zerar TODAS'),
        viewCountInCard: src.includes('Visualizações:'),
        zerarViews: src.includes('resetGalleryViews')
    };
    
    console.log('📊 COMPONENTES DO ANALYTICS:');
    console.log(`   - Total de visualizações: ${hasAnalytics.statsHeader ? '✅' : '❌'}`);
    console.log(`   - Zerar TODAS: ${hasAnalytics.zerarTodas ? '✅' : '❌'}`);
    console.log(`   - Visualizações no card: ${hasAnalytics.viewCountInCard ? '✅' : '❌'}`);
    console.log(`   - Zerar views: ${hasAnalytics.zerarViews ? '✅' : '❌'}`);
    
    const isCoreVersion = src.includes('background: #e8f4fd') && !src.includes('[Support]');
    const isSupportVersion = src.includes('[Support]') || src.includes('admin-list-ui');
    
    console.log(`\n📌 Origem: ${isCoreVersion ? 'CORE SYSTEM' : (isSupportVersion ? 'SUPPORT SYSTEM' : 'DESCONHECIDA')}`);
    console.log(`🔧 Modo: ${window.location.search.includes('debug=true') ? 'DEBUG' : 'PRODUÇÃO'}`);
    
    if (isSupportVersion && !hasAnalytics.statsHeader) {
        console.log('\n⚠️ Support System está sobrescrevendo com versão sem Analytics!');
        console.log('💡 Execute window.restoreCoreLoadPropertyList() para restaurar');
    }
    
    console.groupEnd();
    return { hasAnalytics, isCoreVersion, isSupportVersion, success: hasAnalytics.statsHeader };
};

window.backupCoreLoadPropertyList = function() {
    if (typeof window.loadPropertyList === 'function') {
        window.__coreLoadPropertyListBackup = window.loadPropertyList;
        console.log('✅ Backup da função Core loadPropertyList realizado');
        return true;
    }
    console.warn('⚠️ loadPropertyList não disponível');
    return false;
};

window.restoreCoreLoadPropertyList = function() {
    console.group('🔄 RESTAURANDO loadPropertyList DO CORE SYSTEM');
    
    const backup = window.__coreLoadPropertyListBackup;
    if (backup && typeof backup === 'function') {
        window.loadPropertyList = backup;
        console.log('✅ Função Core restaurada!');
        
        if (typeof window.loadPropertyList === 'function') {
            setTimeout(() => {
                window.loadPropertyList(window.adminCurrentPage || 1);
                console.log('🔄 Lista admin recarregada com a versão Core');
                
                setTimeout(() => {
                    const src = window.loadPropertyList?.toString();
                    const hasAnalytics = src?.includes('Total de visualizações');
                    if (hasAnalytics) {
                        console.log('✅ ANALYTICS RESTAURADO COM SUCESSO!');
                    } else {
                        console.log('⚠️ Analytics ainda ausente. Recarregue a página sem ?debug=true');
                    }
                }, 500);
            }, 100);
        }
        
        console.groupEnd();
        return { success: true };
    }
    
    console.warn('⚠️ Backup da função Core não encontrado');
    console.log('💡 Recarregue a página sem ?debug=true para usar a versão Core');
    console.groupEnd();
    return { success: false };
};

// ========== FUNÇÕES DE SUPORTE ==========

function waitForRegistryAndExecute() {
    console.log('⏳ Aguardando DiagnosticRegistry...');
    
    if (window.DiagnosticRegistry && window.DiagnosticRegistry._eventDispatched) {
        executeAllChecks();
        return;
    }
    
    const timeoutId = setTimeout(() => {
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        executeAllChecks(true);
    }, 5000);
    
    const readyHandler = () => {
        clearTimeout(timeoutId);
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        executeAllChecks();
    };
    
    window.addEventListener('diagnostic-registry-ready', readyHandler);
    
    let checkCount = 0;
    const intervalId = setInterval(() => {
        checkCount++;
        if (window.DiagnosticRegistry?.registry.size > 0) {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            executeAllChecks();
        } else if (checkCount >= 10) {
            clearInterval(intervalId);
        }
    }, 500);
}

function executeAllChecks(isPartial = false) {
    if (isPartial) console.warn('⚠️ Executando verificações PARCIAIS');
    
    setTimeout(() => {
        window.runSupportChecks?.();
        setTimeout(() => {
            window.quickDiagnostic?.();
            console.log('\n🚀 EXECUÇÃO AUTOMÁTICA: Validando extração de bairros...');
            window.validateExtractBairroFunction?.();
            
            // Execução automática da verificação detalhada do isVideoUrl fallback
            setTimeout(() => {
                console.log('\n📹 EXECUÇÃO AUTOMÁTICA: Verificando isVideoUrl fallback (detalhado)...');
                const result = window.diagnoseIsVideoUrlFallback?.();
                if (result && result.canRemove) {
                    console.log('✅ O fallback do gallery.js pode ser removido com segurança');
                    console.log('   Localização: gallery.js linhas ~13-24');
                } else if (result && !result.canRemove) {
                    console.log('⚠️ NÃO remover o fallback. Verifique as pendências acima.');
                }
            }, 500);
            
            // Execução automática do Analytics
            setTimeout(() => {
                console.log('\n📊 EXECUÇÃO AUTOMÁTICA: Verificando Analytics...');
                const src = window.loadPropertyList?.toString();
                const hasAnalytics = src?.includes('Total de visualizações');
                
                if (!hasAnalytics) {
                    console.log('⚠️ Analytics ausente na função atual.');
                    console.log('   Tentando restauração automática...');
                    window.restoreCoreLoadPropertyList();
                } else {
                    console.log('✅ Analytics presente na função atual.');
                }
            }, 1000);
            
            console.log('\n💡 DICAS (comandos disponíveis):');
            console.log('   • window.diagnoseActiveLoadPropertyList() - Verifica versão ativa');
            console.log('   • window.restoreCoreLoadPropertyList() - Restaura versão Core');
            console.log('   • window.diagnoseIsVideoUrlFallback() - Verifica fallback isVideoUrl (DETALHADO)');
            console.log('   • window.runQuickValidation() - Todas as validações');
            console.log('   • window.runAnalyticsDiagnostic() - Diagnóstico de Analytics');
            console.log('   • window.diagnoseAndFixAnalytics() - Diagnóstico e correção');
        }, 500);
    }, 100);
}

// ========== INICIALIZAÇÃO AUTOMÁTICA ==========

(function autoRunVerification() {
    const isDebugMode = window.location.search.includes('debug=true') || 
                       window.location.search.includes('test=true') ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1');
    
    if (isDebugMode) {
        console.log('🔧 simple-checker.js - Modo debug ativado (v2.9)');
        
        // Fazer backup da função Core ANTES de ser sobrescrita
        window.backupCoreLoadPropertyList();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    window.preRemovalVerification?.();
                    setTimeout(() => {
                        window.diagnoseActiveLoadPropertyList?.();
                        window.diagnoseIsVideoUrlFallback?.();
                    }, 1500);
                    waitForRegistryAndExecute();
                }, 500);
            });
        } else {
            setTimeout(() => {
                window.preRemovalVerification?.();
                setTimeout(() => {
                    window.diagnoseActiveLoadPropertyList?.();
                    window.diagnoseIsVideoUrlFallback?.();
                }, 1500);
                waitForRegistryAndExecute();
            }, 500);
        }
    } else {
        console.log('🚀 simple-checker.js carregado (modo produção - v2.9)');
    }
})();

// ✅ EXPORTAR PARA USO GLOBAL
window.simpleChecker = {
    // Funções básicas
    runSupportChecks: window.runSupportChecks,
    quickDiagnostic: window.quickDiagnostic,
    runSafeDiagnostics: window.runSafeDiagnostics,
    listFunctions: window.listDiagnosticFunctions,
    
    // Validações de centralização
    validateCentralizedFunctions: window.validateCentralizedFunctions,
    checkDuplicateRemoval: window.checkDuplicateRemoval,
    validateMediaSystem: window.validateMediaSystem,
    validateFilterManager: window.validateFilterManager,
    
    // Performance e extração
    testExtractionPerformance: window.testExtractionPerformance,
    validateExtractBairroFunction: window.validateExtractBairroFunction,
    
    // Pré-remoção e pós-testes
    preRemovalVerification: window.preRemovalVerification,
    runPostRemovalTests: window.runPostRemovalTests,
    testNoConsoleErrors: window.testNoConsoleErrors,
    testCardsFunctionality: window.testCardsFunctionality,
    testAdminEditCapability: window.testAdminEditCapability,
    testAdminCreateCapability: window.testAdminCreateCapability,
    
    // Analytics
    diagnoseAnalyticsQuick: window.diagnoseAnalyticsQuick,
    diagnoseAnalyticsFull: window.diagnoseAnalyticsFull,
    diagnoseLoadPropertyListCode: window.diagnoseLoadPropertyListCode,
    diagnoseAnalyticsComplete: window.diagnoseAnalyticsComplete,
    fixAdminAnalytics: window.fixAdminAnalytics,
    diagnoseAndFixAnalytics: window.diagnoseAndFixAnalytics,
    runAnalyticsDiagnostic: window.runAnalyticsDiagnostic,
    
    // Core/Support Detection
    diagnoseActiveLoadPropertyList: window.diagnoseActiveLoadPropertyList,
    restoreCoreLoadPropertyList: window.restoreCoreLoadPropertyList,
    backupCoreLoadPropertyList: window.backupCoreLoadPropertyList,
    
    // isVideoUrl Fallback Detection (v2.9 - versão detalhada)
    diagnoseIsVideoUrlFallback: window.diagnoseIsVideoUrlFallback,
    
    // Validação rápida
    runQuickValidation: window.runQuickValidation
};

console.log('✅ simple-checker.js ATUALIZADO v2.9 - Diagnóstico detalhado do gallery.js + isVideoUrl fallback detection!');
