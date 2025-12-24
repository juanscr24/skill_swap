/**
 * Scroll suave al inicio de la página
 * Solo funciona si estamos en la página principal
 */
export const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

/**
 * Scroll suave a un elemento específico por ID con offset para navbar fijo
 * @param elementId - ID del elemento al que hacer scroll
 * @param offset - Offset en píxeles (opcional, se calcula automáticamente según el tamaño de pantalla)
 */
export const scrollToElement = (
    elementId: string,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    offset?: number
) => {
    e.preventDefault();
    const element = document.getElementById(elementId);
    if (element) {
        // Offset responsivo: 80px en mobile, 120px en desktop
        const responsiveOffset = offset ?? (window.innerWidth < 768 ? 80 : 120);

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - responsiveOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};
