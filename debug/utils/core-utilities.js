// debug/utils/core-utilities.js
// Módulo utilitário para funções de formatação e validação migradas do Core System
// ✅ Este módulo é OPCIONAL e NÃO ESSENCIAL para o Core System funcionar
// VERSÃO: 2.0.1 - Adicionado log detalhado de carregamento

console.log('🔧 [SUPPORT] Carregando core-utilities.js - VERSÃO 2.0.1');

// ========== FUNÇÕES DE FEATURES E VIDEO ==========
window.SupportCoreUtils = {
    version: '2.0.1',
    
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
                ensureBooleanVideo: typeof this.ensureBooleanVideo === 'function'
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
        console.log('📋 [core-utilities] Funções registradas no DiagnosticRegistry');
    } catch (e) {
        console.warn('⚠️ [core-utilities] Erro ao registrar no DiagnosticRegistry:', e.message);
    }
}

// Exibir relatório de carregamento detalhado
console.log('✅ [SUPPORT] core-utilities.js v2.0.1 carregado com sucesso!');
console.log('📦 Funções disponíveis no SupportCoreUtils:');
console.log('   🔧 formatFeaturesForDisplay:', typeof window.SupportCoreUtils.formatFeaturesForDisplay);
console.log('   🔧 parseFeaturesForStorage:', typeof window.SupportCoreUtils.parseFeaturesForStorage);
console.log('   🔧 ensureBooleanVideo:', typeof window.SupportCoreUtils.ensureBooleanVideo);
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
