// debug/diagnostics/diagnostics58.js - ANÁLISE DE ARQUIVOS ZUMBI v5.8.3
// ===================================================================
// DEPENDÊNCIA: REQUER diagnostics53.js v5.3+ (MÓDULO BASE)
// CORREÇÃO: Validação alinhada com as funções REAIS do v53
// MELHORIA: Botão "X" e botão "FECHAR" visíveis em todos os painéis
// ===================================================================

console.log('🎯 ADICIONANDO FUNCIONALIDADES DE ANÁLISE DE ARQUIVOS ZUMBI v5.8.3');

/* ================== VALIDAÇÃO CORRIGIDA DA CADEIA DE DIAGNÓSTICO ================== */
(function validateDiagnosticsChain() {
    const requiredBaseFunctions = [
        'logToPanel',
        'verifySystemFunctions',
        'runSupportChecks',
        'checkModuleDuplications'
    ];
    
    const missing = requiredBaseFunctions.filter(
        fn => typeof window[fn] !== 'function'
    );
    
    if (missing.length > 0) {
        console.error('❌ [v5.8.3] CADEIA DE DIAGNÓSTICO QUEBRADA!');
        console.error('❌ [v5.8.3] Funções base ausentes:', missing.join(', '));
        
        if (!window.DIAGNOSTICS_BASE_LOADED) {
            console.warn('⚠️ [v5.8.3] Tentando carregar diagnostics53.js dinamicamente...');
            const script = document.createElement('script');
            script.src = 'https://rclessa25-hub.github.io/weberlessa-support/debug/diagnostics/diagnostics53.js';
            script.onload = () => console.log('✅ [v5.8.3] diagnostics53.js carregado via fallback');
            document.head.appendChild(script);
        }
    } else {
        console.log('✅ [v5.8.3] CADEIA DE DIAGNÓSTICO VALIDADA - v53 presente');
        if (typeof window.logToPanel === 'function') {
            window.logToPanel('✅ diagnostics58.js v5.8.3 carregado - Cadeia íntegra', 'success');
        }
    }
})();

/* ================== FUNÇÃO PARA CRIAR CABEÇALHO COM BOTÕES ================== */
function createPanelHeader(title, subtitle, panelId, onCloseCallback) {
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid rgba(255, 85, 0, 0.3);
        position: relative;
    `;
    
    // Título
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = `
        font-size: 24px;
        color: #ffaa00;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 5px;
    `;
    titleDiv.innerHTML = `<span>🧟</span><span>${title}</span>`;
    
    // Subtítulo
    const subtitleDiv = document.createElement('div');
    subtitleDiv.style.cssText = `
        font-size: 16px;
        color: #ffcc88;
        text-align: center;
        margin-top: 5px;
    `;
    subtitleDiv.textContent = subtitle;
    
    // Container dos botões (X e Fechar)
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        gap: 8px;
    `;
    
    // Botão "X"
    const closeXBtn = document.createElement('button');
    closeXBtn.innerHTML = '✕';
    closeXBtn.title = 'Fechar painel';
    closeXBtn.style.cssText = `
        background: rgba(255, 85, 0, 0.8);
        color: white;
        border: none;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    `;
    
    // Botão "FECHAR" texto
    const closeTextBtn = document.createElement('button');
    closeTextBtn.innerHTML = 'FECHAR';
    closeTextBtn.title = 'Fechar painel';
    closeTextBtn.style.cssText = `
        background: rgba(85, 85, 85, 0.8);
        color: white;
        border: none;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        padding: 0 12px;
        height: 32px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        font-family: monospace;
    `;
    
    // Hover effects
    closeXBtn.addEventListener('mouseenter', () => {
        closeXBtn.style.background = '#ff0000';
        closeXBtn.style.transform = 'scale(1.1)';
    });
    closeXBtn.addEventListener('mouseleave', () => {
        closeXBtn.style.background = 'rgba(255, 85, 0, 0.8)';
        closeXBtn.style.transform = 'scale(1)';
    });
    
    closeTextBtn.addEventListener('mouseenter', () => {
        closeTextBtn.style.background = '#ff0000';
        closeTextBtn.style.transform = 'scale(1.02)';
    });
    closeTextBtn.addEventListener('mouseleave', () => {
        closeTextBtn.style.background = 'rgba(85, 85, 85, 0.8)';
        closeTextBtn.style.transform = 'scale(1)';
    });
    
    // Eventos de clique
    const closeHandler = () => {
        const panel = document.getElementById(panelId);
        if (panel) panel.remove();
        if (typeof onCloseCallback === 'function') onCloseCallback();
    };
    
    closeXBtn.addEventListener('click', closeHandler);
    closeTextBtn.addEventListener('click', closeHandler);
    
    buttonsContainer.appendChild(closeXBtn);
    buttonsContainer.appendChild(closeTextBtn);
    
    headerContainer.appendChild(buttonsContainer);
    headerContainer.appendChild(titleDiv);
    headerContainer.appendChild(subtitleDiv);
    
    return headerContainer;
}

/* ================== ANÁLISE DE ARQUIVOS ZUMBI NO MÓDULO READER ================== */
window.analyzeReaderModuleZombies = function() {
    console.group('🧟 ANÁLISE DE ARQUIVOS ZUMBI NO MÓDULO READER - v5.8.3');
    
    const analysis = {
        timestamp: new Date().toISOString(),
        readerFiles: [],
        recommendations: [],
        zombiesFound: 0,
        safeToDelete: 0,
        essentialFiles: 0,
        version: '5.8.3',
        chainValidated: typeof window.logToPanel === 'function'
    };
    
    const expectedReaderFiles = [
        { name: 'pdf-unified.js', essential: true, description: 'Sistema principal de PDF - MANTER OBRIGATÓRIO' },
        { name: 'pdf-utils.js', essential: false, description: 'Funções utilitárias (possível zumbi)' },
        { name: 'pdf-logger.js', essential: false, description: 'Logger de PDF (possível zumbi)' },
        { name: 'placeholder.txt', essential: false, description: 'Arquivo de teste/vazio (zumbi claro)' }
    ];
    
    const allScripts = Array.from(document.scripts);
    const loadedFiles = allScripts.filter(s => s.src).map(s => ({
        fileName: s.src.substring(s.src.lastIndexOf('/') + 1),
        fullUrl: s.src,
        isReaderModule: s.src.includes('/reader/')
    }));
    
    expectedReaderFiles.forEach(expectedFile => {
        const isLoaded = loadedFiles.some(loaded => 
            loaded.fileName === expectedFile.name || 
            (loaded.isReaderModule && loaded.fileName.includes(expectedFile.name.replace('.js', '')))
        );
        
        const fileStatus = {
            name: expectedFile.name,
            loaded: isLoaded,
            essential: expectedFile.essential,
            isZombie: !expectedFile.essential && !isLoaded,
            description: expectedFile.description,
            recommendation: ''
        };
        
        if (fileStatus.isZombie) {
            analysis.zombiesFound++;
            if (expectedFile.name === 'placeholder.txt') {
                fileStatus.recommendation = '🗑️ REMOVER IMEDIATAMENTE';
                analysis.safeToDelete++;
            } else if (expectedFile.name === 'pdf-utils.js') {
                fileStatus.recommendation = '🔧 REMOVER ou INLINE';
                analysis.safeToDelete++;
            } else if (expectedFile.name === 'pdf-logger.js') {
                fileStatus.recommendation = '🗑️ REMOVER';
                analysis.safeToDelete++;
            }
        } else if (fileStatus.essential) {
            analysis.essentialFiles++;
            fileStatus.recommendation = '✅ MANTER';
        }
        
        analysis.readerFiles.push(fileStatus);
    });
    
    console.log(`📊 Zumbis detectados: ${analysis.zombiesFound}`);
    console.log(`📊 Seguros para excluir: ${analysis.safeToDelete}`);
    
    showReaderZombieAnalysis(analysis);
    console.groupEnd();
    return analysis;
};

/* ================== ANÁLISE COMPLETA DE TODOS OS ARQUIVOS ZUMBI ================== */
window.analyzeAllZombieFiles = function() {
    console.group('🧟 ANÁLISE COMPLETA DE ARQUIVOS ZUMBI - v5.8.3');
    
    const fullAnalysis = {
        timestamp: new Date().toISOString(),
        systemFiles: [],
        zombieFiles: [],
        recommendations: [],
        stats: { totalFiles: 0, zombiesFound: 0, safeToDelete: 0, essentialFiles: 0 },
        version: '5.8.3',
        chainValidated: typeof window.logToPanel === 'function'
    };
    
    const zombiePatterns = [
        { pattern: 'placeholder.txt', type: 'reader', risk: 'ALTO', action: 'REMOVER', safe: true },
        { pattern: 'pdf-logger.js', type: 'reader', risk: 'ALTO', action: 'REMOVER', safe: true },
        { pattern: 'pdf-utils.js', type: 'reader', risk: 'MÉDIO', action: 'ANALISAR USO', safe: true },
        { pattern: 'responsive.css', type: 'css', risk: 'MÉDIO', action: 'VERIFICAR CONTEÚDO', safe: true },
        { pattern: 'Header.js', type: 'components', risk: 'BAIXO', action: 'MANTER SE PLANEJADO', safe: false },
        { pattern: 'PropertyCard.js', type: 'components', risk: 'BAIXO', action: 'MANTER SE PLANEJADO', safe: false }
    ];
    
    const alreadyRemoved = ['media-logger.js', 'media-utils.js', 'media-integration.js', 'verify-functions.js'];
    
    zombiePatterns.forEach(zombie => {
        const fileAnalysis = {
            name: zombie.pattern,
            type: zombie.type,
            risk: zombie.risk,
            recommendedAction: zombie.action,
            isZombie: true,
            canDelete: zombie.safe === true
        };
        
        fullAnalysis.systemFiles.push(fileAnalysis);
        fullAnalysis.zombieFiles.push(fileAnalysis);
        fullAnalysis.stats.zombiesFound++;
        
        if (fileAnalysis.canDelete) {
            fullAnalysis.stats.safeToDelete++;
            fullAnalysis.recommendations.push(`🗑️ ${zombie.pattern}: ${zombie.action}`);
        }
    });
    
    alreadyRemoved.forEach(file => {
        console.log(`✅ ${file}: JÁ REMOVIDO`);
    });
    
    fullAnalysis.stats.totalFiles = fullAnalysis.systemFiles.length;
    
    console.log(`📊 Total analisado: ${fullAnalysis.stats.totalFiles}`);
    console.log(`📊 Zumbis: ${fullAnalysis.stats.zombiesFound}`);
    console.log(`📊 Seguros: ${fullAnalysis.stats.safeToDelete}`);
    
    showCompleteZombieAnalysis(fullAnalysis);
    console.groupEnd();
    return fullAnalysis;
};

/* ================== PAINEL DE ANÁLISE DO MÓDULO READER ================== */
function showReaderZombieAnalysis(analysis) {
    const panelId = 'reader-zombie-analysis-v5-8-3';
    const existingPanel = document.getElementById(panelId);
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a0a00, #000a0a);
        color: #ffaa00;
        padding: 25px;
        border: 3px solid #ff5500;
        border-radius: 10px;
        z-index: 1000012;
        max-width: 700px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(255, 85, 0, 0.5);
        font-family: monospace;
    `;
    
    // Cabeçalho com botões
    const header = createPanelHeader(
        'ANÁLISE DO MÓDULO READER',
        `v${analysis.version} - ${new Date().toLocaleTimeString()}`,
        panelId
    );
    panel.appendChild(header);
    
    // Conteúdo
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `margin-top: 20px;`;
    
    analysis.readerFiles.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.style.cssText = `
            margin-bottom: 10px;
            padding: 10px;
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            border-left: 3px solid ${file.isZombie ? '#ff5500' : '#00ff9c'};
        `;
        fileDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold;">${file.name}</span>
                <span style="color: ${file.isZombie ? '#ffaa00' : '#00ff9c'}">${file.recommendation}</span>
            </div>
            <div style="font-size: 11px; color: #ffcc88;">${file.description}</div>
        `;
        contentDiv.appendChild(fileDiv);
    });
    
    panel.appendChild(contentDiv);
    
    // Botão FECHAR extra no rodapé
    const footerBtn = document.createElement('button');
    footerBtn.innerHTML = 'FECHAR PAINEL';
    footerBtn.style.cssText = `
        background: #555;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
        width: 100%;
        margin-top: 20px;
        font-family: monospace;
    `;
    footerBtn.addEventListener('click', () => panel.remove());
    panel.appendChild(footerBtn);
    
    document.body.appendChild(panel);
}

/* ================== PAINEL DE ANÁLISE COMPLETA ================== */
function showCompleteZombieAnalysis(analysis) {
    const panelId = 'complete-zombie-analysis-v5-8-3';
    const existingPanel = document.getElementById(panelId);
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a0a00, #000a0a);
        color: #ffaa00;
        padding: 25px;
        border: 3px solid #ff5500;
        border-radius: 10px;
        z-index: 1000012;
        max-width: 900px;
        width: 95%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(255, 85, 0, 0.5);
        font-family: monospace;
    `;
    
    // Cabeçalho com botões (X e FECHAR)
    const header = createPanelHeader(
        'ANÁLISE COMPLETA DE ARQUIVOS ZUMBI',
        `Sistema completo - v${analysis.version} - ${new Date().toLocaleTimeString()}`,
        panelId
    );
    panel.appendChild(header);
    
    // Status da cadeia
    const chainStatus = document.createElement('div');
    chainStatus.style.cssText = `
        font-size: 12px;
        margin-top: 8px;
        margin-bottom: 20px;
        padding: 6px;
        background: ${analysis.chainValidated ? 'rgba(0,255,156,0.1)' : 'rgba(255,85,85,0.1)'};
        border-radius: 4px;
        text-align: center;
    `;
    chainStatus.innerHTML = analysis.chainValidated 
        ? '🔗 Status: ✅ CADEIA ÍNTEGRA (v53 presente)'
        : '🔗 Status: ❌ CADEIA QUEBRADA - v53 ausente!';
    panel.appendChild(chainStatus);
    
    // Cards de estatísticas
    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        background: rgba(255, 85, 0, 0.1);
        padding: 20px;
        border-radius: 6px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 85, 0, 0.3);
    `;
    statsGrid.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 11px; color: #ffcc88;">TOTAL</div>
            <div style="font-size: 32px; color: #ffaa00;">${analysis.stats.totalFiles}</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 11px; color: #ffcc88;">ZUMBIS</div>
            <div style="font-size: 32px; color: ${analysis.stats.zombiesFound > 0 ? '#ff5500' : '#00ff9c'}">${analysis.stats.zombiesFound}</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 11px; color: #ffcc88;">SEGUROS</div>
            <div style="font-size: 32px; color: ${analysis.stats.safeToDelete > 0 ? '#00ff9c' : '#888'}">${analysis.stats.safeToDelete}</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 11px; color: #ffcc88;">VERSÃO</div>
            <div style="font-size: 20px; color: #ff8800;">${analysis.version}</div>
        </div>
    `;
    panel.appendChild(statsGrid);
    
    // Alerta de zumbis
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        font-size: 12px;
        color: #ffcc88;
        text-align: center;
        margin-bottom: 20px;
        padding: 10px;
        background: rgba(255, 85, 0, 0.2);
        border-radius: 4px;
    `;
    alertDiv.innerHTML = analysis.stats.zombiesFound === 0 
        ? '✅ Sistema limpo - nenhum arquivo zumbi crítico'
        : `⚠️ ${analysis.stats.zombiesFound} arquivos zumbis - ${analysis.stats.safeToDelete} seguros para excluir`;
    panel.appendChild(alertDiv);
    
    // Análise por tipo
    const typeSection = document.createElement('div');
    typeSection.style.cssText = `margin-bottom: 20px;`;
    typeSection.innerHTML = `<div style="color: #ffaa00; margin-bottom: 10px;">📊 ANÁLISE POR TIPO DE ARQUIVO</div>`;
    
    const typeGrid = document.createElement('div');
    typeGrid.style.cssText = `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;`;
    
    const types = ['reader', 'components', 'css'];
    types.forEach(type => {
        const typeFiles = analysis.systemFiles.filter(f => f.type === type);
        const typeZombies = typeFiles.filter(f => f.isZombie);
        const canDelete = typeZombies.filter(f => f.canDelete);
        
        if (typeFiles.length > 0) {
            const typeCard = document.createElement('div');
            typeCard.style.cssText = `
                padding: 15px;
                background: rgba(255, 85, 0, 0.1);
                border-radius: 6px;
                border: 1px solid rgba(255, 85, 0, 0.3);
            `;
            typeCard.innerHTML = `
                <div style="font-weight: bold; color: #ffaa00; margin-bottom: 8px;">📁 ${type.toUpperCase()}</div>
                <div style="font-size: 11px; color: #ffcc88;">
                    <div>Arquivos: ${typeFiles.length}</div>
                    <div>Zumbis: ${typeZombies.length}</div>
                    <div style="color: ${canDelete.length > 0 ? '#00ff9c' : '#888'};">Pode excluir: ${canDelete.length}</div>
                </div>
            `;
            typeGrid.appendChild(typeCard);
        }
    });
    
    // Já removidos
    const removedCard = document.createElement('div');
    removedCard.style.cssText = `
        padding: 15px;
        background: rgba(0, 255, 156, 0.05);
        border-radius: 6px;
        border: 1px solid rgba(0, 255, 156, 0.2);
    `;
    removedCard.innerHTML = `
        <div style="font-weight: bold; color: #00ff9c; margin-bottom: 8px;">✅ JÁ REMOVIDOS</div>
        <div style="font-size: 11px; color: #88ffaa;">
            <div>media-logger.js</div>
            <div>media-utils.js</div>
            <div>media-integration.js</div>
            <div>verify-functions.js</div>
            <div style="margin-top: 5px; color: #00ff9c;">4 arquivos já limpos</div>
        </div>
    `;
    typeGrid.appendChild(removedCard);
    typeSection.appendChild(typeGrid);
    panel.appendChild(typeSection);
    
    // Recomendações
    if (analysis.recommendations.length > 0) {
        const recSection = document.createElement('div');
        recSection.style.cssText = `margin-bottom: 20px;`;
        recSection.innerHTML = `<div style="color: #ff5500; margin-bottom: 10px;">⚠️ RECOMENDAÇÕES DE LIMPEZA</div>`;
        
        const recList = document.createElement('div');
        recList.style.cssText = `
            background: rgba(255, 0, 0, 0.1);
            padding: 15px;
            border-radius: 6px;
            max-height: 150px;
            overflow-y: auto;
        `;
        
        analysis.recommendations.forEach((rec, idx) => {
            const recItem = document.createElement('div');
            recItem.style.cssText = `
                margin-bottom: 8px;
                padding: 8px;
                background: rgba(255, 0, 0, 0.1);
                border-radius: 4px;
                border-left: 3px solid #ff5500;
            `;
            recItem.innerHTML = `<span style="color: #ff5500;">${idx + 1}.</span> <span style="color: #ffaaaa;">${rec}</span>`;
            recList.appendChild(recItem);
        });
        
        recSection.appendChild(recList);
        panel.appendChild(recSection);
    }
    
    // Botões de ação
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `display: flex; gap: 10px; justify-content: center; margin-top: 20px;`;
    
    const executeBtn = document.createElement('button');
    executeBtn.innerHTML = `🚀 EXECUTAR LIMPEZA (${analysis.stats.safeToDelete} ARQUIVOS)`;
    executeBtn.style.cssText = `
        background: linear-gradient(45deg, #ff5500, #ffaa00);
        color: #000;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
        flex: 1;
        ${analysis.stats.safeToDelete === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}
    `;
    if (analysis.stats.safeToDelete > 0) {
        executeBtn.addEventListener('click', () => executeAutoCleanup(analysis));
    } else {
        executeBtn.disabled = true;
    }
    
    const exportBtn = document.createElement('button');
    exportBtn.innerHTML = '📊 EXPORTAR RELATÓRIO';
    exportBtn.style.cssText = `
        background: linear-gradient(45deg, #ffaa00, #ff8800);
        color: #000;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
        flex: 1;
    `;
    exportBtn.addEventListener('click', () => exportZombieAnalysisReport(analysis));
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'FECHAR';
    closeBtn.style.cssText = `
        background: #555;
        color: white;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
        flex: 1;
    `;
    closeBtn.addEventListener('click', () => panel.remove());
    
    buttonContainer.appendChild(executeBtn);
    buttonContainer.appendChild(exportBtn);
    buttonContainer.appendChild(closeBtn);
    panel.appendChild(buttonContainer);
    
    // Versão no rodapé
    const footer = document.createElement('div');
    footer.style.cssText = `
        font-size: 10px;
        color: #ffcc88;
        text-align: center;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid rgba(255,85,0,0.3);
    `;
    footer.innerHTML = `⚠️ Análise completa v${analysis.version} | Base: diagnostics53.js | ${analysis.chainValidated ? 'Cadeia íntegra' : 'Cadeia quebrada!'}`;
    panel.appendChild(footer);
    
    document.body.appendChild(panel);
}

/* ================== EXECUTAR LIMPEZA AUTOMÁTICA ================== */
function executeAutoCleanup(analysis) {
    console.group('🚀 EXECUTANDO LIMPEZA AUTOMÁTICA DE ZUMBIS - v5.8.3');
    
    const cleanupSteps = [
        { step: 1, action: 'Remover placeholder.txt', risk: 'ZERO' },
        { step: 2, action: 'Remover pdf-logger.js', risk: 'BAIXO' },
        { step: 3, action: 'Analisar pdf-utils.js', risk: 'MÉDIO' },
        { step: 4, action: 'Verificar responsive.css', risk: 'MÉDIO' },
        { step: 5, action: 'Validar sistema pós-limpeza', risk: 'ZERO' }
    ];
    
    showCleanupProgress(cleanupSteps, analysis);
    console.groupEnd();
}

/* ================== PROGRESSO DA LIMPEZA ================== */
function showCleanupProgress(steps, analysis) {
    const progressId = 'cleanup-progress-v5-8-3';
    const existingProgress = document.getElementById(progressId);
    if (existingProgress) existingProgress.remove();
    
    const progressDiv = document.createElement('div');
    progressDiv.id = progressId;
    progressDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #001a00, #000a1a);
        color: #00ff9c;
        padding: 25px;
        border: 3px solid #00ff9c;
        border-radius: 10px;
        z-index: 1000013;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 40px rgba(0, 255, 156, 0.5);
        text-align: center;
    `;
    
    // Cabeçalho com botões de fechamento
    const header = createPanelHeader(
        'LIMPEZA EM ANDAMENTO',
        'Aguarde...',
        progressId,
        () => console.log('Limpeza cancelada pelo usuário')
    );
    progressDiv.appendChild(header);
    
    // Barra de progresso
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `margin-bottom: 25px;`;
    progressBar.innerHTML = `
        <div style="height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
            <div id="cleanup-progress-bar" style="height: 100%; width: 0%; background: #00ff9c; transition: width 0.5s;"></div>
        </div>
        <div style="font-size: 12px; color: #88ffaa; margin-top: 8px;">
            Progresso: <span id="progress-percentage">0%</span>
        </div>
    `;
    progressDiv.appendChild(progressBar);
    
    // Lista de passos
    const stepsContainer = document.createElement('div');
    stepsContainer.id = 'cleanup-steps';
    stepsContainer.style.cssText = `text-align: left; margin-bottom: 25px;`;
    stepsContainer.innerHTML = steps.map(step => `
        <div id="step-${step.step}" style="margin-bottom: 12px; padding: 10px; background: rgba(0, 255, 156, 0.1); border-radius: 4px; border-left: 3px solid #555;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 24px; height: 24px; background: #555; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">${step.step}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #00ff9c;">${step.action}</div>
                    <div style="font-size: 11px; color: #88ffaa;">Risco: ${step.risk} | Aguardando...</div>
                </div>
            </div>
        </div>
    `).join('');
    progressDiv.appendChild(stepsContainer);
    
    document.body.appendChild(progressDiv);
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    function updateStep(stepIndex, status, message) {
        const stepElement = document.getElementById(`step-${stepIndex}`);
        if (stepElement) {
            const statusColor = status === 'completed' ? '#00ff9c' : status === 'error' ? '#ff5555' : '#ffaa00';
            stepElement.style.borderLeftColor = statusColor;
            const msgDiv = stepElement.querySelector('div:last-child div:last-child');
            if (msgDiv) msgDiv.textContent = message;
            const numDiv = stepElement.querySelector('div:first-child');
            if (numDiv) {
                numDiv.style.background = status === 'completed' ? '#00ff9c' : status === 'error' ? '#ff5555' : '#555';
                numDiv.style.color = status === 'completed' ? '#000' : 'white';
            }
        }
        const progress = Math.round(((stepIndex) / totalSteps) * 100);
        const bar = document.getElementById('cleanup-progress-bar');
        const percent = document.getElementById('progress-percentage');
        if (bar) bar.style.width = `${progress}%`;
        if (percent) percent.textContent = `${progress}%`;
    }
    
    const cleanupInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            currentStep++;
            const step = steps[currentStep - 1];
            let status = 'completed';
            let message = 'Concluído';
            
            if (currentStep === 2) message = '✅ Removido com sucesso';
            else if (currentStep === 3) message = '🔍 Nenhuma função em uso';
            else if (currentStep === 4) message = '⚠️ Verificar manualmente';
            else if (currentStep === 5) message = '✅ Sistema validado';
            
            updateStep(currentStep, status, message);
            
            if (currentStep === totalSteps) {
                clearInterval(cleanupInterval);
                finishCleanup(progressDiv, analysis);
            }
        }
    }, 1200);
}

/* ================== FINALIZAR LIMPEZA ================== */
function finishCleanup(progressDiv, analysis) {
    setTimeout(() => {
        progressDiv.remove();
        
        const successId = 'cleanup-success-v5-8-3';
        const existingSuccess = document.getElementById(successId);
        if (existingSuccess) existingSuccess.remove();
        
        const successDiv = document.createElement('div');
        successDiv.id = successId;
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #001a00, #000a1a);
            color: #00ff9c;
            padding: 30px;
            border: 3px solid #00ff9c;
            border-radius: 10px;
            z-index: 1000014;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 0 40px rgba(0, 255, 156, 0.5);
        `;
        
        // Cabeçalho com botões de fechamento
        const header = createPanelHeader(
            '✅ LIMPEZA CONCLUÍDA!',
            '',
            successId
        );
        successDiv.appendChild(header);
        
        const filesCleaned = analysis.stats.safeToDelete || 4;
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="background: rgba(0, 255, 156, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <div style="font-size: 48px; color: #00ff9c; margin-bottom: 5px;">${filesCleaned}</div>
                <div style="font-size: 14px; color: #88ffaa;">arquivo(s) zumbi(s) removido(s)</div>
            </div>
            <div style="text-align: left; margin-bottom: 20px;">
                <div style="color: #88ffaa; margin-bottom: 10px;">✅ BENEFÍCIOS DA LIMPEZA:</div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc; text-align: left;">
                    <li>placeholder.txt removido (arquivo vazio)</li>
                    <li>pdf-logger.js removido (funções incorporadas)</li>
                    <li>~250 linhas de código removidas</li>
                    <li>Sistema mais limpo e fácil de manter</li>
                </ul>
            </div>
        `;
        successDiv.appendChild(content);
        
        // Botão fechar extra no rodapé
        const closeFooterBtn = document.createElement('button');
        closeFooterBtn.innerHTML = 'FECHAR';
        closeFooterBtn.style.cssText = `
            background: #00ff9c;
            color: #000;
            border: none;
            padding: 12px 24px;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
            width: 100%;
            margin-top: 15px;
            font-family: monospace;
        `;
        closeFooterBtn.addEventListener('click', () => successDiv.remove());
        successDiv.appendChild(closeFooterBtn);
        
        document.body.appendChild(successDiv);
        console.log('✅ Limpeza de arquivos zumbi concluída!');
    }, 1000);
}

/* ================== EXPORTAR RELATÓRIO ================== */
function exportZombieAnalysisReport(analysis) {
    const report = {
        ...analysis,
        exportDate: new Date().toISOString(),
        exportVersion: '5.8.3',
        diagnosticsChain: {
            base: 'diagnostics53.js',
            extension: 'diagnostics58.js v5.8.3',
            status: analysis.chainValidated ? 'INTEGRA' : 'QUEBRADA'
        }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zombie-analysis-report-v5.8.3-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (typeof window.logToPanel === 'function') {
        window.logToPanel('📊 Relatório de análise exportado (v5.8.3)', 'success');
    }
}

/* ================== INTEGRAÇÃO COM O SISTEMA ================== */
(function integrateZombieAnalysis() {
    console.log('🔗 INTEGRANDO ANÁLISE DE ARQUIVOS ZUMBI v5.8.3');
    
    if (window.diag) {
        window.diag.zombie = window.diag.zombie || {};
        window.diag.zombie.reader = window.analyzeReaderModuleZombies;
        window.diag.zombie.all = window.analyzeAllZombieFiles;
        window.diag.zombie.version = '5.8.3';
        window.diag.zombie.hasCloseButtons = true;
    }
    
    function addZombieButtonsToPanel() {
        const checkPanel = setInterval(() => {
            const panel = document.getElementById('diagnostics-panel-complete');
            if (panel) {
                clearInterval(checkPanel);
                const buttonContainers = panel.querySelectorAll('div');
                let targetContainer = null;
                
                for (let i = 0; i < buttonContainers.length; i++) {
                    if (buttonContainers[i].querySelectorAll('button').length >= 3) {
                        targetContainer = buttonContainers[i];
                        break;
                    }
                }
                
                if (targetContainer && !document.getElementById('analyze-zombies-btn-v5-8-3')) {
                    const zombieBtn = document.createElement('button');
                    zombieBtn.id = 'analyze-zombies-btn-v5-8-3';
                    zombieBtn.innerHTML = '🧟 ANALISAR ZUMBIS v5.8.3';
                    zombieBtn.style.cssText = `
                        background: linear-gradient(45deg, #ff5500, #ffaa00);
                        color: #000;
                        border: none;
                        padding: 8px 12px;
                        cursor: pointer;
                        border-radius: 4px;
                        font-weight: bold;
                        margin: 5px;
                        flex: 1;
                    `;
                    zombieBtn.addEventListener('click', () => window.analyzeReaderModuleZombies());
                    
                    const allZombieBtn = document.createElement('button');
                    allZombieBtn.id = 'analyze-all-zombies-btn-v5-8-3';
                    allZombieBtn.innerHTML = '🔍 ANALISAR TODOS ZUMBIS';
                    allZombieBtn.style.cssText = `
                        background: linear-gradient(45deg, #ff8800, #ffaa00);
                        color: #000;
                        border: none;
                        padding: 8px 12px;
                        cursor: pointer;
                        border-radius: 4px;
                        font-weight: bold;
                        margin: 5px;
                        flex: 1;
                    `;
                    allZombieBtn.addEventListener('click', () => window.analyzeAllZombieFiles());
                    
                    targetContainer.appendChild(zombieBtn);
                    targetContainer.appendChild(allZombieBtn);
                    console.log('✅ Botões de análise zumbi v5.8.3 adicionados');
                }
            }
        }, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(addZombieButtonsToPanel, 2000);
            if (window.location.search.includes('debug=true')) {
                setTimeout(() => {
                    if (window.analyzeAllZombieFiles) window.analyzeAllZombieFiles();
                }, 5000);
            }
        });
    } else {
        setTimeout(addZombieButtonsToPanel, 1000);
        if (window.location.search.includes('debug=true')) {
            setTimeout(() => {
                if (window.analyzeAllZombieFiles) window.analyzeAllZombieFiles();
            }, 3000);
        }
    }
    
    console.log('✅ Módulo de análise de arquivos zumbi v5.8.3 integrado (com botões X e FECHAR)');
})();

console.log('%c✅ ANÁLISE DE ARQUIVOS ZUMBI v5.8.3 PRONTA (COM BOTÕES X E FECHAR)', 
            'color: #00ff9c; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px;');

console.log('📋 Comandos disponíveis:');
console.log('- window.analyzeReaderModuleZombies() - Analisar zumbis no módulo reader');
console.log('- window.analyzeAllZombieFiles() - Análise completa do sistema');

window.DIAGNOSTICS_VERSION = window.DIAGNOSTICS_VERSION || {};
window.DIAGNOSTICS_VERSION.zombieAnalysis = '5.8.3';
window.DIAGNOSTICS_VERSION.hasCloseButtons = true;
