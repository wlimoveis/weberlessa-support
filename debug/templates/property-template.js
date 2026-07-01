// debug/templates/property-template.js
// Módulo de Templates para Cards de Propriedades
// Versão: 1.1.0 - Com delegação para gallery.js
// Finalidade: Gerar HTML para os cards de imóveis, delegando a galeria para o gallery.js
// Carregado apenas em modo debug (?debug=true)

console.log('🎨 [SUPPORT] Carregando PropertyTemplateEngine v1.1.0');

// Namespace para templates
window.SupportTemplates = window.SupportTemplates || {};

/**
 * PropertyTemplateEngine - Gera HTML para os cards de propriedades
 * Migrado do Core System (properties.js linhas 40-355)
 * 
 * ✅ V1.1.0: Agora delega a criação da galeria para o gallery.js
 * Isso garante que todas as funcionalidades sejam exibidas:
 * - Contador de visualizações (Glassmorphism)
 * - Contador de imagens
 * - Miniaturas de vídeo com ícone de play
 * - Setas de navegação Liquid Glass
 * - Botão de expandir para tela cheia
 */
window.SupportTemplates.PropertyTemplateEngine = class PropertyTemplateEngine {
    
    constructor() {
        this.version = '1.1.0';
        this.imageFallback = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        this.cacheEnabled = true;
        this.templateCache = new Map();
        this.stats = { hits: 0, misses: 0 };
        console.log('🎨 PropertyTemplateEngine v1.1.0 inicializado');
    }
    
    /**
     * Gera o HTML completo para um card de propriedade
     * @param {Object} property - Dados da propriedade
     * @returns {string} HTML do card
     */
    generate(property) {
        if (!property) return '<div class="property-card error">Dados do imóvel inválidos</div>';
        
        // Verificar cache
        const cacheKey = `card_${property.id}_${property.images?.length || 0}_${property.has_video}_${property.updated_at || property.version || '1.0'}`;
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
     * Template principal do card
     * @private
     */
    _generateTemplate(property) {
        // Usar SharedCore para formatação (fallbacks inline garantem operação autônoma)
        const displayFeatures = this._formatFeatures(property.features);
        const price = this._formatPrice(property.price);
        
        // ========== CRÍTICO: Delegar para gallery.js ==========
        // Em vez de gerar HTML próprio, chama a função existente no gallery.js
        // Isso garante que TODAS as funcionalidades sejam exibidas:
        // - Contador de visualizações (Glassmorphism)
        // - Contador de imagens
        // - Miniaturas de vídeo
        // - Setas de navegação Liquid Glass
        // - Botão de expandir
        let imageSectionHtml = '';
        
        if (typeof window.createPropertyGallery === 'function') {
            try {
                imageSectionHtml = window.createPropertyGallery(property);
                if (window.location.search.includes('debug=true')) {
                    console.log(`🎨 [template] Galeria delegada para gallery.js: ID ${property.id}`);
                }
            } catch (error) {
                console.warn(`⚠️ [template] Erro ao chamar createPropertyGallery para ${property.id}:`, error);
                imageSectionHtml = this._generateFallbackImageSection(property);
            }
        } else {
            if (window.location.search.includes('debug=true')) {
                console.warn(`⚠️ [template] window.createPropertyGallery não disponível, usando fallback`);
            }
            imageSectionHtml = this._generateFallbackImageSection(property);
        }
        
        // Gerar HTML completo do card
        const html = `
            <div class="property-card" data-property-id="${property.id}" data-property-title="${this._escapeHtml(property.title || '')}">
                ${imageSectionHtml}
                <div class="property-content">
                    ${property.badge ? `<div class="property-badge ${property.rural ? 'rural-badge' : ''}">${this._escapeHtml(property.badge)}</div>` : ''}
                    <div class="property-price" data-price-field>${price}</div>
                    <h3 class="property-title" data-title-field>${this._escapeHtml(property.title || 'Imóvel sem título')}</h3>
                    <div class="property-location" data-location-field>
                        <i class="fas fa-map-marker-alt"></i> ${this._escapeHtml(property.location || 'Local não informado')}
                    </div>
                    <p class="property-description" data-description-field>${this._truncateText(this._escapeHtml(property.description || 'Descrição não disponível.'), 150)}</p>
                    ${displayFeatures ? `
                        <div class="property-features" data-features-field>
                            ${displayFeatures.split(',').slice(0, 4).map(f => `
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
        
        return html;
    }
    
    /**
     * Fallback para quando createPropertyGallery não está disponível
     * Garante que o Core System continue funcionando autonomamente
     * @private
     */
    _generateFallbackImageSection(property) {
        const hasImages = property.images && property.images.length > 0 && property.images !== 'EMPTY';
        const imageUrls = hasImages ? property.images.split(',').filter(url => url.trim() !== '') : [];
        const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : this.imageFallback;
        const imageCount = imageUrls.length;
        const hasVideo = window.SharedCore?.ensureBooleanVideo?.(property.has_video) ?? false;
        const hasPdfs = property.pdfs && property.pdfs !== 'EMPTY' && property.pdfs.trim() !== '';
        
        return `
            <div class="property-image ${property.rural ? 'rural-image' : ''}" style="position: relative; height: 250px; overflow: hidden;">
                <div onclick="if(window.openGalleryAtCurrentIndex) openGalleryAtCurrentIndex(${property.id})" style="cursor: pointer; width: 100%; height: 100%;">
                    <img src="${firstImageUrl}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         alt="${this._escapeHtml(property.title || 'Imóvel')}"
                         loading="lazy"
                         onerror="this.src='${this.imageFallback}'">
                </div>
                
                <!-- Badge do imóvel -->
                ${property.badge ? `<div class="property-badge ${property.rural ? 'rural-badge' : ''}">${this._escapeHtml(property.badge)}</div>` : ''}
                
                <!-- Indicador de vídeo -->
                ${hasVideo ? `
                    <div class="video-indicator" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; z-index: 20;">
                        <i class="fas fa-video"></i> Vídeo
                    </div>
                ` : ''}
                
                <!-- Contador de imagens (fallback) -->
                ${imageCount > 1 ? `
                    <div class="image-counter" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; z-index: 20;">
                        <i class="fas fa-images"></i> ${imageCount}
                    </div>
                ` : ''}
                
                <!-- Botão de acesso a PDFs -->
                ${hasPdfs ? `
                    <button class="pdf-access" onclick="event.stopPropagation(); if(window.PdfSystem) window.PdfSystem.showModal(${property.id})" 
                            style="position: absolute; bottom: 2px; right: 35px; background: rgba(255,255,255,0.95); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #1a5276; z-index: 20; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                ` : ''}
                
                <!-- Botão de expandir galeria -->
                <div class="gallery-expand-icon" onclick="event.stopPropagation(); if(window.openGalleryAtCurrentIndex) openGalleryAtCurrentIndex(${property.id})" 
                     style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 20; transition: transform 0.2s;">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        `;
    }
    
    /**
     * Atualiza o conteúdo de um card específico (atualização parcial)
     * @param {number|string} id - ID da propriedade
     * @param {Object} data - Novos dados para atualização
     * @returns {boolean} Sucesso da operação
     */
    updateCardContent(id, data) {
        console.log(`🔄 [template] Atualizando conteúdo do card ${id}`);
        
        const card = document.querySelector(`.property-card[data-property-id="${id}"]`);
        if (!card) {
            console.warn(`⚠️ [template] Card ${id} não encontrado`);
            return false;
        }
        
        try {
            // Atualizar preço
            if (data.price !== undefined) {
                const priceElement = card.querySelector('[data-price-field]');
                if (priceElement) {
                    priceElement.textContent = this._formatPrice(data.price);
                }
            }
            
            // Atualizar título
            if (data.title !== undefined) {
                const titleElement = card.querySelector('[data-title-field]');
                if (titleElement) {
                    titleElement.textContent = this._escapeHtml(data.title);
                }
                card.setAttribute('data-property-title', data.title);
            }
            
            // Atualizar localização
            if (data.location !== undefined) {
                const locationElement = card.querySelector('[data-location-field]');
                if (locationElement) {
                    locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${this._escapeHtml(data.location)}`;
                }
            }
            
            // Atualizar descrição
            if (data.description !== undefined) {
                const descriptionElement = card.querySelector('[data-description-field]');
                if (descriptionElement) {
                    descriptionElement.textContent = this._truncateText(this._escapeHtml(data.description), 150);
                }
            }
            
            // Atualizar features
            if (data.features !== undefined) {
                const featuresElement = card.querySelector('[data-features-field]');
                const displayFeatures = this._formatFeatures(data.features);
                if (featuresElement && displayFeatures) {
                    featuresElement.innerHTML = displayFeatures.split(',').slice(0, 4).map(f => `
                        <span class="feature-tag">${f.trim()}</span>
                    `).join('');
                }
            }
            
            // Invalidar cache para este card
            this._invalidateCache(id);
            
            // Adicionar efeito visual de atualização
            card.classList.add('highlighted');
            setTimeout(() => card.classList.remove('highlighted'), 1000);
            
            console.log(`✅ [template] Card ${id} atualizado com sucesso`);
            return true;
            
        } catch (error) {
            console.error(`❌ [template] Erro ao atualizar card ${id}:`, error);
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
        console.log(`🧹 [template] Cache limpo: ${count} itens removidos`);
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
            cacheEnabled: this.cacheEnabled,
            version: this.version
        };
    }
    
    /**
     * Retorna status do módulo
     * @returns {Object} Status detalhado
     */
    getStatus() {
        return {
            version: this.version,
            cacheEnabled: this.cacheEnabled,
            cacheSize: this.templateCache.size,
            galleryAvailable: typeof window.createPropertyGallery === 'function',
            stats: this.getCacheStats(),
            timestamp: new Date().toISOString()
        };
    }
    
    // ========== MÉTODOS PRIVADOS DE FORMATAÇÃO ==========
    
    /**
     * Formata o preço para exibição
     * @private
     */
    _formatPrice(price) {
        if (!price) return 'Preço sob consulta';
        
        // Usar SharedCore se disponível
        if (window.SharedCore?.PriceFormatter?.formatForCard) {
            return window.SharedCore.PriceFormatter.formatForCard(price);
        }
        
        // Fallback inline
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
     * Formata as features para exibição
     * @private
     */
    _formatFeatures(features) {
        if (!features) return '';
        
        // Usar SharedCore se disponível
        if (window.SharedCore?.formatFeaturesForDisplay) {
            return window.SharedCore.formatFeaturesForDisplay(features);
        }
        
        // Fallback inline
        if (Array.isArray(features)) {
            return features.filter(f => f && f.trim()).join(', ');
        }
        
        if (typeof features === 'string') {
            try {
                if (features.trim().startsWith('[')) {
                    const parsed = JSON.parse(features);
                    if (Array.isArray(parsed)) return parsed.filter(f => f && f.trim()).join(', ');
                }
            } catch (e) {
                // Ignorar erro de parse
            }
            return features.replace(/[\[\]"]/g, '').replace(/\s*,\s*/g, ', ');
        }
        
        return '';
    }
    
    /**
     * Trunca texto para um tamanho máximo
     * @private
     */
    _truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
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
    
    // ========== MÉTODOS PRIVADOS DE CACHE ==========
    
    /**
     * Gerencia o tamanho do cache (mantém no máximo 100 itens)
     * @private
     */
    _manageCacheSize() {
        if (this.templateCache.size > 100) {
            const keysToDelete = Array.from(this.templateCache.keys()).slice(0, 20);
            keysToDelete.forEach(key => this.templateCache.delete(key));
            if (window.location.search.includes('debug=true')) {
                console.log('🧹 [template] Cache: 20 itens removidos (limite de 100)');
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
            console.log(`🧹 [template] Cache invalidado para propriedade ${propertyId}: ${count} itens`);
        }
    }
};

// ========== REGISTRO NO DIAGNOSTIC REGISTRY ==========
if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.register === 'function') {
    try {
        window.DiagnosticRegistry.register(
            'SupportTemplates.PropertyTemplateEngine',
            window.SupportTemplates.PropertyTemplateEngine,
            'templates',
            {
                isSafe: true,
                version: '1.1.0',
                description: 'Engine de templates para cards de propriedades com delegação para gallery.js'
            }
        );
        console.log('📋 [property-template] Registrado no DiagnosticRegistry');
    } catch (e) {
        console.warn('⚠️ [property-template] Erro ao registrar:', e.message);
    }
}

// ========== HEALTH CHECK AUTOMÁTICO ==========
if (window.location.search.includes('debug=true')) {
    setTimeout(() => {
        console.group('🎨 [property-template] HEALTH CHECK v1.1.0');
        console.log('✅ Módulo carregado:', !!window.SupportTemplates.PropertyTemplateEngine);
        console.log('✅ createPropertyGallery disponível:', typeof window.createPropertyGallery === 'function');
        console.log('✅ SharedCore disponível:', !!window.SharedCore);
        
        // Teste rápido
        const engine = new window.SupportTemplates.PropertyTemplateEngine();
        const testProperty = {
            id: 999,
            title: 'Teste Integração',
            price: '450000',
            location: 'Localização Teste',
            images: 'test.jpg',
            description: 'Teste de integração com gallery.js'
        };
        
        const testHtml = engine.generate(testProperty);
        console.log(`✅ Template gerado: ${testHtml.length} caracteres`);
        console.log(`📊 Cache stats:`, engine.getCacheStats());
        
        console.groupEnd();
    }, 1000);
}

console.log('✅ [SUPPORT] property-template.js v1.1.0 carregado');
console.log('📝 Objeto disponível: window.SupportTemplates.PropertyTemplateEngine');
console.log('🎯 Integração com gallery.js:', typeof window.createPropertyGallery === 'function' ? '✅ Disponível' : '⚠️ Aguardando carregamento');
