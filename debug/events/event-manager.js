// ============================================================
// weberlessa-support/debug/events/event-manager.js
// GERENCIADOR DE EVENTOS COM DEBOUNCE E RASTREAMENTO
// ============================================================
// ✅ Versão: 1.0.0
// ✅ Finalidade: Gerenciar eventos com debounce automático e rastreamento
// ✅ Carregado: Em modo debug ou quando necessário
// ✅ Funcionalidades:
//    - Registro de listeners com debounce automático
//    - Remoção seletiva de listeners
//    - Listagem de listeners ativos
//    - Limpeza em massa de listeners
//    - Integração com DiagnosticRegistry
// ============================================================

console.log('🔧 [SUPPORT] event-manager.js carregado - Versão 1.0.0');

// ============================================================
// IIFE - ISOLAMENTO DE ESCOPO
// ============================================================
(function() {
    'use strict';
    
    // ============================================================
    // EVENT MANAGER - OBJETO PRINCIPAL
    // ============================================================
    /**
     * Gerenciador de eventos com debounce e rastreamento
     * Útil para debugging e otimização de performance
     */
    window.EventManager = {
        // ============================================================
        // PROPRIEDADES
        // ============================================================
        listeners: new Map(),
        version: '1.0.0',
        
        // ============================================================
        // MÉTODO: REGISTRAR LISTENER
        // ============================================================
        /**
         * Registra um listener com debounce automático
         * 
         * @param {HTMLElement} element - Elemento alvo
         * @param {string} event - Nome do evento (ex: 'click')
         * @param {Function} handler - Função a ser executada
         * @param {Object} options - Opções adicionais
         * @param {number} options.debounce - Tempo de debounce em ms
         * @returns {string} - Chave única do listener
         */
        on: function(element, event, handler, options) {
            options = options || {};
            var key = event + '_' + Math.random().toString(36).substr(2, 9);
            
            // Aplicar debounce se especificado
            var finalHandler = handler;
            if (options.debounce && options.debounce > 0) {
                finalHandler = this.debounce(handler, options.debounce);
            }
            
            // Registrar listener
            element.addEventListener(event, finalHandler, options);
            
            // Armazenar para possível remoção
            this.listeners.set(key, { 
                element: element, 
                event: event, 
                handler: finalHandler 
            });
            
            if (window.location.search.indexOf('debug=true') !== -1) {
                console.log('📋 [EventManager] Listener registrado: ' + event + ' (' + key + ')');
            }
            
            return key;
        },
        
        // ============================================================
        // MÉTODO: REMOVER LISTENER
        // ============================================================
        /**
         * Remove um listener específico pela chave
         * 
         * @param {string} key - Chave do listener a ser removido
         */
        off: function(key) {
            var listener = this.listeners.get(key);
            if (listener) {
                listener.element.removeEventListener(
                    listener.event, 
                    listener.handler
                );
                this.listeners.delete(key);
                
                if (window.location.search.indexOf('debug=true') !== -1) {
                    console.log('🗑️ [EventManager] Listener removido: ' + key);
                }
            } else {
                if (window.location.search.indexOf('debug=true') !== -1) {
                    console.warn('⚠️ [EventManager] Listener não encontrado: ' + key);
                }
            }
        },
        
        // ============================================================
        // MÉTODO: DEBOUNCE
        // ============================================================
        /**
         * Função de debounce para otimização de eventos
         * 
         * @param {Function} func - Função a ser executada
         * @param {number} wait - Tempo de espera em ms
         * @returns {Function} - Função com debounce aplicado
         */
        debounce: function(func, wait) {
            var timeout;
            return function executedFunction() {
                var args = arguments;
                var later = function() {
                    clearTimeout(timeout);
                    func.apply(null, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // ============================================================
        // MÉTODO: LIMPAR TODOS OS LISTENERS
        // ============================================================
        /**
         * Remove todos os listeners ativos
         */
        cleanup: function() {
            var count = this.listeners.size;
            var self = this;
            this.listeners.forEach(function(listener, key) {
                self.off(key);
            });
            this.listeners.clear();
            
            if (window.location.search.indexOf('debug=true') !== -1) {
                console.log('🧹 [EventManager] ' + count + ' listeners removidos');
            }
        },
        
        // ============================================================
        // MÉTODO: LISTAR LISTENERS ATIVOS
        // ============================================================
        /**
         * Lista todos os listeners ativos no console
         * 
         * @returns {Array} - Array com todos os listeners
         */
        list: function() {
            console.group('📋 [EventManager] Listeners ativos');
            var self = this;
            this.listeners.forEach(function(listener, key) {
                console.log('  - ' + key + ': ' + listener.event + ' em', listener.element);
            });
            console.log('  Total: ' + self.listeners.size + ' listeners');
            console.groupEnd();
            
            return Array.from(this.listeners.entries());
        },
        
        // ============================================================
        // MÉTODO: OBTER STATUS
        // ============================================================
        /**
         * Retorna o status atual do EventManager
         * 
         * @returns {Object} - Status detalhado
         */
        getStatus: function() {
            return {
                version: this.version,
                totalListeners: this.listeners.size,
                isActive: this.listeners.size > 0,
                timestamp: new Date().toISOString()
            };
        }
    };
    
    // ============================================================
    // REGISTRO NO DIAGNOSTIC REGISTRY
    // ============================================================
    setTimeout(function() {
        if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.register === 'function') {
            try {
                window.DiagnosticRegistry.register(
                    'EventManager',
                    window.EventManager,
                    'essential',
                    {
                        description: 'Gerenciador de eventos com debounce e rastreamento',
                        isObject: true,
                        isSafe: true,
                        version: '1.0.0',
                        category: 'events'
                    }
                );
                console.log('📋 [event-manager] Registrado no DiagnosticRegistry');
            } catch (e) {
                console.warn('⚠️ [event-manager] Erro ao registrar:', e.message);
            }
        }
    }, 1000);
    
    // ============================================================
    // HEALTH CHECK AUTOMÁTICO (MODO DEBUG)
    // ============================================================
    if (window.location.search.indexOf('debug=true') !== -1) {
        setTimeout(function() {
            console.group('🔧 [event-manager] HEALTH CHECK v1.0.0');
            console.log('✅ EventManager disponível:', typeof window.EventManager === 'object');
            console.log('✅ EventManager.on disponível:', typeof window.EventManager.on === 'function');
            console.log('✅ EventManager.off disponível:', typeof window.EventManager.off === 'function');
            console.log('✅ EventManager.debounce disponível:', typeof window.EventManager.debounce === 'function');
            console.log('✅ EventManager.cleanup disponível:', typeof window.EventManager.cleanup === 'function');
            console.log('✅ EventManager.list disponível:', typeof window.EventManager.list === 'function');
            console.log('📊 Listeners ativos:', window.EventManager.listeners.size);
            console.log('📌 Versão:', window.EventManager.version);
            console.groupEnd();
        }, 1500);
    }
    
    console.log('✅ [event-manager.js] EventManager disponível');
    
    // ============================================================
    // FIM DA IIFE
    // ============================================================
})();

// ============================================================
// FIM DO ARQUIVO - event-manager.js
// ============================================================
// STATUS: ✅ CARREGADO COM SUCESSO
// Versão: 1.0.0
// Última atualização: 2026-07-01
// ============================================================
