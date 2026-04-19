// debug/ui/location-autocomplete.js - v1.0.0
// Sistema de autocomplete de bairros para Weber Lessa
console.log('📍 location-autocomplete.js - Sistema de sugestão de bairros');

(function() {
    'use strict';
    
    // Lista oficial de bairros (ordem correta)
    const BAIRROS_OFICIAIS = [
        'Pajuçara', 'Ponta Verde', 'Jatiúca', 'Jacarecica', 'Cruz das Almas',
        'Mangabeiras', 'Poço', 'Barro Duro', 'Gruta de Lourdes', 'Serraria',
        'Farol', 'Jardim Petrópolis', 'Centro', 'Prado', 'Jaraguá', 'Feitosa',
        'Pinheiro', 'Santa Lúcia', 'Santa Amélia', 'Tabuleiro do Martins',
        'Cidade Universitária', 'Clima Bom', 'Benedito Bentes', 'Santos Dumont',
        'São Jorge', 'Levada', 'Trapiche da Barra', 'Vergel do Lago',
        'Ouro Preto', 'Mutange', 'Fernão Velho', 'Rio Novo', 'Riacho Doce',
        'Pontal da Barra', 'Guaxuma', 'Ipioca', 'Garça Torta', 'Pescaria',
        'Chã da Jaqueira', 'Chã de Bebedouro', 'Bebedouro', 'Bom Parto',
        'Canaã', 'Pitanguinha', 'Ponta da Terra', 'Santo Amaro', 'Zona Rural'
    ];
    
    // Configuração
    const CONFIG = {
        inputSelector: '#propLocation',
        minChars: 2,
        maxSuggestions: 8,
        debounceDelay: 300,
        suggestionsClass: 'location-suggestions',
        highlightClass: 'suggestion-highlight'
    };
    
    let currentInput = null;
    let suggestionsContainer = null;
    let debounceTimer = null;
    
    /**
     * Filtra bairros baseado no texto digitado
     */
    function filterBairros(searchText) {
        if (!searchText || searchText.length < CONFIG.minChars) {
            return [];
        }
        
        const searchLower = searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        return BAIRROS_OFICIAIS
            .filter(bairro => {
                const bairroLower = bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return bairroLower.includes(searchLower);
            })
            .slice(0, CONFIG.maxSuggestions);
    }
    
    /**
     * Cria elemento de sugestão
     */
    function createSuggestionElement(bairro, searchText) {
        const div = document.createElement('div');
        div.className = CONFIG.suggestionsClass + '-item';
        div.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: background 0.2s ease;
            font-size: 0.9rem;
        `;
        
        // Destacar parte que corresponde à busca
        const searchLower = searchText.toLowerCase();
        const bairroLower = bairro.toLowerCase();
        const index = bairroLower.indexOf(searchLower);
        
        if (index !== -1) {
            const before = bairro.substring(0, index);
            const match = bairro.substring(index, index + searchText.length);
            const after = bairro.substring(index + searchText.length);
            div.innerHTML = `${before}<strong style="color: #1a5276;">${match}</strong>${after}`;
        } else {
            div.textContent = bairro;
        }
        
        // Evento de clique
        div.addEventListener('click', () => {
            if (currentInput) {
                currentInput.value = bairro;
                hideSuggestions();
                
                // Disparar evento para notificar mudança
                const event = new Event('input', { bubbles: true });
                currentInput.dispatchEvent(event);
            }
        });
        
        // Hover effect
        div.addEventListener('mouseenter', () => {
            div.style.backgroundColor = '#f0f7ff';
        });
        
        div.addEventListener('mouseleave', () => {
            div.style.backgroundColor = '';
        });
        
        return div;
    }
    
    /**
     * Mostra sugestões
     */
    function showSuggestions(suggestions, searchText) {
        hideSuggestions();
        
        if (!suggestions.length || !currentInput) return;
        
        // Criar container
        const rect = currentInput.getBoundingClientRect();
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = CONFIG.suggestionsClass;
        suggestionsContainer.style.cssText = `
            position: absolute;
            z-index: 10000;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 300px;
            overflow-y: auto;
            width: ${rect.width}px;
            top: ${rect.bottom + window.scrollY}px;
            left: ${rect.left + window.scrollX}px;
        `;
        
        // Adicionar itens
        suggestions.forEach(bairro => {
            suggestionsContainer.appendChild(createSuggestionElement(bairro, searchText));
        });
        
        document.body.appendChild(suggestionsContainer);
        
        // Fechar ao clicar fora
        setTimeout(() => {
            document.addEventListener('click', function onClickOutside(e) {
                if (!suggestionsContainer?.contains(e.target) && e.target !== currentInput) {
                    hideSuggestions();
                    document.removeEventListener('click', onClickOutside);
                }
            });
        }, 0);
    }
    
    /**
     * Esconde sugestões
     */
    function hideSuggestions() {
        if (suggestionsContainer) {
            suggestionsContainer.remove();
            suggestionsContainer = null;
        }
    }
    
    /**
     * Handler de input
     */
    function onInputChange(e) {
        const searchText = e.target.value;
        
        if (debounceTimer) clearTimeout(debounceTimer);
        
        if (!searchText || searchText.length < CONFIG.minChars) {
            hideSuggestions();
            return;
        }
        
        debounceTimer = setTimeout(() => {
            const suggestions = filterBairros(searchText);
            showSuggestions(suggestions, searchText);
        }, CONFIG.debounceDelay);
    }
    
    /**
     * Inicializa o autocomplete
     */
    function init() {
        const input = document.querySelector(CONFIG.inputSelector);
        if (!input) {
            console.log('📍 Campo de localização não encontrado, autocomplete não iniciado');
            return false;
        }
        
        if (currentInput === input) {
            console.log('📍 Autocomplete já inicializado');
            return true;
        }
        
        // Limpar anterior
        if (currentInput) {
            currentInput.removeEventListener('input', onInputChange);
            currentInput.removeEventListener('blur', () => setTimeout(hideSuggestions, 200));
        }
        
        currentInput = input;
        currentInput.setAttribute('autocomplete', 'off');
        currentInput.setAttribute('placeholder', 'Ex: Ponta Verde, Maceió-AL (digite o bairro)');
        
        // Adicionar eventos
        currentInput.addEventListener('input', onInputChange);
        currentInput.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
        
        // Estilo para o campo
        currentInput.style.position = 'relative';
        
        console.log('📍 Sistema de autocomplete inicializado com', BAIRROS_OFICIAIS.length, 'bairros');
        return true;
    }
    
    /**
     * Destrói o autocomplete
     */
    function destroy() {
        if (currentInput) {
            currentInput.removeEventListener('input', onInputChange);
            currentInput.removeEventListener('blur', () => setTimeout(hideSuggestions, 200));
            currentInput = null;
        }
        hideSuggestions();
        if (debounceTimer) clearTimeout(debounceTimer);
        console.log('📍 Sistema de autocomplete destruído');
    }
    
    // API pública
    window.LocationAutocomplete = {
        init,
        destroy,
        getBairrosList: () => [...BAIRROS_OFICIAIS],
        isActive: () => currentInput !== null,
        CONFIG
    };
    
    // Auto-registrar no DiagnosticRegistry se disponível
    if (window.DiagnosticRegistry) {
        window.DiagnosticRegistry.register('LocationAutocomplete.init', init, 'ui', {
            isSafe: true,
            description: 'Inicializa sistema de autocomplete de bairros'
        });
        window.DiagnosticRegistry.register('LocationAutocomplete.getBairrosList', 
            () => BAIRROS_OFICIAIS, 'ui', {
            isSafe: true,
            description: 'Retorna lista oficial de bairros de Maceió'
        });
    }
    
    console.log('✅ location-autocomplete.js carregado -', BAIRROS_OFICIAIS.length, 'bairros disponíveis');
})();
