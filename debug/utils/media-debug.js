// ================== CORREÇÃO DE EMERGÊNCIA PARA VÍDEOS ==================
// Adicionado em: 04/04/2026
// Finalidade: Corrigir problemas de exibição de vídeos .mov e outros formatos

console.log('🎬 [media-debug] Adicionando correção de emergência para vídeos...');

// Estender o objeto mediaDebug existente ou criar se não existir
window.mediaDebug = window.mediaDebug || {};

/**
 * Correção de emergência para vídeos .mov
 * Aplica patches nos sistemas MediaSystem e Gallery para suportar vídeos corretamente
 */
window.mediaDebug.applyVideoEmergencyFix = function() {
    console.group('🚨 [media-debug] APLICANDO CORREÇÃO DE EMERGÊNCIA PARA VÍDEOS .MOV');
    
    let fixesApplied = [];
    let errors = [];
    
    // ========== 1. Função de detecção de vídeo ==========
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
    
    // Adicionar ao escopo global se não existir
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
            'mediaDebug.applyVideoEmergencyFix',
            window.mediaDebug.applyVideoEmergencyFix,
            'media',
            { 
                isSafe: false,
                isDestructive: false,
                description: 'Aplica correção de emergência para vídeos .MOV na galeria e preview',
                version: '1.0.0'
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

/**
 * Verifica se a correção de vídeos está ativa
 */
window.mediaDebug.checkVideoFixStatus = function() {
    console.group('🔍 [media-debug] Verificando status da correção de vídeos');
    
    const status = {
        isVideoUrlFunction: typeof window.isVideoUrl === 'function',
        mediaSystemIsVideoUrl: !!(window.MediaSystem?.isVideoUrl),
        openGalleryPatched: window.openGallery?.toString().includes('isVideoUrl'),
        createGalleryPatched: window.createPropertyGallery?.toString().includes('video-indicator'),
        videoDetectionTest: {
            mov: window.isVideoUrl ? window.isVideoUrl('video.mov') : null,
            mp4: window.isVideoUrl ? window.isVideoUrl('video.mp4') : null,
            jpg: window.isVideoUrl ? window.isVideoUrl('foto.jpg') : null
        }
    };
    
    console.table(status);
    
    const isFullyActive = status.isVideoUrlFunction && 
                          status.videoDetectionTest.mov === true &&
                          status.videoDetectionTest.jpg === false;
    
    console.log(`\n📊 Status geral: ${isFullyActive ? '✅ CORREÇÃO ATIVA' : '⚠️ CORREÇÃO PARCIAL OU INATIVA'}`);
    console.groupEnd();
    
    return status;
};

// Auto-execução em modo debug (opcional, via parâmetro)
if (window.location.search.includes('fix-videos=true')) {
    setTimeout(() => {
        console.log('🎬 [media-debug] Auto-aplicação da correção de vídeos ativada por parâmetro');
        window.mediaDebug.applyVideoEmergencyFix();
    }, 2000);
}

console.log('✅ [media-debug] Correção de emergência para vídeos disponível');
console.log('📝 Execute window.mediaDebug.applyVideoEmergencyFix() para aplicar a correção');
console.log('📝 Execute window.mediaDebug.checkVideoFixStatus() para verificar status');
