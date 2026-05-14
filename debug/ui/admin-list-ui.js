// debug/ui/admin-list-ui.js - UI COMPLETA DA LISTA ADMINISTRATIVA
// Módulo de UI para o painel administrativo (loadPropertyList e paginação)
console.log('📋 admin-list-ui.js carregado - UI completa para lista de propriedades');

(function() {
    'use strict';

    // ========== VARIÁVEIS DE PAGINAÇÃO ==========
    if (typeof window.adminCurrentPage === 'undefined') {
        window.adminCurrentPage = 1;
    }
    if (typeof window.adminItemsPerPage === 'undefined') {
        const isMobile = window.innerWidth <= 768;
        window.adminItemsPerPage = isMobile ? 3 : 4;
    }

    // ========== FUNÇÃO AUXILIAR: createPaginationControls ==========
    function createPaginationControls(totalPages, currentPage, itemsPerPage = null) {
        const paginationDiv = document.createElement('div');
        paginationDiv.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin: 1rem 0 0.5rem 0; flex-wrap: wrap; padding: 0.5rem 0.2rem; position: relative; z-index: 10;';
        
        const isMobile = window.innerWidth <= 768;
        const currentItemsPerPage = itemsPerPage || (isMobile ? 3 : window.adminItemsPerPage || 4);
        
        // Botão Primeira Página
        const firstBtn = document.createElement('button');
        firstBtn.innerHTML = '<i class="fas fa-angle-double-left"></i>';
        firstBtn.style.cssText = 'background: var(--primary); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;';
        firstBtn.disabled = currentPage === 1;
        if (currentPage === 1) firstBtn.style.opacity = '0.5';
        firstBtn.onclick = () => window.loadPropertyList(1);
        paginationDiv.appendChild(firstBtn);
        
        // Botão Anterior
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.style.cssText = 'background: var(--primary); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;';
        prevBtn.disabled = currentPage === 1;
        if (currentPage === 1) prevBtn.style.opacity = '0.5';
        prevBtn.onclick = () => window.loadPropertyList(currentPage - 1);
        paginationDiv.appendChild(prevBtn);
        
        // Números das Páginas (com elipse para muitas páginas)
        const maxVisiblePages = isMobile ? 3 : 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            const firstPageSpan = document.createElement('span');
            firstPageSpan.textContent = '1';
            firstPageSpan.style.cssText = 'background: #e9ecef; color: var(--text); padding: 0.3rem 0.7rem; border-radius: 5px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; min-width: 32px; text-align: center;';
            firstPageSpan.onclick = () => window.loadPropertyList(1);
            paginationDiv.appendChild(firstPageSpan);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 0.3rem 0.2rem; color: #666; font-size: 0.8rem;';
                paginationDiv.appendChild(ellipsis);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.style.cssText = `background: ${i === currentPage ? 'var(--gold)' : '#e9ecef'}; color: ${i === currentPage ? 'white' : 'var(--text)'}; border: none; padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease; font-weight: ${i === currentPage ? 'bold' : 'normal'}; min-width: 32px;`;
            pageBtn.onclick = () => window.loadPropertyList(i);
            paginationDiv.appendChild(pageBtn);
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 0.3rem 0.2rem; color: #666; font-size: 0.8rem;';
                paginationDiv.appendChild(ellipsis);
            }
            
            const lastPageSpan = document.createElement('span');
            lastPageSpan.textContent = totalPages;
            lastPageSpan.style.cssText = 'background: #e9ecef; color: var(--text); padding: 0.3rem 0.7rem; border-radius: 5px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; min-width: 32px; text-align: center;';
            lastPageSpan.onclick = () => window.loadPropertyList(totalPages);
            paginationDiv.appendChild(lastPageSpan);
        }
        
        // Botão Próximo
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.style.cssText = 'background: var(--primary); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;';
        nextBtn.disabled = currentPage === totalPages;
        if (currentPage === totalPages) nextBtn.style.opacity = '0.5';
        nextBtn.onclick = () => window.loadPropertyList(currentPage + 1);
        paginationDiv.appendChild(nextBtn);
        
        // Botão Última Página
        const lastBtn = document.createElement('button');
        lastBtn.innerHTML = '<i class="fas fa-angle-double-right"></i>';
        lastBtn.style.cssText = 'background: var(--primary); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;';
        lastBtn.disabled = currentPage === totalPages;
        if (currentPage === totalPages) lastBtn.style.opacity = '0.5';
        lastBtn.onclick = () => window.loadPropertyList(totalPages);
        paginationDiv.appendChild(lastBtn);
        
        // Selector de itens por página
        const perPageSelect = document.createElement('select');
        perPageSelect.style.cssText = 'background: white; border: 1px solid var(--primary); padding: 0.3rem 0.5rem; border-radius: 5px; font-size: 0.75rem; margin-left: 0.5rem; cursor: pointer;';
        perPageSelect.innerHTML = `
            <option value="3" ${currentItemsPerPage === 3 ? 'selected' : ''}>3 por página</option>
            <option value="4" ${currentItemsPerPage === 4 ? 'selected' : ''}>4 por página</option>
            <option value="8" ${currentItemsPerPage === 8 ? 'selected' : ''}>8 por página</option>
            <option value="12" ${currentItemsPerPage === 12 ? 'selected' : ''}>12 por página</option>
        `;
        perPageSelect.onchange = (e) => {
            window.adminItemsPerPage = parseInt(e.target.value);
            window.adminCurrentPage = 1;
            window.loadPropertyList(1);
        };
        paginationDiv.appendChild(perPageSelect);
        
        return paginationDiv;
    }

    // ========== FUNÇÃO PRINCIPAL: loadPropertyList ==========
    window.loadPropertyList = function(page = window.adminCurrentPage) {
        if (!window.properties || typeof window.properties.forEach !== 'function') {
            console.error('❌ window.properties não é um array válido');
            return;
        }
        
        const container = document.getElementById('propertyList');
        const countElement = document.getElementById('propertyCount');
        
        if (!container) return;
        
        const isMobile = window.innerWidth <= 768;
        const itemsPerPage = isMobile ? 3 : window.adminItemsPerPage;
        
        window.adminCurrentPage = page;
        
        const totalItems = window.properties.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const paginatedProperties = window.properties.slice(startIndex, endIndex);
        
        container.innerHTML = '';
        
        if (countElement) {
            countElement.textContent = totalItems;
        }
        
        if (totalItems === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Nenhum imóvel cadastrado</p>';
            return;
        }
        
        container.style.maxHeight = '650px';
        container.style.overflowY = 'auto';
        container.style.paddingRight = '5px';
        container.style.paddingBottom = '20px';
        
        const totalViews = window.getTotalGalleryViews ? window.getTotalGalleryViews() : 0;
        
        // Cabeçalho com estatísticas
        const statsHeader = document.createElement('div');
        statsHeader.style.cssText = 'background: #e8f4fd; padding: 0.5rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem;';
        
        const statsContainer = document.createElement('div');
        statsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 0.5rem;';
        
        const viewsSpan = document.createElement('span');
        viewsSpan.style.cssText = 'display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.7rem;';
        viewsSpan.innerHTML = `<i class="fas fa-eye"></i> <strong>Total Visualizações:</strong> ${totalViews}`;
        statsContainer.appendChild(viewsSpan);
        
        const itemsSpan = document.createElement('span');
        itemsSpan.style.cssText = 'display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.7rem;';
        itemsSpan.innerHTML = `<i class="fas fa-building"></i> <strong>Total imóveis:</strong> ${totalItems}`;
        statsContainer.appendChild(itemsSpan);
        
        const showingSpan = document.createElement('span');
        showingSpan.style.cssText = 'display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.7rem;';
        showingSpan.innerHTML = `<i class="fas fa-list"></i> <strong>Exibindo:</strong> ${startIndex + 1}-${endIndex} de ${totalItems}`;
        statsContainer.appendChild(showingSpan);
        
        statsHeader.appendChild(statsContainer);
        container.appendChild(statsHeader);
        
        // Lista de imóveis
        const listContainer = document.createElement('div');
        listContainer.id = 'propertyListItems';
        listContainer.style.cssText = 'margin: 0.5rem 0;';
        
        const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80';
        
        paginatedProperties.forEach(property => {
            const viewCount = window.getGalleryViews ? window.getGalleryViews(property.id) : 0;
            const lastView = window.getLastGalleryView ? window.getLastGalleryView(property.id) : null;
            
            let firstImage = defaultImage;
            let isVideo = false;
            
            if (property.images && property.images !== 'EMPTY') {
                const imageUrls = property.images.split(',').filter(url => url && url.trim() !== '');
                if (imageUrls.length > 0) {
                    firstImage = imageUrls[0];
                    isVideo = window.SharedCore ? window.SharedCore.isVideoUrl(firstImage) : false;
                }
            }
            
            const item = document.createElement('div');
            item.className = 'property-item';
            item.style.cssText = 'background: #f5f5f5; padding: 0.8rem; margin: 0.5rem 0; border-radius: 5px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-left: 4px solid var(--primary); transition: all 0.3s ease;';
            
            const escapeTitle = window.SharedCore ? window.SharedCore.escapeHtml(property.title) : (property.title || '').replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
            
            item.innerHTML = `
                <div style="flex-shrink: 0; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; background: #2c3e50; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" 
                     onclick="if(window.openGalleryAtCurrentIndex) window.openGalleryAtCurrentIndex(${property.id})"
                     title="Clique para abrir galeria">
                    ${isVideo ? `
                        <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #1a5276, #2c3e50); display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-video" style="font-size: 1.5rem; color: rgba(255,255,255,0.8);"></i>
                        </div>
                    ` : `
                        <img src="${firstImage}" 
                             loading="lazy"
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="this.src='${defaultImage}'; this.onerror=null;"
                             alt="${escapeTitle}">
                    `}
                </div>
                <div style="flex: 3; min-width: 180px;">
                    <strong style="color: var(--primary); font-size: 0.9rem; display: block; margin-bottom: 0.3rem;">
                        ${escapeTitle}
                    </strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.3rem;">
                        <small style="background: #e9ecef; padding: 0.2rem 0.5rem; border-radius: 4px;">
                            <i class="fas fa-tag"></i> ${property.price}
                        </small>
                        <small style="background: #e9ecef; padding: 0.2rem 0.5rem; border-radius: 4px;">
                            <i class="fas fa-map-marker-alt"></i> ${property.location.substring(0, 40)}${property.location.length > 40 ? '...' : ''}
                        </small>
                    </div>
                    <div style="font-size: 0.65rem; color: #666; display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.2rem;">
                        <span><i class="fas fa-id-card"></i> ID: ${property.id}</span>
                        ${property.has_video ? '<span style="color: #9b59b6;"><i class="fas fa-video"></i> Tem vídeo</span>' : ''}
                        <span><i class="fas fa-images"></i> Imagens: ${property.images ? property.images.split(',').filter(i => i && i.trim() && i !== 'EMPTY').length : 0}</span>
                        ${property.pdfs && property.pdfs !== 'EMPTY' ? `<span><i class="fas fa-file-pdf"></i> PDFs: ${property.pdfs.split(',').filter(p => p && p.trim() && p !== 'EMPTY').length}</span>` : ''}
                        <span><i class="fas fa-eye"></i> <strong>Visualizações: ${viewCount}</strong></span>
                        ${lastView ? `<span><i class="fas fa-clock"></i> Última: ${new Date(lastView).toLocaleDateString('pt-BR')}</span>` : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; flex-shrink: 0;">
                    <button onclick="editProperty(${property.id})" 
                            style="background: var(--accent); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.75rem;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button onclick="if(window.resetGalleryViews) window.resetGalleryViews(${property.id}, '${escapeTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')" 
                            style="background: #e67e22; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.75rem;">
                        <i class="fas fa-eye-slash"></i> Zerar views
                    </button>
                    <button onclick="deleteProperty(${property.id})" 
                            style="background: #e74c3c; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.75rem;">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            listContainer.appendChild(item);
        });
        
        container.appendChild(listContainer);
        
        // Paginação (rodapé)
        if (totalPages > 1) {
            const paginationWrapper = document.createElement('div');
            paginationWrapper.style.cssText = 'margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid #e0e0e0;';
            const paginationBottom = createPaginationControls(totalPages, page, itemsPerPage);
            paginationWrapper.appendChild(paginationBottom);
            container.appendChild(paginationWrapper);
        }
        
        console.log(`✅ [Support] Página ${page}/${totalPages} - ${paginatedProperties.length} imóveis exibidos (${itemsPerPage} por página, total: ${totalItems})`);
    };

    // ========== REGISTRO NO DIAGNOSTIC REGISTRY ==========
    setTimeout(() => {
        if (window.DiagnosticRegistry && typeof window.loadPropertyList === 'function') {
            window.DiagnosticRegistry.register('loadPropertyList', window.loadPropertyList, 'ui', {
                description: 'Renderiza lista de imóveis no painel admin com paginação e analytics'
            });
            console.log('✅ [Support] admin-list-ui: Funções registradas no DiagnosticRegistry');
        }
    }, 1000);

    console.log('✅ [Support] admin-list-ui: Funções loadPropertyList e createPaginationControls injetadas');
})();
