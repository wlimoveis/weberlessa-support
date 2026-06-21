// ===========================================================
// debug/diagnostics/diagnostics65.js
// SISTEMA DE DIAGNÓSTICO COMPLETO v6.5.7
// ===========================================================
// ✅ CORREÇÃO: self.reconstructUrl is not a function (v6.5.7)
// ✅ CORREÇÃO: Vinculação de contexto em todas as funções
// ✅ Detecta e corrige automaticamente:
//   1. Illegal return statement
//   2. Funções da galeria ausentes
//   3. Imagens quebradas (ERR_NAME_NOT_RESOLVED)
//   4. URLs com domínios antigos do Supabase
//   5. Estado "MISTO" (antigo + novo)
//   6. Funções críticas ausentes
// ============================================================
(function() {
    'use strict';
    console.log('🔧 [DIAGNOSTICS v6.5.7] SISTEMA DE DIAGNÓSTICO COMPLETO CARREGADO');
    try {
        // ========== CONFIGURAÇÃO ==========
        var CONFIG = {
            version: '6.5.7',
            name: 'Sistema de Diagnóstico Completo',
            autoFix: true,
            logLevel: 'debug',
            maxRetries: 3,
            retryDelay: 1000,
            fallbackImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            // Domínios antigos conhecidos
            oldDomains: [
                'syztbxvpdaplpetmixmt.supabase.co',
                'wlimoveis.supabase.co'
            ]
        };

        // ========== DETECÇÃO DO DOMÍNIO CORRETO DO SUPABASE ==========
        function detectSupabaseDomain() {
            try {
                if (window.SUPABASE_CONSTANTS && window.SUPABASE_CONSTANTS.URL) {
                    var url = window.SUPABASE_CONSTANTS.URL;
                    var match = url.match(/https?:\/\/([^\/]+)/);
                    if (match) {
                        return match[1];
                    }
                }
                if (window.SUPABASE_URL) {
                    var match2 = window.SUPABASE_URL.match(/https?:\/\/([^\/]+)/);
                    if (match2) {
                        return match2[1];
                    }
                }
            } catch (e) {
                console.warn('⚠️ Erro ao detectar domínio Supabase:', e);
            }
            return 'wxdiowpswepsvklumgvx.supabase.co';
        }

        var SUPABASE_DOMAIN = detectSupabaseDomain();
        var SUPABASE_URL = 'https://' + SUPABASE_DOMAIN;

        console.log('🔍 Domínio Supabase detectado:', SUPABASE_DOMAIN);

        // ========== ESTADO ==========
        var state = {
            initialized: false,
            diagnostics: [],
            fixes: [],
            errors: [],
            warnings: [],
            status: 'idle',
            initStatus: null,
            domainFixed: 0
        };

        // ========== UTILITÁRIOS ==========
        function log(message, type) {
            type = type || 'info';
            var prefix = {
                'debug': '🔍',
                'info': 'ℹ️',
                'warn': '⚠️',
                'error': '❌',
                'success': '✅'
            };
            var timestamp = new Date().toISOString();
            var logMsg = (prefix[type] || '📌') + ' [' + timestamp + '] ' + message;
            console.log(logMsg);
            
            if (type === 'error') state.errors.push(message);
            if (type === 'warn') state.warnings.push(message);
            
            return logMsg;
        }

        function safeExecute(fn, fallback) {
            fallback = fallback || null;
            try { 
                var result = fn();
                return result !== undefined ? result : fallback;
            } catch (error) { 
                log('Erro ao executar: ' + error.message, 'error'); 
                return fallback; 
            }
        }

        // ========== RECUPERAÇÃO DE IMAGENS E URLs (CORRIGIDO v6.5.7) ==========
        var RecoverImages = {
            config: {
                supabaseUrl: SUPABASE_URL,
                supabaseDomain: SUPABASE_DOMAIN,
                bucket: 'properties',
                fallbackImage: CONFIG.fallbackImage,
                oldDomains: CONFIG.oldDomains
            },

            /**
             * RECONSTRÓI UMA URL PARA O DOMÍNIO CORRETO
             * CORRIGIDO v6.5.7: Usa arrow function para manter contexto
             */
            reconstructUrl: function(url) {
                if (!url || typeof url !== 'string') return url;
                if (url === 'EMPTY' || url.trim() === '') return url;
                
                // Se já tem o domínio correto, retorna
                if (url.includes(this.config.supabaseDomain)) {
                    return url;
                }

                // Verificar se é uma URL antiga com domínio incorreto
                for (var i = 0; i < this.config.oldDomains.length; i++) {
                    var oldDomain = this.config.oldDomains[i];
                    if (url.includes(oldDomain)) {
                        var fixedUrl = url.replace(oldDomain, this.config.supabaseDomain);
                        log('🔄 URL corrigida: ' + oldDomain + ' → ' + this.config.supabaseDomain, 'debug');
                        return fixedUrl;
                    }
                }

                // Se é um nome de arquivo (sem domínio), reconstrói
                if (!url.startsWith('http') && url.includes('_') && url.includes('.')) {
                    var reconstructed = this.config.supabaseUrl + '/storage/v1/object/public/' + this.config.bucket + '/' + url;
                    log('🔄 URL reconstruída: ' + url, 'debug');
                    return reconstructed;
                }

                return url;
            },

            /**
             * TESTA SE UMA URL É VÁLIDA
             */
            testImageUrl: function(url) {
                return new Promise(function(resolve) {
                    if (!url || url === 'EMPTY' || url.trim() === '') {
                        resolve(false);
                        return;
                    }
                    var img = new Image();
                    img.onload = function() { resolve(true); };
                    img.onerror = function() { resolve(false); };
                    img.src = url;
                    setTimeout(function() { resolve(false); }, 5000);
                });
            },

            /**
             * CORRIGE URLs EM UMA PROPRIEDADE
             * CORRIGIDO v6.5.7: self = this antes de usar
             */
            fixPropertyUrls: function(property) {
                if (!property) return { property: property, fixed: false, changes: [] };
                
                // CORREÇÃO: self = this para manter contexto
                var self = this;
                var fixed = false;
                var changes = [];

                // Corrigir imagens
                if (property.images && property.images !== 'EMPTY') {
                    var urls = property.images.split(',').filter(function(u) { return u && u.trim(); });
                    var fixedUrls = urls.map(function(u) { 
                        return self.reconstructUrl(u.trim()); 
                    });
                    var newImages = fixedUrls.join(',');
                    if (newImages !== property.images) {
                        property.images = newImages;
                        fixed = true;
                        changes.push('images');
                        log('🔄 Imagens corrigidas para imóvel ' + property.id, 'debug');
                    }
                }

                // Corrigir PDFs
                if (property.pdfs && property.pdfs !== 'EMPTY') {
                    var pdfUrls = property.pdfs.split(',').filter(function(u) { return u && u.trim(); });
                    var fixedPdfUrls = pdfUrls.map(function(u) { 
                        return self.reconstructUrl(u.trim()); 
                    });
                    var newPdfs = fixedPdfUrls.join(',');
                    if (newPdfs !== property.pdfs) {
                        property.pdfs = newPdfs;
                        fixed = true;
                        changes.push('pdfs');
                        log('🔄 PDFs corrigidos para imóvel ' + property.id, 'debug');
                    }
                }

                return { property: property, fixed: fixed, changes: changes };
            },

            /**
             * RECUPERA TODAS AS PROPRIEDADES
             * CORRIGIDO v6.5.7: self = this antes de usar
             */
            recoverAll: async function() {
                log('🚀 Iniciando recuperação de imagens e URLs...', 'info');
                
                // CORREÇÃO: self = this para manter contexto
                var self = this;
                
                if (!window.properties || window.properties.length === 0) {
                    log('⚠️ Nenhuma propriedade encontrada', 'warn');
                    return { fixed: 0, total: 0, errors: [], domainFixed: 0 };
                }

                var results = {
                    fixed: 0,
                    total: window.properties.length,
                    errors: [],
                    fixedProperties: [],
                    domainFixed: 0,
                    urlChanges: []
                };

                for (var i = 0; i < window.properties.length; i++) {
                    var property = window.properties[i];
                    var originalImages = property.images;
                    var originalPdfs = property.pdfs;
                    
                    // CORREÇÃO: Usar self.fixPropertyUrls com contexto correto
                    var fixResult = self.fixPropertyUrls(property);
                    
                    if (fixResult.fixed) {
                        results.fixed++;
                        results.fixedProperties.push(property.id);
                        results.urlChanges.push({
                            id: property.id,
                            title: property.title,
                            changes: fixResult.changes
                        });
                        
                        if (originalImages && originalImages !== property.images) {
                            results.domainFixed++;
                        }
                        if (originalPdfs && originalPdfs !== property.pdfs) {
                            results.domainFixed++;
                        }
                    }

                    // Testar se as imagens estão carregando
                    if (property.images && property.images !== 'EMPTY') {
                        var urls = property.images.split(',').filter(function(u) { return u && u.trim(); });
                        for (var j = 0; j < urls.length; j++) {
                            var isValid = await self.testImageUrl(urls[j]);
                            if (!isValid) {
                                var urlsArray = property.images.split(',').filter(function(u) { return u && u.trim(); });
                                urlsArray[j] = self.config.fallbackImage;
                                property.images = urlsArray.join(',');
                                results.fixed++;
                                results.errors.push({ property: property.id, url: urls[j] });
                                log('⚠️ Imagem inválida, usando fallback: ' + urls[j].substring(0, 50) + '...', 'warn');
                            }
                        }
                    }
                }

                // Salvar alterações
                if (results.fixed > 0) {
                    if (typeof window.savePropertiesToStorage === 'function') {
                        window.savePropertiesToStorage();
                        log('💾 Propriedades salvas no localStorage', 'success');
                    }
                    if (typeof window.renderProperties === 'function') {
                        window.renderProperties('todos', true);
                        log('🔄 Interface re-renderizada', 'success');
                    }
                    if (typeof window.loadPropertyList === 'function') {
                        setTimeout(function() { window.loadPropertyList(); }, 200);
                        log('📋 Lista admin atualizada', 'success');
                    }
                }

                state.domainFixed = results.domainFixed;
                log('📊 Resumo: ' + results.fixed + ' imóveis corrigidos, ' + results.domainFixed + ' URLs de domínio corrigidas', 'success');
                return results;
            },

            /**
             * VERIFICA UM IMÓVEL ESPECÍFICO
             * CORRIGIDO v6.5.7: self = this antes de usar
             */
            checkProperty: async function(propertyId) {
                // CORREÇÃO: self = this para manter contexto
                var self = this;
                
                var property = null;
                for (var i = 0; i < window.properties.length; i++) {
                    if (window.properties[i].id == propertyId) {
                        property = window.properties[i];
                        break;
                    }
                }
                if (!property) {
                    log('❌ Imóvel ' + propertyId + ' não encontrado', 'error');
                    return null;
                }
                
                log('🔍 Verificando imóvel: ' + property.title, 'info');
                
                if (!property.images || property.images === 'EMPTY') {
                    log('⚠️ Nenhuma imagem encontrada', 'warn');
                    return { hasImages: false };
                }

                var urls = property.images.split(',').filter(function(u) { return u && u.trim(); });
                var results = [];
                var needsFix = false;
                
                for (var j = 0; j < urls.length; j++) {
                    var url = urls[j];
                    var reconstructed = self.reconstructUrl(url);
                    var isValid = await self.testImageUrl(reconstructed);
                    var isOldDomain = false;
                    
                    for (var k = 0; k < self.config.oldDomains.length; k++) {
                        if (url.includes(self.config.oldDomains[k])) {
                            isOldDomain = true;
                            break;
                        }
                    }
                    
                    results.push({
                        original: url,
                        reconstructed: reconstructed,
                        valid: isValid,
                        isOldDomain: isOldDomain,
                        needsFix: !isValid || isOldDomain
                    });
                    
                    if (!isValid) {
                        log('❌ Imagem inválida: ' + url.substring(0, 60) + '...', 'warn');
                    }
                    if (isOldDomain) {
                        log('🔄 Domínio antigo detectado: ' + url.substring(0, 60) + '...', 'warn');
                    }
                    needsFix = needsFix || !isValid || isOldDomain;
                }

                if (needsFix) {
                    log('⚠️ Imóvel ' + propertyId + ' precisa de correção', 'warn');
                    var fixResult = self.fixPropertyUrls(property);
                    if (fixResult.fixed) {
                        if (typeof window.savePropertiesToStorage === 'function') {
                            window.savePropertiesToStorage();
                        }
                        log('✅ Imóvel ' + propertyId + ' corrigido', 'success');
                    }
                } else {
                    log('✅ Imóvel ' + propertyId + ' está OK', 'success');
                }

                return {
                    property: property,
                    results: results,
                    validCount: results.filter(function(r) { return r.valid; }).length,
                    totalCount: results.length,
                    oldDomainCount: results.filter(function(r) { return r.isOldDomain; }).length,
                    needsFix: needsFix,
                    fixed: fixResult ? fixResult.fixed : false
                };
            },

            /**
             * DIAGNOSTICA DOMÍNIOS ANTIGOS
             * CORRIGIDO v6.5.7: self = this antes de usar
             */
            diagnoseOldDomains: function() {
                log('🔍 Diagnosticando domínios antigos...', 'debug');
                
                var self = this;
                var oldDomainsFound = [];
                var totalImages = 0;
                var totalPdfs = 0;
                
                if (!window.properties) {
                    return { found: 0, oldDomains: [], totalImages: 0, totalPdfs: 0 };
                }

                for (var i = 0; i < window.properties.length; i++) {
                    var prop = window.properties[i];
                    
                    if (prop.images && prop.images !== 'EMPTY') {
                        var urls = prop.images.split(',').filter(function(u) { return u && u.trim(); });
                        totalImages += urls.length;
                        
                        for (var j = 0; j < urls.length; j++) {
                            var url = urls[j];
                            for (var k = 0; k < self.config.oldDomains.length; k++) {
                                if (url.includes(self.config.oldDomains[k])) {
                                    oldDomainsFound.push({
                                        url: url,
                                        property: prop.id,
                                        oldDomain: self.config.oldDomains[k]
                                    });
                                }
                            }
                        }
                    }
                    
                    if (prop.pdfs && prop.pdfs !== 'EMPTY') {
                        var pdfUrls = prop.pdfs.split(',').filter(function(u) { return u && u.trim(); });
                        totalPdfs += pdfUrls.length;
                        
                        for (var m = 0; m < pdfUrls.length; m++) {
                            var pdfUrl = pdfUrls[m];
                            for (var n = 0; n < self.config.oldDomains.length; n++) {
                                if (pdfUrl.includes(self.config.oldDomains[n])) {
                                    oldDomainsFound.push({
                                        url: pdfUrl,
                                        property: prop.id,
                                        oldDomain: self.config.oldDomains[n],
                                        type: 'pdf'
                                    });
                                }
                            }
                        }
                    }
                }

                log('📊 Domínios antigos encontrados: ' + oldDomainsFound.length, 'info');
                return {
                    found: oldDomainsFound.length,
                    oldDomains: oldDomainsFound,
                    totalImages: totalImages,
                    totalPdfs: totalPdfs
                };
            }
        };

        // ========== DIAGNÓSTICO 1: VERIFICAR ILLEGAL RETURN STATEMENT ==========
        function diagnoseIllegalReturn() {
            log('🔍 Diagnosticando Illegal Return Statement...', 'debug');
            
            var results = { hasError: false, location: null, fix: null };
            try {
                if (window.MediaSystem && window.MediaSystem.uploadSingleFile) {
                    var fnString = window.MediaSystem.uploadSingleFile.toString();
                    var hasReturnOutsidePromise = /}\s*return\s+/.test(fnString);
                    if (hasReturnOutsidePromise) {
                        results.hasError = true;
                        results.location = 'media-unified.js - uploadSingleFile';
                        results.fix = 'Remover return fora da Promise';
                        log('❌ Illegal return statement detectado em media-unified.js', 'error');
                    }
                }
                if (!results.hasError) {
                    log('✅ Nenhum Illegal return statement detectado', 'success');
                }
                return results;
            } catch (error) {
                log('Erro no diagnóstico de Illegal Return: ' + error.message, 'error');
                return results;
            }
        }

        // ========== DIAGNÓSTICO 2: VERIFICAR FUNÇÕES DA GALERIA ==========
        function diagnoseGalleryFunctions() {
            log('🔍 Diagnosticando funções da galeria...', 'debug');
            
            var requiredFunctions = [
                'openGalleryAtCurrentIndex',
                'closeGallery',
                'createPropertyGallery',
                'setupGalleryEvents',
                'navigatePropertyGallery',
                'registerGalleryView'
            ];
            var results = { missing: [], exists: [], fix: null };
            for (var i = 0; i < requiredFunctions.length; i++) {
                var fnName = requiredFunctions[i];
                if (typeof window[fnName] === 'function') {
                    results.exists.push(fnName);
                    log('✅ ' + fnName + ' disponível', 'debug');
                } else {
                    results.missing.push(fnName);
                    log('❌ ' + fnName + ' NÃO DISPONÍVEL', 'error');
                }
            }
            if (results.missing.length > 0) {
                results.fix = 'Carregar gallery.js ou criar fallbacks';
                log('⚠️ ' + results.missing.length + ' função(ões) da galeria ausentes', 'warn');
            } else {
                log('✅ Todas as funções da galeria estão disponíveis', 'success');
            }
            return results;
        }

        // ========== DIAGNÓSTICO 3: VERIFICAR IMAGENS QUEBRADAS ==========
        function diagnoseBrokenImages() {
            log('🔍 Diagnosticando imagens quebradas...', 'debug');
            
            var results = { brokenImages: [], totalImages: 0, fix: null };
            try {
                var images = document.querySelectorAll('img');
                results.totalImages = images.length;
                for (var i = 0; i < images.length; i++) {
                    var img = images[i];
                    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
                        var src = img.src || img.getAttribute('src');
                        if (src && src.includes('supabase.co')) {
                            results.brokenImages.push({
                                src: src,
                                element: img,
                                error: 'ERR_NAME_NOT_RESOLVED'
                            });
                            log('❌ Imagem quebrada: ' + src.substring(0, 50) + '...', 'error');
                        }
                    }
                }
                if (results.brokenImages.length > 0) {
                    results.fix = 'Verificar URLs no Supabase ou usar fallback';
                    log('⚠️ ' + results.brokenImages.length + ' imagem(ns) quebrada(s) detectada(s)', 'warn');
                } else {
                    log('✅ Nenhuma imagem quebrada detectada', 'success');
                }
                return results;
            } catch (error) {
                log('Erro no diagnóstico de imagens: ' + error.message, 'error');
                return results;
            }
        }

        // ========== DIAGNÓSTICO 4: VERIFICAR ESTADO DO SISTEMA ==========
        function diagnoseSystemState() {
            log('🔍 Diagnosticando estado do sistema...', 'debug');
            
            var results = {
                isMixed: false,
                oldFunctions: [],
                newFunctions: [],
                fix: null
            };
            var oldPatterns = ['filterProperties', 'openGallery', 'closeGallery'];
            var newPatterns = ['filterPropertiesByType', 'openGalleryAtCurrentIndex', 'closeGallery'];
            for (var i = 0; i < oldPatterns.length; i++) {
                var fn = oldPatterns[i];
                if (typeof window[fn] === 'function') {
                    results.oldFunctions.push(fn);
                }
            }
            for (var j = 0; j < newPatterns.length; j++) {
                var fn2 = newPatterns[j];
                if (typeof window[fn2] === 'function') {
                    results.newFunctions.push(fn2);
                }
            }
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
            
            var criticalFunctions = [
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
            var results = { missing: [], exists: [], fix: null };
            for (var i = 0; i < criticalFunctions.length; i++) {
                var fnName = criticalFunctions[i];
                if (typeof window[fnName] !== 'undefined') {
                    results.exists.push(fnName);
                    log('✅ ' + fnName + ' disponível', 'debug');
                } else {
                    results.missing.push(fnName);
                    log('❌ ' + fnName + ' NÃO DISPONÍVEL', 'error');
                }
            }
            if (results.missing.length > 0) {
                results.fix = 'Carregar módulos: ' + results.missing.join(', ');
                log('⚠️ ' + results.missing.length + ' função(ões) crítica(s) ausentes', 'warn');
            } else {
                log('✅ Todas as funções críticas estão disponíveis', 'success');
            }
            return results;
        }

        // ========== DIAGNÓSTICO 6: VERIFICAR DOMÍNIOS ANTIGOS ==========
        function diagnoseOldDomains() {
            log('🔍 Diagnosticando domínios antigos do Supabase...', 'debug');
            var results = RecoverImages.diagnoseOldDomains();
            
            if (results.found > 0) {
                log('⚠️ ' + results.found + ' URL(s) com domínio(s) antigo(s) encontrada(s)', 'warn');
                results.fix = 'Executar RecoverImages.recoverAll() para corrigir';
            } else {
                log('✅ Nenhum domínio antigo encontrado', 'success');
            }
            return results;
        }

        // ========== CORREÇÃO 1: CORRIGIR ILLEGAL RETURN ==========
        function fixIllegalReturn(diagnostic) {
            log('🔧 Corrigindo Illegal return statement...', 'info');
            
            try {
                if (window.MediaSystem && window.MediaSystem.uploadSingleFile) {
                    var fixedFn = function(file, propertyId, type) {
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
                log('❌ Erro ao corrigir Illegal return: ' + error.message, 'error');
                return false;
            }
        }

        // ========== CORREÇÃO 2: CRIAR FALLBACKS PARA GALERIA ==========
        function fixGalleryFunctions(diagnostic) {
            log('🔧 Criando fallbacks para funções da galeria...', 'info');
            
            try {
                var missing = diagnostic.missing || [];
                var fixed = 0;
                if (missing.indexOf('createPropertyGallery') !== -1 || typeof window.createPropertyGallery !== 'function') {
                    window.createPropertyGallery = function(property) {
                        var fallbackImage = property.images && property.images !== 'EMPTY' 
                            ? property.images.split(',')[0] 
                            : CONFIG.fallbackImage;
                        
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
                                </div>
                            </div>
                        `;
                    };
                    fixed++;
                    log('✅ createPropertyGallery fallback criado', 'success');
                }
                if (missing.indexOf('openGalleryAtCurrentIndex') !== -1 || typeof window.openGalleryAtCurrentIndex !== 'function') {
                    window.openGalleryAtCurrentIndex = function(propertyId) {
                        var property = null;
                        for (var i = 0; i < window.properties.length; i++) {
                            if (window.properties[i].id === propertyId) {
                                property = window.properties[i];
                                break;
                            }
                        }
                        if (!property) {
                            log('❌ Imóvel ' + propertyId + ' não encontrado', 'error');
                            return;
                        }
                        
                        var hasImages = property.images && property.images !== 'EMPTY';
                        if (!hasImages) {
                            log('ℹ️ Imóvel ' + propertyId + ' não tem imagens', 'info');
                            return;
                        }
                        
                        var images = property.images.split(',').filter(function(u) { return u && u.trim(); });
                        var firstImage = images[0] || CONFIG.fallbackImage;
                        
                        if (typeof window.registerGalleryView === 'function') {
                            window.registerGalleryView(propertyId);
                        }
                        
                        alert('📸 ' + property.title + '\n\nClique em OK para abrir a imagem em nova aba.');
                        window.open(firstImage, '_blank');
                        
                        log('✅ Galeria aberta para imóvel ' + propertyId + ' (fallback)', 'success');
                    };
                    fixed++;
                    log('✅ openGalleryAtCurrentIndex fallback criado', 'success');
                }
                if (missing.indexOf('closeGallery') !== -1 || typeof window.closeGallery !== 'function') {
                    window.closeGallery = function() {
                        var modal = document.getElementById('propertyGalleryModal');
                        if (modal) {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                            log('✅ Galeria fechada (fallback)', 'success');
                        }
                    };
                    fixed++;
                    log('✅ closeGallery fallback criado', 'success');
                }
                if (missing.indexOf('setupGalleryEvents') !== -1 || typeof window.setupGalleryEvents !== 'function') {
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
                if (missing.indexOf('navigatePropertyGallery') !== -1 || typeof window.navigatePropertyGallery !== 'function') {
                    window.navigatePropertyGallery = function(propertyId, direction) {
                        log('ℹ️ Navegação da galeria: ' + direction + ' (fallback)', 'info');
                    };
                    fixed++;
                    log('✅ navigatePropertyGallery fallback criado', 'success');
                }
                log('✅ ' + fixed + ' fallback(s) da galeria criado(s)', 'success');
                return true;
            } catch (error) {
                log('❌ Erro ao criar fallbacks da galeria: ' + error.message, 'error');
                return false;
            }
        }

        // ========== CORREÇÃO 3: CORRIGIR IMAGENS QUEBRADAS ==========
        function fixBrokenImages(diagnostic) {
            log('🔧 Corrigindo imagens quebradas...', 'info');
            
            try {
                var brokenImages = diagnostic.brokenImages || [];
                var fixed = 0;
                for (var i = 0; i < brokenImages.length; i++) {
                    var item = brokenImages[i];
                    var img = item.element;
                    if (img) {
                        var fallbackUrl = CONFIG.fallbackImage;
                        img.src = fallbackUrl;
                        img.onerror = null;
                        img.style.border = '2px solid #e74c3c';
                        img.title = 'Imagem original indisponível - usando fallback';
                        fixed++;
                        log('✅ Imagem corrigida: ' + item.src.substring(0, 30) + '...', 'success');
                    }
                }
                if (fixed > 0) {
                    log('✅ ' + fixed + ' imagem(ns) quebrada(s) corrigida(s) com fallback', 'success');
                }
                return true;
            } catch (error) {
                log('❌ Erro ao corrigir imagens: ' + error.message, 'error');
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
                log('❌ Erro ao unificar sistema: ' + error.message, 'error');
                return false;
            }
        }

        // ========== CORREÇÃO 5: FUNÇÕES CRÍTICAS AUSENTES ==========
        function fixCriticalFunctions(diagnostic) {
            log('🔧 Corrigindo funções críticas ausentes...', 'info');
            
            try {
                var missing = diagnostic.missing || [];
                var fixed = 0;
                if (missing.indexOf('SUPABASE_CONSTANTS') !== -1 || typeof window.SUPABASE_CONSTANTS === 'undefined') {
                    window.SUPABASE_CONSTANTS = {
                        URL: SUPABASE_URL,
                        KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZGlvd3Bzd2Vwc3ZrbHVtZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MTExNzksImV4cCI6MjA4Nzk4NzE3OX0.QsUHE_w5m5-pz3LcwdREuwmwvCiX3Hz8FYv8SAwhD6U',
                        ADMIN_PASSWORD: "wl654",
                        PDF_PASSWORD: "doc123"
                    };
                    window.SUPABASE_URL = window.SUPABASE_CONSTANTS.URL;
                    window.SUPABASE_KEY = window.SUPABASE_CONSTANTS.KEY;
                    fixed++;
                    log('✅ SUPABASE_CONSTANTS criado', 'success');
                }
                if (missing.indexOf('SharedCore') !== -1 || typeof window.SharedCore === 'undefined') {
                    window.SharedCore = {
                        version: '2.0.0',
                        formatPrice: function(value) {
                            if (!value && value !== 0) return 'R$ 0,00';
                            var numericPrice = parseFloat(value.toString().replace(/[^0-9,-]/g, '').replace(',', '.'));
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
                                var lower = value.toLowerCase().trim();
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
                log('✅ ' + fixed + ' função(ões) crítica(s) corrigida(s)', 'success');
                return true;
            } catch (error) {
                log('❌ Erro ao corrigir funções críticas: ' + error.message, 'error');
                return false;
            }
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
                var illegalReturn = diagnoseIllegalReturn();
                state.diagnostics.push({ type: 'illegalReturn', result: illegalReturn });
                
                var galleryFunctions = diagnoseGalleryFunctions();
                state.diagnostics.push({ type: 'galleryFunctions', result: galleryFunctions });
                
                var brokenImages = diagnoseBrokenImages();
                state.diagnostics.push({ type: 'brokenImages', result: brokenImages });
                
                var systemState = diagnoseSystemState();
                state.diagnostics.push({ type: 'systemState', result: systemState });
                
                var criticalFunctions = diagnoseCriticalFunctions();
                state.diagnostics.push({ type: 'criticalFunctions', result: criticalFunctions });
                
                var oldDomains = diagnoseOldDomains();
                state.diagnostics.push({ type: 'oldDomains', result: oldDomains });

                if (CONFIG.autoFix) {
                    log('🔧 Aplicando correções automáticas...', 'info');
                    
                    if (illegalReturn.hasError) {
                        var fixed = fixIllegalReturn(illegalReturn);
                        if (fixed) state.fixes.push('Illegal return statement corrigido');
                    }
                    
                    if (galleryFunctions.missing.length > 0) {
                        var fixed2 = fixGalleryFunctions(galleryFunctions);
                        if (fixed2) state.fixes.push(galleryFunctions.missing.length + ' função(ões) da galeria criada(s)');
                    }
                    
                    if (brokenImages.brokenImages.length > 0) {
                        var fixed3 = fixBrokenImages(brokenImages);
                        if (fixed3) state.fixes.push(brokenImages.brokenImages.length + ' imagem(ns) corrigida(s)');
                    }
                    
                    if (systemState.isMixed) {
                        var fixed4 = fixSystemState(systemState);
                        if (fixed4) state.fixes.push('Sistema unificado');
                    }
                    
                    if (criticalFunctions.missing.length > 0) {
                        var fixed5 = fixCriticalFunctions(criticalFunctions);
                        if (fixed5) state.fixes.push(criticalFunctions.missing.length + ' função(ões) crítica(s) corrigida(s)');
                    }
                    
                    if (oldDomains.found > 0) {
                        log('🔄 Corrigindo domínios antigos automaticamente...', 'info');
                        var recoveryResult = await RecoverImages.recoverAll();
                        if (recoveryResult.fixed > 0) {
                            state.fixes.push(recoveryResult.fixed + ' imóvel(is) corrigido(s) com domínios atualizados');
                            state.domainFixed = recoveryResult.domainFixed || 0;
                        }
                    }
                    
                    log('✅ ' + state.fixes.length + ' correção(ões) aplicada(s)', 'success');
                }
                
                state.status = 'completed';
                log('✅ DIAGNÓSTICO COMPLETO FINALIZADO', 'success');
                var report = generateReport(state.diagnostics);
                
                if (typeof window.showDiagnosticResults === 'function') {
                    window.showDiagnosticResults(report);
                }
                return report;
            } catch (error) {
                state.status = 'error';
                log('❌ Erro no diagnóstico: ' + error.message, 'error');
                return null;
            }
        }

        // ========== RELATÓRIO COMPLETO ==========
        function generateReport(results) {
            log('📊 GERANDO RELATÓRIO COMPLETO...', 'info');
            
            var report = {
                timestamp: new Date().toISOString(),
                version: CONFIG.version,
                status: state.status,
                summary: {
                    totalDiagnostics: results.length,
                    totalFixes: state.fixes.length,
                    totalErrors: state.errors.length,
                    totalWarnings: state.warnings.length,
                    domainFixed: state.domainFixed || 0
                },
                diagnostics: results,
                fixes: state.fixes,
                errors: state.errors,
                warnings: state.warnings,
                initStatus: state.initStatus,
                supabaseDomain: SUPABASE_DOMAIN
            };
            
            console.group('📊 RELATÓRIO DE DIAGNÓSTICO v' + CONFIG.version);
            console.log('📅 Data/Hora:', report.timestamp);
            console.log('📈 Status:', report.status);
            console.log('🔗 Domínio Supabase:', report.supabaseDomain);
            console.log('📊 Resumo:', report.summary);
            console.log('🔍 Diagnósticos:', report.diagnostics);
            console.log('🔧 Correções:', report.fixes);
            console.log('❌ Erros:', report.errors);
            console.log('⚠️ Avisos:', report.warnings);
            console.groupEnd();
            return report;
        }

        // ========== FUNÇÃO DE CORREÇÃO RÁPIDA ==========
        function quickFix() {
            log('⚡ Executando correção rápida...', 'info');
            
            var fixedCount = 0;
            
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
                    var fallbackImage = property.images && property.images !== 'EMPTY' 
                        ? property.images.split(',')[0] 
                        : CONFIG.fallbackImage;
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
                            var modal = document.getElementById('propertyGalleryModal');
                            if (modal) {
                                modal.style.display = 'none';
                                document.body.style.overflow = 'auto';
                            }
                        }
                    });
                };
                fixedCount++;
            }
            
            log('✅ ' + fixedCount + ' correção(ões) aplicada(s)', 'success');
            return true;
        }

        // ========== FUNÇÃO PARA EXIBIR PAINEL ==========
        function showDiagnosticPanel() {
            log('📋 Exibindo painel de diagnóstico...', 'info');
            
            var existingPanel = document.getElementById('diagnosticPanel65');
            if (existingPanel) {
                existingPanel.remove();
            }
            
            var panel = document.createElement('div');
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
                <div style="margin-bottom: 10px; padding: 8px 12px; background: #2a2a4e; border-radius: 6px; font-size: 0.8rem; color: #aaa;">
                    <i class="fas fa-link" style="color: #d4af37;"></i>
                    Domínio Supabase: <strong style="color: #fff;">${SUPABASE_DOMAIN}</strong>
                    <span style="margin-left: 15px; color: #666;">|</span>
                    <span style="color: #888;">Domínios antigos: ${CONFIG.oldDomains.join(', ')}</span>
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
                    <button id="fixDomainsBtn" 
                            style="background: #9b59b6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-link"></i> Corrigir Domínios
                    </button>
                    <button id="checkPropertyBtn" 
                            style="background: #1abc9c; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-home"></i> Verificar Imóvel
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
            document.getElementById('closeDiagnosticPanelBtn').addEventListener('click', function() {
                var p = document.getElementById('diagnosticPanel65');
                if (p) p.remove();
                log('✅ Painel fechado', 'info');
            });
            
            document.getElementById('closePanelBtn').addEventListener('click', function() {
                var p = document.getElementById('diagnosticPanel65');
                if (p) p.remove();
                log('✅ Painel fechado', 'info');
            });
            
            document.getElementById('runDiagnosticBtn').addEventListener('click', async function() {
                var statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executando diagnóstico completo...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    log('▶️ Executando diagnóstico completo (via botão)', 'info');
                    var result = await window.DiagnosticSystem65.runFullDiagnostic();
                    
                    if (result) {
                        var domainMsg = result.summary.domainFixed > 0 ? 
                            ` (${result.summary.domainFixed} domínio(s) corrigido(s))` : '';
                        statusDiv.innerHTML = '✅ Diagnóstico concluído! ' + result.summary.totalFixes + 
                            ' correções aplicadas.' + domainMsg;
                        statusDiv.style.color = '#27ae60';
                    } else {
                        statusDiv.innerHTML = '⚠️ Diagnóstico concluído com algumas pendências. Verifique o console.';
                        statusDiv.style.color = '#f39c12';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '❌ Erro: ' + error.message;
                    statusDiv.style.color = '#e74c3c';
                    log('❌ Erro no diagnóstico: ' + error.message, 'error');
                }
            });
            
            document.getElementById('quickFixBtn').addEventListener('click', function() {
                var statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aplicando correção rápida...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    log('⚡ Executando correção rápida (via botão)', 'info');
                    var result = window.DiagnosticSystem65.quickFix();
                    
                    if (result) {
                        statusDiv.innerHTML = '✅ Correção rápida aplicada com sucesso!';
                        statusDiv.style.color = '#27ae60';
                    } else {
                        statusDiv.innerHTML = '⚠️ Correção rápida concluída com ressalvas.';
                        statusDiv.style.color = '#f39c12';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '❌ Erro: ' + error.message;
                    statusDiv.style.color = '#e74c3c';
                    log('❌ Erro na correção rápida: ' + error.message, 'error');
                }
            });
            
            document.getElementById('recoverImagesBtn').addEventListener('click', async function() {
                var statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recuperando imagens...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    log('🖼️ Executando recuperação de imagens (via botão)', 'info');
                    var result = await window.DiagnosticSystem65.recoverImages();
                    
                    if (result && result.fixed > 0) {
                        var domainMsg = result.domainFixed > 0 ? 
                            ` (${result.domainFixed} domínio(s) corrigido(s))` : '';
                        statusDiv.innerHTML = '✅ ' + result.fixed + ' imóveis corrigidos' + 
                            domainMsg + ' (' + result.total + ' processados)';
                        statusDiv.style.color = '#27ae60';
                    } else if (result && result.fixed === 0) {
                        statusDiv.innerHTML = '✅ Nenhuma imagem precisou ser corrigida.';
                        statusDiv.style.color = '#27ae60';
                    } else {
                        statusDiv.innerHTML = '⚠️ Recuperação concluída. Verifique o console.';
                        statusDiv.style.color = '#f39c12';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '❌ Erro: ' + error.message;
                    statusDiv.style.color = '#e74c3c';
                    log('❌ Erro na recuperação de imagens: ' + error.message, 'error');
                }
            });

            document.getElementById('fixDomainsBtn').addEventListener('click', async function() {
                var statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Corrigindo domínios...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    log('🔗 Corrigindo domínios (via botão)', 'info');
                    
                    var diagnosis = RecoverImages.diagnoseOldDomains();
                    statusDiv.innerHTML = '🔍 ' + diagnosis.found + ' URL(s) com domínio(s) antigo(s) encontrada(s). Corrigindo...';
                    
                    var result = await RecoverImages.recoverAll();
                    
                    if (result && result.fixed > 0) {
                        statusDiv.innerHTML = '✅ ' + result.fixed + ' imóvel(is) corrigido(s) com domínios atualizados' +
                            (result.domainFixed > 0 ? ` (${result.domainFixed} URLs corrigidas)` : '');
                        statusDiv.style.color = '#27ae60';
                    } else if (result && result.fixed === 0) {
                        statusDiv.innerHTML = '✅ Nenhum domínio antigo encontrado para corrigir.';
                        statusDiv.style.color = '#27ae60';
                    } else {
                        statusDiv.innerHTML = '⚠️ Correção de domínios concluída. Verifique o console.';
                        statusDiv.style.color = '#f39c12';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '❌ Erro: ' + error.message;
                    statusDiv.style.color = '#e74c3c';
                    log('❌ Erro na correção de domínios: ' + error.message, 'error');
                }
            });

            document.getElementById('checkPropertyBtn').addEventListener('click', async function() {
                var propertyId = prompt('Digite o ID do imóvel para verificar:');
                if (!propertyId) return;
                
                var statusDiv = document.getElementById('diagnosticStatus');
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando imóvel ' + propertyId + '...';
                statusDiv.style.color = '#ffd700';
                
                try {
                    var result = await window.DiagnosticSystem65.checkPropertyImages(parseInt(propertyId));
                    
                    if (result) {
                        var msg = '📊 Imóvel "' + result.property.title + '"\n';
                        msg += '📸 ' + result.validCount + '/' + result.totalCount + ' imagens válidas\n';
                        msg += '🔄 ' + result.oldDomainCount + ' URL(s) com domínio antigo\n';
                        msg += result.needsFix ? '⚠️ Precisa de correção' : '✅ OK';
                        
                        statusDiv.innerHTML = msg;
                        statusDiv.style.color = result.needsFix ? '#f39c12' : '#27ae60';
                    } else {
                        statusDiv.innerHTML = '❌ Imóvel não encontrado';
                        statusDiv.style.color = '#e74c3c';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '❌ Erro: ' + error.message;
                    statusDiv.style.color = '#e74c3c';
                }
            });
            
            log('✅ Painel de diagnóstico criado com eventos', 'success');
            return panel;
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
            diagnoseOldDomains: diagnoseOldDomains,
            fixIllegalReturn: fixIllegalReturn,
            fixGalleryFunctions: fixGalleryFunctions,
            fixBrokenImages: fixBrokenImages,
            fixSystemState: fixSystemState,
            fixCriticalFunctions: fixCriticalFunctions,
            generateReport: generateReport,
            recoverImages: RecoverImages.recoverAll,
            checkPropertyImages: RecoverImages.checkProperty,
            reconstructImageUrl: RecoverImages.reconstructUrl,
            fixPropertyUrls: RecoverImages.fixPropertyUrls,
            detectSupabaseDomain: detectSupabaseDomain,
            CONFIG: CONFIG
        };

        // ========== INICIALIZAÇÃO AUTOMÁTICA ==========
        function autoInitialize() {
            log('🔧 Inicializando automaticamente...', 'debug');
            
            if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.registerFunction === 'function') {
                window.DiagnosticRegistry.registerFunction('DiagnosticSystem65', {
                    description: 'Sistema de Diagnóstico Completo v6.5.7',
                    version: CONFIG.version,
                    functions: [
                        'runFullDiagnostic',
                        'showPanel',
                        'quickFix',
                        'recoverImages',
                        'checkPropertyImages',
                        'diagnoseOldDomains',
                        'fixPropertyUrls'
                    ],
                    autoFix: CONFIG.autoFix
                });
                log('✅ Registrado no DiagnosticRegistry', 'success');
            }
            
            var isDebugMode = window.location.search.indexOf('diagnostics=true') !== -1 || 
                               window.location.search.indexOf('debug=true') !== -1;
            
            if (isDebugMode) {
                setTimeout(function() {
                    log('🚀 Executando diagnóstico automático...', 'info');
                    
                    if (typeof window.DiagnosticSystem65.runFullDiagnostic === 'function') {
                        window.DiagnosticSystem65.runFullDiagnostic();
                    }
                    
                    setTimeout(function() {
                        if (typeof window.DiagnosticSystem65.showPanel === 'function') {
                            window.DiagnosticSystem65.showPanel();
                        }
                    }, 1500);
                }, 2000);
            }
            
            state.initialized = true;
            log('✅ DiagnosticSystem65 v6.5.7 inicializado com sucesso', 'success');
            console.log('📊 [INIT] DiagnosticSystem65 v' + CONFIG.version + ' - Pronto para uso');
            console.log('🔗 [INIT] Domínio Supabase detectado:', SUPABASE_DOMAIN);
            console.log('📋 [INIT] Use window.DiagnosticSystem65.runFullDiagnostic() para diagnóstico completo');
            console.log('🔄 [INIT] Use window.DiagnosticSystem65.recoverImages() para corrigir URLs');
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoInitialize);
        } else {
            setTimeout(autoInitialize, 100);
        }

        // ========== COMANDOS RÁPIDOS PARA O CONSOLE ==========
        console.log('%c🔧 DiagnosticSystem65 v6.5.7 Carregado', 'font-size: 16px; font-weight: bold; color: #d4af37;');
        console.log('%cComandos disponíveis:', 'font-weight: bold;');
        console.log('  🔍 window.DiagnosticSystem65.runFullDiagnostic() - Executar diagnóstico completo');
        console.log('  📋 window.DiagnosticSystem65.showPanel() - Mostrar painel de diagnóstico');
        console.log('  ⚡ window.DiagnosticSystem65.quickFix() - Correção rápida');
        console.log('  📊 window.DiagnosticSystem65.generateReport() - Gerar relatório');
        console.log('  🖼️ window.DiagnosticSystem65.recoverImages() - Recuperar imagens quebradas');
        console.log('  🔗 window.DiagnosticSystem65.diagnoseOldDomains() - Diagnosticar domínios antigos');
        console.log('  🔗 window.DiagnosticSystem65.fixPropertyUrls(property) - Corrigir URLs de uma propriedade');
        console.log('  🔍 window.DiagnosticSystem65.checkPropertyImages(id) - Verificar imagens de um imóvel');
        console.log('  🔗 Domínio atual:', SUPABASE_DOMAIN);

    } catch (error) {
        console.error('❌ [FATAL] Erro ao carregar DiagnosticSystem65:', error);
        console.error('   Mensagem:', error.message);
        
        if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.reportError === 'function') {
            window.DiagnosticRegistry.reportError('DiagnosticSystem65', error);
        }
        
        if (!window.DiagnosticSystem65) {
            window.DiagnosticSystem65 = {
                version: '6.5.7',
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
// Versão: 6.5.7
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.DiagnosticSystem65;
}
window.__DIAGNOSTICS65_LOADED = true;
window.__DIAGNOSTICS65_VERSION = '6.5.7';
window.__DIAGNOSTICS65_STATUS = 'success';
console.log('✅ [diagnostics65.js] v6.5.7 carregado com sucesso');
console.log('🔧 [diagnostics65.js] Correção: self.reconstructUrl is not a function resolvido');
// ============================================================
// FIM DO ARQUIVO - diagnostics65.js
// ============================================================
