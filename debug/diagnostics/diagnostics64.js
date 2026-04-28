// debug/diagnostics/diagnostics64.js - v6.5.3
// ANÁLISE DE DADOS DE PROPRIEDADES (Categorias, Badges, Bairros, Tipos)
// ===================================================================
// FINALIDADE: Diagnóstico e validação de dados dos imóveis cadastrados
// Inclui: Análise de categorias vs badges, extração de bairros,
//         distribuição de badges, validação de tipos e mapeamento completo
// ===================================================================

console.log('🏠 diagnostics64.js v6.5.3 - Análise de Dados de Propriedades');

(function() {
    'use strict';
    
    // ==========================================================
    // CONFIGURAÇÃO ATUALIZADA COM MAPEAMENTO COMPLETO
    // ==========================================================
    const CONFIG = {
        debugEnabled: true,
        version: '6.5.3',
        categories: {
            'Rural': { badges: ['Fazenda', 'Chácara', 'Sítio'], tipos: ['rural'] },
            'Residencial': { badges: ['Novo', 'Destaque', 'Luxo', 'Diamante'], tipos: ['residencial'] },
            'Comercial': { badges: ['Comercial', 'Empresarial'], tipos: ['comercial'] },
            'Minha Casa Minha Vida': { badges: ['MCMV', 'MCMV - Minha Casa Minha Vida'], tipos: ['residencial'] }
        }
    };
    
    // ==========================================================
    // FUNÇÃO AUXILIAR: Extrair bairro da localização
    // ==========================================================
    function extractBairroFromLocation(location) {
        if (!location || typeof location !== 'string') return '❓ NÃO IDENTIFICADO';
        
        let bairro = location.trim();
        
        if (bairro.includes(',')) {
            bairro = bairro.split(',')[0];
        }
        if (bairro.includes('-')) {
            bairro = bairro.split('-')[0];
        }
        if (bairro.includes(' - ')) {
            bairro = bairro.split(' - ')[0];
        }
        
        bairro = bairro.trim();
        
        return bairro || '❓ NÃO IDENTIFICADO';
    }
    
    // ==========================================================
    // FUNÇÃO 1: Diagnóstico de Bairros por Categoria
    // ==========================================================
    window.diagnoseCategoryBairros = function() {
        console.group('🔍 DIAGNÓSTICO DE BAIRROS POR CATEGORIA');
        
        if (!window.properties || !Array.isArray(window.properties)) {
            console.error('❌ window.properties não encontrado ou não é um array!');
            console.log('💡 Certifique-se de que os imóveis já foram carregados.');
            console.groupEnd();
            return { error: 'Propriedades não carregadas' };
        }
        
        const properties = window.properties;
        console.log(`📊 Total de imóveis no sistema: ${properties.length}`);
        
        const results = {
            timestamp: new Date().toISOString(),
            totalProperties: properties.length,
            categories: {}
        };
        
        for (const [category, config] of Object.entries(CONFIG.categories)) {
            const badges = config.badges;
            console.log(`\n📌 Categoria: ${category}`);
            console.log(`   Badges esperados: ${badges.join(', ')}`);
            
            const matchingProperties = properties.filter(p => 
                p.badge && badges.includes(p.badge)
            );
            
            const bairrosCount = {};
            const propertiesList = [];
            
            console.log(`   Imóveis encontrados: ${matchingProperties.length}`);
            
            if (matchingProperties.length === 0) {
                console.warn(`   ⚠️ NENHUM imóvel encontrado! Verifique se existem imóveis com badge: ${badges.join(' ou ')}`);
            } else {
                matchingProperties.forEach(p => {
                    const bairro = extractBairroFromLocation(p.location);
                    bairrosCount[bairro] = (bairrosCount[bairro] || 0) + 1;
                    propertiesList.push({
                        id: p.id,
                        title: p.title,
                        badge: p.badge,
                        location: p.location,
                        bairro: bairro
                    });
                    console.log(`   ✓ "${p.title}" - Badge: ${p.badge} - Local: ${p.location} → Bairro: ${bairro}`);
                });
            }
            
            results.categories[category] = {
                expectedBadges: badges,
                foundProperties: matchingProperties.length,
                properties: propertiesList,
                bairrosDistribution: bairrosCount
            };
        }
        
        console.groupEnd();
        
        console.group('📊 RESUMO DO DIAGNÓSTICO');
        for (const [category, data] of Object.entries(results.categories)) {
            const status = data.foundProperties > 0 ? '✅' : '⚠️';
            console.log(`${status} ${category}: ${data.foundProperties} imóvel(is)`);
        }
        console.groupEnd();
        
        return results;
    };
    
    // ==========================================================
    // FUNÇÃO 2: Diagnóstico de Bairros Faltantes
    // ==========================================================
    window.diagnoseMissingBairros = function() {
        console.group('🔍 DIAGNÓSTICO DE BAIRROS FALTANTES');
        
        if (!window.properties || !Array.isArray(window.properties)) {
            console.error('❌ window.properties não encontrado!');
            console.groupEnd();
            return { error: 'Propriedades não carregadas' };
        }
        
        const properties = window.properties;
        const missingBairros = [];
        const validBairros = [];
        
        properties.forEach(property => {
            const bairro = extractBairroFromLocation(property.location);
            if (bairro === '❓ NÃO IDENTIFICADO' || !property.location || property.location.trim() === '') {
                missingBairros.push({
                    id: property.id,
                    title: property.title,
                    location: property.location || '(vazio)'
                });
            } else {
                validBairros.push({
                    id: property.id,
                    title: property.title,
                    location: property.location,
                    bairro: bairro
                });
            }
        });
        
        console.log(`📊 Total de imóveis: ${properties.length}`);
        console.log(`✅ Com bairro identificado: ${validBairros.length}`);
        console.log(`⚠️ Sem bairro identificado: ${missingBairros.length}`);
        
        if (missingBairros.length > 0) {
            console.warn('\n⚠️ IMÓVEIS COM PROBLEMAS DE LOCALIZAÇÃO:');
            missingBairros.forEach(p => {
                console.warn(`   - ID ${p.id}: "${p.title}" - Localização: "${p.location}"`);
            });
        } else {
            console.log('✅ Todos os imóveis têm localização válida!');
        }
        
        const uniqueBairros = [...new Set(validBairros.map(v => v.bairro))].sort();
        console.log('\n📌 BAIRROS IDENTIFICADOS:');
        uniqueBairros.forEach(bairro => {
            const count = validBairros.filter(v => v.bairro === bairro).length;
            console.log(`   - ${bairro}: ${count} imóvel(is)`);
        });
        
        console.groupEnd();
        
        return {
            total: properties.length,
            valid: validBairros.length,
            missing: missingBairros.length,
            missingList: missingBairros,
            uniqueBairros: uniqueBairros
        };
    };
    
    // ==========================================================
    // FUNÇÃO 3: Distribuição de Badges por Categoria
    // ==========================================================
    window.diagnoseBadgeDistribution = function() {
        console.group('📊 DISTRIBUIÇÃO DE BADGES POR CATEGORIA');
        
        if (!window.properties || !Array.isArray(window.properties)) {
            console.error('❌ window.properties não encontrado!');
            console.groupEnd();
            return { error: 'Propriedades não carregadas' };
        }
        
        const properties = window.properties;
        const distribution = {};
        
        for (const [category, config] of Object.entries(CONFIG.categories)) {
            distribution[category] = {
                expectedBadges: config.badges,
                found: {},
                total: 0
            };
            config.badges.forEach(badge => {
                distribution[category].found[badge] = 0;
            });
        }
        
        properties.forEach(property => {
            if (!property.badge) return;
            
            for (const [category, config] of Object.entries(CONFIG.categories)) {
                if (config.badges.includes(property.badge)) {
                    distribution[category].found[property.badge]++;
                    distribution[category].total++;
                    break;
                }
            }
        });
        
        let hasIssues = false;
        for (const [category, data] of Object.entries(distribution)) {
            console.log(`\n📌 ${category}:`);
            console.log(`   Total: ${data.total} imóvel(is)`);
            
            for (const [badge, count] of Object.entries(data.found)) {
                const status = count > 0 ? '✅' : '⚠️';
                console.log(`   ${status} ${badge}: ${count} imóvel(is)`);
                if (count === 0) hasIssues = true;
            }
        }
        
        if (!hasIssues) {
            console.log('\n✅ Distribuição de badges OK!');
        }
        
        console.groupEnd();
        return distribution;
    };
    
    // ==========================================================
    // FUNÇÃO 4: VALIDAÇÃO DE MAPEAMENTO CATEGORIA → BADGE + TIPO (NOVA)
    // ==========================================================
    window.validateCategoryBadgeTypeMapping = function() {
        console.group('🔍 VALIDAÇÃO DE MAPEAMENTO CATEGORIA → BADGE + TIPO');
        
        if (!window.properties || !Array.isArray(window.properties)) {
            console.error('❌ window.properties não encontrado!');
            console.groupEnd();
            return { error: 'Propriedades não carregadas' };
        }
        
        const properties = window.properties;
        const results = {
            timestamp: new Date().toISOString(),
            totalProperties: properties.length,
            categories: {},
            issues: []
        };
        
        for (const [category, config] of Object.entries(CONFIG.categories)) {
            console.log(`\n📌 Categoria: ${category}`);
            console.log(`   Badges esperados: ${config.badges.join(', ')}`);
            console.log(`   Tipos esperados: ${config.tipos.join(', ')}`);
            
            // Imóveis corretos (badge E tipo corretos)
            const correctProperties = properties.filter(p => 
                p.badge && config.badges.includes(p.badge) &&
                p.type && config.tipos.includes(p.type)
            );
            
            console.log(`   ✅ IMÓVEIS CORRETOS: ${correctProperties.length}`);
            
            // Imóveis com badge correto mas tipo incorreto
            const wrongTypeProperties = properties.filter(p => 
                p.badge && config.badges.includes(p.badge) &&
                (!p.type || !config.tipos.includes(p.type))
            );
            
            if (wrongTypeProperties.length > 0) {
                console.warn(`   ⚠️ IMÓVEIS COM BADGE MAS TIPO INCORRETO: ${wrongTypeProperties.length}`);
                wrongTypeProperties.forEach(p => {
                    console.warn(`      - "${p.title}" (badge: ${p.badge}, type: ${p.type || 'não definido'})`);
                    results.issues.push({
                        category,
                        title: p.title,
                        badge: p.badge,
                        type: p.type || 'não definido',
                        issue: 'Badge correto mas tipo incorreto ou não definido'
                    });
                });
            }
            
            // Imóveis com badge que não pertence a esta categoria (mas podem estar em outra)
            const unrelatedProperties = properties.filter(p => 
                p.badge && config.badges.includes(p.badge) &&
                p.type && !config.tipos.includes(p.type)
            );
            
            results.categories[category] = {
                expectedBadges: config.badges,
                expectedTypes: config.tipos,
                correctCount: correctProperties.length,
                wrongTypeCount: wrongTypeProperties.length,
                correctProperties: correctProperties.map(p => ({
                    id: p.id,
                    title: p.title,
                    badge: p.badge,
                    type: p.type
                })),
                wrongTypeProperties: wrongTypeProperties.map(p => ({
                    id: p.id,
                    title: p.title,
                    badge: p.badge,
                    type: p.type || 'não definido'
                }))
            };
        }
        
        // Resumo final
        console.log('\n📊 RESUMO DA VALIDAÇÃO:');
        if (results.issues.length === 0) {
            console.log('✅ TODOS OS IMÓVEIS ESTÃO CORRETOS!');
            console.log('   (Badges e tipos consistentes com as categorias)');
        } else {
            console.warn(`⚠️ ${results.issues.length} PROBLEMA(S) ENCONTRADO(S):`);
            results.issues.forEach(issue => {
                console.warn(`   - ${issue.category}: "${issue.title}" - Badge: ${issue.badge}, Tipo: ${issue.type}`);
            });
        }
        
        console.groupEnd();
        return results;
    };
    
    // ==========================================================
    // FUNÇÃO 5: Diagnóstico Completo (Todas as Análises)
    // ==========================================================
    window.runPropertyDataDiagnostic = function() {
        console.log('🏠 Iniciando diagnóstico completo de dados de propriedades...\n');
        
        const results = {
            timestamp: new Date().toISOString(),
            version: CONFIG.version,
            propertiesLoaded: !!(window.properties && Array.isArray(window.properties)),
            totalProperties: window.properties?.length || 0
        };
        
        if (!results.propertiesLoaded) {
            console.error('❌ Imóveis não carregados! Aguarde o carregamento e tente novamente.');
            return results;
        }
        
        // Executar todos os diagnósticos
        console.log('📋 Executando diagnósticos...\n');
        
        results.categoryBairros = window.diagnoseCategoryBairros();
        results.missingBairros = window.diagnoseMissingBairros();
        results.badgeDistribution = window.diagnoseBadgeDistribution();
        results.categoryBadgeTypeMapping = window.validateCategoryBadgeTypeMapping();
        
        // Resumo final
        console.group('\n🎯 RESUMO FINAL DO DIAGNÓSTICO');
        console.log(`📊 Total de imóveis analisados: ${results.totalProperties}`);
        console.log(`🏷️ Categorias configuradas: ${Object.keys(CONFIG.categories).length}`);
        
        const totalBadges = Object.values(CONFIG.categories).flatMap(c => c.badges).length;
        console.log(`🎖️ Total de badges mapeados: ${totalBadges}`);
        
        const missingCount = results.missingBairros?.missing || 0;
        if (missingCount > 0) {
            console.warn(`⚠️ ${missingCount} imóvel(is) com localização não identificada`);
        } else {
            console.log('✅ Todos os imóveis têm localização válida!');
        }
        
        const issuesCount = results.categoryBadgeTypeMapping?.issues?.length || 0;
        if (issuesCount > 0) {
            console.warn(`⚠️ ${issuesCount} problema(s) de mapeamento categoria-badge-tipo encontrado(s)`);
        } else {
            console.log('✅ Mapeamento categoria-badge-tipo está consistente!');
        }
        
        console.groupEnd();
        
        if (window.location.search.includes('debug=true')) {
            showDiagnosticNotification(results);
        }
        
        return results;
    };
    
    // ==========================================================
    // FUNÇÃO 6: Validação Legado (Apenas Badges)
    // ==========================================================
    window.validateCategoryBadgeMapping = function() {
        console.group('🔍 VALIDAÇÃO DE MAPEAMENTO CATEGORIA vs BADGE (Legado)');
        
        const issues = [];
        const validMappings = [];
        
        for (const [category, config] of Object.entries(CONFIG.categories)) {
            const badges = config.badges;
            console.log(`\n📌 Validando ${category}:`);
            
            badges.forEach(badge => {
                const usedInProperties = window.properties?.filter(p => p.badge === badge).length || 0;
                const status = usedInProperties > 0 ? '✅' : '⚠️';
                console.log(`   ${status} Badge "${badge}" usado em ${usedInProperties} imóvel(is)`);
                
                if (usedInProperties === 0) {
                    issues.push({
                        category,
                        badge,
                        issue: 'Badge não utilizado em nenhum imóvel',
                        severity: 'low'
                    });
                } else {
                    validMappings.push({ category, badge, count: usedInProperties });
                }
            });
        }
        
        if (issues.length === 0) {
            console.log('\n✅ Todos os badges estão sendo utilizados corretamente!');
        } else {
            console.warn('\n⚠️ Problemas encontrados:');
            issues.forEach(issue => {
                console.warn(`   - ${issue.category}: Badge "${issue.badge}" - ${issue.issue}`);
            });
        }
        
        console.groupEnd();
        return { issues, validMappings };
    };
    
    // ==========================================================
    // FUNÇÃO 7: Exportar Relatório de Dados
    // ==========================================================
    window.exportPropertyDataReport = function() {
        console.log('📊 Exportando relatório de dados de propriedades...');
        
        const report = {
            exportDate: new Date().toISOString(),
            version: CONFIG.version,
            totalProperties: window.properties?.length || 0,
            categories: CONFIG.categories,
            diagnostics: {
                categoryBairros: window.diagnoseCategoryBairros(),
                missingBairros: window.diagnoseMissingBairros(),
                badgeDistribution: window.diagnoseBadgeDistribution(),
                categoryBadgeTypeMapping: window.validateCategoryBadgeTypeMapping(),
                categoryBadgeMapping: window.validateCategoryBadgeMapping()
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `property-data-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('✅ Relatório exportado com sucesso!');
        return report;
    };
    
    // ==========================================================
    // NOTIFICAÇÃO VISUAL (MODO DEBUG)
    // ==========================================================
    function showDiagnosticNotification(results) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 80px;
            background: linear-gradient(135deg, #1a5276, #2980b9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 999999;
            font-family: monospace;
            font-size: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
            cursor: pointer;
        `;
        
        const issuesCount = results.categoryBadgeTypeMapping?.issues?.length || 0;
        const missingCount = results.missingBairros?.missing || 0;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>🏠</span>
                <div>
                    <div style="font-weight: bold;">Diagnóstico de Dados Concluído</div>
                    <div style="font-size: 10px; opacity: 0.8;">
                        ${results.totalProperties} imóveis | 
                        ${issuesCount > 0 ? `⚠️ ${issuesCount} problemas` : '✅ OK'}
                        ${missingCount > 0 ? ` | ⚠️ ${missingCount} sem bairro` : ''}
                    </div>
                </div>
                <button style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">✕</button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => notification.remove());
        
        notification.addEventListener('click', (e) => {
            if (e.target !== closeBtn) {
                window.runPropertyDataDiagnostic();
                notification.remove();
            }
        });
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 8000);
    }
    
    // ==========================================================
    // BOTÃO FLUTUANTE DE DIAGNÓSTICO
    // ==========================================================
    function createDiagnosticButton() {
        if (document.getElementById('property-data-diagnostic-btn')) return;
        
        const btn = document.createElement('div');
        btn.id = 'property-data-diagnostic-btn';
        btn.innerHTML = '🏠';
        btn.title = 'Diagnóstico de Dados de Propriedades (Categorias, Badges, Tipos, Bairros)';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999998;
            box-shadow: 0 4px 15px rgba(0,0,0,0.35);
            font-size: 24px;
            transition: all 0.3s ease;
            border: 2px solid rgba(255,255,255,0.25);
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.12)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('click', () => {
            window.runPropertyDataDiagnostic();
        });
        
        document.body.appendChild(btn);
        console.log('✅ Botão 🏠 de diagnóstico de dados adicionado');
    }
    
    // ==========================================================
    // REGISTRO NO DIAGNOSTIC REGISTRY
    // ==========================================================
    function registerDiagnosticFunctions() {
        if (!window.DiagnosticRegistry) {
            console.log('ℹ️ DiagnosticRegistry não disponível, registro adiado');
            setTimeout(registerDiagnosticFunctions, 1000);
            return;
        }
        
        window.DiagnosticRegistry.register('diagnoseCategoryBairros', window.diagnoseCategoryBairros, 'data', {
            isSafe: true,
            description: 'Diagnostica imóveis por categoria e bairro'
        });
        
        window.DiagnosticRegistry.register('diagnoseMissingBairros', window.diagnoseMissingBairros, 'data', {
            isSafe: true,
            description: 'Identifica imóveis sem bairro identificado'
        });
        
        window.DiagnosticRegistry.register('diagnoseBadgeDistribution', window.diagnoseBadgeDistribution, 'data', {
            isSafe: true,
            description: 'Analisa distribuição de badges por categoria'
        });
        
        window.DiagnosticRegistry.register('validateCategoryBadgeTypeMapping', window.validateCategoryBadgeTypeMapping, 'data', {
            isSafe: true,
            description: 'Valida mapeamento de categorias vs badges e tipos (NOVO)'
        });
        
        window.DiagnosticRegistry.register('runPropertyDataDiagnostic', window.runPropertyDataDiagnostic, 'data', {
            isSafe: true,
            description: 'Executa diagnóstico completo de dados de propriedades'
        });
        
        window.DiagnosticRegistry.register('validateCategoryBadgeMapping', window.validateCategoryBadgeMapping, 'data', {
            isSafe: true,
            description: 'Valida mapeamento de categorias vs badges (legado)'
        });
        
        window.DiagnosticRegistry.register('exportPropertyDataReport', window.exportPropertyDataReport, 'data', {
            isSafe: true,
            description: 'Exporta relatório completo em JSON'
        });
        
        console.log('✅ Funções de diagnóstico de dados registradas no DiagnosticRegistry');
    }
    
    // ==========================================================
    // ADICIONAR AO PAINEL UNIFICADO
    // ==========================================================
    function addToUnifiedPanel() {
        const checkPanel = setInterval(() => {
            const panel = document.getElementById('diagnostics-panel-complete');
            if (panel) {
                clearInterval(checkPanel);
                
                const buttonContainer = panel.querySelector('.diagnostic-buttons');
                if (buttonContainer && !document.getElementById('property-data-diagnostic-btn-panel')) {
                    const dataBtn = document.createElement('button');
                    dataBtn.id = 'property-data-diagnostic-btn-panel';
                    dataBtn.innerHTML = '🏠 ANALISAR DADOS v6.5.3';
                    dataBtn.title = 'Diagnóstico de dados de propriedades (categorias, badges, tipos, bairros)';
                    dataBtn.style.cssText = `
                        background: linear-gradient(45deg, #27ae60, #2ecc71);
                        color: white;
                        border: none;
                        padding: 8px 12px;
                        cursor: pointer;
                        border-radius: 4px;
                        font-weight: bold;
                        margin: 5px;
                        transition: all 0.2s;
                        flex: 1;
                    `;
                    
                    dataBtn.addEventListener('click', () => {
                        window.runPropertyDataDiagnostic();
                    });
                    
                    buttonContainer.appendChild(dataBtn);
                    console.log('✅ Botão de análise de dados adicionado ao painel unificado');
                }
            }
        }, 2000);
    }
    
    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================
    function init() {
        console.log(`🔧 Inicializando módulo de análise de dados de propriedades ${CONFIG.version}`);
        
        registerDiagnosticFunctions();
        
        if (window.location.search.includes('debug=true')) {
            setTimeout(() => {
                createDiagnosticButton();
                addToUnifiedPanel();
            }, 2000);
        }
        
        if (window.location.search.includes('debug=true') && 
            window.location.search.includes('diagnose-data=true')) {
            setTimeout(() => {
                console.log('🔍 Auto-execução: runPropertyDataDiagnostic()');
                window.runPropertyDataDiagnostic();
            }, 3000);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ==========================================================
    // LOG FINAL
    // ==========================================================
    console.log('%c✅ diagnostics64.js v6.5.3 carregado - Análise de Dados de Propriedades', 
                'color: #27ae60; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px;');
    
    console.log('📋 COMANDOS DISPONÍVEIS:');
    console.log('   - window.diagnoseCategoryBairros()          → Diagnóstico de bairros por categoria');
    console.log('   - window.diagnoseMissingBairros()           → Identifica imóveis sem bairro');
    console.log('   - window.diagnoseBadgeDistribution()        → Distribuição de badges');
    console.log('   - window.validateCategoryBadgeTypeMapping() → Valida CATEGORIA → BADGE + TIPO (NOVO)');
    console.log('   - window.runPropertyDataDiagnostic()        → Diagnóstico COMPLETO');
    console.log('   - window.validateCategoryBadgeMapping()     → Valida mapeamento (legado)');
    console.log('   - window.exportPropertyDataReport()         → Exporta relatório JSON');
    
})();

// ===================================================================
// FIM DO ARQUIVO diagnostics64.js v6.5.3
// FINALIDADE: Análise de dados de propriedades (categorias, badges, bairros, tipos)
// NOVIDADE v6.5.3: Função validateCategoryBadgeTypeMapping (valida badge + tipo)
// AUTOR: Weber Lessa Support System
// VERSÃO: 6.5.3
// DATA: 28/04/2026
// ===================================================================
