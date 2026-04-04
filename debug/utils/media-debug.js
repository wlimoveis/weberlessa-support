// debug/utils/media-debug.js - Utilitários de Debug para o Sistema de Mídia
// VERSÃO: 2.1.0 - Adicionado suporte a vídeos .MOV e correção de emergência
console.log('📸 [SUPPORT] media-debug.js v2.1.0 carregado.');

(function() {
    'use strict';

    // ==============================================================
    // DIAGNÓSTICO DO ESTADO DO MEDIA SYSTEM
    // Extraído de media-unified.js (Core System)
    // ==============================================================
    window.debugMediaSystem = function() {
        if (!window.MediaSystem) {
            console.error('❌ MediaSystem não disponível');
            return;
        }
        
        console.group('🐛 DEBUG - ESTADO DO MEDIA SYSTEM');
        console.log('📊 Estado atual:');
        console.log('- Arquivos novos:', MediaSystem.state?.files?.length || 0);
        console.log('- Arquivos existentes:', MediaSystem.state?.existing?.length || 0);
        console.log('- PDFs novos:', MediaSystem.state?.pdfs?.length || 0);
        console.log('- PDFs existentes:', MediaSystem.state?.existingPdfs?.length || 0);
        console.log('- Upload em andamento:', MediaSystem.state?.isUploading || false);
        console.log('- Property ID atual:', MediaSystem.state?.currentPropertyId || null);
        
        console.log('📁 Arquivos novos:');
        (MediaSystem.state?.files || []).forEach((item, i) => {
            console.log(`  ${i+1}. "${item.name}"`, {
                isNew: item.isNew,
                uploaded: item.uploaded,
                hasFile: !!item.file
            });
        });
        
        console.groupEnd();
    };

    // ==============================================================
    // TESTE DE UPLOAD
    // Extraído de media-unified.js (Core System)
    // ==============================================================
    window.testMediaUpload = async function() {
        console.group('🧪 TESTE DE UPLOAD RÁPIDO');
        
        if (!window.MediaSystem) {
            console.error('❌ MediaSystem não disponível');
            alert('❌ MediaSystem não disponível');
            console.groupEnd();
            return;
        }
        
        try {
            // Criar arquivo de teste
            const testBlob = new Blob(['test content'], { type: 'image/jpeg' });
            const testFile = new File([testBlob], 'test_image.jpg', { type: 'image/jpeg' });
            
            console.log('📁 Arquivo de teste criado');
            
            // Adicionar ao sistema
            MediaSystem.addFiles([testFile]);
            
            // Aguardar um pouco
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Testar upload
            const testId = 'test_' + Date.now();
            const result = await MediaSystem.uploadAll(testId, 'Teste de Upload');
            
            if (result.success) {
                console.log('✅ TESTE DE UPLOAD BEM-SUCEDIDO!');
                console.log('📊 URLs geradas:', result.images);
                alert('✅ Upload funcionou! Verifique console para detalhes.');
            } else {
                console.error('❌ TESTE DE UPLOAD FALHOU!');
                alert('❌ Upload falhou. Verifique console.');
            }
        } catch (error) {
            console.error('❌ Erro no teste:', error);
            alert(`❌ Erro: ${error.message}`);
        }
        
        console.groupEnd();
    };

    // ==============================================================
    // FUNÇÃO AUXILIAR: Forçar atualização do preview
    // ==============================================================
    window.forceMediaPreviewUpdate = function() {
        if (!window.MediaSystem) {
            console.error('❌ MediaSystem não disponível');
            return;
        }
        
        console.log('🔄 Forçando atualização do preview de mídia...');
        MediaSystem.updateUI();
        console.log('✅ Preview atualizado');
    };

    // ==============================================================
    // CORREÇÃO DE EMERGÊNCIA PARA VÍDEOS (PASSO 3)
    // ==============================================================
    
    // Função de detecção de vídeo (reutilizável)
    function isVideoUrl(url) {
        if (!url) return false;
        const urlLower = url.toLowerCase();
        return urlLower.includes('.mp4') || 
               urlLower.includes('.mov') || 
               urlLower.includes('.webm') || 
               urlLower.includes('.avi') ||
               urlLower.includes('.mkv') ||
               urlLower.includes('.flv');
    }
    
    /**
     * Correção de emergência para vídeos .MOV
     * Aplica patches nos sistemas MediaSystem e Gallery para suportar vídeos corretamente
     */
    window.applyVideoEmergencyFix = function() {
        console.group('🚨 [media-debug] APLICANDO CORREÇÃO DE EMERGÊNCIA PARA VÍDEOS .MOV');
        
        let fixesApplied = [];
        let errors = [];
        
        // ========== 1. Adicionar função de detecção de vídeo ao escopo global ==========
        if (typeof window.isVideoUrl !== 'function') {
            window.isVideoUrl = isVideoUrl;
            fixesApplied.push('window.isVideoUrl');
            console.log('✅ window.isVideoUrl adicionada');
        }
        
        // ========== 2. Corrigir MediaSystem ==========
        if (window.MediaSystem) {
            // Adicionar isVideoUrl ao MediaSystem
            if (!window.MediaSystem.isVideoUrl) {
                window.MediaSystem.isVideoUrl = isVideoUrl;
                fixesApplied.push('MediaSystem.isVideoUrl');
                console.log('✅ MediaSystem.isVideoUrl adicionada');
            }
            
            // Corrigir getMediaPreviewHTML para vídeos
            if (window.MediaSystem.getMediaPreviewHTML) {
                const originalGetPreview = window.MediaSystem.getMediaPreviewHTML;
                window.MediaSystem.getMediaPreviewHTML = function(item) {
                    const isVideo = isVideoUrl(item.url) || isVideoUrl(item.uploadedUrl) || 
                                   (item.name && isVideoUrl(item.name));
                    
                    if (isVideo && (item.url || item.uploadedUrl)) {
                        const videoUrl = item.uploadedUrl || item.url;
                        fixesApplied.push('MediaSystem.getMediaPreviewHTML (patchado)');
                        return `
                            <div style="width:100%;height:70px;position:relative;background:#000;">
                                <video style="width:100%;height:100%;object-fit:cover;" preload="metadata" muted>
                                    <source src="${videoUrl}" type="video/mp4">
                                    <source src="${videoUrl}" type="video/quicktime">
                                </video>
                                <div style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.7);color:white;padding:2px 5px;border-radius:3px;font-size:0.6rem;">
                                    <i class="fas fa-video"></i> Vídeo
                                </div>
                            </div>
                        `;
                    }
                    return originalGetPreview.call(this, item);
                };
                console.log('✅ MediaSystem.getMediaPreviewHTML corrigido para vídeos');
            }
            
            // Corrigir renderMediaPreview para vídeos
            if (window.MediaSystem.renderMediaPreview) {
                const originalRender = window.MediaSystem.renderMediaPreview;
                window.MediaSystem.renderMediaPreview = function() {
                    const container = document.getElementById('uploadPreview');
                    if (!container) return;
                    
                    const allFiles = [
                        ...(this.state.existing?.filter(item => !item.markedForDeletion) || []),
                        ...(this.state.files || [])
                    ];
                    
                    if (allFiles.length === 0) {
                        container.innerHTML = '<div style="text-align:center;color:#95a5a6;padding:2rem;"><i class="fas fa-images" style="font-size:2rem;margin-bottom:1rem;opacity:0.5;"></i><p>Nenhuma foto ou vídeo adicionada</p></div>';
                        return;
                    }
                    
                    let html = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
                    allFiles.forEach((item) => {
                        const isVideo = isVideoUrl(item.url) || isVideoUrl(item.uploadedUrl) || (item.name && isVideoUrl(item.name));
                        const borderColor = isVideo ? '#9b59b6' : '#3498db';
                        const displayName = item.name || 'Arquivo';
                        const shortName = displayName.length > 15 ? displayName.substring(0,12)+'...' : displayName;
                        
                        html += `
                            <div style="position:relative;width:110px;height:110px;border-radius:8px;overflow:hidden;border:2px solid ${borderColor};background:#e8f4fc;">
                                <div style="width:100%;height:70px;overflow:hidden;">
                                    ${this.getMediaPreviewHTML(item)}
                                </div>
                                <div style="padding:5px;font-size:0.7rem;text-align:center;">
                                    ${isVideo ? '<i class="fas fa-video"></i> ' : '<i class="fas fa-image"></i> '}${shortName}
                                </div>
                            </div>
                        `;
                    });
                    html += '</div>';
                    container.innerHTML = html;
                };
                console.log('✅ MediaSystem.renderMediaPreview corrigido para vídeos');
            }
            
            // Forçar re-renderização
            if (window.MediaSystem.updateUI) {
                setTimeout(() => window.MediaSystem.updateUI(), 100);
                fixesApplied.push('MediaSystem.updateUI (forçado)');
            }
        } else {
            errors.push('MediaSystem não encontrado');
        }
        
        // ========== 3. Corrigir openGallery ==========
        if (window.openGallery) {
            const originalOpenGallery = window.openGallery;
            window.openGallery = function(propertyId) {
                const property = window.properties?.find(p => p.id === propertyId);
                if (!property) return;
                
                const hasImages = property.images && property.images.length > 0 && property.images !== 'EMPTY';
                if (!hasImages) return;
                
                const allMedia = property.images.split(',').filter(url => url.trim() !== '');
                const imageUrls = allMedia.filter(url => !isVideoUrl(url));
                const videoUrls = allMedia.filter(url => isVideoUrl(url));
                
                // Se não houver imagens mas tiver vídeos, abrir vídeo
                if (imageUrls.length === 0 && videoUrls.length > 0) {
                    window.open(videoUrls[0], '_blank');
                    return;
                }
                
                // Se não houver imagens, sair
                if (imageUrls.length === 0) return;
                
                // Chamar função original com apenas imagens
                window.currentGalleryImages = imageUrls;
                window.currentGalleryIndex = 0;
                originalOpenGallery(propertyId);
            };
            fixesApplied.push('openGallery (patchado com filtro de vídeos)');
            console.log('✅ openGallery corrigido com filtro de vídeos');
        } else {
            errors.push('openGallery não encontrado');
        }
        
        // ========== 4. Corrigir createPropertyGallery ==========
        if (window.createPropertyGallery) {
            const originalCreateGallery = window.createPropertyGallery;
            window.createPropertyGallery = function(property) {
                const hasImages = property.images && property.images.length > 0 && property.images !== 'EMPTY';
                const allMedia = hasImages ? property.images.split(',').filter(url => url.trim() !== '') : [];
                const hasVideos = allMedia.some(url => isVideoUrl(url));
                
                let html = originalCreateGallery(property);
                
                // Adicionar indicador de vídeo se necessário
                if (hasVideos && !html.includes('video-indicator')) {
                    html = html.replace(
                        'property-image',
                        `property-image"
                        <div class="video-indicator" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:4px 8px;border-radius:4px;font-size:0.7rem;z-index:20;">
                            <i class="fas fa-video"></i> Vídeo
                        </div>
                    `
                    );
                    fixesApplied.push('createPropertyGallery (indicador de vídeo adicionado)');
                }
                return html;
            };
            console.log('✅ createPropertyGallery corrigido com indicador de vídeo');
        } else {
            errors.push('createPropertyGallery não encontrado');
        }
        
        // ========== 5. Forçar recriação dos cards ==========
        setTimeout(() => {
            if (typeof window.renderProperties === 'function') {
                window.renderProperties(window.currentFilter || 'todos');
                console.log('✅ renderProperties forçado para atualizar cards');
            } else if (typeof window.displayProperties === 'function') {
                window.displayProperties();
            } else if (typeof window.loadProperties === 'function') {
                window.loadProperties();
            }
        }, 200);
        
        // ========== 6. Registrar no DiagnosticRegistry ==========
        if (window.DiagnosticRegistry) {
            window.DiagnosticRegistry.register(
                'applyVideoEmergencyFix',
                window.applyVideoEmergencyFix,
                'media',
                { 
                    isSafe: false,
                    isDestructive: false,
                    description: 'Aplica correção de emergência para vídeos .MOV na galeria e preview',
                    version: '2.1.0'
                }
            );
        }
        
        // ========== 7. Resumo ==========
        console.log('\n📊 RESUMO DA CORREÇÃO:');
        console.log(`✅ Correções aplicadas: ${fixesApplied.length}`);
        fixesApplied.forEach(fix => console.log(`   • ${fix}`));
        
        if (errors.length > 0) {
            console.warn(`⚠️ Erros encontrados: ${errors.length}`);
            errors.forEach(err => console.warn(`   • ${err}`));
        }
        
        console.log('\n🎬 Vídeos .MOV agora devem funcionar na galeria e no preview!');
        console.groupEnd();
        
        return {
            success: errors.length === 0,
            fixesApplied: fixesApplied,
            errors: errors,
            timestamp: new Date().toISOString()
        };
    };

    // ==============================================================
    // VERIFICAÇÃO MANUAL - STATUS DA CORREÇÃO (PASSO 4)
    // ==============================================================
    /**
     * Verifica se a correção de vídeos está ativa
     * Esta função substitui a necessidade de digitar comandos no console F12
     */
    window.checkVideoFixStatus = function() {
        console.group('🔍 [media-debug] VERIFICAÇÃO MANUAL - STATUS DA CORREÇÃO DE VÍDEOS');
        
        // Executar testes de detecção
        const testMov = isVideoUrl('video.mov');
        const testMp4 = isVideoUrl('video.mp4');
        const testJpg = isVideoUrl('foto.jpg');
        
        const status = {
            // Funções globais
            isVideoUrlFunction: typeof window.isVideoUrl === 'function',
            
            // MediaSystem
            mediaSystemExists: !!window.MediaSystem,
            mediaSystemIsVideoUrl: !!(window.MediaSystem?.isVideoUrl),
            
            // Gallery
            openGalleryExists: typeof window.openGallery === 'function',
            openGalleryPatched: window.openGallery?.toString().includes('isVideoUrl'),
            createPropertyGalleryExists: typeof window.createPropertyGallery === 'function',
            createGalleryPatched: window.createPropertyGallery?.toString().includes('video-indicator'),
            
            // Testes de detecção
            videoDetectionTests: {
                'Arquivo .mov': testMov ? '✅ VÍDEO' : '❌ NÃO DETECTADO',
                'Arquivo .mp4': testMp4 ? '✅ VÍDEO' : '❌ NÃO DETECTADO',
                'Arquivo .jpg': testJpg ? '⚠️ (detectado como vídeo?)' : '✅ IMAGEM'
            },
            
            // Propriedades com vídeos
            propertiesWithVideos: 0,
            videoUrlsFound: []
        };
        
        // Verificar propriedades que contêm vídeos
        if (window.properties && Array.isArray(window.properties)) {
            window.properties.forEach(property => {
                if (property.images && property.images !== 'EMPTY') {
                    const urls = property.images.split(',').filter(u => u.trim());
                    const videos = urls.filter(u => isVideoUrl(u));
                    if (videos.length > 0) {
                        status.propertiesWithVideos++;
                        status.videoUrlsFound.push({
                            propertyId: property.id,
                            title: property.title,
                            videoCount: videos.length,
                            firstVideo: videos[0].substring(0, 80) + '...'
                        });
                    }
                }
            });
        }
        
        // Determinar status geral
        const isFullyActive = status.isVideoUrlFunction && 
                              status.mediaSystemIsVideoUrl &&
                              testMov === true &&
                              testJpg === false;
        
        const needsFix = !isFullyActive || 
                        (status.openGalleryExists && !status.openGalleryPatched) ||
                        (status.createPropertyGalleryExists && !status.createGalleryPatched);
        
        // Exibir resultados formatados
        console.log('\n📊 FUNÇÕES E MÓDULOS:');
        console.log(`   window.isVideoUrl: ${status.isVideoUrlFunction ? '✅' : '❌'}`);
        console.log(`   MediaSystem disponível: ${status.mediaSystemExists ? '✅' : '❌'}`);
        console.log(`   MediaSystem.isVideoUrl: ${status.mediaSystemIsVideoUrl ? '✅' : '❌'}`);
        console.log(`   openGallery: ${status.openGalleryExists ? (status.openGalleryPatched ? '✅ PATCHADO' : '⚠️ ORIGINAL') : '❌'}`);
        console.log(`   createPropertyGallery: ${status.createPropertyGalleryExists ? (status.createGalleryPatched ? '✅ PATCHADO' : '⚠️ ORIGINAL') : '❌'}醒`);
        
        console.log('\n🎬 TESTES DE DETECÇÃO:');
        console.log(`   .mov (vídeo): ${status.videoDetectionTests['Arquivo .mov']}`);
        console.log(`   .mp4 (vídeo): ${status.videoDetectionTests['Arquivo .mp4']}`);
        console.log(`   .jpg (imagem): ${status.videoDetectionTests['Arquivo .jpg']}`);
        
        if (status.propertiesWithVideos > 0) {
            console.log(`\n📹 PROPRIEDADES COM VÍDEOS: ${status.propertiesWithVideos}`);
            status.videoUrlsFound.slice(0, 5).forEach(p => {
                console.log(`   • ID ${p.propertyId}: "${p.title}" - ${p.videoCount} vídeo(s)`);
            });
            if (status.videoUrlsFound.length > 5) {
                console.log(`   ... e mais ${status.videoUrlsFound.length - 5} propriedades`);
            }
        } else {
            console.log('\n📹 Nenhuma propriedade com vídeos encontrada.');
        }
        
        console.log('\n📊 STATUS GERAL:');
        if (isFullyActive) {
            console.log('   ✅ CORREÇÃO ATIVA - Vídeos .MOV devem funcionar corretamente');
        } else if (needsFix) {
            console.log('   ⚠️ CORREÇÃO PARCIAL OU INATIVA - Execute applyVideoEmergencyFix()');
            console.log('   💡 Para aplicar: window.applyVideoEmergencyFix()');
        } else {
            console.log('   ⚠️ VERIFICAÇÃO INCONCLUSIVA - Revise os resultados acima');
        }
        
        // Recomendações
        if (!status.isVideoUrlFunction) {
            console.log('\n💡 RECOMENDAÇÃO: window.isVideoUrl não está disponível');
            console.log('   Execute: window.applyVideoEmergencyFix()');
        }
        
        if (status.openGalleryExists && !status.openGalleryPatched) {
            console.log('\n💡 RECOMENDAÇÃO: openGallery não está patchado para filtrar vídeos');
            console.log('   Execute: window.applyVideoEmergencyFix()');
        }
        
        if (testJpg === true) {
            console.log('\n⚠️ ATENÇÃO: A função isVideoUrl está detectando .jpg como vídeo!');
            console.log('   Isso pode indicar um problema na implementação.');
        }
        
        console.groupEnd();
        
        return {
            status: isFullyActive ? 'active' : (needsFix ? 'needs_fix' : 'partial'),
            isActive: isFullyActive,
            needsFix: needsFix,
            details: status,
            timestamp: new Date().toISOString(),
            recommendation: needsFix ? 'Execute applyVideoEmergencyFix() para aplicar a correção' : 
                         (isFullyActive ? 'Sistema funcionando corretamente' : 'Verifique manualmente os resultados acima')
        };
    };

    // ==============================================================
    // AUTO-VERIFICAÇÃO EM MODO DEBUG (opcional)
    // ==============================================================
    const urlParams = new URLSearchParams(window.location.search);
    
    // Auto-aplicação da correção se solicitado via parâmetro
    if (urlParams.has('fix-videos')) {
        setTimeout(() => {
            console.log('🎬 [media-debug] Auto-aplicação da correção de vídeos ativada por parâmetro');
            window.applyVideoEmergencyFix();
            
            // Verificar status após a correção
            setTimeout(() => {
                window.checkVideoFixStatus();
            }, 1000);
        }, 2000);
    }
    
    // Auto-verificação em modo debug
    if (urlParams.has('debug=true') || urlParams.has('check-videos')) {
        setTimeout(() => {
            console.log('🔍 [media-debug] Executando auto-verificação do sistema de vídeos...');
            window.checkVideoFixStatus();
        }, 3000);
    }

    console.log('✅ media-debug.js v2.1.0 pronto. Funções disponíveis:');
    console.log('   🔧 DIAGNÓSTICO:');
    console.log('      - debugMediaSystem()');
    console.log('      - testMediaUpload()');
    console.log('      - forceMediaPreviewUpdate()');
    console.log('   🎬 CORREÇÃO DE VÍDEOS:');
    console.log('      - applyVideoEmergencyFix() - Aplica correção para vídeos .MOV');
    console.log('      - checkVideoFixStatus() - Verifica se a correção está ativa');
    console.log('   📝 PARÂMETROS DE URL:');
    console.log('      - ?fix-videos - Aplica correção automaticamente');
    console.log('      - ?check-videos - Executa verificação automática');
})();
