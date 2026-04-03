// debug/utils/core-utilities.js
// Módulo utilitário para funções de formatação e validação migradas do Core System
// ✅ Este módulo é OPCIONAL e NÃO ESSENCIAL para o Core System funcionar
// VERSÃO: 2.1.0 - Adicionado validateIdForSupabase e manageEditingState

console.log('🔧 [SUPPORT] Carregando core-utilities.js - VERSÃO 2.1.0');

// ========== FUNÇÕES DE FEATURES E VIDEO ==========
window.SupportCoreUtils = {
    version: '2.1.0',
    
    /**
     * Formata features para exibição
     * @param {string|array} features - Features a serem formatadas
     * @returns {string} Features formatadas como string separada por vírgulas
     */
    formatFeaturesForDisplay: function(features) {
        if (!features) return '';
        try {
            if (Array.isArray(features)) return features.filter(f => f && f.trim()).join(', ');
            if (typeof features === 'string' && features.trim().startsWith('[') && features.trim().endsWith(']')) {
                const parsed = JSON.parse(features);
                if (Array.isArray(parsed)) return parsed.filter(f => f && f.trim()).join(', ');
            }
            return features.toString().replace(/[\[\]"]/g, '').replace(/\s*,\s*/g, ', ');
        } catch (error) {
            console.warn('⚠️ [core-utilities] Erro ao formatar features:', error);
            return '';
        }
    },

    /**
     * Converte features de string para formato de armazenamento (JSON)
     * @param {string|array} value - Features a serem processadas
     * @returns {string} Features em formato JSON string
     */
    parseFeaturesForStorage: function(value) {
        if (!value) return '[]';
        try {
            if (Array.isArray(value)) return JSON.stringify(value.filter(f => f && f.trim()));
            if (typeof value === 'string' && value.trim().startsWith('[') && value.trim().endsWith(']')) {
                JSON.parse(value);
                return value;
            }
            const featuresArray = value.split(',').map(f => f.trim()).filter(f => f);
            return JSON.stringify(featuresArray);
        } catch (error) {
            console.error('❌ [core-utilities] Erro ao parsear features:', error);
            return '[]';
        }
    },

    /**
     * Garante que o valor do vídeo seja booleano
     * @param {any} videoValue - Valor a ser convertido
     * @returns {boolean} Valor booleano do vídeo
     */
    ensureBooleanVideo: function(videoValue) {
        if (videoValue === undefined || videoValue === null) return false;
        if (typeof videoValue === 'boolean') return videoValue;
        if (typeof videoValue === 'string') {
            const lower = videoValue.toLowerCase().trim();
            if (lower === 'true' || lower === '1' || lower === 'sim' || lower === 'yes') return true;
            if (lower === 'false' || lower === '0' || lower === 'não' || lower === 'no') return false;
        }
        if (typeof videoValue === 'number') return videoValue === 1;
        return Boolean(videoValue);
    },
    
    /**
     * Gerencia o estado global de edição de propriedade.
     * @param {string|number|null} id - O ID da propriedade em edição ou null para limpar.
     * @returns {string|number|null} O ID atual após a operação.
     */
    manageEditingState: function(id = null) {
        if (id === null) {
            window.editingPropertyId = null;
            console.log('🧹 [core-utils] Estado de edição limpo.');
            return null;
        }
        // Garante que o ID seja armazenado como número, se possível, para consistência.
        const numericId = this.validateIdForSupabase(id);
        window.editingPropertyId = numericId !== null ? numericId : id;
        console.log(`✏️ [core-utils] Estado de edição definido para: ${window.editingPropertyId}`);
        return window.editingPropertyId;
    },

    /**
     * Valida e sanitiza um ID de propriedade para uso com o Supabase.
     * @param {string|number} id - O ID bruto a ser validado.
     * @returns {number|null} O ID numérico válido ou null se inválido.
     */
    validateIdForSupabase: function(id) {
        if (id === undefined || id === null || id === 'null' || id === 'undefined') {
            console.warn('⚠️ [core-utils] ID inválido fornecido:', id);
            return null;
        }
        if (typeof id === 'number' && !isNaN(id) && id > 0) {
            return id;
        }
        if (typeof id === 'string') {
            // Tenta extrair números da string (ex: "temp_123" -> 123)
            const numericMatch = id.match(/\d+/);
            if (numericMatch) {
                const numericId = parseInt(numericMatch[0], 10);
                if (!isNaN(numericId) && numericId > 0) {
                    return numericId;
                }
            }
        }
        console.warn('⚠️ [core-utils] Não foi possível validar o ID:', id);
        return null;
    },
    
    /**
     * Verifica se o módulo está funcionando corretamente
     * @returns {object} Status do módulo
     */
    healthCheck: function() {
        const testFeatures = '["Teste1", "Teste2"]';
        const formatted = this.formatFeaturesForDisplay(testFeatures);
        const parsed = this.parseFeaturesForStorage('Teste1, Teste2');
        
        return {
            version: this.version,
            status: 'healthy',
            functions: {
                formatFeaturesForDisplay: typeof this.formatFeaturesForDisplay === 'function',
                parseFeaturesForStorage: typeof this.parseFeaturesForStorage === 'function',
                ensureBooleanVideo: typeof this.ensureBooleanVideo === 'function',
                manageEditingState: typeof this.manageEditingState === 'function',
                validateIdForSupabase: typeof this.validateIdForSupabase === 'function'
            },
            testResults: {
                formatFeaturesForDisplay: formatted === 'Teste1, Teste2',
                parseFeaturesForStorage: parsed === '["Teste1","Teste2"]'
            }
        };
    }
};

// Registrar no DiagnosticRegistry (se disponível)
if (window.DiagnosticRegistry && typeof window.DiagnosticRegistry.register === 'function') {
    try {
        window.DiagnosticRegistry.register('formatFeaturesForDisplay', window.SupportCoreUtils.formatFeaturesForDisplay, 'utils', { 
            isSafe: true, 
            hasFallback: true,
            version: window.SupportCoreUtils.version,
            description: 'Formata features para exibição (array ou JSON → string)'
        });
        window.DiagnosticRegistry.register('parseFeaturesForStorage', window.SupportCoreUtils.parseFeaturesForStorage, 'utils', { 
            isSafe: true, 
            hasFallback: true,
            version: window.SupportCoreUtils.version,
            description: 'Converte features para formato de armazenamento (string → JSON)'
        });
        window.DiagnosticRegistry.register('ensureBooleanVideo', window.SupportCoreUtils.ensureBooleanVideo, 'utils', { 
            isSafe: true, 
            hasFallback: true,
            version: window.SupportCoreUtils.version,
            description: 'Converte valor de vídeo para booleano'
        });
        window.DiagnosticRegistry.register('validateIdForSupabase', window.SupportCoreUtils.validateIdForSupabase, 'utils', { 
            isSafe: true, 
            hasFallback: true,
            version: window.SupportCoreUtils.version,
            description: 'Valida e sanitiza ID para uso com Supabase'
        });
        window.DiagnosticRegistry.register('manageEditingState', window.SupportCoreUtils.manageEditingState, 'utils', { 
            isSafe: true, 
            hasFallback: true,
            version: window.SupportCoreUtils.version,
            description: 'Gerencia estado global de edição de propriedade'
        });
        console.log('📋 [core-utilities] Funções registradas no DiagnosticRegistry');
    } catch (e) {
        console.warn('⚠️ [core-utilities] Erro ao registrar no DiagnosticRegistry:', e.message);
    }
}

// Expor funções globalmente para compatibilidade com código legado
if (typeof window.validateIdForSupabase === 'undefined') {
    window.validateIdForSupabase = window.SupportCoreUtils.validateIdForSupabase.bind(window.SupportCoreUtils);
}
if (typeof window.manageEditingState === 'undefined') {
    window.manageEditingState = window.SupportCoreUtils.manageEditingState.bind(window.SupportCoreUtils);
}

// Exibir relatório de carregamento detalhado
console.log('✅ [SUPPORT] core-utilities.js v2.1.0 carregado com sucesso!');
console.log('📦 Funções disponíveis no SupportCoreUtils:');
console.log('   🔧 formatFeaturesForDisplay:', typeof window.SupportCoreUtils.formatFeaturesForDisplay);
console.log('   🔧 parseFeaturesForStorage:', typeof window.SupportCoreUtils.parseFeaturesForStorage);
console.log('   🔧 ensureBooleanVideo:', typeof window.SupportCoreUtils.ensureBooleanVideo);
console.log('   🔧 validateIdForSupabase:', typeof window.SupportCoreUtils.validateIdForSupabase);
console.log('   🔧 manageEditingState:', typeof window.SupportCoreUtils.manageEditingState);
console.log('   🔧 healthCheck:', typeof window.SupportCoreUtils.healthCheck);

// Executar health check automático em modo debug
if (window.location.search.includes('debug=true') || window.location.search.includes('test-utils=true')) {
    console.log('🧪 [core-utilities] Executando health check automático...');
    const health = window.SupportCoreUtils.healthCheck();
    console.table(health.functions);
    console.log('📊 Resultados dos testes:', health.testResults);
    
    if (health.testResults.formatFeaturesForDisplay && health.testResults.parseFeaturesForStorage) {
        console.log('✅ [core-utilities] Todos os testes passaram!');
    } else {
        console.warn('⚠️ [core-utilities] Alguns testes falharam. Verifique a implementação.');
    }
}

// Exportar para uso global (garantir compatibilidade)
if (typeof window.SharedCore === 'undefined') {
    console.log('ℹ️ [core-utilities] SharedCore não detectado - módulo em modo standalone');
} else {
    console.log('🔗 [core-utilities] Conectado ao SharedCore - funções disponíveis via proxy');
}
