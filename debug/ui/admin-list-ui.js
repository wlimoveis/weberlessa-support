// debug/ui/admin-list-ui.js - UI COMPLETA DA LISTA ADMINISTRATIVA
console.log('📋 admin-list-ui.js carregado - UI completa para lista de propriedades');

// ========== IMPLEMENTAÇÃO COMPLETA DO window.loadPropertyList ==========
window.loadPropertyList = function(page = window.adminCurrentPage) {
    if (!window.properties || typeof window.properties.forEach !== 'function') {
        console.error('❌ window.properties não é um array válido');
        return;
    }
    
    const container = document.getElementById('propertyList');
    const countElement = document.getElementById('propertyCount');
    
    if (!container) return;
    
    // Salvar página atual
    window.adminCurrentPage = page;
    
    // Calcular paginação
    const totalItems = window.properties.length;
    const totalPages = Math.ceil(totalItems / window.adminItemsPerPage);
    const startIndex = (page - 1) * window.adminItemsPerPage;
    const endIndex = Math.min(startIndex + window.adminItemsPerPage, totalItems);
    const paginatedProperties = window.properties.slice(startIndex, endIndex);
    
    // Limpar container mas manter estrutura para paginação
    container.innerHTML = '';
    
    if (countElement) {
        countElement.textContent = totalItems;
    }
    
    if (totalItems === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Nenhum imóvel cadastrado</p>';
        return;
    }
    
    // Adicionar estilo para scroll suave na lista
    container.style.maxHeight = '600px';
    container.style.overflowY = 'auto';
    container.style.paddingRight = '5px';
    
    // Calcular total de visualizações
    const totalViews = window.getTotalGalleryViews ? window.getTotalGalleryViews() : 0;
    
    // ========== CABEÇALHO COM ESTATÍSTICAS ==========
    const statsHeader = document.createElement('div');
    statsHeader.style.cssText = 'background: #e8f4fd; padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;';
    statsHeader.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
            <span><i class="fas fa-eye"></i> <strong>Total de visualizações:</strong> ${totalViews}</span>
            <span><i class="fas fa-building"></i> <strong>Total de imóveis:</strong> ${totalItems}</span>
            <span><i class="fas fa-images"></i> <strong>Exibindo:</strong> ${startIndex + 1}-${endIndex} de ${totalItems}</span>
        </div>
        <button onclick="if(window.resetAllGalleryViews) window.resetAllGalleryViews()" style="background: #e67e22; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.75rem;">
            <i class="fas fa-trash-alt"></i> Zerar TODAS
        </button>
    `;
    container.appendChild(statsHeader);
    
    // ========== CONTROLES DE PAGINAÇÃO (TOPO) ==========
    if (totalPages > 1) {
        const paginationTop = createPaginationControls(totalPages, page);
        container.appendChild(paginationTop);
    }
    
    // ========== LISTA DE IMÓVEIS (APENAS PÁGINA ATUAL) ==========
    const listContainer = document.createElement('div');
    listContainer.id = 'propertyListItems';
    listContainer.style.cssText = 'margin: 1rem 0;';
    
    const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80';
    
    paginatedProperties.forEach(property => {
        const viewCount = window.getGalleryViews ? window.getGalleryViews(property.id) : 0;
        const lastView = window.getLastGalleryView ? window.getLastGalleryView(property.id) : null;
        
        // Extrair a primeira imagem do imóvel
        let firstImage = defaultImage;
        let isVideo = false;
        
        if (property.images && property.images !== 'EMPTY') {
            const imageUrls = property.images.split(',').filter(url => url && url.trim() !== '');
            if (imageUrls.length > 0) {
                firstImage = imageUrls[0];
                // Verificar se é vídeo
                isVideo = window.isVideoUrl ? window.isVideoUrl(firstImage) : 
                          (firstImage.toLowerCase().includes('.mp4') || firstImage.toLowerCase().includes('.mov') || firstImage.toLowerCase().includes('video/'));
            }
        }
        
        const item = document.createElement('div');
        item.className = 'property-item';
        item.style.cssText = 'background: #f5f5f5; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-left: 4px solid var(--primary); transition: all 0.3s ease;';
        
        item.innerHTML = `
            <!-- MINIATURA DA IMAGEM -->
            <div style="flex-shrink: 0; width: 70px; height: 70px; border-radius: 8px; overflow: hidden; background: #2c3e50; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s ease;" 
                 onclick="if(window.openGalleryAtCurrentIndex) window.openGalleryAtCurrentIndex(${property.id})"
                 onmouseenter="this.style.transform='scale(1.05)'"
                 onmouseleave="this.style.transform='scale(1)'"
                 title="Clique para abrir galeria">
                ${isVideo ? `
                    <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #1a5276, #2c3e50); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-video" style="font-size: 1.8rem; color: rgba(255,255,255,0.8);"></i>
                        <div style="position: absolute; bottom: 2px; right: 4px; background: rgba(0,0,0,0.6); border-radius: 3px; padding: 1px 4px; font-size: 0.6rem; color: white;">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                ` : `
                    <img src="${firstImage}" 
                         loading="lazy"
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.src='${defaultImage}'; this.onerror=null;"
                         alt="${window.SharedCore?.escapeHtml(property.title) || property.title}">
                `}
            </div>
            
            <!-- INFORMAÇÕES DO IMÓVEL -->
            <div style="flex: 3; min-width: 200px;">
                <strong style="color: var(--primary); font-size: 1rem; display: block; margin-bottom: 0.3rem;">
                    ${window.SharedCore?.escapeHtml(property.title) || property.title}
                </strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.3rem;">
                    <small style="background: #e9ecef; padding: 0.2rem 0.5rem; border-radius: 4px;">
                        <i class="fas fa-tag"></i> ${property.price}
                    </small>
                    <small style="background: #e9ecef; padding: 0.2rem 0.5rem; border-radius: 4px;">
                        <i class="fas fa-map-marker-alt"></i> ${property.location.substring(0, 40)}${property.location.length > 40 ? '...' : ''}
                    </small>
                </div>
                <div style="font-size: 0.7rem; color: #666; display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 0.2rem;">
                    <span><i class="fas fa-id-card"></i> ID: ${property.id}</span>
                    ${property.has_video ? '<span style="color: #9b59b6;"><i class="fas fa-video"></i> Tem vídeo</span>' : ''}
                    <span><i class="fas fa-images"></i> Imagens: ${property.images ? property.images.split(',').filter(i => i && i.trim() && i !== 'EMPTY').length : 0}</span>
                    ${property.pdfs && property.pdfs !== 'EMPTY' ? `<span><i class="fas fa-file-pdf"></i> PDFs: ${property.pdfs.split(',').filter(p => p && p.trim() && p !== 'EMPTY').length}</span>` : ''}
                    <span><i class="fas fa-eye"></i> <strong>Visualizações: ${viewCount}</strong></span>
                    ${lastView ? `<span><i class="fas fa-clock"></i> Última: ${new Date(lastView).toLocaleDateString('pt-BR')}</span>` : ''}
                </div>
            </div>
            
            <!-- BOTÕES DE AÇÃO -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; flex-shrink: 0;">
                <button onclick="editProperty(${property.id})" 
                        style="background: var(--accent); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;"
                        onmouseenter="this.style.transform='translateY(-2px)'"
                        onmouseleave="this.style.transform='translateY(0)'">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="if(window.resetGalleryViews) window.resetGalleryViews(${property.id}, '${property.title.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')" 
                        style="background: #e67e22; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;"
                        onmouseenter="this.style.transform='translateY(-2px)'"
                        onmouseleave="this.style.transform='translateY(0)'">
                    <i class="fas fa-eye-slash"></i> Zerar views
                </button>
                <button onclick="deleteProperty(${property.id})" 
                        style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;"
                        onmouseenter="this.style.transform='translateY(-2px)'"
                        onmouseleave="this.style.transform='translateY(0)'">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        listContainer.appendChild(item);
    });
    
    container.appendChild(listContainer);
    
    // ========== CONTROLES DE PAGINAÇÃO (RODAPÉ) ==========
    if (totalPages > 1) {
        const paginationBottom = createPaginationControls(totalPages, page);
        container.appendChild(paginationBottom);
    }
    
    console.log(`✅ [Support] Página ${page}/${totalPages} - ${paginatedProperties.length} imóveis exibidos (total: ${totalItems})`);
};

// ========== IMPLEMENTAÇÃO COMPLETA DO createPaginationControls ==========
function createPaginationControls(totalPages, currentPage) {
    const paginationDiv = document.createElement('div');
    paginationDiv.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin: 1rem 0; flex-wrap: wrap;';
    
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
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        const firstPageSpan = document.createElement('span');
        firstPageSpan.textContent = '1';
        firstPageSpan.style.cssText = 'background: #e9ecef; color: var(--text); padding: 0.3rem 0.7rem; border-radius: 5px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;';
        firstPageSpan.onclick = () => window.loadPropertyList(1);
        paginationDiv.appendChild(firstPageSpan);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.cssText = 'padding: 0.3rem 0.5rem; color: #666;';
            paginationDiv.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.style.cssText = `background: ${i === currentPage ? 'var(--gold)' : '#e9ecef'}; color: ${i === currentPage ? 'white' : 'var(--text)'}; border: none; padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease; font-weight: ${i === currentPage ? 'bold' : 'normal'};`;
        pageBtn.onclick = () => window.loadPropertyList(i);
        paginationDiv.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.cssText = 'padding: 0.3rem 0.5rem; color: #666;';
            paginationDiv.appendChild(ellipsis);
        }
        
        const lastPageSpan = document.createElement('span');
        lastPageSpan.textContent = totalPages;
        lastPageSpan.style.cssText = 'background: #e9ecef; color: var(--text); padding: 0.3rem 0.7rem; border-radius: 5px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;';
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
    
    // Selector de itens por página (4/8/12/16) - Padrão 4 selecionado
    const perPageSelect = document.createElement('select');
    perPageSelect.style.cssText = 'background: white; border: 1px solid var(--primary); padding: 0.3rem 0.5rem; border-radius: 5px; font-size: 0.75rem; margin-left: 0.5rem; cursor: pointer;';
    perPageSelect.innerHTML = `
        <option value="4" ${window.adminItemsPerPage === 4 ? 'selected' : ''}>4 por página</option>
        <option value="8" ${window.adminItemsPerPage === 8 ? 'selected' : ''}>8 por página</option>
        <option value="12" ${window.adminItemsPerPage === 12 ? 'selected' : ''}>12 por página</option>
        <option value="16" ${window.adminItemsPerPage === 16 ? 'selected' : ''}>16 por página</option>
    `;
    perPageSelect.onchange = (e) => {
        window.adminItemsPerPage = parseInt(e.target.value);
        window.adminCurrentPage = 1; // Reset para primeira página
        window.loadPropertyList(1);
    };
    paginationDiv.appendChild(perPageSelect);
    
    return paginationDiv;
}

console.log('✅ Módulo admin-list-ui: Funções loadPropertyList e createPaginationControls injetadas.');
