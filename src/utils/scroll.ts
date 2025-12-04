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
 * @param offset - Offset en píxeles (por defecto 100px para compensar navbar)
 */
export const scrollToElement = (
    elementId: string,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    offset: number = 120
) => {
    e.preventDefault();
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};
