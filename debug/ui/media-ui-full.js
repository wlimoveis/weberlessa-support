// debug/ui/media-ui-full.js - UI Completa do Media System para modo debug
// VERSÃO: 1.2.0 - Suporte completo a vídeos + diagnóstico automático
console.log('🎨 [SUPPORT] media-ui-full.js v1.2.0 carregado.');

(function() {
    'use strict';

    // ==============================================================
    // FUNÇÕES DE DIAGNÓSTICO AUTOMÁTICO
    // ==============================================================
    
    function autoDiagnose() {
        console.log('═══════════════════════════════════════════════════');
        console.log('🔍 [DIAGNÓSTICO AUTOMÁTICO] SupportMediaUI v1.2.0');
        console.log('═══════════════════════════════════════════════════');
        
        // Aguardar MediaSystem estar disponível
        setTimeout(() => {
            if (!window.MediaSystem) {
                console.warn('⚠️ MediaSystem não disponível ainda, agendando novo diagnóstico...');
                setTimeout(() => autoDiagnose(), 500);
                return;
            }
            
            const state = window.MediaSystem.state;
            
            console.log('📊 ESTADO ATUAL:');
            console.log('  ├─ existing:', state.existing?.length || 0, 'arquivos');
            console.log('  ├─ files:', state.files?.length || 0, 'arquivos');
            console.log('  ├─ existingPdfs:', state.existingPdfs?.length || 0, 'PDFs');
            console.log('  └─ pdfs:', state.pdfs?.length || 0, 'PDFs');
            
            // Verificar URLs carregadas
            if (state.existing && state.existing.length > 0) {
                console.log('📸 URLs de imagens/vídeos:');
                state.existing.forEach((item, idx) => {
                    const shortUrl = item.url?.substring(0, 80) || 'sem URL';
                    console.log(`  ${idx+1}. ${shortUrl}... (vídeo: ${item.isVideo || false})`);
                });
            } else {
                console.log('📸 Nenhuma imagem/vídeo carregado');
            }
            
            if (state.existingPdfs && state.existingPdfs.length > 0) {
                console.log('📄 URLs de PDFs:');
                state.existingPdfs.forEach((pdf, idx) => {
                    const shortUrl = pdf.url?.substring(0, 80) || 'sem URL';
                    console.log(`  ${idx+1}. ${shortUrl}...`);
                });
            } else {
                console.log('📄 Nenhum PDF carregado');
            }
            
            // Verificar container
            const container = document.getElementById('uploadPreview');
            console.log('📦 Container #uploadPreview:', container ? '✅ existe' : '❌ NÃO EXISTE');
            
            if (container) {
                const totalFiles = (state.existing?.length || 0) + (state.files?.length || 0);
                console.log('🎨 Total a renderizar:', totalFiles);
            }
            
            console.log('═══════════════════════════════════════════════════');
            
            // Forçar renderização se houver dados
            if (window.SupportMediaUI?.renderMediaPreview && 
                ((state.existing?.length || 0) + (state.files?.length || 0) > 0)) {
                console.log('🔄 Forçando renderização automática...');
                window.SupportMediaUI.renderMediaPreview.call(window.MediaSystem);
            }
        }, 100);
    }
    
    // Monitorar atualizações do MediaSystem (via MutationObserver ou polling)
    let lastStateHash = '';
    
    function monitorStateChanges() {
        if (!window.MediaSystem) return;
        
        const currentState = window.MediaSystem.state;
        const stateHash = JSON.stringify({
            existingLen: currentState.existing?.length || 0,
            filesLen: currentState.files?.length || 0,
            existingPdfsLen: currentState.existingPdfs?.length || 0,
            pdfsLen: currentState.pdfs?.length || 0
        });
        
        if (stateHash !== lastStateHash) {
            lastStateHash = stateHash;
            console.log('🔄 [MONITOR] Estado do MediaSystem alterado, diagnosticando...');
            
            const total = (currentState.existing?.length || 0) + (currentState.files?.length || 0);
            console.log(`📊 Novo estado: ${total} arquivo(s) no total`);
            
            // Se há dados mas a UI pode não ter renderizado, forçar
            if (total > 0 && window.SupportMediaUI?.renderMediaPreview) {
                setTimeout(() => {
                    window.SupportMediaUI.renderMediaPreview.call(window.MediaSystem);
                }, 50);
            }
        }
    }
    
    // Iniciar monitoramento periódico
    function startMonitoring() {
        setInterval(monitorStateChanges, 500);
        console.log('👀 Monitoramento de estado iniciado (check a cada 500ms)');
    }

    // ==============================================================
    // FUNÇÕES DE UI (VERSÃO COMPLETA COM SUPORTE A VÍDEOS)
    // ==============================================================

    function isVideoUrl(url) {
        if (!url) return false;
        const urlLower = url.toLowerCase();
        return urlLower.includes('.mp4') || 
               urlLower.includes('.mov') || 
               urlLower.includes('.webm') || 
               urlLower.includes('.avi') ||
               urlLower.includes('video/');
    }

    function getMediaPreviewHTML(item) {
        const displayName = item.name || 'Arquivo';
        const shortName = displayName.length > 20 ? displayName.substring(0, 17) + '...' : displayName;
        
        // Verificar se é VÍDEO (prioridade máxima)
        const isVideoFile = item.isVideo === true || 
                            (item.type && item.type.startsWith('video/')) || 
                            (item.name && item.name.toLowerCase().match(/\.(mp4|mov|webm|avi)$/)) ||
                            (item.url && isVideoUrl(item.url));
        
        const videoUrl = item.uploadedUrl || item.url || item.preview;
        
        // Se for vídeo e tiver URL válida, renderizar player de vídeo
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
        
        // Se for arquivo NOVO não enviado (tem BLOB URL)
        if (item.isNew && !item.uploaded && item.preview && item.preview.startsWith('blob:')) {
            return `
                <div style="width:100%;height:70px;position:relative;background:#2c3e50;">
                    <img src="${item.preview}" 
                         alt="${displayName}"
                         style="width:100%;height:100%;object-fit:cover;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:none;flex-direction:column;align-items:center;justify-content:center;color:#ecf0f1;">
                        <i class="fas fa-image" style="font-size:1.5rem;margin-bottom:5px;"></i>
                        <div style="font-size:0.65rem;text-align:center;">${shortName}</div>
                    </div>
                </div>
            `;
        }
        
        // Se for arquivo com URL permanente
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
                        <div style="font-size:0.65rem;text-align:center;">${shortName}</div>
                    </div>
                </div>
            `;
        }
        
        // Fallback
        return `
            <div style="width:100%;height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#2c3e50;color:#ecf0f1;">
                <i class="fas fa-image" style="font-size:1.5rem;margin-bottom:5px;"></i>
                <div style="font-size:0.65rem;text-align:center;">${shortName}</div>
            </div>
        `;
    }

    function renderMediaPreview() {
        const container = document.getElementById('uploadPreview');
        if (!container) {
            console.warn('⚠️ Container #uploadPreview não encontrado');
            return;
        }
        
        // Obter o MediaSystem corretamente
        const mediaSystem = this && (this.state !== undefined) ? this : window.MediaSystem;
        
        if (!mediaSystem || !mediaSystem.state) {
            console.warn('⚠️ MediaSystem não disponível para renderização');
            return;
        }
        
        // Combinar todos os arquivos
        const allFiles = [
            ...(mediaSystem.state.existing?.filter(item => !item.markedForDeletion) || []),
            ...(mediaSystem.state.files || [])
        ];
        
        console.log(`🎨 Renderizando ${allFiles.length} arquivo(s) visualmente`);
        
        // DIAGNÓSTICO DETALHADO
        if (allFiles.length === 0) {
            console.log('ℹ️ Nenhum arquivo para renderizar - exibindo estado vazio');
            // Verificar se há dados no MediaSystem mas não foram filtrados
            const existingCount = mediaSystem.state.existing?.length || 0;
            const filesCount = mediaSystem.state.files?.length || 0;
            if (existingCount > 0 || filesCount > 0) {
                console.warn(`⚠️ INCONSISTÊNCIA: MediaSystem tem ${existingCount + filesCount} arquivo(s), mas todos estão marcados para exclusão?`);
                console.log('  existing (marcados):', mediaSystem.state.existing?.filter(i => i.markedForDeletion).length);
                console.log('  existing (não marcados):', mediaSystem.state.existing?.filter(i => !i.markedForDeletion).length);
            }
            
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
            const isUploaded = item.uploaded;
            
            // Determinar se é vídeo para aplicar estilo diferente
            const isVideo = item.isVideo === true || 
                            (item.type && item.type.startsWith('video/')) || 
                            (item.name && isVideoUrl(item.name)) ||
                            (item.url && isVideoUrl(item.url));
            
            // Cores: Roxo para vídeos, Azul para imagens
            let borderColor = isVideo ? '#9b59b6' : '#3498db';
            let bgColor = isVideo ? '#f4ecf7' : '#e8f4fc';
            let statusText = isNew ? 'Novo' : (isExisting ? 'Existente' : (isUploaded ? 'Salvo' : ''));
            let statusIcon = isVideo ? '<i class="fas fa-video"></i> ' : '<i class="fas fa-image"></i> ';
            
            if (isMarked) {
                borderColor = '#e74c3c';
                bgColor = '#ffebee';
                statusText = 'Excluir';
            }
            
            const displayName = item.name || 'Arquivo';
            const shortName = displayName.length > 15 ? displayName.substring(0, 12) + '...' : displayName;
            
            html += `
            <div class="media-preview-item draggable-item" 
                 draggable="true"
                 data-id="${item.id}"
                 title="${displayName}"
                 style="position:relative;width:110px;height:110px;border-radius:8px;overflow:hidden;border:2px solid ${borderColor};background:${bgColor};cursor:grab;">
                
                <div style="width:100%;height:70px;overflow:hidden;">
                    ${getMediaPreviewHTML.call(this, item)}
                </div>
                
                <div style="padding:5px;font-size:0.7rem;text-align:center;height:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                    <span style="display:block;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${statusIcon}${shortName}
                    </span>
                </div>
                
                <div style="position:absolute;top:0;left:0;background:rgba(0,0,0,0.7);color:white;width:22px;height:22px;border-radius:0 0 8px 0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;z-index:10;">
                    <i class="fas fa-arrows-alt"></i>
                </div>
                
                <div style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.8);color:white;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;z-index:5;">
                    ${index + 1}
                </div>
                
                <button onclick="window.MediaSystem.removeFile('${item.id}')" 
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
        setTimeout(() => setupContainerDragEvents('uploadPreview'), 100);
        
        console.log(`✅ Renderização concluída: ${allFiles.length} arquivo(s) visualizados`);
    }

    function renderPdfPreview() {
        const container = document.getElementById('pdfUploadPreview');
        if (!container) return;
        
        const mediaSystem = this && (this.state !== undefined) ? this : window.MediaSystem;
        if (!mediaSystem || !mediaSystem.state) return;
        
        const allPdfs = [
            ...(mediaSystem.state.existingPdfs?.filter(item => !item.markedForDeletion) || []),
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
            const isNew = pdf.isNew;
            const isUploaded = pdf.uploaded;
            
            let borderColor = '#3498db';
            let bgColor = '#e8f4fc';
            let statusText = 'Novo';
            
            if (isMarked) {
                borderColor = '#e74c3c';
                bgColor = '#ffebee';
                statusText = 'Excluir';
            } else if (isExisting) {
                borderColor = '#27ae60';
                bgColor = '#e8f8ef';
                statusText = 'Existente';
            } else if (isUploaded) {
                borderColor = '#9b59b6';
                bgColor = '#f4ecf7';
                statusText = 'Salvo';
            }
            
            const shortName = pdf.name.length > 15 ? pdf.name.substring(0, 12) + '...' : pdf.name;
            
            html += `
                <div class="pdf-preview-container draggable-item"
                     draggable="true"
                     data-id="${pdf.id}"
                     style="position:relative;cursor:grab;">
                    <div style="background:${bgColor};border:1px solid ${borderColor};border-radius:6px;padding:0.5rem;width:90px;height:90px;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;overflow:hidden;position:relative;">
                        <div style="position:absolute;top:0;left:0;background:rgba(0,0,0,0.6);color:white;width:20px;height:20px;border-radius:0 0 6px 0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;z-index:5;">
                            <i class="fas fa-arrows-alt"></i>
                        </div>
                        
                        <div style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.8);color:white;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;z-index:5;">
                            ${index + 1}
                        </div>
                        
                        <i class="fas fa-file-pdf" style="font-size:1.2rem;color:${borderColor};margin-bottom:0.3rem;"></i>
                        <p style="font-size:0.7rem;margin:0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${shortName}</p>
                        <small style="color:#7f8c8d;font-size:0.6rem;">${statusText}</small>
                    </div>
                    <button onclick="window.MediaSystem.removeFile('${pdf.id}')" 
                            style="position:absolute;top:0;right:0;background:${borderColor};color:white;border:none;width:22px;height:22px;font-size:14px;font-weight:bold;cursor:pointer;border-radius:0 0 0 6px;">
                        ×
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        setTimeout(() => setupContainerDragEvents('pdfUploadPreview'), 100);
    }

    function setupContainerDragEvents(containerId) {
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
            if (window.MediaSystem && window.MediaSystem.reorderItems) {
                window.MediaSystem.reorderItems(draggedId, targetId);
            }
            document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        });
        
        container.addEventListener('dragend', () => {
            document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        });
    }

    function setupDragAndDrop() {
        setTimeout(() => {
            setupContainerDragEvents('uploadPreview');
            setupContainerDragEvents('pdfUploadPreview');
        }, 500);
    }

    function reorderItems(draggedId, targetId) {
        let sourceArray = null;
        let arrayName = '';
        
        const allArrays = [
            { name: 'files', array: this.state.files },
            { name: 'existing', array: this.state.existing },
            { name: 'pdfs', array: this.state.pdfs },
            { name: 'existingPdfs', array: this.state.existingPdfs }
        ];
        
        for (const arr of allArrays) {
            const draggedIndex = arr.array?.findIndex(item => item.id === draggedId);
            if (draggedIndex !== -1) {
                sourceArray = arr.array;
                arrayName = arr.name;
                break;
            }
        }
        
        if (!sourceArray) return;
        
        const draggedIndex = sourceArray.findIndex(item => item.id === draggedId);
        const targetIndex = sourceArray.findIndex(item => item.id === targetId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const newArray = [...sourceArray];
            const [draggedItem] = newArray.splice(draggedIndex, 1);
            newArray.splice(targetIndex, 0, draggedItem);
            
            if (arrayName === 'files') this.state.files = newArray;
            else if (arrayName === 'existing') this.state.existing = newArray;
            else if (arrayName === 'pdfs') this.state.pdfs = newArray;
            else if (arrayName === 'existingPdfs') this.state.existingPdfs = newArray;
        }
        
        this.updateUI();
    }

    function updateUI() {
        if (this._updateTimeout) clearTimeout(this._updateTimeout);
        this._updateTimeout = setTimeout(() => {
            renderMediaPreview.call(this);
            renderPdfPreview.call(this);
        }, 50);
    }

    // ==============================================================
    // EXPORTAÇÃO
    // ==============================================================
    window.SupportMediaUI = {
        getMediaPreviewHTML,
        renderMediaPreview,
        renderPdfPreview,
        setupDragAndDrop,
        setupContainerDragEvents,
        reorderItems,
        updateUI,
        isVideoUrl,
        autoDiagnose,
        version: '1.2.0'
    };

    // ==============================================================
    // INICIALIZAÇÃO AUTOMÁTICA COM DIAGNÓSTICO
    // ==============================================================
    
    // Executar diagnóstico automático ao carregar
    setTimeout(() => {
        autoDiagnose();
        startMonitoring();
        console.log('✅ SupportMediaUI v1.2.0 carregado - Diagnóstico automático ativo');
    }, 500);

    // Verificar periodicamente se o MediaSystem foi carregado
    let checkCount = 0;
    const mediaSystemCheck = setInterval(() => {
        if (window.MediaSystem) {
            console.log('✅ MediaSystem detectado pelo SupportMediaUI');
            clearInterval(mediaSystemCheck);
            // Diagnosticar novamente agora que o MediaSystem está disponível
            setTimeout(() => autoDiagnose(), 200);
        }
        checkCount++;
        if (checkCount > 20) { // 10 segundos
            clearInterval(mediaSystemCheck);
            if (!window.MediaSystem) {
                console.warn('⚠️ MediaSystem não detectado após 10 segundos');
            }
        }
    }, 500);

    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register('mediaUI', () => ({ status: 'loaded', version: '1.2.0' }), 'ui', { isSafe: true });
    }

    console.log('✅ SupportMediaUI v1.2.0 pronto - UI completa com diagnóstico automático');
})();
