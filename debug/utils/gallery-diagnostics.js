// debug/utils/gallery-diagnostics.js
// Módulo de diagnóstico e suporte para o sistema de galeria
console.log('🔧 [SUPPORT] gallery-diagnostics.js carregado');

(function() {
    // =========================================================================
    // 1. INICIALIZAÇÃO MANUAL DA GALERIA (MIGRADO DO GALLERY.JS)
    // =========================================================================
    /**
     * Inicializa o módulo da galeria manualmente
     * Útil para testes e depuração
     */
    window.initializeGalleryModule = function() {
        console.log('🚀 [SUPORTE] Inicializando módulo da galeria manualmente...');
        
        if (typeof window.setupGalleryEvents === 'function') {
            window.setupGalleryEvents();
            console.log('✅ Galeria inicializada com sucesso');
            return true;
        } else {
            console.error('❌ setupGalleryEvents não disponível');
            return false;
        }
    };

    // =========================================================================
    // 2. VERIFICAÇÃO DO SISTEMA DE GALERIA (VERSÃO MELHORADA)
    // =========================================================================
    /**
     * Verifica se o sistema de galeria está funcionando corretamente
     * Agora inclui verificação profunda do CSS
     */
    window.checkGallerySystem = function() {
        console.group('🔍 [SUPORTE] VERIFICAÇÃO DO SISTEMA DE GALERIA');
        
        // Verificação CSS aprimorada
        let galleryCssStatus = {
            found: false,
            href: null,
            rulesCount: 0,
            canReadRules: false,
            error: null
        };
        
        try {
            const sheets = document.styleSheets;
            for (let i = 0; i < sheets.length; i++) {
                const sheet = sheets[i];
                if (sheet.href && sheet.href.includes('gallery.css')) {
                    galleryCssStatus.found = true;
                    galleryCssStatus.href = sheet.href;
                    try {
                        const rules = sheet.cssRules || sheet.rules;
                        galleryCssStatus.rulesCount = rules ? rules.length : 0;
                        galleryCssStatus.canReadRules = true;
                    } catch(e) {
                        galleryCssStatus.canReadRules = false;
                        galleryCssStatus.error = e.message;
                    }
                    break;
                }
            }
        } catch(e) {
            galleryCssStatus.error = e.message;
        }
        
        // Verificar também se o link existe no DOM (fallback)
        const cssLinkExists = !!document.querySelector('link[href*="gallery.css"]');
        
        const results = {
            'CSS da galeria': {
                'link no DOM': cssLinkExists ? '✅' : '❌',
                'arquivo carregado': galleryCssStatus.found ? '✅' : '❌',
                'URL': galleryCssStatus.href || 'não encontrado',
                'regras CSS': galleryCssStatus.rulesCount > 0 ? `${galleryCssStatus.rulesCount} regras` : (galleryCssStatus.found ? '⚠️ (CORS - não pode ler)' : '❌'),
                'CORS bloqueio': !galleryCssStatus.canReadRules && galleryCssStatus.found ? '⚠️ Sim' : '✅'
            },
            'Funções essenciais': {
                'createPropertyGallery': typeof window.createPropertyGallery === 'function' ? '✅' : '❌',
                'openGallery': typeof window.openGallery === 'function' ? '✅' : '❌',
                'closeGallery': typeof window.closeGallery === 'function' ? '✅' : '❌',
                'nextGalleryImage': typeof window.nextGalleryImage === 'function' ? '✅' : '❌',
                'prevGalleryImage': typeof window.prevGalleryImage === 'function' ? '✅' : '❌',
                'setupGalleryEvents': typeof window.setupGalleryEvents === 'function' ? '✅' : '❌'
            },
            'Variáveis de estado': {
                'currentGalleryImages': Array.isArray(window.currentGalleryImages),
                'currentGalleryIndex': typeof window.currentGalleryIndex === 'number',
                'touchStartX': typeof window.touchStartX === 'number',
                'touchEndX': typeof window.touchEndX === 'number'
            },
            'Elementos DOM': {
                'galleryModal': !!document.getElementById('propertyGalleryModal')
            }
        };
        
        console.log('📊 RESULTADOS:');
        console.log('\n🎨 CSS DA GALERIA:');
        Object.entries(results['CSS da galeria']).forEach(([nome, valor]) => {
            console.log(`  - ${nome}: ${valor}`);
        });
        
        if (galleryCssStatus.found && !galleryCssStatus.canReadRules) {
            console.log('\n⚠️ ATENÇÃO: O CSS foi carregado mas está bloqueado por CORS!');
            console.log('   Isso pode impedir que as regras CSS sejam aplicadas corretamente.');
            console.log('   Solução: Servir o CSS do mesmo domínio ou configurar CORS corretamente.');
        }
        
        console.log('\n📋 FUNÇÕES:');
        Object.entries(results['Funções essenciais']).forEach(([nome, status]) => {
            console.log(`  - ${nome}: ${status}`);
        });
        
        console.log('\n🔧 VARIÁVEIS:');
        Object.entries(results['Variáveis de estado']).forEach(([nome, status]) => {
            console.log(`  - ${nome}: ${status ? '✅' : '❌'}`);
        });
        
        console.log('\n🖼️ MODAL:');
        console.log(`  - Modal existe: ${results['Elementos DOM']['galleryModal'] ? '✅' : '❌'}`);
        
        if (window.properties && window.properties.length > 0) {
            const firstProperty = window.properties[0];
            const hasImages = firstProperty.images && 
                             firstProperty.images !== 'EMPTY' && 
                             firstProperty.images.split(',').filter(u => u.trim()).length > 0;
            
            console.log(`\n🏠 TESTE COM PRIMEIRO IMÓVEL:`);
            console.log(`  - ID: ${firstProperty.id}`);
            console.log(`  - Título: ${firstProperty.title}`);
            console.log(`  - Tem imagens: ${hasImages ? '✅' : '❌'}`);
            
            if (hasImages) {
                const imageCount = firstProperty.images.split(',').filter(u => u.trim()).length;
                console.log(`  - Quantidade de imagens: ${imageCount}`);
                console.log(`  - Para testar: openGallery(${firstProperty.id})`);
            }
        }
        
        const allFunctionsOk = Object.values(results['Funções essenciais'])
            .every(v => v === '✅');
        
        if (allFunctionsOk && galleryCssStatus.found) {
            console.log('\n✅✅✅ SISTEMA DE GALERIA OPERACIONAL!');
        } else if (!galleryCssStatus.found) {
            console.log('\n⚠️⚠️⚠️ CSS DA GALERIA NÃO CARREGADO!');
            console.log('   Verifique se o arquivo gallery.css existe e o caminho está correto.');
        } else {
            console.log('\n⚠️⚠️⚠️ SISTEMA DE GALERIA COM PROBLEMAS!');
        }
        
        console.groupEnd();
        
        return results;
    };

    // =========================================================================
    // 3. VERIFICAÇÃO DEDICADA DO CSS DA GALERIA (NOVA FUNÇÃO)
    // =========================================================================
    /**
     * Verifica especificamente se o CSS da galeria foi carregado corretamente
     * Útil para diagnosticar problemas de estilo
     */
    window.checkGalleryCSS = function() {
        console.group('🎨 [SUPORTE] VERIFICAÇÃO DEDICADA DO CSS DA GALERIA');
        
        const result = {
            cssLinkInDOM: false,
            cssLoaded: false,
            cssUrl: null,
            rulesCount: 0,
            canAccessRules: false,
            corsIssue: false,
            criticalSelectors: {},
            error: null
        };
        
        // Verificar link no DOM
        const cssLink = document.querySelector('link[href*="gallery.css"]');
        result.cssLinkInDOM = !!cssLink;
        if (cssLink) {
            result.cssUrl = cssLink.href;
            console.log(`📄 Link encontrado: ${result.cssUrl}`);
        } else {
            console.log('❌ Nenhum link para gallery.css encontrado no DOM');
        }
        
        // Verificar se o CSS foi realmente carregado
        try {
            const sheets = document.styleSheets;
            for (let i = 0; i < sheets.length; i++) {
                const sheet = sheets[i];
                if (sheet.href && sheet.href.includes('gallery.css')) {
                    result.cssLoaded = true;
                    result.cssUrl = sheet.href;
                    
                    try {
                        const rules = sheet.cssRules || sheet.rules;
                        result.rulesCount = rules ? rules.length : 0;
                        result.canAccessRules = true;
                        
                        // Verificar seletores críticos
                        const criticalSelectors = [
                            '.gallery-modal',
                            '.gallery-container',
                            '.gallery-nav-arrow',
                            '.gallery-dot',
                            '.gallery-view-counter',
                            '.video-indicator',
                            '.property-image'
                        ];
                        
                        console.log('\n📊 VERIFICANDO SELETORES CRÍTICOS:');
                        for (const selector of criticalSelectors) {
                            let found = false;
                            for (let j = 0; j < rules.length; j++) {
                                const rule = rules[j];
                                if (rule.selectorText && rule.selectorText.includes(selector)) {
                                    found = true;
                                    break;
                                }
                            }
                            result.criticalSelectors[selector] = found;
                            console.log(`  - ${selector}: ${found ? '✅' : '❌'}`);
                        }
                        
                    } catch(e) {
                        result.canAccessRules = false;
                        result.corsIssue = true;
                        result.error = e.message;
                        console.log(`⚠️ Não foi possível ler as regras CSS (CORS): ${e.message}`);
                    }
                    break;
                }
            }
        } catch(e) {
            result.error = e.message;
            console.log(`❌ Erro ao acessar styleSheets: ${e.message}`);
        }
        
        if (!result.cssLoaded && result.cssLinkInDOM) {
            console.log('\n⚠️ O link do CSS existe mas o arquivo não foi carregado!');
            console.log('   Possíveis causas:');
            console.log('   - Caminho do arquivo incorreto');
            console.log('   - Servidor não está servindo o arquivo');
            console.log('   - Rede bloqueando o download');
        }
        
        if (result.corsIssue) {
            console.log('\n⚠️⚠️⚠️ PROBLEMA DE CORS DETECTADO!');
            console.log('   O CSS foi carregado de um domínio diferente e não pode ser lido.');
            console.log('   Isso pode impedir a aplicação correta dos estilos.');
            console.log('   Solução:');
            console.log('   1. Servir o CSS do mesmo domínio que a página');
            console.log('   2. Ou configurar CORS no servidor que hospeda o CSS');
        }
        
        console.log('\n📋 RESUMO:');
        console.log(`   - Link no DOM: ${result.cssLinkInDOM ? '✅' : '❌'}`);
        console.log(`   - CSS carregado: ${result.cssLoaded ? '✅' : '❌'}`);
        console.log(`   - Pode ler regras: ${result.canAccessRules ? '✅' : '❌'}`);
        console.log(`   - Problema CORS: ${result.corsIssue ? '⚠️ Sim' : '✅ Não'}`);
        console.log(`   - Regras CSS: ${result.rulesCount}`);
        
        console.groupEnd();
        
        return result;
    };

    // =========================================================================
    // 4. TESTE DE NAVEGAÇÃO DA GALERIA
    // =========================================================================
    /**
     * Testa a navegação da galeria com um imóvel de exemplo
     */
    window.testGalleryNavigation = function(propertyId = null) {
        console.group('🧪 [SUPORTE] TESTE DE NAVEGAÇÃO DA GALERIA');
        
        // Se não forneceu ID, pegar o primeiro imóvel com imagens
        if (!propertyId && window.properties) {
            const propertyWithImages = window.properties.find(p => 
                p.images && p.images !== 'EMPTY' && 
                p.images.split(',').filter(u => u.trim()).length > 0
            );
            
            if (propertyWithImages) {
                propertyId = propertyWithImages.id;
                console.log(`📌 Usando imóvel: "${propertyWithImages.title}" (ID: ${propertyId})`);
            }
        }
        
        if (!propertyId) {
            console.error('❌ Nenhum imóvel com imagens encontrado para teste');
            console.groupEnd();
            return false;
        }
        
        console.log('🎬 Executando sequência de testes:');
        
        // Abrir galeria
        console.log('1. Abrindo galeria...');
        window.openGallery(propertyId);
        
        setTimeout(() => {
            // Testar navegação
            console.log('2. Testando nextGalleryImage()...');
            window.nextGalleryImage();
            
            setTimeout(() => {
                console.log('3. Testando prevGalleryImage()...');
                window.prevGalleryImage();
                
                setTimeout(() => {
                    console.log('4. Fechando galeria...');
                    window.closeGallery();
                    console.log('✅ Teste de navegação concluído!');
                    console.groupEnd();
                }, 500);
            }, 500);
        }, 500);
        
        return true;
    };

    // =========================================================================
    // 5. DIAGNÓSTICO DE TOUCH EVENTS
    // =========================================================================
    /**
     * Verifica se os eventos de touch estão configurados
     */
    window.diagnoseGalleryTouch = function() {
        console.group('👆 [SUPORTE] DIAGNÓSTICO DE TOUCH EVENTS');
        
        const touchEvents = {
            'touchstart handler': typeof window.handleTouchStart === 'function',
            'touchend handler': typeof window.handleTouchEnd === 'function',
            'SWIPE_THRESHOLD': window.SWIPE_THRESHOLD === 50,
            'listeners ativos': false
        };
        
        // Verificar listeners no documento
        const docListeners = getEventListeners ? 
            Object.keys(getEventListeners(document) || {}) : 
            'não disponível';
        
        if (docListeners !== 'não disponível') {
            touchEvents['listeners ativos'] = docListeners.includes('touchstart') && 
                                              docListeners.includes('touchend');
        }
        
        console.log('📊 STATUS DOS TOUCH EVENTS:');
        Object.entries(touchEvents).forEach(([evento, status]) => {
            console.log(`  - ${evento}: ${status ? '✅' : '❌'}`);
        });
        
        if (touchEvents['touchstart handler'] && touchEvents['touchend handler']) {
            console.log('\n✅ SISTEMA DE TOUCH OPERACIONAL');
            console.log('💡 Threshold de swipe: 50px');
        } else {
            console.log('\n⚠️ SISTEMA DE TOUCH COM PROBLEMAS');
        }
        
        console.groupEnd();
    };

    // =========================================================================
    // 6. AGUARDAR CARREGAMENTO DE IMAGENS DOS IMÓVEIS
    // =========================================================================
    /**
     * Aguarda todas as imagens dos imóveis carregarem
     * Útil para testes de performance e diagnóstico visual
     */
    window.waitForAllPropertyImages = async function() {
        console.log('🖼️ [SUPPORT] Aguardando carregamento completo de todas as imagens...');
        
        const propertyImages = document.querySelectorAll('.property-image img, .property-gallery-image');
        
        if (propertyImages.length === 0) {
            console.log('ℹ️ [SUPPORT] Nenhuma imagem de imóvel encontrada');
            return 0;
        }
        
        console.log(`📸 [SUPPORT] ${propertyImages.length} imagem(ns) de imóveis para carregar`);
        
        return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = propertyImages.length;
            
            propertyImages.forEach(img => {
                if (img.complete && img.naturalWidth > 0) {
                    loadedCount++;
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount >= totalImages) resolve(loadedCount);
                    };
                    
                    img.onerror = () => {
                        loadedCount++;
                        if (loadedCount >= totalImages) resolve(loadedCount);
                    };
                }
            });
            
            const safetyTimeout = setTimeout(() => {
                console.log(`⏰ [SUPPORT] Timeout: ${loadedCount}/${totalImages} imagens carregadas`);
                resolve(loadedCount);
            }, 10000);
            
            if (loadedCount >= totalImages) {
                clearTimeout(safetyTimeout);
                resolve(loadedCount);
            }
        });
    };

    // =========================================================================
    // 7. CORREÇÃO DE EMERGÊNCIA PARA GALERIA
    // =========================================================================
    /**
     * Diagnóstico completo da função createPropertyGallery
     * Verifica por que setas, contadores e ícones não estão aparecendo
     */
    window.galleryDebug = window.galleryDebug || {};

    window.galleryDebug.diagnoseCreatePropertyGallery = function() {
        console.group('🔍 [gallery-diagnostics] DIAGNÓSTICO DA FUNÇÃO createPropertyGallery');
        
        if (typeof window.createPropertyGallery !== 'function') {
            console.error('❌ window.createPropertyGallery não é uma função!');
            console.groupEnd();
            return { error: 'createPropertyGallery_not_available' };
        }
        
        // Obter o primeiro imóvel com dados
        const testProperty = window.properties?.find(p => p.images && p.images !== 'EMPTY');
        
        if (!testProperty) {
            console.error('❌ Nenhum imóvel com imagens encontrado para teste');
            console.groupEnd();
            return { error: 'no_property_with_images' };
        }
        
        console.log('📊 TESTE COM IMÓVEL:', {
            id: testProperty.id,
            title: testProperty.title,
            images: testProperty.images,
            imagesType: typeof testProperty.images,
            hasVideo: testProperty.has_video
        });
        
        // Analisar os dados do imóvel
        const hasImages = testProperty.images && testProperty.images.length > 0 && testProperty.images !== 'EMPTY';
        const allMediaUrls = hasImages ? testProperty.images.split(',').filter(url => url.trim() !== '') : [];
        const totalMediaCount = allMediaUrls.length;
        const hasVideos = allMediaUrls.some(url => {
            const urlLower = url.toLowerCase();
            return urlLower.includes('.mp4') || urlLower.includes('.mov') || urlLower.includes('.webm');
        });
        
        console.log('📊 ANÁLISE DOS DADOS:');
        console.log(`   - hasImages: ${hasImages}`);
        console.log(`   - totalMediaCount: ${totalMediaCount}`);
        console.log(`   - hasVideos: ${hasVideos}`);
        console.log(`   - URLs:`, allMediaUrls);
        
        // Executar a função e capturar o HTML gerado
        let generatedHtml = '';
        try {
            generatedHtml = window.createPropertyGallery(testProperty);
            console.log('✅ createPropertyGallery executada com sucesso');
        } catch (error) {
            console.error('❌ Erro ao executar createPropertyGallery:', error);
            console.groupEnd();
            return { error: error.message };
        }
        
        // Verificar elementos no HTML gerado
        const hasArrows = generatedHtml.includes('gallery-nav-arrow') || generatedHtml.includes('nav-arrow');
        const hasDots = generatedHtml.includes('gallery-dot') || generatedHtml.includes('gallery-controls');
        const hasViewCounter = generatedHtml.includes('gallery-view-counter') || generatedHtml.includes('view-counter');
        const hasVideoIndicator = generatedHtml.includes('video-indicator') || generatedHtml.includes('video-thumbnail');
        const hasExpandButton = generatedHtml.includes('gallery-expand-icon') || generatedHtml.includes('expand');
        
        console.log('📊 ELEMENTOS ENCONTRADOS NO HTML:');
        console.log(`   - Setas (arrows): ${hasArrows ? '✅' : '❌'}`);
        console.log(`   - Dots (guias): ${hasDots ? '✅' : '❌'}`);
        console.log(`   - Contador de views: ${hasViewCounter ? '✅' : '❌'}`);
        console.log(`   - Indicador de vídeo: ${hasVideoIndicator ? '✅' : '❌'}`);
        console.log(`   - Botão expandir: ${hasExpandButton ? '✅' : '❌'}`);
        
        // Diagnóstico do problema
        const diagnosis = {
            propertyId: testProperty.id,
            totalMediaCount,
            hasVideos,
            elementsFound: { hasArrows, hasDots, hasViewCounter, hasVideoIndicator, hasExpandButton },
            possibleIssues: []
        };
        
        if (totalMediaCount <= 1) {
            diagnosis.possibleIssues.push('totalMediaCount <= 1 - setas e dots NÃO são gerados por padrão');
            diagnosis.recommendation = 'Modificar gallery.js para mostrar setas/dots mesmo com 1 mídia (especialmente se houver vídeos)';
        }
        
        if (totalMediaCount === 0) {
            diagnosis.possibleIssues.push('totalMediaCount === 0 - nenhuma mídia para exibir');
            diagnosis.recommendation = 'Verificar se property.images está sendo salvo corretamente';
        }
        
        if (!hasArrows && totalMediaCount > 1) {
            diagnosis.possibleIssues.push('totalMediaCount > 1 mas setas NÃO foram geradas');
            diagnosis.recommendation = 'Verificar função createNavigationArrows() no gallery.js';
        }
        
        if (!hasDots && totalMediaCount > 1) {
            diagnosis.possibleIssues.push('totalMediaCount > 1 mas dots NÃO foram gerados');
            diagnosis.recommendation = 'Verificar lógica de geração de dots no gallery.js';
        }
        
        console.log('\n📋 DIAGNÓSTICO:');
        if (diagnosis.possibleIssues.length === 0) {
            console.log('✅ Nenhum problema identificado - os elementos devem estar visíveis');
        } else {
            diagnosis.possibleIssues.forEach(issue => console.log(`   ⚠️ ${issue}`));
            if (diagnosis.recommendation) {
                console.log(`\n💡 RECOMENDAÇÃO: ${diagnosis.recommendation}`);
            }
        }
        
        console.log('\n📝 HTML GERADO (primeiros 800 caracteres):');
        console.log(generatedHtml.substring(0, 800));
        
        console.groupEnd();
        
        return diagnosis;
    };

    /**
     * Correção de emergência para a galeria
     * Aplica patches na função createPropertyGallery para garantir exibição de setas/dots
     */
    window.galleryDebug.applyGalleryFix = function() {
        console.group('🚨 [gallery-diagnostics] APLICANDO CORREÇÃO DE EMERGÊNCIA PARA GALERIA');
        
        if (typeof window.createPropertyGallery !== 'function') {
            console.error('❌ window.createPropertyGallery não disponível');
            console.groupEnd();
            return { success: false, error: 'createPropertyGallery_not_available' };
        }
        
        // Salvar função original
        const originalCreatePropertyGallery = window.createPropertyGallery;
        let fixesApplied = [];
        
        // Criar função patchada
        window.createPropertyGallery = function(property) {
            // ========== DIAGNÓSTICO (logs condicionais) ==========
            if (window.location.search.includes('debug=true')) {
                console.log('🎨 [gallery-fix] createPropertyGallery chamado para ID:', property.id);
                console.log('   - images:', property.images);
                console.log('   - has_video:', property.has_video);
            }
            
            // Analisar dados do imóvel
            const hasImages = property.images && property.images.length > 0 && property.images !== 'EMPTY';
            const allMediaUrls = hasImages ? property.images.split(',').filter(url => url.trim() !== '') : [];
            const totalMediaCount = allMediaUrls.length;
            const hasVideos = allMediaUrls.some(url => {
                const urlLower = url.toLowerCase();
                return urlLower.includes('.mp4') || urlLower.includes('.mov') || urlLower.includes('.webm');
            });
            
            if (window.location.search.includes('debug=true')) {
                console.log(`   - totalMediaCount: ${totalMediaCount}, hasVideos: ${hasVideos}`);
            }
            
            // Chamar função original
            let html = originalCreatePropertyGallery(property);
            
            // ========== CORREÇÕES PÓS-GERAÇÃO ==========
            
            // CORREÇÃO 1: Se não há setas mas deveria haver (quando tem vídeos mesmo com 1 mídia)
            const hasArrowsInHtml = html.includes('gallery-nav-arrow') || html.includes('nav-arrow');
            const shouldHaveArrows = totalMediaCount > 1 || (hasVideos && totalMediaCount >= 1);
            
            if (shouldHaveArrows && !hasArrowsInHtml) {
                // Adicionar setas manualmente
                const arrowsHtml = `
                    <div class="gallery-nav-arrows" style="position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); display: flex; justify-content: space-between; padding: 0 10px; pointer-events: none; z-index: 25;">
                        <button class="gallery-nav-arrow prev-arrow" onclick="event.stopPropagation(); window.prevGalleryImage(${property.id})" style="background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; pointer-events: auto; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="gallery-nav-arrow next-arrow" onclick="event.stopPropagation(); window.nextGalleryImage(${property.id})" style="background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; pointer-events: auto; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                `;
                
                // Inserir setas após a div da imagem
                html = html.replace(/(<div class="property-image[^>]*>)/, `$1${arrowsHtml}`);
                fixesApplied.push('setas adicionadas manualmente');
                console.log('✅ [gallery-fix] Setas adicionadas manualmente');
            }
            
            // CORREÇÃO 2: Adicionar indicador de vídeo se não existir
            const hasVideoIndicator = html.includes('video-indicator');
            if (hasVideos && !hasVideoIndicator) {
                const videoIndicatorHtml = `
                    <div class="video-indicator" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; z-index: 20;">
                        <i class="fas fa-video"></i> Vídeo
                    </div>
                `;
                html = html.replace(/(<div class="property-image[^>]*>)/, `$1${videoIndicatorHtml}`);
                fixesApplied.push('indicador de vídeo adicionado manualmente');
                console.log('✅ [gallery-fix] Indicador de vídeo adicionado manualmente');
            }
            
            // CORREÇÃO 3: Adicionar contador de imagens se não existir e houver múltiplas imagens
            const hasImageCounter = html.includes('image-counter') || html.includes('gallery-counter');
            if (totalMediaCount > 1 && !hasImageCounter) {
                const imageCounterHtml = `
                    <div class="image-counter" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; z-index: 20;">
                        <i class="fas fa-images"></i> ${totalMediaCount}
                    </div>
                `;
                html = html.replace(/(<div class="property-image[^>]*>)/, `$1${imageCounterHtml}`);
                fixesApplied.push('contador de imagens adicionado manualmente');
                console.log('✅ [gallery-fix] Contador de imagens adicionado manualmente');
            }
            
            return html;
        };
        
        fixesApplied.push('createPropertyGallery patchada');
        
        console.log('\n📊 RESUMO DA CORREÇÃO:');
        console.log(`✅ Correções aplicadas: ${fixesApplied.length}`);
        fixesApplied.forEach(fix => console.log(`   • ${fix}`));
        
        console.log('\n🎨 Galeria corrigida! Recarregue os cards para ver as alterações.');
        console.groupEnd();
        
        // Forçar recriação dos cards
        setTimeout(() => {
            if (typeof window.renderProperties === 'function') {
                window.renderProperties(window.currentFilter || 'todos');
                console.log('🔄 [gallery-fix] Cards recarregados automaticamente');
            }
        }, 500);
        
        return { success: true, fixesApplied, timestamp: new Date().toISOString() };
    };

    /**
     * Verifica o status da correção da galeria
     */
    window.galleryDebug.checkGalleryFixStatus = function() {
        console.group('🔍 [gallery-diagnostics] VERIFICAÇÃO DO STATUS DA GALERIA');
        
        const status = {
            createPropertyGalleryExists: typeof window.createPropertyGallery === 'function',
            isPatched: window.createPropertyGallery?.toString().includes('gallery-fix'),
            originalFunctionAvailable: typeof window.createPropertyGallery === 'function'
        };
        
        console.log('📊 STATUS:');
        console.log(`   - createPropertyGallery disponível: ${status.createPropertyGalleryExists ? '✅' : '❌'}`);
        console.log(`   - Função patchada: ${status.isPatched ? '✅' : '⚠️ (original)'}`);
        
        if (status.createPropertyGalleryExists && window.properties?.length > 0) {
            const testProperty = window.properties.find(p => p.images && p.images !== 'EMPTY');
            if (testProperty) {
                const html = window.createPropertyGallery(testProperty);
                console.log('\n📊 ELEMENTOS NO HTML GERADO:');
                console.log(`   - Setas: ${html.includes('gallery-nav-arrow') || html.includes('nav-arrow') ? '✅' : '❌'}`);
                console.log(`   - Dots: ${html.includes('gallery-dot') ? '✅' : '❌'}`);
                console.log(`   - Contador: ${html.includes('image-counter') ? '✅' : '❌'}`);
                console.log(`   - Indicador vídeo: ${html.includes('video-indicator') ? '✅' : '❌'}`);
            }
        }
        
        console.log('\n💡 COMANDOS DISPONÍVEIS:');
        console.log('   • window.galleryDebug.diagnoseCreatePropertyGallery() - Diagnosticar problema');
        console.log('   • window.galleryDebug.applyGalleryFix() - Aplicar correção');
        console.log('   • window.galleryDebug.checkGalleryFixStatus() - Verificar status');
        console.log('   • window.checkGalleryCSS() - Verificar CSS da galeria');
        
        console.groupEnd();
        
        return status;
    };

    /**
     * EXECUÇÃO AUTOMÁTICA COMPLETA - Diagnóstico e Correção
     * Esta função executa todo o fluxo de diagnóstico e correção automaticamente
     */
    window.galleryDebug.runAutoDiagnosticAndFix = function() {
        console.log('🚀 [gallery-diagnostics] Iniciando diagnóstico e correção automática da galeria...');
        
        // Verificar CSS primeiro
        const cssStatus = window.checkGalleryCSS();
        
        // Verificar se SupportTemplates existe
        console.log('📋 SupportTemplates disponível:', !!window.SupportTemplates);
        console.log('📋 PropertyTemplateEngine:', !!window.SupportTemplates?.PropertyTemplateEngine);
        
        // Verificar se createPropertyGallery existe
        if (typeof window.createPropertyGallery !== 'function') {
            console.error('❌ createPropertyGallery NÃO é uma função! gallery.js pode não ter carregado.');
            return { success: false, error: 'createPropertyGallery_not_available', cssStatus };
        }
        
        // Executar diagnóstico
        const diagnosis = window.galleryDebug.diagnoseCreatePropertyGallery();
        
        // Se houver problemas, aplicar correção
        if (diagnosis.possibleIssues && diagnosis.possibleIssues.length > 0) {
            console.log('⚠️ Problemas detectados, aplicando correção de emergência...');
            const fixResult = window.galleryDebug.applyGalleryFix();
            
            // Forçar re-renderização
            setTimeout(() => {
                if (typeof window.renderProperties === 'function') {
                    window.renderProperties('todos', true);
                    console.log('🔄 Re-renderização forçada após correção');
                }
                
                // Verificar status final
                setTimeout(() => {
                    window.galleryDebug.checkGalleryFixStatus();
                }, 500);
            }, 500);
            
            return { success: true, diagnosis, fixResult, cssStatus };
        } else {
            console.log('✅ Nenhum problema detectado, galeria já está funcionando corretamente');
            return { success: true, diagnosis, message: 'no_issues_found', cssStatus };
        }
    };

    // Registrar no DiagnosticRegistry
    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register('galleryDebug.diagnoseCreatePropertyGallery', window.galleryDebug.diagnoseCreatePropertyGallery, 'gallery', {
            isSafe: true,
            description: 'Diagnostica por que setas/contadores não aparecem na galeria'
        });
        window.DiagnosticRegistry.register('galleryDebug.applyGalleryFix', window.galleryDebug.applyGalleryFix, 'gallery', {
            isSafe: false,
            isDestructive: false,
            description: 'Aplica correção de emergência para exibir setas/contadores'
        });
        window.DiagnosticRegistry.register('galleryDebug.checkGalleryFixStatus', window.galleryDebug.checkGalleryFixStatus, 'gallery', {
            isSafe: true,
            description: 'Verifica o status da correção da galeria'
        });
        window.DiagnosticRegistry.register('galleryDebug.runAutoDiagnosticAndFix', window.galleryDebug.runAutoDiagnosticAndFix, 'gallery', {
            isSafe: false,
            isDestructive: false,
            description: 'Executa diagnóstico e correção automática completa da galeria'
        });
        window.DiagnosticRegistry.register('checkGalleryCSS', window.checkGalleryCSS, 'gallery', {
            isSafe: true,
            description: 'Verifica se o CSS da galeria foi carregado corretamente'
        });
    }

    console.log('✅ [gallery-diagnostics] Correção de emergência para galeria disponível');
    console.log('📝 Comandos disponíveis:');
    console.log('   • galleryDebug.diagnoseCreatePropertyGallery() - Diagnosticar problema');
    console.log('   • galleryDebug.applyGalleryFix() - Aplicar correção');
    console.log('   • galleryDebug.checkGalleryFixStatus() - Verificar status');
    console.log('   • galleryDebug.runAutoDiagnosticAndFix() - Executar diagnóstico e correção automática');
    console.log('   • checkGalleryCSS() - Verificar CSS da galeria');

    // =========================================================================
    // 8. EXECUÇÃO AUTOMÁTICA EM MODO DEBUG OU COM PARÂMETROS ESPECÍFICOS
    // =========================================================================
    
    // Executar diagnóstico automático quando debug=true ou fix-gallery=true
    const shouldRunAutoDiagnostic = window.location.search.includes('debug=true') || 
                                     window.location.search.includes('fix-gallery=true') ||
                                     window.location.search.includes('auto-fix-gallery=true');
    
    if (shouldRunAutoDiagnostic) {
        // Aguardar o carregamento completo da página e dos dados
        const startAutoDiagnostic = function() {
            console.log('🔧 [gallery-diagnostics] Execução automática de diagnóstico e correção ativada');
            
            // Aguardar window.properties estar disponível
            let checkInterval = 0;
            const maxChecks = 20; // 10 segundos máximo (20 * 500ms)
            
            const checkProperties = setInterval(() => {
                checkInterval++;
                
                if (window.properties && window.properties.length > 0) {
                    clearInterval(checkProperties);
                    console.log('✅ [gallery-diagnostics] Dados dos imóveis carregados, executando diagnóstico...');
                    window.galleryDebug.runAutoDiagnosticAndFix();
                } else if (checkInterval >= maxChecks) {
                    clearInterval(checkProperties);
                    console.warn('⚠️ [gallery-diagnostics] Timeout aguardando window.properties');
                    
                    // Mesmo sem properties, verificar CSS e se createPropertyGallery existe
                    window.checkGalleryCSS();
                    
                    if (typeof window.createPropertyGallery === 'function') {
                        console.log('🔄 [gallery-diagnostics] createPropertyGallery disponível, mas sem dados. Tentando diagnóstico parcial...');
                        window.galleryDebug.diagnoseCreatePropertyGallery();
                    } else {
                        console.error('❌ [gallery-diagnostics] createPropertyGallery NÃO disponível!');
                    }
                }
            }, 500);
        };
        
        // Iniciar após o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startAutoDiagnostic);
        } else {
            startAutoDiagnostic();
        }
    }
    
    // Executar verificação do container de propriedades quando debug=true
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            console.log('🔄 [SUPORTE] Executando verificação automática da galeria...');
            
            // Verificar CSS automaticamente
            window.checkGalleryCSS();
            
            // Verificar o container atual
            const container = document.getElementById('properties-container');
            if (container) {
                const firstCard = container.querySelector('.property-card');
                if (firstCard) {
                    console.log('📋 Primeiro card atual (primeiros 500 chars):', firstCard.outerHTML.substring(0, 500));
                    console.log('📋 Card contém property-gallery-container?', firstCard.innerHTML.includes('property-gallery-container'));
                } else {
                    console.log('⚠️ Nenhum card encontrado no container');
                }
            }
            
            // Verificar sistema após 3 segundos
            setTimeout(() => {
                if (typeof window.checkGallerySystem === 'function') {
                    window.checkGallerySystem();
                }
            }, 3000);
            
            // Configurar atalho no console
            console.log('📌 Comandos disponíveis:');
            console.log('  - checkGallerySystem() - Verificar sistema completo');
            console.log('  - checkGalleryCSS() - Verificar CSS da galeria');
            console.log('  - testGalleryNavigation() - Testar navegação');
            console.log('  - diagnoseGalleryTouch() - Diagnosticar touch');
            console.log('  - initializeGalleryModule() - Reinicializar manualmente');
            console.log('  - waitForAllPropertyImages() - Aguardar carregamento de imagens');
            console.log('  - galleryDebug.diagnoseCreatePropertyGallery() - Diagnosticar problema da galeria');
            console.log('  - galleryDebug.applyGalleryFix() - Aplicar correção de emergência');
            console.log('  - galleryDebug.checkGalleryFixStatus() - Verificar status da correção');
            console.log('  - galleryDebug.runAutoDiagnosticAndFix() - Executar diagnóstico e correção automática');
            
        }, 1000);
    }

    // =========================================================================
    // 9. CORREÇÃO TEMPORÁRIA PARA FORÇAR GALERIA A APARECER (EMBARCADA)
    // =========================================================================
    // Esta correção é ativada automaticamente se detectar que a galeria não está funcionando
    setTimeout(function() {
        console.log('🔧 [gallery-diagnostics] Verificando necessidade de correção temporária da galeria...');
        
        // Verificar CSS primeiro
        const cssStatus = window.checkGalleryCSS();
        
        if (!cssStatus.cssLoaded) {
            console.warn('⚠️ [gallery-diagnostics] CSS da galeria não carregado! Verifique o caminho do arquivo.');
        }
        
        // Verificar se a função existe
        if (typeof window.createPropertyGallery !== 'function') {
            console.error('❌ [gallery-diagnostics] createPropertyGallery não encontrada!');
            return;
        }
        
        // Verificar se há imóveis carregados
        if (!window.properties || window.properties.length === 0) {
            console.log('⏳ [gallery-diagnostics] Aguardando carregamento dos imóveis...');
            return;
        }
        
        // Testar com o primeiro imóvel
        const testProperty = window.properties[0];
        if (testProperty && testProperty.images && testProperty.images !== 'EMPTY') {
            const testHtml = window.createPropertyGallery(testProperty);
            
            const hasExpectedElements = testHtml.includes('gallery-view-counter') || 
                                       testHtml.includes('gallery-nav-arrow') || 
                                       testHtml.includes('gallery-dot');
            
            console.log('📊 [gallery-diagnostics] Verificação de elementos esperados:', {
                'gallery-view-counter': testHtml.includes('gallery-view-counter'),
                'gallery-nav-arrow': testHtml.includes('gallery-nav-arrow'),
                'gallery-dot': testHtml.includes('gallery-dot'),
                'video-indicator': testHtml.includes('video-indicator')
            });
            
            // Se não encontrar os elementos esperados, aplicar correção automaticamente
            if (!hasExpectedElements) {
                console.warn('⚠️ [gallery-diagnostics] Elementos da galeria não encontrados! Aplicando correção automática...');
                window.galleryDebug.applyGalleryFix();
            } else if (!cssStatus.cssLoaded) {
                console.warn('⚠️ [gallery-diagnostics] Elementos HTML existem mas CSS não carregou!');
                console.log('   Verifique se o arquivo gallery.css está no caminho correto.');
            } else {
                console.log('✅ [gallery-diagnostics] Galeria parece estar funcionando corretamente');
            }
        }
        
        // Forçar re-renderização para garantir
        if (typeof window.renderProperties === 'function') {
            window.renderProperties('todos', true);
            console.log('✅ [gallery-diagnostics] Re-renderização forçada');
        }
    }, 3000);

})();
