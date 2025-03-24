/**
 * DevTipsBR - Filtro de Seções
 * 
 * Este script gerencia a filtragem de seções nas páginas de comandos/dicas
 * permitindo que o usuário mostre apenas uma seção específica de cada vez.
 */
document.addEventListener('DOMContentLoaded', function() {
    const sectionSelector = document.getElementById('sectionSelector');
    const sections = document.querySelectorAll('.section-content');
    
    if (!sectionSelector || sections.length === 0) {
        return; // Sai se os elementos necessários não forem encontrados
    }
    
    // Função para mostrar apenas a seção selecionada
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        if (sectionId === 'all') {
            sections.forEach(section => {
                section.classList.add('active');
            });
        } else {
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }
        }
        
        // Salva a preferência do usuário (opcional)
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('devtipsbr_selected_section', sectionId);
        }
    }
    
    // Listener para o seletor de seções
    sectionSelector.addEventListener('change', function() {
        showSection(this.value);
    });
    
    // Sempre iniciar com "Todas as seções" selecionado
    sectionSelector.value = 'all';
    showSection('all');
    
    // Limpa a preferência anterior
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem('devtipsbr_selected_section');
    }
}); 