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
    // 2. VERIFICAÇÃO DO SISTEMA DE GALERIA
    // =========================================================================
    /**
     * Verifica se o sistema de galeria está funcionando corretamente
     */
    window.checkGallerySystem = function() {
        console.group('🔍 [SUPORTE] VERIFICAÇÃO DO SISTEMA DE GALERIA');
        
        const results = {
            'CSS carregado': !!document.querySelector('link[href*="gallery.css"]'),
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
        console.log(`- CSS da galeria: ${results['CSS carregado'] ? '✅' : '❌'}`);
        
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
        
        if (allFunctionsOk) {
            console.log('\n✅✅✅ SISTEMA DE GALERIA OPERACIONAL!');
        } else {
            console.log('\n⚠️⚠️⚠️ SISTEMA DE GALERIA COM PROBLEMAS!');
        }
        
        console.groupEnd();
        
        return results;
    };

    // =========================================================================
    // 3. TESTE DE NAVEGAÇÃO DA GALERIA
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
    // 4. DIAGNÓSTICO DE TOUCH EVENTS
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
    // 5. AGUARDAR CARREGAMENTO DE IMAGENS DOS IMÓVEIS
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
    // 6. CORREÇÃO DE EMERGÊNCIA PARA GALERIA (NOVO - 05/04/2026)
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
        
        console.groupEnd();
        
        return status;
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
    }

    // Auto-execução em modo debug com parâmetro específico
    if (window.location.search.includes('fix-gallery=true')) {
        setTimeout(() => {
            console.log('🔧 [gallery-diagnostics] Auto-aplicação da correção de galeria ativada');
            window.galleryDebug.applyGalleryFix();
            setTimeout(() => {
                window.galleryDebug.checkGalleryFixStatus();
            }, 1000);
        }, 2000);
    }

    console.log('✅ [gallery-diagnostics] Correção de emergência para galeria disponível');
    console.log('📝 Comandos: galleryDebug.diagnoseCreatePropertyGallery(), galleryDebug.applyGalleryFix(), galleryDebug.checkGalleryFixStatus()');

    // =========================================================================
    // 7. INICIALIZAÇÃO AUTOMÁTICA EM MODO DEBUG
    // =========================================================================
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            console.log('🔄 [SUPORTE] Executando verificação automática da galeria...');
            
            // Registrar no DiagnosticRegistry (se disponível)
            setTimeout(() => {
                if (window.DiagnosticRegistry && typeof window.waitForAllPropertyImages === 'function') {
                    window.DiagnosticRegistry.register('waitForAllPropertyImages', window.waitForAllPropertyImages, 'gallery', {
                        description: 'Aguarda carregamento de todas as imagens dos imóveis'
                    });
                }
            }, 1000);
            
            // Verificar sistema após 3 segundos
            setTimeout(() => {
                if (typeof window.checkGallerySystem === 'function') {
                    window.checkGallerySystem();
                }
            }, 3000);
            
            // Configurar atalho no console
            console.log('📌 Comandos disponíveis:');
            console.log('  - checkGallerySystem() - Verificar sistema');
            console.log('  - testGalleryNavigation() - Testar navegação');
            console.log('  - diagnoseGalleryTouch() - Diagnosticar touch');
            console.log('  - initializeGalleryModule() - Reinicializar manualmente');
            console.log('  - waitForAllPropertyImages() - Aguardar carregamento de imagens');
            console.log('  - galleryDebug.diagnoseCreatePropertyGallery() - Diagnosticar problema da galeria');
            console.log('  - galleryDebug.applyGalleryFix() - Aplicar correção de emergência');
            console.log('  - galleryDebug.checkGalleryFixStatus() - Verificar status da correção');
            
        }, 1000);
    }

})();
