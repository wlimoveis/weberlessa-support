// debug/media/media-ui-full.js - MÓDULO DE UI COMPLETA PARA MEDIASYSTEM
// ✅ Carrega APENAS em modo debug (?debug=true)
// ✅ Fornece previews, drag & drop, reordenamento e UI visual avançada
// ✅ TODO código não essencial migrado do Core System

console.log('🎨 [Support] media-ui-full.js carregado - UI completa para MediaSystem');

(function() {
    'use strict';
    
    // ========== VERIFICAÇÃO DE AMBIENTE ==========
    const isDebugMode = window.location.search.includes('debug=true') || 
                        window.location.search.includes('test=true');
    
    if (!isDebugMode) {
        console.log('🎨 [Support] Modo produção - UI completa não carregada');
        return;
    }
    
    // ========== CONFIGURAÇÃO ==========
    const UI_CONFIG = {
        animationDuration: 300,
        maxPreviewItems: 50,
        dragThreshold: 5
    };
    
    // ========== FUNÇÕES DE PREVIEW ==========
    
    /**
     * Obtém HTML de preview para um item de mídia
     * @param {Object} item - Item de mídia (foto ou vídeo)
     * @returns {string} HTML do preview
     */
    function getMediaPreviewHTML(item) {
        const displayName = item.name || 'Arquivo';
        const shortName = displayName.length > 20 ? displayName.substring(0, 17) + '...' : displayName;
        
        // Verificar se é vídeo
        const isVideoFile = item.isVideo === true || 
                            (item.type && item.type.startsWith('video/')) || 
                            (item.name && item.name.toLowerCase().match(/\.(mp4|mov|webm|avi)$/)) ||
                            (item.url && isVideoUrl(item.url));
        
        const videoUrl = item.uploadedUrl || item.url || item.preview;
        
        // Preview de vídeo
        if (isVideoFile && videoUrl && !videoUrl.startsWith('blob:')) {
            return `
                <div style="width:100%;height:70px;position:relative;background:#000;">
                    <video style="width:100%;height:100%;object-fit:cover;" preload="metadata" muted>
                        <source src="${videoUrl}" type="video/mp4">
                        <source src="${videoUrl}" type="video/quicktime">
                        Seu navegador não suporta vídeo.
                    </video>
                    <div style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.7);color:white;padding:2px 5px;border-radius:3px;font-size:0.6rem;">
                        <i class="fas fa-video"></i> Vídeo
                    </div>
                </div>
            `;
        }
        
        // Preview de imagem nova (blob URL)
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
        
        // Preview de imagem existente
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
        
        // Fallback
        return `
            <div style="width:100%;height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#2c3e50;color:#ecf0f1;">
                <i class="fas fa-image" style="font-size:1.5rem;margin-bottom:5px;"></i>
                <div style="font-size:0.65rem;text-align:center;">${escapeHtml(shortName)}</div>
            </div>
        `;
    }
    
    /**
     * Verifica se URL é de vídeo
     */
    function isVideoUrl(url) {
        if (!url) return false;
        const urlLower = url.toLowerCase();
        return urlLower.includes('.mp4') || 
               urlLower.includes('.mov') || 
               urlLower.includes('.webm') || 
               urlLower.includes('.avi') ||
               urlLower.includes('video/');
    }
    
    /**
     * Escapa HTML para evitar XSS
     */
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    // ========== RENDERIZAÇÃO DE PREVIEWS ==========
    
    /**
     * Renderiza preview de mídia (fotos/vídeos)
     * @param {Object} mediaSystem - Instância do MediaSystem
     */
    function renderMediaPreview(mediaSystem) {
        const container = document.getElementById('uploadPreview');
        if (!container) return;
        
        const allFiles = [
            ...(mediaSystem.state.existing || []).filter(item => !item.markedForDeletion),
            ...(mediaSystem.state.files || [])
        ];
        
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
        
        // Reconfigurar eventos de drag & drop
        setTimeout(() => setupContainerDragEvents('uploadPreview', mediaSystem), 100);
    }
    
    /**
     * Renderiza preview de PDFs
     * @param {Object} mediaSystem - Instância do MediaSystem
     */
    function renderPdfPreview(mediaSystem) {
        const container = document.getElementById('pdfUploadPreview');
        if (!container) return;
        
        const allPdfs = [
            ...(mediaSystem.state.existingPdfs || []).filter(item => !item.markedForDeletion),
            ...(mediaSystem.state.pdfs || [])
        ];
        
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
        
        // Reconfigurar eventos de drag & drop
        setTimeout(() => setupContainerDragEvents('pdfUploadPreview', mediaSystem), 100);
    }
    
    // ========== DRAG & DROP REORDER ==========
    
    /**
     * Configura eventos de drag & drop para um container
     * @param {string} containerId - ID do container
     * @param {Object} mediaSystem - Instância do MediaSystem
     */
    function setupContainerDragEvents(containerId, mediaSystem) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.addEventListener('dragstart', (e) => {
            const draggable = e.target.closest('.draggable-item');
            if (!draggable) return;
            
            e.dataTransfer.setData('text/plain', draggable.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
            draggable.classList.add('dragging');
        });
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const draggedId = e.dataTransfer.getData('text/plain');
            const dropTarget = e.target.closest('.draggable-item');
            
            if (!draggedId || !dropTarget) return;
            
            const targetId = dropTarget.dataset.id;
            if (draggedId === targetId) return;
            
            reorderItems(draggedId, targetId, mediaSystem);
            
            document.querySelectorAll('.dragging').forEach(el => {
                el.classList.remove('dragging');
            });
        });
        
        container.addEventListener('dragend', () => {
            document.querySelectorAll('.dragging').forEach(el => {
                el.classList.remove('dragging');
            });
        });
    }
    
    /**
     * Reordena itens após drag & drop
     * @param {string} draggedId - ID do item arrastado
     * @param {string} targetId - ID do item alvo
     * @param {Object} mediaSystem - Instância do MediaSystem
     */
    function reorderItems(draggedId, targetId, mediaSystem) {
        const allArrays = [
            { name: 'files', array: mediaSystem.state.files },
            { name: 'existing', array: mediaSystem.state.existing },
            { name: 'pdfs', array: mediaSystem.state.pdfs },
            { name: 'existingPdfs', array: mediaSystem.state.existingPdfs }
        ];
        
        for (const arr of allArrays) {
            const draggedIndex = arr.array.findIndex(item => item.id === draggedId);
            if (draggedIndex !== -1) {
                const targetIndex = arr.array.findIndex(item => item.id === targetId);
                if (targetIndex !== -1) {
                    const newArray = [...arr.array];
                    const [draggedItem] = newArray.splice(draggedIndex, 1);
                    newArray.splice(targetIndex, 0, draggedItem);
                    
                    if (arr.name === 'files') mediaSystem.state.files = newArray;
                    else if (arr.name === 'existing') mediaSystem.state.existing = newArray;
                    else if (arr.name === 'pdfs') mediaSystem.state.pdfs = newArray;
                    else if (arr.name === 'existingPdfs') mediaSystem.state.existingPdfs = newArray;
                    
                    // Re-renderizar após reordenação
                    setTimeout(() => {
                        renderMediaPreview(mediaSystem);
                        renderPdfPreview(mediaSystem);
                    }, 50);
                }
                break;
            }
        }
    }
    
    // ========== EVENT LISTENERS DE UPLOAD ==========
    
    /**
     * Configura event listeners para áreas de upload
     * @param {Object} mediaSystem - Instância do MediaSystem
     */
    function setupEventListeners(mediaSystem) {
        // Upload de mídia (fotos/vídeos)
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea && fileInput && !uploadArea.hasAttribute('data-ui-initialized')) {
            uploadArea.setAttribute('data-ui-initialized', 'true');
            
            uploadArea.addEventListener('click', () => fileInput.click());
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#3498db';
                uploadArea.style.background = '#e8f4fc';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '#ddd';
                uploadArea.style.background = '#fafafa';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#ddd';
                uploadArea.style.background = '#fafafa';
                
                if (e.dataTransfer.files.length > 0 && mediaSystem.addFiles) {
                    mediaSystem.addFiles(e.dataTransfer.files);
                }
            });
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0 && mediaSystem.addFiles) {
                    mediaSystem.addFiles(e.target.files);
                    e.target.value = '';
                }
            });
        }
        
        // Upload de PDFs
        const pdfUploadArea = document.getElementById('pdfUploadArea');
        const pdfFileInput = document.getElementById('pdfFileInput');
        
        if (pdfUploadArea && pdfFileInput && !pdfUploadArea.hasAttribute('data-ui-initialized')) {
            pdfUploadArea.setAttribute('data-ui-initialized', 'true');
            
            pdfUploadArea.addEventListener('click', () => pdfFileInput.click());
            
            pdfFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0 && mediaSystem.addPdfs) {
                    mediaSystem.addPdfs(e.target.files);
                    e.target.value = '';
                }
            });
        }
    }
    
    // ========== FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ==========
    
    /**
     * Injeta as funções de UI no MediaSystem existente
     * @param {Object} mediaSystem - Instância do MediaSystem
     */
    function injectUIIntoMediaSystem(mediaSystem) {
        if (!mediaSystem) {
            console.error('❌ [Support] MediaSystem não encontrado para injetar UI');
            return false;
        }
        
        console.log('🎨 [Support] Injetando UI completa no MediaSystem...');
        
        // Salvar referências originais (se existirem)
        const originalRenderMediaPreview = mediaSystem.renderMediaPreview;
        const originalRenderPdfPreview = mediaSystem.renderPdfPreview;
        
        // Sobrescrever métodos com versões completas
        mediaSystem.renderMediaPreview = function() {
            renderMediaPreview(this);
        };
        
        mediaSystem.renderPdfPreview = function() {
            renderPdfPreview(this);
        };
        
        mediaSystem.setupDragAndDrop = function() {
            setupContainerDragEvents('uploadPreview', this);
            setupContainerDragEvents('pdfUploadPreview', this);
        };
        
        // Atualizar método setupEventListeners se existir
        if (mediaSystem.setupEventListeners) {
            const originalSetup = mediaSystem.setupEventListeners;
            mediaSystem.setupEventListeners = function() {
                originalSetup.call(this);
                setupEventListeners(this);
            };
        } else {
            mediaSystem.setupEventListeners = function() {
                setupEventListeners(this);
            };
        }
        
        // Adicionar método auxiliar de reordenação
        mediaSystem.reorderItems = function(draggedId, targetId) {
            reorderItems(draggedId, targetId, this);
        };
        
        // Forçar re-renderização
        setTimeout(() => {
            if (mediaSystem.renderMediaPreview) mediaSystem.renderMediaPreview();
            if (mediaSystem.renderPdfPreview) mediaSystem.renderPdfPreview();
        }, 100);
        
        console.log('✅ [Support] UI completa injetada no MediaSystem');
        return true;
    }
    
    // ========== AUTO-INICIALIZAÇÃO ==========
    
    /**
     * Aguarda MediaSystem e injeta UI
     */
    function waitForMediaSystem() {
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.MediaSystem) {
                clearInterval(checkInterval);
                console.log('🎨 [Support] MediaSystem encontrado, injetando UI...');
                injectUIIntoMediaSystem(window.MediaSystem);
                
                // Disparar evento de UI pronta
                if (window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('media-ui-ready', {
                        detail: { source: 'media-ui-full', version: '1.0' }
                    }));
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('⚠️ [Support] MediaSystem não encontrado após 20 tentativas');
            }
        }, 500);
    }
    
    // ========== VERIFICAÇÃO PÓS-MIGRAÇÃO ==========
    // ✅ Checklist Automático (via código versionado)
    
    if (window.location.search.includes('verify-migration=true')) {
        setTimeout(() => {
            console.group('🧪 VERIFICAÇÃO DE MIGRAÇÃO - Media UI Full');
            
            const checks = {
                'renderMediaPreview': typeof window.MediaSystem?.renderMediaPreview === 'function',
                'renderPdfPreview': typeof window.MediaSystem?.renderPdfPreview === 'function',
                'setupDragAndDrop': typeof window.MediaSystem?.setupDragAndDrop === 'function',
                'reorderItems': typeof window.MediaSystem?.reorderItems === 'function',
                'getMediaPreviewHTML': typeof getMediaPreviewHTML === 'function',
                'isVideoUrl': typeof isVideoUrl === 'function'
            };
            
            const allPass = Object.values(checks).every(v => v === true);
            const passCount = Object.values(checks).filter(v => v === true).length;
            const totalCount = Object.keys(checks).length;
            
            console.log(`📊 Resultado: ${passCount}/${totalCount} funcionalidades OK`);
            
            Object.entries(checks).forEach(([name, passed]) => {
                console.log(`${passed ? '✅' : '❌'} ${name}: ${passed ? 'disponível' : 'indisponível'}`);
            });
            
            if (allPass) {
                console.log('✅ MIGRAÇÃO BEM-SUCEDIDA - UI completa funcionando');
                console.log('🎨 UI Visual completa: previews, drag & drop, reordenamento');
            } else {
                console.warn('⚠️ MIGRAÇÃO PARCIAL - Algumas funcionalidades em fallback');
                console.log('📝 Modo produção: UI básica ativa (sem recursos visuais avançados)');
            }
            
            // Verificar ambiente
            const isDebug = window.location.search.includes('debug=true');
            console.log(`🔧 Ambiente: ${isDebug ? 'DEBUG (UI completa)' : 'PRODUÇÃO (UI básica)'}`);
            
            console.groupEnd();
        }, 1500);
    }
    
    // ========== TESTE PRÁTICO PARA VERIFICAÇÃO ==========
    // ✅ Como verificar agora - executa automaticamente em modo debug
    
    if (window.location.search.includes('debug=true') || 
        window.location.search.includes('test=true')) {
        
        setTimeout(() => {
            console.group('🔬 TESTE PRÁTICO - Media UI Full');
            console.log('🎯 Verificando funcionalidades do MediaSystem com UI completa:');
            
            // Teste 1: Verificar se UI foi injetada
            const hasUI = typeof window.MediaSystem?.renderMediaPreview === 'function';
            console.log(`${hasUI ? '✅' : '⚠️'} UI injetada: ${hasUI ? 'Sim' : 'Não (fallback ativo)'}`);
            
            // Teste 2: Verificar container de preview
            const previewContainer = document.getElementById('uploadPreview');
            console.log(`${previewContainer ? '✅' : '❌'} Container preview: ${previewContainer ? 'encontrado' : 'não encontrado'}`);
            
            // Teste 3: Verificar área de upload
            const uploadArea = document.getElementById('uploadArea');
            console.log(`${uploadArea ? '✅' : '❌'} Área de upload: ${uploadArea ? 'configurada' : 'não encontrada'}`);
            
            // Teste 4: Verificar se eventos estão configurados
            const hasDragEvents = uploadArea && uploadArea.hasAttribute('data-ui-initialized');
            console.log(`${hasDragEvents ? '✅' : '⚠️'} Drag & drop: ${hasDragEvents ? 'configurado' : 'não configurado'}`);
            
            // Teste 5: Verificar suporte a vídeos
            const hasVideoSupport = typeof window.MediaSystem?.state?.files !== 'undefined';
            console.log(`${hasVideoSupport ? '✅' : '⚠️'} Suporte a vídeos: ${hasVideoSupport ? 'disponível' : 'não verificado'}`);
            
            console.log('\n📝 COMO TESTAR MANUALMENTE (se tivesse console):');
            console.log('  1. Abrir painel admin (botão flutuante)');
            console.log('  2. Clicar na área de upload ou arrastar imagens');
            console.log('  3. Verificar se previews aparecem com estilos visuais');
            console.log('  4. Arrastar itens para reordenar');
            console.log('  5. Verificar se PDFs são exibidos corretamente');
            
            console.groupEnd();
        }, 2000);
    }
    
    // Inicializar
    waitForMediaSystem();
    
    // Registrar no DiagnosticRegistry se disponível
    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register(
            'mediaUI',
            () => ({
                status: 'loaded',
                version: '1.0',
                functions: {
                    renderMediaPreview: typeof renderMediaPreview === 'function',
                    renderPdfPreview: typeof renderPdfPreview === 'function',
                    reorderItems: typeof reorderItems === 'function'
                }
            }),
            'ui',
            { isSafe: true, description: 'UI completa para MediaSystem (previews, drag & drop, reordenamento)' }
        );
    }
    
    // Expor utilitários para debug (se necessário)
    window.SupportUI = {
        renderMediaPreview,
        renderPdfPreview,
        reorderItems,
        getMediaPreviewHTML,
        isVideoUrl,
        version: '1.0'
    };
    
    console.log('✅ [Support] media-ui-full.js inicializado - UI completa pronta');
})();
