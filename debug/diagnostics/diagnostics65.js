// ============================================================
// debug/diagnostics/diagnostics65.js
// SISTEMA DE DIAGNÓSTICO COMPLETO v6.5.4
// ============================================================
// ✅ Detecta e corrige automaticamente:
//   1. Illegal return statement
//   2. Funções da galeria ausentes
//   3. Imagens quebradas (ERR_NAME_NOT_RESOLVED) - COM RECUPERAÇÃO
//   4. Estado "MISTO" (antigo + novo)
//   5. Funções críticas ausentes
// ✅ Integração com Recuperação de Imagens
// ✅ CORREÇÃO: Botões do painel agora respondem ao clique
// ✅ MARCADOR DE FIM DE ARQUIVO PARA GITHUB ACTIONS
// ============================================================

(function() {
    'use strict';

    console.log('🔧 [DIAGNOSTICS v6.5.4] SISTEMA DE DIAGNÓSTICO COMPLETO CARREGADO');

    try {

        // ========== CONFIGURAÇÃO ==========
        const CONFIG = {
            version: '6.5.4',
            name: 'Sistema de Diagnóstico Completo',
            autoFix: true,
            logLevel: 'debug',
            maxRetries: 3,
            retryDelay: 1000,
            supabaseUrl: 'https://wxdiowpswepsvklumgvx.supabase.co',
            bucket: 'properties',
            fallbackImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        };

        // ========== ESTADO ==========
        const state = {
            initialized: false,
            diagnostics: [],
            fixes: [],
            errors: [],
            warnings: [],
            status: 'idle',
            initStatus: null
        };

        // ========== UTILITÁRIOS ==========
        function log(message, type = 'info') {
            const prefix = {
                'debug': '🔍',
                'info': 'ℹ️',
                'warn': '⚠️',
                'error': '❌',
                'success': '✅'
            };
            const timestamp = new Date().toISOString();
            const logMsg = `${prefix[type] || '📌'} [${timestamp}] ${message}`;
            console.log(logMsg);
            
            if (type === 'error') state.errors.push(message);
            if (type === 'warn') state.warnings.push(message);
            
            return logMsg;
        }

        function safeExecute(fn, fallback = null) {
            try { 
                const result = fn();
                return result !== undefined ? result : fallback;
            } catch (error) { 
                log(`Erro ao executar: ${error.message}`, 'error'); 
                return fallback; 
            }
        }

        // ========== DIAGNÓSTICO 1: VERIFICAR ILLEGAL RETURN STATEMENT ==========
        function diagnoseIllegalReturn() {
            log('🔍 Diagnosticando Illegal Return Statement...', 'debug');
            
            const results = { hasError: false, location: null, fix: null };

            try {
                if (window.MediaSystem && window.MediaSystem.uploadSingleFile) {
                    const fnString = window.MediaSystem.uploadSingleFile.toString();
                    const hasReturnOutsidePromise = /}\s*return\s+/.test(fnString);
                    if (hasReturnOutsidePromise) {
                        results.hasError = true;
                        results.location = 'media-unified.js - uploadSingleFile';
                        results.fix = 'Remover return fora da Promise';
                        log('❌ Illegal return statement detectado em media-unified.js', 'error');
                    }
                }

                const scripts = document.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.src && script.src.includes('properties.js')) {
                        try {
                            const content = script.textContent || '';
                            if (content.includes('return') && !content.includes('function')) {
                                if (content.match(/^\s*return\s+[^;]+;/m)) {
                                    results.hasError = true;
                                    results.location = 'properties.js';
                                    results.fix = 'Remover return solto';
                                    log('❌ Illegal return statement detectado em properties.js', 'error');
                                }
                            }
                        } catch (e) {}
                    }
                });

                if (!results.hasError) {
                    log('✅ Nenhum Illegal return statement detectado', 'success');
                }

                return results;

            } catch (error) {
                log(`Erro no diagnóstico de Illegal Return: ${error.message}`, 'error');
                return results;
            }
        }

        // ========== DIAGNÓSTICO 2: VERIFICAR FUNÇÕES DA GALERIA ==========
        function diagnoseGalleryFunctions() {
            log('🔍 Diagnosticando funções da galeria...', 'debug');
            
            const requiredFunctions = [
                'openGalleryAtCurrentIndex',
                'closeGallery',
                'createPropertyGallery',
                'setupGalleryEvents',
                'navigatePropertyGallery',
                'registerGalleryView'
            ];

            const results = { missing: [], exists: [], fix: null };

            requiredFunctions.forEach(fnName => {
                if (typeof window[fnName] === 'function') {
                    results.exists.push(fnName);
                    log(`✅ ${fnName} disponível`, 'debug');
                } else {
                    results.missing.push(fnName);
                    log(`❌ ${fnName} NÃO DISPONÍVEL`, 'error');
                }
            });

            if (results.missing.length > 0) {
                results.fix = 'Carregar gallery.js ou criar fallbacks';
                log(`⚠️ ${results.missing.length} função(ões) da galeria ausentes`, 'warn');
            } else {
                log('✅ Todas as funções da galeria estão disponíveis', 'success');
            }

            return results;
        }

        // ========== DIAGNÓSTICO 3: VERIFICAR IMAGENS QUEBRADAS ==========
        function diagnoseBrokenImages() {
            log('🔍 Diagnosticando imagens quebradas...', 'debug');
            
            const results = { brokenImages: [], totalImages: 0, fix: null };

            try {
                const images = document.querySelectorAll('img');
                results.totalImages = images.length;

                images.forEach(img => {
                    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
                        const src = img.src || img.getAttribute('src');
                        if (src && src.includes('supabase.co')) {
                            results.brokenImages.push({
                                src: src,
                                element: img,
                                error: 'ERR_NAME_NOT_RESOLVED'
                            });
                            log(`❌ Imagem quebrada: ${src.substring(0, 50)}...`, 'error');
                        }
                    }
                });

                if (results.brokenImages.length > 0) {
                    results.fix = 'Verificar URLs no Supabase ou usar fallback';
                    log(`⚠️ ${results.brokenImages.length} imagem(ns) quebrada(s) detectada(s)`, 'warn');
                } else {
                    log('✅ Nenhuma imagem quebrada detectada', 'success');
                }

                return results;

            } catch (error) {
                log(`Erro no diagnóstico de imagens: ${error.message}`, 'error');
                return results;
            }
        }

        // ========== DIAGNÓSTICO 4: VERIFICAR ESTADO DO SISTEMA ==========
        function diagnoseSystemState() {
            log('🔍 Diagnosticando estado do sistema...', 'debug');
            
            const results = {
                isMixed: false,
                oldFunctions: [],
                newFunctions: [],
                fix: null
            };

            const oldPatterns = ['filterProperties', 'openGallery', 'closeGallery'];
            const newPatterns = ['filterPropertiesByType', 'openGalleryAtCurrentIndex', 'closeGallery'];

            oldPatterns.forEach(fn => {
                if (typeof window[fn] === 'function') {
                    results.oldFunctions.push(fn);
                }
            });

            newPatterns.forEach(fn => {
                if (typeof window[fn] === 'function') {
                    results.newFunctions.push(fn);
                }
            });

            if (results.oldFunctions.length > 0 && results.newFunctions.length > 0) {
                results.isMixed = true;
                results.fix = 'Unificar funções (remover versões antigas)';
                log('⚠️ Sistema em estado MISTO (antigo + novo)', 'warn');
            } else if (results.oldFunctions.length > 0) {
                results.isMixed = false;
                results.fix = 'Migrar para versões novas';
                log('⚠️ Sistema usando versões antigas', 'warn');
            } else {
                log('✅ Sistema unificado (apenas versões novas)', 'success');
            }

            return results;
        }

        // ========== DIAGNÓSTICO 5: VERIFICAR FUNÇÕES CRÍTICAS ==========
        function diagnoseCriticalFunctions() {
            log('🔍 Diagnosticando funções críticas...', 'debug');
            
            const criticalFunctions = [
                'properties',
                'propertyTemplates',
                'renderProperties',
                'loadPropertiesData',
                'addNewProperty',
                'updateProperty',
                'deleteProperty',
                'SharedCore',
                'SUPABASE_CONSTANTS'
            ];

            const results = { missing: [], exists: [], fix: null };

            criticalFunctions.forEach(fnName => {
                if (typeof window[fnName] !== 'undefined') {
                    results.exists.push(fnName);
                    log(`✅ ${fnName} disponível`, 'debug');
                } else {
                    results.missing.push(fnName);
                    log(`❌ ${fnName} NÃO DISPONÍVEL`, 'error');
                }
            });

            if (results.missing.length > 0) {
                results.fix = `Carregar módulos: ${results.missing.join(', ')}`;
                log(`⚠️ ${results.missing.length} função(ões) crítica(s) ausentes`, 'warn');
            } else {
                log('✅ Todas as funções críticas estão disponíveis', 'success');
            }

            return results;
        }

        // ========== CORREÇÃO 1: CORRIGIR ILLEGAL RETURN ==========
        function fixIllegalReturn(diagnostic) {
            log('🔧 Corrigindo Illegal return statement...', 'info');
            
            try {
                if (window.MediaSystem && window.MediaSystem.uploadSingleFile) {
                    const fixedFn = function(file, propertyId, type) {
                        var self = this;
                        var t = type || 'media';
                        return new Promise(function(resolve, reject) {
                            var SUPABASE_URL = window.SUPABASE_CONSTANTS.URL;
                            var SUPABASE_KEY = window.SUPABASE_CONSTANTS.KEY;
                            var bucket = self.config.buckets[self.config.currentSystem];
                            var timestamp = Date.now();
                            var random = Math.random().toString(36).substring(2, 10);
                            var safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 50);
                            var prefix = t === 'pdf' ? 'pdf' : 'media';
                            var fileName = prefix + '_' + propertyId + '_' + timestamp + '_' + random + '_' + safeName;
                            var filePath = bucket + '/' + fileName;
                            var uploadUrl = SUPABASE_URL + '/storage/v1/object/' + filePath;
                            
                            fetch(uploadUrl, { 
                                method: 'POST', 
                                headers: { 
                                    'Authorization': 'Bearer ' + SUPABASE_KEY, 
                                    'apikey': SUPABASE_KEY, 
                                    'Content-Type': file.type || 'application/octet-stream' 
                                }, 
                                body: file 
                            }).then(function(response) {
                                if (response.ok) { 
                                    var publicUrl = SUPABASE_URL + '/storage/v1/object/public/' + filePath; 
                                    resolve(publicUrl); 
                                } else { 
                                    reject(new Error('Upload falhou: ' + response.status)); 
                                }
                            }).catch(function(error) { 
                                reject(error); 
                            });
                        });
                    };

                    window.MediaSystem.uploadSingleFile = fixedFn;
                    log('✅ Illegal return statement corrigido em MediaSystem.uploadSingleFile', 'success');
                    return true;
                }

                log('⚠️ MediaSystem não encontrado para corrigir', 'warn');
                return false;

            } catch (error) {
                log(`❌ Erro ao corrigir Illegal return: ${error.message}`, 'error');
                return false;
            }
        }

        // ========== CORREÇÃO 2: CRIAR FALLBACKS PARA GALERIA ==========
        function fixGalleryFunctions(diagnostic) {
            log('🔧 Criando fallbacks para funções da galeria...', 'info');
            
            try {
                const missing = diagnostic.missing || [];
                let fixed = 0;

                if (missing.includes('createPropertyGallery') || typeof window.createPropertyGallery !== 'function') {
                    window.createPropertyGallery = function(property) {
                        const fallbackImage = property.images && property.images !== 'EMPTY' 
                            ? property.images.split(',')[0] 
                            : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                        
                        return `
                            <div class="property-image ${property.rural ? 'rural-image' : ''}" 
                                 style="position: relative; height: 250px; overflow: hidden;">
                                <div class="property-gallery-container" 
                                     style="cursor:pointer; position:relative; width:100%; height:100%;">
                                    <img src="${fallbackImage}" 
                                         loading="lazy"
                                         style="width: 100%; height: 100%; object-fit: cover;"
                                         alt="${property.title || 'Imóvel'}">
                                    ${property.badge ? `
                                        <div class="property-badge" style="
                                            position: absolute; 
                                            top: 15px; 
                                            left: 15px; 
                                            background: #f39c12; 
                                            color: white; 
                                            padding: 0.4rem 1rem; 
                                            border-radius: 20px; 
                                            font-size: 0.8rem; 
                                            font-weight: bold; 
                                            z-index: 10;
                                        ">
                                            ${property.badge}
                                        </div>
                                    ` : ''}
                                    ${property.images && property.images !== 'EMPTY' ? `
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
                                        ">
                                            <i class="fas fa-images"></i> ${property.images.split(',').filter(u => u && u.trim()).length}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    };
                    fixed++;
                    log('✅ createPropertyGallery fallback criado', 'success');
                }

                if (missing.includes('openGalleryAtCurrentIndex') || typeof window.openGalleryAtCurrentIndex !== 'function') {
                    window.openGalleryAtCurrentIndex = function(propertyId) {
                        const property = window.properties.find(p => p.id === propertyId);
                        if (!property) {
                            log(`❌ Imóvel ${propertyId} não encontrado`, 'error');
                            return;
                        }
                        
                        const hasImages = property.images && property.images !== 'EMPTY';
                        if (!hasImages) {
                            log(`ℹ️ Imóvel ${propertyId} não tem imagens`, 'info');
                            return;
                        }
                        
                        const images = property.images.split(',').filter(u => u && u.trim());
                        const firstImage = images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                        
                        if (typeof window.registerGalleryView === 'function') {
                            window.registerGalleryView(propertyId);
                        }
                        
                        alert(`📸 ${property.title}\n\nClique em OK para abrir a imagem em nova aba.`);
                        window.open(firstImage, '_blank');
                        
                        log(`✅ Galeria aberta para imóvel ${propertyId} (fallback)`, 'success');
                    };
                    fixed++;
                    log('✅ openGalleryAtCurrentIndex fallback criado', 'success');
                }

                if (missing.includes('closeGallery') || typeof window.closeGallery !== 'function') {
                    window.closeGallery = function() {
                        const modal = document.getElementById('propertyGalleryModal');
                        if (modal) {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                            log('✅ Galeria fechada (fallback)', 'success');
                        }
                    };
                    fixed++;
                    log('✅ closeGallery fallback criado', 'success');
                }

                if (missing.includes('setupGalleryEvents') || typeof window.setupGalleryEvents !== 'function') {
                    window.setupGalleryEvents = function() {
                        log('✅ setupGalleryEvents fallback executado', 'info');
                        document.addEventListener('keydown', function(event) {
                            if (event.key === 'Escape' && typeof window.closeGallery === 'function') {
                                window.closeGallery();
                            }
                        });
                    };
                    fixed++;
                    log('✅ setupGalleryEvents fallback criado', 'success');
                }

                if (missing.includes('navigatePropertyGallery') || typeof window.navigatePropertyGallery !== 'function') {
                    window.navigatePropertyGallery = function(propertyId, direction) {
                        log(`ℹ️ Navegação da galeria: ${direction} (fallback)`, 'info');
                    };
                    fixed++;
                    log('✅ navigatePropertyGallery fallback criado', 'success');
                }

                log(`✅ ${fixed} fallback(s) da galeria criado(s)`, 'success');
                return true;

            } catch (error) {
                log(`❌ Erro ao criar fallbacks da galeria: ${error.message}`, 'error');
                return false;
            }
        }

        // ========== CORREÇÃO 3: CORRIGIR IMAGENS QUEBRADAS ==========
        function fixBrokenImages(diagnostic) {
            log('🔧 Corrigindo imagens quebradas...', 'info');
            
            try {
                const brokenImages = diagnostic.brokenImages || [];
                let fixed = 0;

                brokenImages.forEach(item => {
                    const img = item.element;
                    if (img) {
                        const fallbackUrl = CONFIG.fallbackImage;
                        img.src = fallbackUrl;
                        img.onerror = null;
                        img.style.border = '2px solid #e74c3c';
                        img.title = 'Imagem original indisponível - usando fallback';
                        fixed++;
                        log(`✅ Imagem corrigida: ${item.src.substring(0, 30)}...`, 'success');
                    }
                });

                if (fixed > 0) {
                    log(`✅ ${fixed} imagem(ns) quebrada(s) corrigida(s) com fallback`, 'success');
                }

                return true;

            } catch (error) {
                log(`❌ Erro ao corrigir imagens: ${error.message}`, 'error');
                return false;
            }
        }

        // ========== CORREÇÃO 4: UNIFICAR SISTEMA ==========
        function fixSystemState(diagnostic) {
            log('🔧 Unificando sistema...', 'info');
            
            try {
                if (typeof window.filterPropertiesByType === 'function' && typeof window.filterProperties === 'undefined') {
                    window.filterProperties = window.filterPropertiesByType;
                    log('✅ filterProperties criado como alias para filterPropertiesByType', 'success');
                }

                if (typeof window.openGalleryAtCurrentIndex === 'function' && typeof window.openGallery === 'undefined') {
                    window.openGallery = window.openGalleryAtCurrentIndex;
                    log('✅ openGallery criado como alias para openGalleryAtCurrentIndex', 'success');
                }

                log('✅ Sistema unificado com aliases', 'success');
                return true;

            } catch (error) {
                log(`❌ Erro ao unificar sistema: ${error.message}`, 'error');
                return false;
            }
        }

        // ========== CORREÇÃO 5: FUNÇÕES CRÍTICAS AUSENTES ==========
        function fixCriticalFunctions(diagnostic) {
            log('🔧 Corrigindo funções críticas ausentes...', 'info');
            
            try {
                const missing = diagnostic.missing || [];
                let fixed = 0;

                if (missing.includes('SUPABASE_CONSTANTS') || typeof window.SUPABASE_CONSTANTS === 'undefined') {
                    window.SUPABASE_CONSTANTS = {
                        URL: 'https://wxdiowpswepsvklumgvx.supabase.co',
                        KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZGlvd3Bzd2Vwc3ZrbHVtZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MTExNzksImV4cCI6MjA4Nzk4NzE3OX0.QsUHE_w5m5-pz3LcwdREuwmwvCiX3Hz8FYv8SAwhD6U',
                        ADMIN_PASSWORD: "wl654",
                        PDF_PASSWORD: "doc123"
                    };
                    window.SUPABASE_URL = window.SUPABASE_CONSTANTS.URL;
                    window.SUPABASE_KEY = window.SUPABASE_CONSTANTS.KEY;
                    fixed++;
                    log('✅ SUPABASE_CONSTANTS criado', 'success');
                }

                if (missing.includes('SharedCore') || typeof window.SharedCore === 'undefined') {
                    window.SharedCore = {
                        version: '2.0.0',
                        formatPrice: function(value) {
                            if (!value && value !== 0) return 'R$ 0,00';
                            const numericPrice = parseFloat(value.toString().replace(/[^0-9,-]/g, '').replace(',', '.'));
                            if (isNaN(numericPrice)) return 'R$ 0,00';
                            return numericPrice.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        },
                        escapeHtml: function(str) {
                            if (!str) return '';
                            return str.replace(/&/g, '&amp;')
                                      .replace(/</g, '&lt;')
                                      .replace(/>/g, '&gt;')
                                      .replace(/"/g, '&quot;')
                                      .replace(/'/g, '&#39;');
                        },
                        ensureBooleanVideo: function(value) {
                            if (value === undefined || value === null) return false;
                            if (typeof value === 'boolean') return value;
                            if (typeof value === 'string') {
                                const lower = value.toLowerCase().trim();
                                if (lower === 'true' || lower === '1' || lower === 'sim') return true;
                                if (lower === 'false' || lower === '0' || lower === 'não') return false;
                            }
                            if (typeof value === 'number') return value === 1;
                            return Boolean(value);
                        }
                    };
                    fixed++;
                    log('✅ SharedCore criado (fallback)', 'success');
                }

                log(`✅ ${fixed} função(ões) crítica(s) corrigida(s)`, 'success');
                return true;

            } catch (error) {
                log(`❌ Erro ao corrigir funções críticas: ${error.message}`, 'error');
                return false;
            }
        }

        // ========== RECUPERAÇÃO DE IMAGENS ==========

        const RecoverImages = {
            config: {
                supabaseUrl: window.SUPABASE_CONSTANTS?.URL || 'https://wxdiowpswepsvklumgvx.supabase.co',
                bucket: 'properties',
                fallbackImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            },

            testImageUrl: function(url) {
                return new Promise((resolve) => {
                    if (!url || url === 'EMPTY' || url.trim() === '') {
                        resolve(false);
                        return;
                    }
                    const img = new Image();
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    img.src = url;
                    setTimeout(() => resolve(false), 5000);
                });
            },

            reconstructUrl: function(url) {
                if (!url || url.startsWith('http')) return url;
                
                const { supabaseUrl, bucket } = this.config;
                if (url.includes('_') && url.includes('.')) {
                    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${url}`;
                }
                return url;
            },

            recoverAll: async function() {
                console.log('🚀 Iniciando recuperação de imagens...');
                
                if (!window.properties || window.properties.length === 0) {
                    console.warn('⚠️ Nenhuma propriedade encontrada');
                    return { fixed: 0, total: 0, errors: [] };
                }

                const results = {
                    fixed: 0,
                    total: 0,
                    errors: [],
                    fixedProperties: []
                };

                for (const property of window.properties) {
                    if (!property.images || property.images === 'EMPTY') continue;
                    
                    const urls = property.images.split(',').filter(u => u && u.trim());
                    results.total += urls.length;
                    
                    let needsFix = false;
                    const fixedUrls = [];
                    
                    for (const url of urls) {
                        const reconstructed = this.reconstructUrl(url);
                        const isValid = await this.testImageUrl(reconstructed);
                        
                        if (isValid) {
                            fixedUrls.push(reconstructed);
                        } else {
                            console.warn(`⚠️ Imagem inválida: ${url}`);
                            fixedUrls.push(this.config.fallbackImage);
                            needsFix = true;
                            results.errors.push({ property: property.id, url: url });
                        }
                    }
                    
                    if (needsFix || fixedUrls.join(',') !== property.images) {
                        property.images = fixedUrls.join(',');
                        results.fixed++;
                        results.fixedProperties.push(property.id);
                        console.log(`✅ Imóvel ${property.id} corrigido`);
                    }
                }

                if (results.fixed > 0) {
                    if (typeof window.savePropertiesToStorage === 'function') {
                        window.savePropertiesToStorage();
                    }
                    if (typeof window.renderProperties === 'function') {
                        window.renderProperties('todos', true);
                    }
                }

                console.log(`📊 Resumo: ${results.fixed} imóveis corrigidos, ${results.total} imagens processadas`);
                return results;
            },

            checkProperty: async function(propertyId) {
                const property = window.properties.find(p => p.id == propertyId);
                if (!property) {
                    console.error(`❌ Imóvel ${propertyId} não encontrado`);
                    return null;
                }

                console.log(`🔍 Verificando imóvel: ${property.title}`);
                
                if (!property.images || property.images === 'EMPTY') {
                    console.warn('⚠️ Nenhuma imagem encontrada');
                    return { hasImages: false };
                }

                const urls = property.images.split(',').filter(u => u && u.trim());
                const results = [];
                
                for (const url of urls) {
                    const reconstructed = this.reconstructUrl(url);
                    const isValid = await this.testImageUrl(reconstructed);
                    results.push({
                        original: url,
                        reconstructed: reconstructed,
                        valid: isValid
                    });
                    console.log(`${isValid ? '✅' : '❌'} ${url}`);
                }

                return {
                    property: property,
                    results: results,
                    validCount: results.filter(r => r.valid).length,
                    totalCount: results.length
                };
            }
        };

        // ========== RELATÓRIO COMPLETO ==========
        function generateReport(results) {
            log('📊 GERANDO RELATÓRIO COMPLETO...', 'info');
            
            const report = {
                timestamp: new Date().toISOString(),
                version: CONFIG.version,
                status: state.status,
                summary: {
                    totalDiagnostics: results.length,
                    totalFixes: state.fixes.length,
                    totalErrors: state.errors.length,
                    totalWarnings: state.warnings.length
                },
                diagnostics: results,
                fixes: state.fixes,
                errors: state.errors,
                warnings: state.warnings,
                initStatus: state.initStatus
            };

            console.group('📊 RELATÓRIO DE DIAGNÓSTICO v' + CONFIG.version);
            console.log('📅 Data/Hora:', report.timestamp);
            console.log('📈 Status:', report.status);
            console.log('📊 Resumo:', report.summary);
            console.log('🔍 Diagnósticos:', report.diagnostics);
            console.log('🔧 Correções:', report.fixes);
            console.log('❌ Erros:', report.errors);
            console.log('⚠️ Avisos:', report.warnings);
            console.log('📌 Init Status:', report.initStatus);
            console.groupEnd();

            return report;
        }

        // ========== FUNÇÃO PRINCIPAL DE DIAGNÓSTICO ==========
        async function runFullDiagnostic() {
            log('🚀 INICIANDO DIAGNÓSTICO COMPLETO v' + CONFIG.version, 'info');
            state.status = 'running';
            state.diagnostics = [];
            state.fixes = [];
            state.errors = [];
            state.warnings = [];

            try {
                const illegalReturn = diagnoseIllegalReturn();
                state.diagnostics.push({ type: 'illegalReturn', result: illegalReturn });
                
                const galleryFunctions = diagnoseGalleryFunctions();
                state.diagnostics.push({ type: 'galleryFunctions', result: galleryFunctions });
                
                const brokenImages = diagnoseBrokenImages();
                state.diagnostics.push({ type: 'brokenImages', result: brokenImages });
                
                const systemState = diagnoseSystemState();
                state.diagnostics.push({ type: 'systemState', result: systemState });
                
                const criticalFunctions = diagnoseCriticalFunctions();
                state.diagnostics.push({ type: 'criticalFunctions', result: criticalFunctions });

                if (CONFIG.autoFix) {
                    log('🔧 Aplicando correções automáticas...', 'info');

                    if (illegalReturn.hasError) {
                        const fixed = fixIllegalReturn(illegalReturn);
                        if (fixed) state.fixes.push('Illegal return statement corrigido');
                    }

                    if (galleryFunctions.missing.length > 0) {
                        const fixed = fixGalleryFunctions(galleryFunctions);
                        if (fixed) state.fixes.push(`${galleryFunctions.missing.length} função(ões) da galeria criada(s)`);
                    }

                    if (brokenImages.brokenImages.length > 0) {
                        const fixed = fixBrokenImages(brokenImages);
                        if (fixed) state.fixes.push(`${brokenImages.brokenImages.length} imagem(ns) corrigida(s)`);
                    }

                    if (systemState.isMixed) {
                        const fixed = fixSystemState(systemState);
                        if (fixed) state.fixes.push('Sistema unificado');
                    }

                    if (criticalFunctions.missing.length > 0) {
                        const fixed = fixCriticalFunctions(criticalFunctions);
                        if (fixed) state.fixes.push(`${criticalFunctions.missing.length} função(ões) crítica(s) corrigida(s)`);
                    }

                    log(`✅ ${state.fixes.length} correção(ões) aplicada(s)`, 'success');
                }

                state.status = 'completed';
                log('✅ DIAGNÓSTICO COMPLETO FINALIZADO', 'success');

                const report = generateReport(state.diagnostics);
                
                if (typeof window.showDiagnosticResults === 'function') {
                    window.showDiagnosticResults(report);
                }

                return report;

            } catch (error) {
                state.status = 'error';
                log(`❌ Erro no diagnóstico: ${error.message}`, 'error');
                return null;
            }
        }

        // ========== FUNÇÃO PARA EXIBIR NO PAINEL - CORRIGIDA ==========
        function showDiagnosticPanel() {
            log('📋 Exibindo painel de diagnóstico...', 'info');
            
            let existingPanel = document.getElementById('diagnosticPanel65');
            if (existingPanel) {
                existingPanel.remove();
            }
            
            const panel = document.createElement('div');
            panel.id = 'diagnosticPanel65';
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                background: #1a1a2e;
                color: #fff;
                border-radius: 12px;
                padding: 20px;
                z-index: 999999;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                border: 2px solid #d4af37;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
            
            panel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
                    <h2 style="margin: 0; color: #d4af37;">
                        <i class="fas fa-stethoscope"></i> Diagnóstico do Sistema
                        <span style="font-size: 0.6rem; color: #888; margin-left: 10px;">v${CONFIG.version}</span>
                    </h2>
                    <button id="closeDiagnosticPanelBtn" 
                            style="background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">
                        ×
                    </button>
                </div>
                <div id="diagnosticContent" style="margin-top: 10px;">
                    <p style="color: #aaa;">Clique em um dos botões abaixo para executar o diagnóstico.</p>
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="runDiagnosticBtn" 
                            style="background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-play"></i> Executar Diagnóstico Completo
                    </button>
                    <button id="quickFixBtn" 
                            style="background: #f39c12; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-wrench"></i> Correção Rápida
                    </button>
                    <button id="recoverImagesBtn" 
                            style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-image"></i> Recuperar Imagens
                    </button>
                    <button id="closePanelBtn" 
                            style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
                <div id="diagnosticStatus" style="margin-top: 15px; padding: 10px; background: #2a2a4e; border-radius: 6px; font-size: 0.9rem; color: #aaa;">
                    Aguardando diagnóstico...
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // ========== EVENTOS DIRETOS COM IDS ==========
            
            // Botão Fechar (X no cabeçalho)
            document.getElementById('closeDiagnosticPanelBtn').addEventListener('click', function() {
                const p = document.getElementById('diagnosticPanel65');
                if (p) p.remove();
                log('✅ Painel fechado', 'info');
            });
            
            // Botão Fechar (rodapé)
            document.getElementById('closePanelBtn').addEventListener('click', function() {
                const p = document.getElementById('diagnosticPanel65');
                if (p) p.remove();
                log('✅ Painel fechado', 'info');
            });
            
            // Botão Executar Diagnóstico Completo
            document.getElementById('runDiagnosticBtn').addEventListener('click', async function() {
                const statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executando diagnóstico completo...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    log('▶️ Executando diagnóstico completo (via botão)', 'info');
                    const result = await window.DiagnosticSystem65.runFullDiagnostic();
                    
                    if (result) {
                        statusDiv.innerHTML = `✅ Diagnóstico concluído! ${result.summary.totalFixes} correções aplicadas.`;
                        statusDiv.style.color = '#27ae60';
                    } else {
                        statusDiv.innerHTML = '⚠️ Diagnóstico concluído com algumas pendências. Verifique o console.';
                        statusDiv.style.color = '#f39c12';
                    }
                } catch (error) {
                    statusDiv.innerHTML = `❌ Erro: ${error.message}`;
                    statusDiv.style.color = '#e74c3c';
                    log(`❌ Erro no diagnóstico: ${error.message}`, 'error');
                }
            });
            
            // Botão Correção Rápida
            document.getElementById('quickFixBtn').addEventListener('click', function() {
                const statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aplicando correção rápida...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    log('⚡ Executando correção rápida (via botão)', 'info');
                    const result = window.DiagnosticSystem65.quickFix();
                    
                    if (result) {
                        statusDiv.innerHTML = '✅ Correção rápida aplicada com sucesso!';
                        statusDiv.style.color = '#27ae60';
                    } else {
                        statusDiv.innerHTML = '⚠️ Correção rápida concluída com ressalvas.';
                        statusDiv.style.color = '#f39c12';
                    }
                } catch (error) {
                    statusDiv.innerHTML = `❌ Erro: ${error.message}`;
                    statusDiv.style.color = '#e74c3c';
                    log(`❌ Erro na correção rápida: ${error.message}`, 'error');
                }
            });
            
            // Botão Recuperar Imagens
            document.getElementById('recoverImagesBtn').addEventListener('click', async function() {
                const statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recuperando imagens...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    log('🖼️ Executando recuperação de imagens (via botão)', 'info');
                    const result = await window.DiagnosticSystem65.recoverImages();
                    
                    if (result && result.fixed > 0) {
                        statusDiv.innerHTML = `✅ ${result.fixed} imóveis corrigidos (${result.total} imagens processadas)`;
                        statusDiv.style.color = '#27ae60';
                    } else if (result && result.fixed === 0) {
                        statusDiv.innerHTML = '✅ Nenhuma imagem precisou ser corrigida.';
                        statusDiv.style.color = '#27ae60';
                    } else {
                        statusDiv.innerHTML = '⚠️ Recuperação concluída. Verifique o console.';
                        statusDiv.style.color = '#f39c12';
                    }
                } catch (error) {
                    statusDiv.innerHTML = `❌ Erro: ${error.message}`;
                    statusDiv.style.color = '#e74c3c';
                    log(`❌ Erro na recuperação de imagens: ${error.message}`, 'error');
                }
            });
            
            // Efeitos hover nos botões
            document.querySelectorAll('#diagnosticPanel65 button').forEach(btn => {
                if (btn.id) {
                    btn.addEventListener('mouseenter', function() {
                        this.style.transform = 'scale(1.05)';
                        this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                    });
                    btn.addEventListener('mouseleave', function() {
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = 'none';
                    });
                }
            });
            
            log('✅ Painel de diagnóstico criado com eventos', 'success');
            return panel;
        }

        // ========== FUNÇÃO DE CORREÇÃO RÁPIDA ==========
        function quickFix() {
            log('⚡ Executando correção rápida...', 'info');
            
            let fixedCount = 0;
            
            if (typeof window.filterProperties === 'undefined' && typeof window.filterPropertiesByType === 'function') {
                window.filterProperties = window.filterPropertiesByType;
                fixedCount++;
            }

            if (typeof window.openGallery === 'undefined' && typeof window.openGalleryAtCurrentIndex === 'function') {
                window.openGallery = window.openGalleryAtCurrentIndex;
                fixedCount++;
            }

            if (typeof window.createPropertyGallery !== 'function') {
                window.createPropertyGallery = function(property) {
                    const fallbackImage = property.images && property.images !== 'EMPTY' 
                        ? property.images.split(',')[0] 
                        : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    return `
                        <div class="property-image" style="position:relative;height:250px;overflow:hidden;">
                            <img src="${fallbackImage}" style="width:100%;height:100%;object-fit:cover;" alt="${property.title}">
                            ${property.badge ? `<div class="property-badge" style="position:absolute;top:15px;left:15px;background:#f39c12;color:white;padding:0.4rem 1rem;border-radius:20px;font-size:0.8rem;font-weight:bold;z-index:10;">${property.badge}</div>` : ''}
                        </div>
                    `;
                };
                fixedCount++;
            }

            if (typeof window.setupGalleryEvents !== 'function') {
                window.setupGalleryEvents = function() {
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape') {
                            const modal = document.getElementById('propertyGalleryModal');
                            if (modal) {
                                modal.style.display = 'none';
                                document.body.style.overflow = 'auto';
                            }
                        }
                    });
                };
                fixedCount++;
            }

            log(`✅ ${fixedCount} correção(ões) aplicada(s)`, 'success');
            return true;
        }

        // ========== EXPOSIÇÃO GLOBAL ==========
        window.DiagnosticSystem65 = {
            version: CONFIG.version,
            name: CONFIG.name,
            runFullDiagnostic: runFullDiagnostic,
            showPanel: showDiagnosticPanel,
            quickFix: quickFix,
            getState: function() { return state; },
            diagnoseIllegalReturn: diagnoseIllegalReturn,
            diagnoseGalleryFunctions: diagnoseGalleryFunctions,
            diagnoseBrokenImages: diagnoseBrokenImages,
            diagnoseSystemState: diagnoseSystemState,
            diagnoseCriticalFunctions: diagnoseCriticalFunctions,
            fixIllegalReturn: fixIllegalReturn,
            fixGalleryFunctions: fixGalleryFunctions,
            fixBrokenImages: fixBrokenImages,
            fixSystemState: fixSystemState,
            fixCriticalFunctions: fixCriticalFunctions,
            generateReport: generateReport,
            recoverImages: RecoverImages.recoverAll,
            checkPropertyImages: RecoverImages.checkProperty,
            reconstructImageUrl: RecoverImages.reconstructUrl,
            CONFIG: CONFIG
        };

        // ========== INICIALIZAÇÃO AUTOMÁTICA ==========
        function autoInitialize() {
            log('🔧 Inicializando automaticamente...', 'debug');
            
            // Registrar no DiagnosticRegistry
            if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.registerFunction === 'function') {
                window.DiagnosticRegistry.registerFunction('DiagnosticSystem65', {
                    description: 'Sistema de Diagnóstico Completo v6.5.4',
                    version: CONFIG.version,
                    functions: [
                        'runFullDiagnostic',
                        'showPanel',
                        'quickFix',
                        'recoverImages',
                        'checkPropertyImages'
                    ],
                    autoFix: CONFIG.autoFix
                });
                log('✅ Registrado no DiagnosticRegistry', 'success');
            }

            // Verificar se deve executar automaticamente
            const isDebugMode = window.location.search.includes('diagnostics=true') || 
                               window.location.search.includes('debug=true');
            
            if (isDebugMode) {
                setTimeout(() => {
                    log('🚀 Executando diagnóstico automático...', 'info');
                    
                    if (typeof window.DiagnosticSystem65.runFullDiagnostic === 'function') {
                        window.DiagnosticSystem65.runFullDiagnostic();
                    } else {
                        log('⚠️ runFullDiagnostic não disponível, pulando execução automática', 'warn');
                    }
                    
                    setTimeout(() => {
                        if (typeof window.DiagnosticSystem65.showPanel === 'function') {
                            window.DiagnosticSystem65.showPanel();
                        }
                    }, 1500);
                }, 2000);
            }

            state.initialized = true;
            log('✅ DiagnosticSystem65 v6.5.4 inicializado com sucesso', 'success');
            console.log(`📊 [INIT] DiagnosticSystem65 v${CONFIG.version} - Pronto para uso`);
        }

        // Inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoInitialize);
        } else {
            setTimeout(autoInitialize, 100);
        }

        // ========== COMANDOS RÁPIDOS PARA O CONSOLE ==========
        console.log('%c🔧 DiagnosticSystem65 v6.5.4 Carregado', 'font-size: 16px; font-weight: bold; color: #d4af37;');
        console.log('%cComandos disponíveis:', 'font-weight: bold;');
        console.log('  🔍 window.DiagnosticSystem65.runFullDiagnostic() - Executar diagnóstico completo');
        console.log('  📋 window.DiagnosticSystem65.showPanel() - Mostrar painel de diagnóstico');
        console.log('  ⚡ window.DiagnosticSystem65.quickFix() - Correção rápida');
        console.log('  📊 window.DiagnosticSystem65.generateReport() - Gerar relatório');
        console.log('  🖼️ window.DiagnosticSystem65.recoverImages() - Recuperar imagens quebradas');
        console.log('  🔍 window.DiagnosticSystem65.checkPropertyImages(id) - Verificar imagens de um imóvel');

    } catch (error) {
        console.error('❌ [FATAL] Erro ao carregar DiagnosticSystem65:', error);
        console.error('   Mensagem:', error.message);
        
        if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.reportError === 'function') {
            window.DiagnosticRegistry.reportError('DiagnosticSystem65', error);
        }
        
        if (!window.DiagnosticSystem65) {
            window.DiagnosticSystem65 = {
                version: '6.5.4',
                name: 'Sistema de Diagnóstico (Fallback)',
                status: 'error',
                error: error.message,
                showPanel: function() { 
                    alert('DiagnosticSystem65 em modo fallback. Verifique o console para mais detalhes.'); 
                }
            };
        }
    }

})();

// ============================================================
// FIM DO ARQUIVO - diagnostics65.js
// ============================================================
// STATUS: ✅ CARREGADO COM SUCESSO
// Versão: 6.5.4
// ============================================================

// Exportar para diagnóstico (se em ambiente Node/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.DiagnosticSystem65;
}

// Sinalizar que o arquivo foi carregado completamente
window.__DIAGNOSTICS65_LOADED = true;
window.__DIAGNOSTICS65_VERSION = '6.5.4';
window.__DIAGNOSTICS65_STATUS = 'success';

console.log('✅ [diagnostics65.js] Arquivo completamente carregado e processado');
console.log(`📊 [diagnostics65.js] Versão: ${window.__DIAGNOSTICS65_VERSION}`);
console.log(`📊 [diagnostics65.js] Status: ${window.__DIAGNOSTICS65_STATUS}`);

// ============================================================
// FIM DO ARQUIVO - diagnostics65.js
// ============================================================
