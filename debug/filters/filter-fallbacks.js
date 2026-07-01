// ============================================================
// weberlessa-support/debug/filters/filter-fallbacks.js
// FILTROS - FALLBACK MANUAL PARA QUANDO O FILTERMANAGER FALHA
// ============================================================
// ✅ Versão: 1.0.0
// ✅ Finalidade: Configurar fallback manual para os filtros do site
// ✅ Carregado: Em modo debug ou quando FilterManager não está disponível
// ✅ Integração: Registra função no DiagnosticRegistry
// ============================================================

console.log('🔧 [SUPPORT] filter-fallbacks.js carregado - Versão 1.0.0');

// ============================================================
// IIFE - ISOLAMENTO DE ESCOPO
// ============================================================
(function() {
    'use strict';
    
    // ============================================================
    // FUNÇÃO PRINCIPAL - FALLBACK MANUAL DOS FILTROS
    // ============================================================
    /**
     * Configura fallback manual para os filtros
     * Útil quando o FilterManager principal falha
     * 
     * @returns {boolean} - True se configurado com sucesso, False caso contrário
     */
    window.setupManualFilterFallback = function() {
        console.warn('⚠️ [SUPPORT] Usando fallback manual de filtros...');
        
        try {
            var filterButtons = document.querySelectorAll('.filter-btn');
            
            if (!filterButtons || filterButtons.length === 0) {
                console.error('❌ [SUPPORT] Botões de filtro não encontrados!');
                return false;
            }
            
            console.log('🔍 [SUPPORT] ' + filterButtons.length + ' botão(ões) de filtro encontrado(s)');
            
            // ============================================================
            // RECONFIGURAR CADA BOTÃO
            // ============================================================
            filterButtons.forEach(function(button) {
                // Clonar para remover listeners antigos
                var newBtn = button.cloneNode(true);
                button.parentNode.replaceChild(newBtn, button);
                
                newBtn.addEventListener('click', function() {
                    // Remover classe active de todos
                    filterButtons.forEach(function(btn) {
                        btn.classList.remove('active');
                    });
                    
                    // Adicionar classe active no clicado
                    this.classList.add('active');
                    
                    // Extrair valor do filtro
                    var filterText = this.textContent.trim();
                    var filterValue = filterText === 'Todos' ? 'todos' : filterText;
                    
                    // Aplicar filtro
                    window.currentFilter = filterValue;
                    if (typeof window.renderProperties === 'function') {
                        window.renderProperties(filterValue);
                        console.log('✅ [SUPPORT] Filtro aplicado: ' + filterValue);
                    } else {
                        console.warn('⚠️ [SUPPORT] window.renderProperties não disponível');
                    }
                });
            });
            
            // ============================================================
            // ATIVAR BOTÃO "TODOS" POR PADRÃO
            // ============================================================
            var todosBtn = Array.from(filterButtons).find(function(btn) {
                return btn.textContent.trim() === 'Todos';
            });
            
            if (todosBtn) {
                todosBtn.classList.add('active');
                console.log('✅ [SUPPORT] Botão "Todos" ativado por padrão');
            }
            
            console.log('✅ [SUPPORT] Fallback de filtros configurado com sucesso');
            return true;
            
        } catch (error) {
            console.error('❌ [SUPPORT] Erro ao configurar fallback de filtros:', error);
            return false;
        }
    };
    
    // ============================================================
    // REGISTRO NO DIAGNOSTIC REGISTRY
    // ============================================================
    setTimeout(function() {
        if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.register === 'function') {
            try {
                window.DiagnosticRegistry.register(
                    'setupManualFilterFallback',
                    window.setupManualFilterFallback,
                    'essential',
                    {
                        description: 'Fallback manual para filtros (quando FilterManager falha)',
                        isDestructive: false,
                        isSafe: true,
                        version: '1.0.0',
                        category: 'filters'
                    }
                );
                console.log('📋 [filter-fallbacks] Registrado no DiagnosticRegistry');
            } catch (e) {
                console.warn('⚠️ [filter-fallbacks] Erro ao registrar:', e.message);
            }
        }
    }, 1000);
    
    // ============================================================
    // HEALTH CHECK AUTOMÁTICO (MODO DEBUG)
    // ============================================================
    if (window.location.search.indexOf('debug=true') !== -1) {
        setTimeout(function() {
            console.group('🔧 [filter-fallbacks] HEALTH CHECK v1.0.0');
            console.log('✅ Módulo carregado: true');
            console.log('✅ setupManualFilterFallback disponível:', typeof window.setupManualFilterFallback === 'function');
            console.log('✅ FilterManager disponível:', typeof window.FilterManager !== 'undefined');
            console.log('✅ filterButtons encontrados:', document.querySelectorAll('.filter-btn').length);
            console.groupEnd();
        }, 1500);
    }
    
    console.log('✅ [filter-fallbacks.js] Função setupManualFilterFallback disponível');
    
    // ============================================================
    // FIM DA IIFE
    // ============================================================
})();

// ============================================================
// FIM DO ARQUIVO - filter-fallbacks.js
// ============================================================
// STATUS: ✅ CARREGADO COM SUCESSO
// Versão: 1.0.0
// Última atualização: 2026-07-01
// ============================================================
