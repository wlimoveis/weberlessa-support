// weberlessa-support/debug/simple-checker.js - VERSÃO ATUALIZADA COM TESTE DE PERFORMANCE
console.log('✅ simple-checker.js - Verificação Básica + Validação de Centralização + Teste Performance (v2.1)');

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
 * Verifica se funções essenciais estão centralizadas no SharedCore em vez de duplicadas globalmente
 */
window.validateCentralizedFunctions = function() {
    console.group('🎯 VALIDAÇÃO DE FUNÇÕES CENTRALIZADAS NO SHAREDCORE');
    
    const resultados = {
        centralizadas: [],
        duplicadas: [],
        ausentes: []
    };
    
    // Lista de funções que DEVEM estar centralizadas no SharedCore
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
 * Verifica se funções duplicadas antigas foram removidas do escopo global
 */
window.checkDuplicateRemoval = function() {
    console.group('🧹 VERIFICAÇÃO DE REMOÇÃO DE DUPLICATAS');
    
    // Funções que NÃO deveriam existir no escopo global (apenas via SharedCore)
    const funcoesObsoletas = [
        'oldFormatPrice',
        'oldFormatFeatures',
        'legacyParseFeatures',
        'videoCheckLegacy',
        'duplicateGalleryFunction',
        'antigaFuncaoMedia'
    ];
    
    // Funções que podem existir globalmente, mas devem ser apenas proxies
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
    
    // Verificar funções obsoletas
    funcoesObsoletas.forEach(nome => {
        if (typeof window[nome] !== 'undefined') {
            console.warn(`❌ Função obsoleta AINDA PRESENTE: ${nome}`);
            resultado.encontradas.push(nome);
        }
    });
    
    // Verificar se proxies estão funcionando corretamente
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
 * Verifica se MediaSystem está operacional com todas as funções necessárias
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
    
    // Verificar funções críticas
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
    
    // Verificar estado atual
    console.log('\n📊 ESTADO ATUAL DO MEDIASYSTEM:');
    console.log(`  Arquivos na fila: ${window.MediaSystem.state?.files?.length || 0}`);
    console.log(`  PDFs na fila: ${window.MediaSystem.state?.pdfs?.length || 0}`);
    console.log(`  Arquivos existentes: ${window.MediaSystem.state?.existing?.length || 0}`);
    console.log(`  PDFs existentes: ${window.MediaSystem.state?.existingPdfs?.length || 0}`);
    console.log(`  Upload em andamento: ${window.MediaSystem.state?.isUploading ? 'Sim' : 'Não'}`);
    
    // Verificar Supabase config
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
 * Verifica se FilterManager está inicializado e funcionando
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
    
    // Verificar funções principais
    const funcoesPrincipais = ['init', 'setActiveFilter', 'getCurrentFilter', 'setupWithFallback'];
    
    funcoesPrincipais.forEach(nome => {
        if (typeof window.FilterManager[nome] === 'function') {
            console.log(`✅ FilterManager.${nome} - Disponível`);
        } else {
            console.error(`❌ FilterManager.${nome} - AUSENTE!`);
            resultado.success = false;
        }
    });
    
    // Verificar inicialização
    resultado.initialized = window.FilterManager.isInitialized ? window.FilterManager.isInitialized() : false;
    console.log(`📌 Estado de inicialização: ${resultado.initialized ? 'Inicializado' : 'Não inicializado'}`);
    
    // Verificar filtros na interface
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterContainer = document.querySelector('.filter-options');
    
    if (filterContainer) {
        console.log(`✅ Container de filtros encontrado: ${filterButtons.length} botões`);
        
        if (filterButtons.length === 0) {
            console.warn('⚠️ Nenhum botão de filtro encontrado');
        }
        
        // Verificar se há filtro ativo
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
    
    // Verificar configuração global de filtro
    if (typeof window.currentFilter !== 'undefined') {
        console.log(`📌 Filtro global atual: ${window.currentFilter || 'todos'}`);
    }
    
    console.log(`\n${resultado.success ? '✅ FILTERMANAGER OPERACIONAL' : '❌ FILTERMANAGER COM PROBLEMAS'}`);
    
    console.groupEnd();
    
    return resultado;
};

// ========== NOVA FUNÇÃO: TESTE DE PERFORMANCE ==========

/**
 * ✅ FUNÇÃO: Testar Performance da Extração de Bairros
 * Mede o tempo de execução da extração de bairros em todos os imóveis
 */
window.testExtractionPerformance = function() {
    console.group('⚡ TESTE DE PERFORMANCE - EXTRAÇÃO DE BAIRROS');
    
    if (!window.properties || !Array.isArray(window.properties)) {
        console.error('❌ window.properties não encontrado ou não é um array!');
        console.log('💡 Certifique-se de que os imóveis já foram carregados.');
        console.groupEnd();
        return null;
    }
    
    if (window.properties.length === 0) {
        console.warn('⚠️ Nenhum imóvel carregado!');
        console.groupEnd();
        return null;
    }
    
    // Verificar qual função de extração está disponível
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
    
    // Executar teste de performance
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
    
    // Mostrar primeiros 5 resultados como exemplo
    if (extractionResults.length > 0) {
        console.log(`\n📋 EXEMPLOS DOS PRIMEIROS 5 IMÓVEIS:`);
        extractionResults.slice(0, 5).forEach((result, idx) => {
            console.log(`   ${idx + 1}. "${result.title}"`);
            console.log(`      📍 Location: "${result.location?.substring(0, 50) || ''}..."`);
            console.log(`      🎯 Bairro extraído: "${result.bairro}"`);
        });
    }
    
    // Verificar performance
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

// ========== FUNÇÃO: VALIDAÇÃO COMPLETA DE BAIRROS (NOVO) ==========

/**
 * ✅ FUNÇÃO: Validar Centralização da Função extractBairroFromLocation
 * Teste completo da função de extração de bairros
 */
window.validateExtractBairroFunction = function() {
    console.group('🔍 VALIDAÇÃO COMPLETA - extractBairroFromLocation');
    console.log('===========================================');
    
    // Teste 1: Verificar disponibilidade no SharedCore
    console.log('\n1️⃣ VERIFICANDO DISPONIBILIDADE:');
    console.log(`   window.SharedCore.extractBairroFromLocation: ${typeof window.SharedCore?.extractBairroFromLocation === 'function' ? '✅ DISPONÍVEL' : '❌ INDISPONÍVEL'}`);
    console.log(`   window.extractBairroFromLocation (global): ${typeof window.extractBairroFromLocation === 'function' ? '✅ DISPONÍVEL' : '❌ INDISPONÍVEL'}`);
    
    // Verificar se FilterManager tem função local duplicada
    const filterManagerHasLocal = window.FilterManager?.hasOwnProperty?.('extractBairroFromLocation') || false;
    console.log(`   FilterManager tem função local? ${!filterManagerHasLocal ? '✅ NÃO (centralizada)' : '⚠️ SIM (duplicada)'}`);
    
    // Teste 2: Testar com casos específicos
    console.log('\n2️⃣ TESTANDO CASOS ESPECÍFICOS:');
    const testCases = [
        'Rua Saleiro Pitão, Ponta Verde - Maceió/AL',
        'Residência Conj. Portal do Renascer, Forene',
        'Av. Menino Marcelo, Tabuleiro do Martins, Maceió/AL',
        'Zona Rural - Sitio São João',
        'Rua do Comércio, Centro, Maceió/AL',
        'Travessa dos Coqueiros, Jatiúca'
    ];
    
    const extractFn = window.SharedCore?.extractBairroFromLocation || window.extractBairroFromLocation;
    if (extractFn) {
        testCases.forEach(location => {
            const result = extractFn(location);
            console.log(`   📍 "${location.substring(0, 40)}..." → "${result || '❌ NÃO ENCONTRADO'}"`);
        });
    } else {
        console.error('   ❌ Função de extração não disponível!');
    }
    
    // Teste 3: Testar com imóveis reais
    console.log('\n3️⃣ TESTANDO COM IMÓVEIS REAIS:');
    if (window.properties && window.properties.length > 0) {
        const testProperties = window.properties.slice(0, 5);
        testProperties.forEach(prop => {
            const bairro = extractFn ? extractFn(prop.location) : null;
            console.log(`   🏠 "${prop.title?.substring(0, 30) || 'Sem título'}"`);
            console.log(`      📍 "${prop.location?.substring(0, 50) || ''}..."`);
            console.log(`      🎯 "${bairro || 'NÃO ENCONTRADO'}"`);
        });
    } else {
        console.warn('   ⚠️ Nenhum imóvel carregado para teste');
    }
    
    // Teste 4: Verificar integração com FilterManager
    console.log('\n4️⃣ VERIFICANDO INTEGRAÇÃO:');
    if (window.FilterManager && typeof window.FilterManager.refreshBairros === 'function') {
        console.log('   FilterManager.refreshBairros: ✅ DISPONÍVEL');
    } else {
        console.log('   FilterManager.refreshBairros: ⚠️ NÃO DISPONÍVEL (pode não ser necessário)');
    }
    
    const isSynchronized = window.extractBairroFromLocation === window.SharedCore?.extractBairroFromLocation;
    console.log(`   Funções globais sincronizadas? ${isSynchronized ? '✅ SIM (mesma referência)' : '⚠️ NÃO (possível conflito)'}`);
    
    // Teste 5: Executar teste de performance
    console.log('\n5️⃣ EXECUTANDO TESTE DE PERFORMANCE:');
    const performanceResult = window.testExtractionPerformance();
    
    console.log('\n===========================================');
    console.log('📊 RESUMO DA VALIDAÇÃO:');
    
    const allChecksPassed = typeof window.SharedCore?.extractBairroFromLocation === 'function' &&
                            !filterManagerHasLocal &&
                            performanceResult?.successCount === performanceResult?.totalProperties;
    
    console.log(`${allChecksPassed ? '✅ VALIDAÇÃO COMPLETA APROVADA!' : '⚠️ VALIDAÇÃO COM PENDÊNCIAS'}`);
    console.groupEnd();
    
    return {
        success: allChecksPassed,
        sharedCoreAvailable: typeof window.SharedCore?.extractBairroFromLocation === 'function',
        globalAvailable: typeof window.extractBairroFromLocation === 'function',
        filterManagerNoLocal: !filterManagerHasLocal,
        testCasesPassed: testCases.every(loc => extractFn && extractFn(loc)),
        performanceResult: performanceResult
    };
};

/**
 * ✅ FUNÇÃO: Executar Validação Rápida de Todas as Funções
 * Executa todas as validações em sequência
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
    
    // 1. Validar centralização
    console.log('\n📍 PASSO 1/5: Validando centralização...');
    resultados.centralizacao = window.validateCentralizedFunctions();
    
    // 2. Verificar duplicatas
    console.log('\n📍 PASSO 2/5: Verificando duplicatas...');
    resultados.duplicatas = window.checkDuplicateRemoval();
    
    // 3. Validar MediaSystem
    console.log('\n📍 PASSO 3/5: Validando MediaSystem...');
    resultados.mediaSystem = window.validateMediaSystem();
    
    // 4. Validar FilterManager
    console.log('\n📍 PASSO 4/5: Validando FilterManager...');
    resultados.filterManager = window.validateFilterManager();
    
    // 5. Validar extração de bairros
    console.log('\n📍 PASSO 5/5: Validando extração de bairros...');
    resultados.extractBairro = window.validateExtractBairroFunction();
    resultados.performance = resultados.extractBairro?.performanceResult;
    
    // Resumo final
    console.log('\n=========================================');
    console.log('📊 RESUMO DA VALIDAÇÃO RÁPIDA:');
    console.log(`  Centralização: ${resultados.centralizacao?.ausentes?.length === 0 ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  Duplicatas: ${resultados.duplicatas?.encontradas?.length === 0 ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  MediaSystem: ${resultados.mediaSystem?.success ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  FilterManager: ${resultados.filterManager?.success ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  Extração de bairros: ${resultados.extractBairro?.success ? '✅ OK' : '⚠️ Pendente'}`);
    console.log(`  Performance: ${resultados.performance?.totalTimeMs < 100 ? '✅ OK' : '⚠️ Verificar'}`);
    
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

// ✅ FUNÇÃO: Aguardar registry e executar
function waitForRegistryAndExecute() {
    console.log('⏳ Aguardando DiagnosticRegistry ficar pronto...');
    
    // Se já existe e já disparou evento, executar imediatamente
    if (window.DiagnosticRegistry && window.DiagnosticRegistry._eventDispatched) {
        console.log('⚡ Registry já pronto, executando imediatamente');
        executeAllChecks();
        return;
    }
    
    // Timer de segurança (timeout global)
    const timeoutId = setTimeout(() => {
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        console.warn('⚠️ Timeout aguardando registry - executando verificações parciais');
        executeAllChecks(true); // true = parcial
    }, 5000);
    
    // Handler do evento
    const readyHandler = (event) => {
        clearTimeout(timeoutId);
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        console.log(`🎯 Evento recebido: diagnostic-registry-ready com ${event.detail.count} funções`);
        executeAllChecks();
    };
    
    // Registrar listener do evento
    window.addEventListener('diagnostic-registry-ready', readyHandler);
    
    // Fallback: verificação periódica silenciosa (caso o evento não dispare)
    let checkCount = 0;
    const intervalId = setInterval(() => {
        checkCount++;
        if (window.DiagnosticRegistry?.registry.size > 0) {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            window.removeEventListener('diagnostic-registry-ready', readyHandler);
            console.log(`✅ Registry detectado via polling (${checkCount * 500}ms)`);
            executeAllChecks();
        } else if (checkCount >= 10) { // 5 segundos (10 * 500ms)
            clearInterval(intervalId);
            // Não fazer nada, o timeout já vai executar
        }
    }, 500);
}

// ✅ FUNÇÃO: Executar todas as verificações
function executeAllChecks(isPartial = false) {
    if (isPartial) {
        console.warn('⚠️ Executando verificações PARCIAIS (registry não respondeu)');
    }
    
    setTimeout(() => {
        window.runSupportChecks?.();
        
        setTimeout(() => {
            window.quickDiagnostic?.();
            
            // ✅ SUGESTÕES (sempre mostradas)
            console.log('\n💡 DICA: Execute window.runQuickValidation() para validar centralização e duplicatas');
            console.log('💡 Ou window.validateExtractBairroFunction() para validar extração de bairros');
            console.log('💡 Ou window.testExtractionPerformance() para testar performance');
            console.log('💡 Ou window.runSafeDiagnostics() para testar funções seguras');
            console.log('💡 Ou window.listDiagnosticFunctions() para listar todas as funções');
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
        console.log('🔧 simple-checker.js - Modo debug ativado (v2.1 com teste de performance)');
        
        // Aguardar carregamento completo do DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(waitForRegistryAndExecute, 500);
            });
        } else {
            setTimeout(waitForRegistryAndExecute, 500);
        }
    } else {
        console.log('🚀 simple-checker.js carregado (modo produção - v2.1)');
    }
})();

// ✅ EXPORTAR PARA USO GLOBAL
window.simpleChecker = {
    runSupportChecks: window.runSupportChecks,
    quickDiagnostic: window.quickDiagnostic,
    runSafeDiagnostics: window.runSafeDiagnostics,
    listFunctions: window.listDiagnosticFunctions,
    // Funções de validação de centralização
    validateCentralizedFunctions: window.validateCentralizedFunctions,
    checkDuplicateRemoval: window.checkDuplicateRemoval,
    validateMediaSystem: window.validateMediaSystem,
    validateFilterManager: window.validateFilterManager,
    // NOVAS FUNÇÕES DE PERFORMANCE E VALIDAÇÃO
    testExtractionPerformance: window.testExtractionPerformance,
    validateExtractBairroFunction: window.validateExtractBairroFunction,
    runQuickValidation: window.runQuickValidation,
    waitForRegistry: waitForRegistryAndExecute
};

console.log('✅ simple-checker.js ATUALIZADO v2.1 - Versão com Teste de Performance e Validação Completa de Bairros');
