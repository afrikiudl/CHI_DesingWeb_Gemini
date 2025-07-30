/**
 * Se ejecuta cuando el contenido del DOM ha sido cargado.
 * Inicializa todos los componentes interactivos de la página.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Gestiona el menú de navegación móvil (hamburguesa).
     * Muestra/oculta el menú y actualiza los atributos ARIA.
     */
    const initMobileMenu = () => {
        const navToggle = document.querySelector('.nav__toggle');
        const nav = document.querySelector('.nav');

        if (!navToggle || !nav) return;

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('nav--open');
        });
    };

    /**
     * Inicializa todos los acordeones de la página (para Programa y FAQ).
     * Permite expandir/colapsar paneles con click y teclado.
     * Gestiona los estados `aria-expanded` y `hidden`.
     */
    const initAccordions = () => {
        const accordionTriggers = document.querySelectorAll('.accordion__trigger');

        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const panel = document.getElementById(trigger.getAttribute('aria-controls'));
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

                // Actualizar atributos ARIA para accesibilidad
                trigger.setAttribute('aria-expanded', !isExpanded);
                panel.toggleAttribute('hidden');
            });
        });
    };

    /**
     * Gestiona la validación del formulario de contacto en tiempo real.
     * Muestra mensajes de error accesibles sin enviar el formulario.
     */
    const initFormValidation = () => {
        const form = document.querySelector('.form');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            // Previene el envío si la validación del navegador falla
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                // Validar todos los campos para mostrar los errores correspondientes
                validateAllFields(form);
                const firstInvalidField = form.querySelector('[aria-invalid="true"]');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            } else {
                // Simulación de envío exitoso
                event.preventDefault();
                const formStatus = document.getElementById('form-status');
                formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
                form.reset();
            }
        });

        const inputs = form.querySelectorAll('.form__input, .form__textarea');
        inputs.forEach(input => {
            // Validar al perder el foco (blur) para no ser intrusivo
            input.addEventListener('blur', () => validateField(input));
        });
    };

    /**
     * Valida un campo individual y muestra u oculta su mensaje de error.
     * @param {HTMLInputElement|HTMLTextAreaElement} field - El campo del formulario a validar.
     */
    const validateField = (field) => {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (!errorElement) return;
        
        // Usamos la API de validación de HTML5
        if (field.validity.valid) {
            errorElement.textContent = '';
            field.setAttribute('aria-invalid', 'false');
        } else {
            field.setAttribute('aria-invalid', 'true');
            if (field.validity.valueMissing) {
                errorElement.textContent = 'Este campo es obligatorio.';
            } else if (field.validity.typeMismatch) {
                errorElement.textContent = 'Por favor, introduce un correo electrónico válido.';
            }
        }
    };
    
    /**
     * Itera y valida todos los campos de un formulario.
     * @param {HTMLFormElement} form - El formulario a validar.
     */
    const validateAllFields = (form) => {
        const fields = form.querySelectorAll('.form__input, .form__textarea');
        fields.forEach(field => validateField(field));
    };

    // Inicialización de todos los módulos
    initMobileMenu();
    initAccordions();
    initFormValidation();

});