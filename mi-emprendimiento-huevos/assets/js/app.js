// TU NÚMERO DE WHATSAPP (Formato internacional sin +)
// Ejemplo: 549 + código de área (341 para Rosario) + número
const MY_PHONE_NUMBER = "5493464529680"; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar precios desde products.js
    loadPrices();
    
    // 2. Intentar rellenar datos si el usuario ya compró antes
    autofillForm();

    // 3. Inicializar eventos
    initEventListeners();
});

// --- FUNCIONES DE INICIALIZACIÓN ---

function loadPrices() {
    const priceElements = document.querySelectorAll('.price[data-product-id]');
    priceElements.forEach(element => {
        const productId = element.getAttribute('data-product-id');
        if (PRODUCTS_DB[productId]) {
            element.textContent = formatCurrency(PRODUCTS_DB[productId].price);
        }
    });
}

function initEventListeners() {
    // A. Botones de sumar/restar (+ y -)
    document.querySelectorAll('.btn-circle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.classList.contains('btn-increase') ? 'increase' : 'decrease';
            const productId = e.target.dataset.id;
            
            // Actualizamos lógica del carrito
            const newQty = updateCart(productId, action);
            
            // Actualizamos UI visual
            document.getElementById(`qty-${productId}`).textContent = newQty;
            updateStickyCart();
        });
    });

    // B. Botón "Continuar" (Muestra el checkout)
    document.getElementById('btn-go-checkout').addEventListener('click', () => {
        const checkoutSection = document.getElementById('checkout-section');
        checkoutSection.classList.remove('hidden');
        // Scroll suave hacia el formulario
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
        
        // Cambiar botones en el sticky cart
        document.getElementById('btn-go-checkout').classList.add('hidden');
        document.getElementById('btn-finish-order').classList.remove('hidden');
    });

    // C. Detectar cambio en método de pago (Mostrar/Ocultar Alias)
    const paymentRadios = document.getElementsByName('payment');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const aliasBox = document.getElementById('alias-box');
            if (e.target.value === 'transferencia') {
                aliasBox.classList.remove('hidden');
            } else {
                aliasBox.classList.add('hidden');
            }
        });
    });

    // D. Botón copiar Alias
    document.getElementById('btn-copy-alias').addEventListener('click', () => {
        navigator.clipboard.writeText("HUEVOS.ROSARIO.MP");
        alert("¡Alias copiado al portapapeles!");
    });

    // E. BOTÓN FINAL: PEDIR POR WHATSAPP
    document.getElementById('btn-finish-order').addEventListener('click', finishOrder);
}

// --- LÓGICA DE UI Y FINALIZACIÓN ---

function updateStickyCart() {
    const stickyCart = document.getElementById('sticky-cart');
    const totalItems = getCartCount();
    const totalPrice = getCartTotal();

    // Mostrar u ocultar la barra
    if (totalItems > 0) {
        stickyCart.classList.remove('hidden');
    } else {
        stickyCart.classList.add('hidden');
        // Si vaciaron el carro, ocultamos también el checkout
        document.getElementById('checkout-section').classList.add('hidden');
        // Reset botones
        document.getElementById('btn-go-checkout').classList.remove('hidden');
        document.getElementById('btn-finish-order').classList.add('hidden');
    }

    // Actualizar textos
    document.getElementById('cart-total-items').textContent = `${totalItems} items`;
    document.getElementById('cart-total-price').textContent = formatCurrency(totalPrice);
}

function finishOrder() {
    // 1. Validar formulario
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const zone = document.getElementById('zone').value;
    
    if (!name || !address || !zone) {
        alert("Por favor, completá todos los datos de envío (Nombre, Dirección y Barrio).");
        return;
    }

    // 2. Obtener método de pago
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // 3. Guardar datos para la próxima (UX Pro)
    const userData = { name, address, zone };
    saveUserData(userData);

    // 4. Generar Link y abrir WhatsApp
    const message = generateOrderText(userData, paymentMethod);
    const waLink = `https://wa.me/${MY_PHONE_NUMBER}?text=${message}`;
    
    window.open(waLink, '_blank');
}

function formatCurrency(amount) {
    return "$" + amount.toLocaleString('es-AR');
}