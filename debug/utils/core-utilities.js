// debug/utils/core-utilities.js
// Módulo utilitário para funções de formatação e validação migradas do Core System
// ✅ Este módulo é OPCIONAL e NÃO ESSENCIAL para o Core System funcionar

console.log('🔧 [SUPPORT] Carregando core-utilities.js');

// ========== FUNÇÕES DE FEATURES E VIDEO ==========
window.SupportCoreUtils = {
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
            console.warn('⚠️ Erro ao formatar features:', error);
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
            console.error('❌ Erro ao parsear features:', error);
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
    }
};

// Registrar no DiagnosticRegistry (se disponível)
if (window.DiagnosticRegistry) {
    window.DiagnosticRegistry.register('formatFeaturesForDisplay', window.SupportCoreUtils.formatFeaturesForDisplay, 'utils', { isSafe: true, hasFallback: true });
    window.DiagnosticRegistry.register('parseFeaturesForStorage', window.SupportCoreUtils.parseFeaturesForStorage, 'utils', { isSafe: true, hasFallback: true });
    window.DiagnosticRegistry.register('ensureBooleanVideo', window.SupportCoreUtils.ensureBooleanVideo, 'utils', { isSafe: true, hasFallback: true });
}

console.log('✅ [SUPPORT] core-utilities.js carregado com funções de features e vídeo');
