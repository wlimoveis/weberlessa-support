// debug/templates/property-template.js
// Módulo de Templates para Cards de Propriedades
// Versão: 1.0.0
// Finalidade: Gerar HTML para os cards de imóveis na galeria principal
// Carregado apenas em modo debug (?debug=true)

console.log('🎨 [SUPPORT] Carregando PropertyTemplateEngine v1.0.0');

// Namespace para templates
window.SupportTemplates = window.SupportTemplates || {};

/**
 * PropertyTemplateEngine - Gera HTML para os cards de propriedades
 * Migrado do Core System (properties.js linhas 40-355)
 * Mantém toda a lógica de apresentação separada do Core
 */
window.SupportTemplates.PropertyTemplateEngine = class PropertyTemplateEngine {
    
    constructor() {
        this.version = '1.0.0';
        this.cacheEnabled = true;
        this.templateCache = new Map();
        this.imageFallback = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        this.stats = { hits: 0, misses: 0 };
        console.log('🎨 PropertyTemplateEngine inicializado');
    }
    
    /**
     * Gera o HTML completo para um card de propriedade
     * @param {Object} property - Dados da propriedade
     * @returns {string} HTML do card
     */
    generate(property) {
        if (!property) return '<div class="property-card error">Dados do imóvel inválidos</div>';
        
        // Tentar usar TemplateCache do Support System primeiro
        if (window.TemplateCache && typeof window.TemplateCache.getTemplate === 'function') {
            return window.TemplateCache.getTemplate(property, (prop) => this._generateTemplate(prop));
        }
        
        // Verificar cache local
        const cacheKey = `card_${property.id}_${property.updated_at || property.version || '1.0'}`;
        if (this.cacheEnabled && this.templateCache.has(cacheKey)) {
            this.stats.hits++;
            return this.templateCache.get(cacheKey);
        }
        
        this.stats.misses++;
        
        // Gerar HTML
        const html = this._generateTemplate(property);
        
        // Armazenar em cache
        if (this.cacheEnabled) {
            this._manageCacheSize();
            this.templateCache.set(cacheKey, html);
        }
        
        return html;
    }
    
    /**
     * Atualiza o conteúdo de um card específico
     * @param {number|string} id - ID da propriedade
     * @param {Object} data - Novos dados para atualização
     * @returns {boolean} Sucesso da operação
     */
    updateCardContent(id, data) {
        const card = document.querySelector(`.property-card[data-property-id="${id}"]`);
        if (!card) return false;
        
        try {
            // Atualizar preço se fornecido
            if (data.price !== undefined) {
                const priceElement = card.querySelector('[data-price-field]');
                if (priceElement) {
                    const formattedPrice = window.SharedCore?.PriceFormatter?.formatForCard 
                        ? window.SharedCore.PriceFormatter.formatForCard(data.price)
                        : (data.price.includes('R$') 
                            ? data.price 
                            : `R$ ${data.price.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`);
                    priceElement.textContent = formattedPrice;
                }
            }
            
            // Atualizar título se fornecido
            if (data.title !== undefined) {
                const titleElement = card.querySelector('[data-title-field]');
                if (titleElement) {
                    titleElement.textContent = data.title;
                }
                card.setAttribute('data-property-title', data.title);
            }
            
            // Atualizar localização se fornecido
            if (data.location !== undefined) {
                const locationElement = card.querySelector('[data-location-field]');
                if (locationElement) {
                    locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.location}`;
                }
            }
            
            // Atualizar descrição se fornecido
            if (data.description !== undefined) {
                const descriptionElement = card.querySelector('[data-description-field]');
                if (descriptionElement) {
                    descriptionElement.textContent = data.description;
                }
            }
            
            // Atualizar features se fornecido
            if (data.features !== undefined) {
                const featuresElement = card.querySelector('[data-features-field]');
                const displayFeatures = window.SharedCore?.formatFeaturesForDisplay?.(data.features) ?? '';
                
                if (featuresElement) {
                    if (displayFeatures) {
                        featuresElement.innerHTML = displayFeatures.split(',').map(f => `
                            <span class="feature-tag ${data.rural ? 'rural-tag' : ''}">${f.trim()}</span>
                        `).join('');
                    } else {
                        featuresElement.innerHTML = '';
                    }
                }
            }
            
            // Atualizar indicador de vídeo
            if (data.has_video !== undefined) {
                const videoIndicator = card.querySelector('.video-indicator');
                const hasVideo = window.SharedCore?.ensureBooleanVideo?.(data.has_video) ?? false;
                
                if (hasVideo && !videoIndicator) {
                    const imageSection = card.querySelector('.property-image');
                    if (imageSection) {
                        const imageCount = imageSection.querySelector('.image-count');
                        const topPosition = imageCount ? '35px' : '10px';
                        
                        imageSection.innerHTML += `
                            <div class="video-indicator pulsing" style="
                                position: absolute;
                                top: ${topPosition};
                                right: 10px;
                                background: rgba(0, 0, 0, 0.8);
                                color: white;
                                padding: 6px 12px;
                                border-radius: 6px;
                                font-size: 12px;
                                display: flex;
                                align-items: center;
                                gap: 6px;
                                z-index: 9;
                                box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                                border: 1px solid rgba(255,255,255,0.3);
                                backdrop-filter: blur(5px);
                                font-weight: 600;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">
                                <i class="fas fa-video" style="color: #FFD700; font-size: 14px;"></i>
                                <span>TEM VÍDEO</span>
                            </div>
                        `;
                    }
                } else if (!hasVideo && videoIndicator) {
                    videoIndicator.remove();
                }
            }
            
            // Invalidar cache para este card
            this._invalidateCache(id);
            
            card.classList.add('highlighted');
            setTimeout(() => {
                card.classList.remove('highlighted');
            }, 1000);
            
            return true;
            
        } catch (error) {
            console.error(`Erro ao atualizar card ${id}:`, error);
            return false;
        }
    }
    
    /**
     * Limpa o cache de templates
     * @returns {number} Número de itens removidos
     */
    clearCache() {
        const count = this.templateCache.size;
        this.templateCache.clear();
        this.stats = { hits: 0, misses: 0 };
        console.log(`🧹 TemplateCache limpo: ${count} itens removidos`);
        return count;
    }
    
    /**
     * Retorna estatísticas do cache
     * @returns {Object} Estatísticas de uso
     */
    getCacheStats() {
        const total = this.stats.hits + this.stats.misses;
        return {
            size: this.templateCache.size,
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) + '%' : '0%',
            cacheEnabled: this.cacheEnabled
        };
    }
    
    // ========== MÉTODOS PRIVADOS ==========
    
    /**
     * Template principal do card
     * @private
     */
    _generateTemplate(property) {
        const hasImages = property.images && property.images.length > 0 && property.images !== 'EMPTY';
        const imageUrls = hasImages ? property.images.split(',').filter(url => url.trim() !== '') : [];
        const imageCount = imageUrls.length;
        const firstImageUrl = imageCount > 0 ? imageUrls[0] : this.imageFallback;
        const hasGallery = imageCount > 1;
        const hasPdfs = property.pdfs && property.pdfs !== 'EMPTY' && property.pdfs.trim() !== '';
        const hasVideo = window.SharedCore?.ensureBooleanVideo?.(property.has_video) ?? false;
        const displayFeatures = window.SharedCore?.formatFeaturesForDisplay?.(property.features) ?? '';
        
        const formatPrice = (price) => {
            if (window.SharedCore?.PriceFormatter?.formatForCard) {
                return window.SharedCore.PriceFormatter.formatForCard(price);
            }
            if (!price) return 'R$ 0,00';
            if (typeof price === 'string' && price.includes('R$')) return price;
            return `R$ ${price.toString().replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
        };

        return `
            <div class="property-card" data-property-id="${property.id}" data-property-title="${property.title || ''}">
                ${this._generateImageSection(property, firstImageUrl, imageCount, hasGallery, hasPdfs, hasVideo)}
                <div class="property-content">
                    ${property.badge ? `<div class="property-badge ${property.rural ? 'rural-badge' : ''}">${this._escapeHtml(property.badge)}</div>` : ''}
                    <div class="property-price" data-price-field>${formatPrice(property.price)}</div>
                    <h3 class="property-title" data-title-field>${this._escapeHtml(property.title || 'Imóvel sem título')}</h3>
                    <div class="property-location" data-location-field>
                        <i class="fas fa-map-marker-alt"></i> ${this._escapeHtml(property.location || 'Local não informado')}
                    </div>
                    <p data-description-field>${this._escapeHtml(property.description || 'Descrição não disponível.')}</p>
                    ${displayFeatures ? `
                        <div class="property-features" data-features-field>
                            ${displayFeatures.split(',').map(f => `
                                <span class="feature-tag ${property.rural ? 'rural-tag' : ''}">${f.trim()}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    <button class="contact-btn" onclick="contactAgent(${property.id})">
                        <i class="fab fa-whatsapp"></i> Entrar em Contato
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Gera a seção de imagem do card
     * @private
     */
    _generateImageSection(property, firstImageUrl, imageCount, hasGallery, hasPdfs, hasVideo) {
        const hasImages = imageCount > 0;
        
        if (!hasImages) {
            return `
                <div class="property-image ${property.rural ? 'rural-image' : ''} no-image">
                    <div class="no-image-placeholder">
                        <i class="fas fa-building"></i>
                        <span>Sem imagem</span>
                    </div>
                </div>
            `;
        }
        
        const isVideo = this._isVideoUrl(firstImageUrl);
        
        if (isVideo) {
            return `
                <div class="property-image ${property.rural ? 'rural-image' : ''}" 
                     style="position: relative; height: 250px;">
                    <div class="video-thumbnail" onclick="window.open('${firstImageUrl}', '_blank')">
                        <video style="width:100%;height:100%;object-fit:cover;" preload="metadata" muted>
                            <source src="${firstImageUrl}" type="video/mp4">
                            <source src="${firstImageUrl}" type="video/quicktime">
                        </video>
                        <div class="video-overlay">
                            <i class="fas fa-play-circle"></i>
                            <span>Assistir vídeo</span>
                        </div>
                    </div>
                    ${property.badge ? `<div class="property-badge ${property.rural ? 'rural-badge' : ''}">${this._escapeHtml(property.badge)}</div>` : ''}
                    ${hasVideo ? '<div class="video-badge"><i class="fas fa-video"></i> Vídeo</div>' : ''}
                </div>
            `;
        }
        
        return `
            <div class="property-image ${property.rural ? 'rural-image' : ''}" 
                 style="position: relative; height: 250px;">
                <img src="${firstImageUrl}" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     alt="${property.title || 'Imóvel'}"
                     loading="lazy"
                     onerror="this.src='${this.imageFallback}'">
                ${property.badge ? `<div class="property-badge ${property.rural ? 'rural-badge' : ''}">${this._escapeHtml(property.badge)}</div>` : ''}
                
                ${hasVideo ? `
                    <div class="video-indicator pulsing" style="
                        position: absolute;
                        top: 85px;
                        right: 10px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        z-index: 9;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                        border: 1px solid rgba(255,255,255,0.3);
                        backdrop-filter: blur(5px);
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    ">
                        <i class="fas fa-video" style="color: #FFD700; font-size: 14px;"></i>
                        <span>TEM VÍDEO</span>
                    </div>
                ` : ''}
                
                ${hasGallery ? `
                    <div class="image-count" style="
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 13px;
                        font-weight: bold;
                        z-index: 10;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
                    ">
                        <i class="fas fa-images" style="margin-right: 5px;"></i>${imageCount}
                    </div>
                ` : ''}
                
                ${hasPdfs ? `
                    <button class="pdf-access" onclick="event.stopPropagation(); window.PdfSystem.showModal(${property.id})" style="
                        position: absolute;
                        bottom: 2px;
                        right: 35px;
                        background: rgba(255, 255, 255, 0.95);
                        border: none;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.75rem;
                        color: #1a5276;
                        transition: all 0.3s ease;
                        z-index: 15;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        border: 1px solid rgba(0,0,0,0.15);
                    ">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Formata o preço para exibição
     * @private
     */
    _formatPrice(price) {
        if (!price) return 'Preço sob consulta';
        if (typeof price === 'string' && price.includes('R$')) return price;
        
        let numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9,-]/g, '').replace(',', '.')) : price;
        if (isNaN(numericPrice)) return 'Preço sob consulta';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numericPrice);
    }
    
    /**
     * Verifica se uma URL é de vídeo
     * @private
     */
    _isVideoUrl(url) {
        if (!url) return false;
        const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.flv'];
        const urlLower = url.toLowerCase();
        return videoExtensions.some(ext => urlLower.includes(ext));
    }
    
    /**
     * Gerencia o tamanho do cache (mantém no máximo 100 itens)
     * @private
     */
    _manageCacheSize() {
        if (this.templateCache.size > 100) {
            const keysToDelete = Array.from(this.templateCache.keys()).slice(0, 20);
            keysToDelete.forEach(key => this.templateCache.delete(key));
            if (window.location.search.includes('debug=true')) {
                console.log('🧹 TemplateCache: 20 itens removidos (limite de 100)');
            }
        }
    }
    
    /**
     * Invalida cache para uma propriedade específica
     * @private
     */
    _invalidateCache(propertyId) {
        let count = 0;
        const pattern = `card_${propertyId}_`;
        for (const key of this.templateCache.keys()) {
            if (key.startsWith(pattern)) {
                this.templateCache.delete(key);
                count++;
            }
        }
        if (count > 0 && window.location.search.includes('debug=true')) {
            console.log(`🧹 Cache invalidado para propriedade ${propertyId}: ${count} itens`);
        }
    }
    
    /**
     * Escapa HTML para prevenir XSS
     * @private
     */
    _escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Registrar no DiagnosticRegistry se disponível
if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.register === 'function') {
    try {
        window.DiagnosticRegistry.register(
            'SupportTemplates.PropertyTemplateEngine',
            window.SupportTemplates.PropertyTemplateEngine,
            'templates',
            {
                isSafe: true,
                version: '1.0.0',
                description: 'Engine de templates para cards de propriedades (HTML)'
            }
        );
        console.log('📋 [property-template] Registrado no DiagnosticRegistry');
    } catch (e) {
        console.warn('⚠️ [property-template] Erro ao registrar:', e.message);
    }
}

// Health check automático
if (window.location.search.includes('debug=true')) {
    console.log('🎨 [property-template] Health check:');
    const engine = new window.SupportTemplates.PropertyTemplateEngine();
    const testProperty = {
        id: 999,
        title: 'Teste',
        price: '450000',
        location: 'Localização Teste',
        images: 'test.jpg'
    };
    const testHtml = engine.generate(testProperty);
    console.log(`   ✅ Template gerado: ${testHtml.length} caracteres`);
    console.log(`   ✅ Cache stats:`, engine.getCacheStats());
}

console.log('✅ [SUPPORT] property-template.js v1.0.0 carregado');
console.log('📝 Objeto disponível: window.SupportTemplates.PropertyTemplateEngine');
