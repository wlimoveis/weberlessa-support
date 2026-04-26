// debug/media/media-ui-full.js - MÓDULO DE UI COMPLETA PARA MEDIASYSTEM (VERSÃO CORRIGIDA)
// ✅ Corrigido: renderização de previews ao carregar mídia existente

console.log('🎨 [Support] media-ui-full.js carregado - UI completa para MediaSystem');

(function() {
    'use strict';
    
    const isDebugMode = window.location.search.includes('debug=true') || 
                        window.location.search.includes('test=true');
    
    // ========== FUNÇÕES DE PREVIEW ==========
    
    function isVideoUrl(url) {
        if (!url) return false;
        const urlLower = url.toLowerCase();
        return urlLower.includes('.mp4') || urlLower.includes('.mov') || 
               urlLower.includes('.webm') || urlLower.includes('.avi') ||
               urlLower.includes('video/');
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    function getMediaPreviewHTML(item) {
        const displayName = item.name || 'Arquivo';
        const shortName = displayName.length > 20 ? displayName.substring(0, 17) + '...' : displayName;
        
        const isVideoFile = item.isVideo === true || 
                            (item.type && item.type.startsWith('video/')) || 
                            (item.name && item.name.toLowerCase().match(/\.(mp4|mov|webm|avi)$/)) ||
                            (item.url && isVideoUrl(item.url));
        
        const videoUrl = item.uploadedUrl || item.url || item.preview;
        
        if (isVideoFile && videoUrl && !videoUrl.startsWith('blob:')) {
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
        
        if (item.isNew && !item.uploaded && item.preview && item.preview.startsWith('blob:')) {
            return `
                <div style="width:100%;height:70px;position:relative;background:#2c3e50;">
                    <img src="${item.preview}" 
                         alt="${displayName}"
                         style="width:100%;height:100%;object-fit:cover;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:none;flex-direction:column;align-items:center;justify-content:center;color:#ecf0f1;">
                        <i class="fas fa-image" style="font-size:1.5rem;margin-bottom:5px;"></i>
                        <div style="font-size:0.65rem;text-align:center;">${escapeHtml(shortName)}</div>
                    </div>
                </div>
            `;
        }
        
        if ((item.url || item.uploadedUrl) && !(item.url || '').startsWith('blob:')) {
            const imageUrl = item.uploadedUrl || item.url;
            return `
                <div style="width:100%;height:70px;position:relative;background:#2c3e50;">
                    <img src="${imageUrl}" 
                         alt="${displayName}"
                         style="width:100%;height:100%;object-fit:cover;"
                         loading="lazy"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:none;flex-direction:column;align-items:center;justify-content:center;color:#ecf0f1;">
                        <i class="fas fa-image" style="font-size:1.5rem;margin-bottom:5px;"></i>
                        <div style="font-size:0.65rem;text-align:center;">${escapeHtml(shortName)}</div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div style="width:100%;height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#2c3e50;color:#ecf0f1;">
                <i class="fas fa-image" style="font-size:1.5rem;margin-bottom:5px;"></i>
                <div style="font-size:0.65rem;text-align:center;">${escapeHtml(shortName)}</div>
            </div>
        `;
    }
    
    // ========== RENDERIZAÇÃO DE PREVIEWS - VERSÃO CORRIGIDA ==========
    
    function renderMediaPreview(mediaSystem) {
        console.log('🎨 [SupportUI] renderMediaPreview chamado');
        
        const container = document.getElementById('uploadPreview');
        if (!container) {
            console.warn('⚠️ [SupportUI] Container #uploadPreview não encontrado');
            return;
        }
        
        const existingItems = (mediaSystem.state.existing || []).filter(item => !item.markedForDeletion);
        const newItems = (mediaSystem.state.files || []);
        const allFiles = [...existingItems, ...newItems];
        
        console.log(`🎨 [SupportUI] Renderizando ${allFiles.length} arquivo(s) (${existingItems.length} existentes, ${newItems.length} novos)`);
        
        if (allFiles.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #95a5a6; padding: 2rem;">
                    <i class="fas fa-images" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p style="margin: 0;">Nenhuma foto ou vídeo adicionada</p>
                    <small style="font-size: 0.8rem;">Arraste ou clique para adicionar</small>
                </div>
            `;
            return;
        }
        
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
        
        allFiles.forEach((item, index) => {
            const isMarked = item.markedForDeletion;
            const isExisting = item.isExisting;
            const isNew = item.isNew;
            const isVideo = item.isVideo === true || 
                            (item.type && item.type.startsWith('video/'));
            
            let borderColor = isVideo ? '#9b59b6' : '#3498db';
            let statusText = isNew ? 'Novo' : (isExisting ? 'Existente' : '');
            let statusIcon = isVideo ? '<i class="fas fa-video"></i> ' : '<i class="fas fa-image"></i> ';
            
            if (isMarked) {
                borderColor = '#e74c3c';
                statusText = 'Excluir';
            }
            
            const displayName = item.name || 'Arquivo';
            const shortName = displayName.length > 15 ? displayName.substring(0, 12) + '...' : displayName;
            
            html += `
                <div class="media-preview-item draggable-item" 
                     draggable="true"
                     data-id="${item.id}"
                     title="${escapeHtml(displayName)}"
                     style="position:relative;width:110px;height:110px;border-radius:8px;overflow:hidden;border:2px solid ${borderColor};background:#e8f4fc;cursor:grab;">
                    
                    <div style="width:100%;height:70px;overflow:hidden;">
                        ${getMediaPreviewHTML(item)}
                    </div>
                    
                    <div style="padding:5px;font-size:0.7rem;text-align:center;height:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                        <span style="display:block;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                            ${statusIcon}${escapeHtml(shortName)}
                        </span>
                    </div>
                    
                    <div style="position:absolute;top:0;left:0;background:rgba(0,0,0,0.7);color:white;width:22px;height:22px;border-radius:0 0 8px 0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;z-index:10;">
                        <i class="fas fa-arrows-alt"></i>
                    </div>
                    
                    <div style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.8);color:white;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;z-index:5;">
                        ${index + 1}
                    </div>
                    
                    <button onclick="window.MediaSystem?.removeFile && window.MediaSystem.removeFile('${item.id}')" 
                            style="position:absolute;top:0;right:0;background:${isMarked ? '#c0392b' : '#e74c3c'};color:white;border:none;width:24px;height:24px;cursor:pointer;font-size:14px;font-weight:bold;z-index:10;border-radius:0 0 0 8px;display:flex;align-items:center;justify-content:center;">
                        ${isMarked ? '↺' : '×'}
                    </button>
                    
                    <div style="position:absolute;bottom:2px;left:2px;background:${borderColor};color:white;font-size:0.5rem;padding:1px 3px;border-radius:2px;z-index:10;">
                        ${statusText}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        console.log('✅ [SupportUI] renderMediaPreview concluído');
    }
    
    function renderPdfPreview(mediaSystem) {
        console.log('🎨 [SupportUI] renderPdfPreview chamado');
        
        const container = document.getElementById('pdfUploadPreview');
        if (!container) {
            console.warn('⚠️ [SupportUI] Container #pdfUploadPreview não encontrado');
            return;
        }
        
        const existingPdfs = (mediaSystem.state.existingPdfs || []).filter(item => !item.markedForDeletion);
        const newPdfs = (mediaSystem.state.pdfs || []);
        const allPdfs = [...existingPdfs, ...newPdfs];
        
        console.log(`🎨 [SupportUI] Renderizando ${allPdfs.length} PDF(s) (${existingPdfs.length} existentes, ${newPdfs.length} novos)`);
        
        if (allPdfs.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #95a5a6; padding: 1rem; font-size: 0.9rem;">
                    <i class="fas fa-cloud-upload-alt" style="font-size: 1.5rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <p style="margin: 0;">Arraste ou clique para adicionar PDFs</p>
                </div>
            `;
            return;
        }
        
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">';
        
        allPdfs.forEach((pdf, index) => {
            const isMarked = pdf.markedForDeletion;
            const isExisting = pdf.isExisting;
            
            let borderColor = '#3498db';
            let statusText = 'Novo';
            
            if (isMarked) {
                borderColor = '#e74c3c';
                statusText = 'Excluir';
            } else if (isExisting) {
                borderColor = '#27ae60';
                statusText = 'Existente';
            }
            
            const shortName = pdf.name.length > 15 ? pdf.name.substring(0, 12) + '...' : pdf.name;
            
            html += `
                <div class="pdf-preview-container draggable-item"
                     draggable="true"
                     data-id="${pdf.id}"
                     style="position:relative;cursor:grab;">
                    <div style="background:#e8f4fc;border:1px solid ${borderColor};border-radius:6px;padding:0.5rem;width:90px;height:90px;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;overflow:hidden;position:relative;">
                        <div style="position:absolute;top:0;left:0;background:rgba(0,0,0,0.6);color:white;width:20px;height:20px;border-radius:0 0 6px 0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;z-index:5;">
                            <i class="fas fa-arrows-alt"></i>
                        </div>
                        
                        <div style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.8);color:white;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;z-index:5;">
                            ${index + 1}
                        </div>
                        
                        <i class="fas fa-file-pdf" style="font-size:1.2rem;color:${borderColor};margin-bottom:0.3rem;"></i>
                        <p style="font-size:0.7rem;margin:0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${escapeHtml(shortName)}</p>
                        <small style="color:#7f8c8d;font-size:0.6rem;">${statusText}</small>
                    </div>
                    <button onclick="window.MediaSystem?.removeFile && window.MediaSystem.removeFile('${pdf.id}')" 
                            style="position:absolute;top:0;right:0;background:${borderColor};color:white;border:none;width:22px;height:22px;font-size:14px;font-weight:bold;cursor:pointer;border-radius:0 0 0 6px;">
                        ×
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        console.log('✅ [SupportUI] renderPdfPreview concluído');
    }
    
    // ========== INJEÇÃO NO MEDIASYSTEM - VERSÃO CORRIGIDA ==========
    
    function injectUIIntoMediaSystem(mediaSystem) {
        if (!mediaSystem) {
            console.error('❌ [Support] MediaSystem não encontrado');
            return false;
        }
        
        console.log('🎨 [Support] Injetando UI completa no MediaSystem...');
        
        // ✅ CORREÇÃO: Sobrescrever o método updateUI diretamente
        mediaSystem.updateUI = function() {
            console.log('🔄 [SupportUI] updateUI chamado via MediaSystem');
            renderMediaPreview(this);
            renderPdfPreview(this);
        };
        
        // ✅ CORREÇÃO: Adicionar métodos auxiliares
        mediaSystem.renderMediaPreview = function() {
            renderMediaPreview(this);
        };
        
        mediaSystem.renderPdfPreview = function() {
            renderPdfPreview(this);
        };
        
        // ✅ CORREÇÃO: Forçar renderização imediata se houver dados
        if (mediaSystem.state.existing.length > 0 || mediaSystem.state.files.length > 0 ||
            mediaSystem.state.existingPdfs.length > 0 || mediaSystem.state.pdfs.length > 0) {
            console.log('🎨 [Support] Dados existentes detectados, renderizando imediatamente...');
            setTimeout(() => {
                renderMediaPreview(mediaSystem);
                renderPdfPreview(mediaSystem);
            }, 100);
        }
        
        console.log('✅ [Support] UI injetada no MediaSystem - método updateUI substituído');
        return true;
    }
    
    // ========== EXPORTAÇÃO PARA WINDOW ==========
    
    window.SupportUI = {
        renderMediaPreview,
        renderPdfPreview,
        getMediaPreviewHTML,
        isVideoUrl,
        injectUIIntoMediaSystem,
        version: '1.1'
    };
    
    // ========== AUTO-INICIALIZAÇÃO ==========
    
    function waitForMediaSystem() {
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.MediaSystem) {
                clearInterval(checkInterval);
                console.log('🎨 [Support] MediaSystem encontrado, injetando UI...');
                injectUIIntoMediaSystem(window.MediaSystem);
                
                // Disparar evento
                if (window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('media-ui-ready', {
                        detail: { source: 'media-ui-full', version: '1.1' }
                    }));
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('⚠️ [Support] MediaSystem não encontrado');
            }
        }, 500);
    }
    
    // Iniciar apenas em modo debug
    if (isDebugMode) {
        waitForMediaSystem();
        console.log('✅ [Support] media-ui-full.js inicializado - Modo DEBUG ativo');
    } else {
        console.log('🎨 [Support] Modo produção - UI completa não carregada');
    }
    
})();
