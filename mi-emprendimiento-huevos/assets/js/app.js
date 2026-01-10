document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Mostrar Precio del Maple desde config.js
    const priceEl = document.getElementById('product-price');
    if (priceEl && typeof PRODUCT !== 'undefined') {
        priceEl.textContent = formatCurrency(PRODUCT.price);
    }

    // 2. Cargar Horarios
    loadDeliveryOptions();

    // 3. Autocompletar
    autofillForm();

    // 4. Iniciar Eventos
    initEventListeners();
}

function loadDeliveryOptions() {
    const select = document.getElementById('delivery-time');
    if(!select) return;

    select.innerHTML = '<option value="" disabled selected>Elegí un horario...</option>';
    
    if (typeof DELIVERY_OPTIONS !== 'undefined') {
        DELIVERY_OPTIONS.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
    }
}

function initEventListeners() {
    // Botones + y -
    document.querySelectorAll('.btn-circle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.classList.contains('btn-increase') ? 'increase' : 'decrease';
            const newQty = updateCart('maple', action);
            
            // Actualizamos el número en pantalla
            const display = document.getElementById('qty-maple');
            if(display) display.textContent = newQty;
            
            updateStickyCart();
        });
    });

    // Botón Continuar
    const btnCheckout = document.getElementById('btn-go-checkout');
    if(btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            const checkoutSection = document.getElementById('checkout-section');
            checkoutSection.classList.remove('hidden');
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
            
            btnCheckout.classList.add('hidden');
            document.getElementById('btn-finish-order').classList.remove('hidden');
        });
    }

    // Pago y Alias
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

    const btnCopy = document.getElementById('btn-copy-alias');
    if(btnCopy) {
        btnCopy.addEventListener('click', () => {
            const alias = "HUEVOS.ROSARIO.MP"; // <--- ACÁ PONES TU ALIAS REAL CUANDO LO TENGAS

            // Intento 1: Forma moderna (requiere HTTPS)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(alias)
                    .then(() => alert("¡Alias copiado! 📋"))
                    .catch(() => copiarALaAntigua(alias)); // Si falla, usa el plan B
            } else {
                // Intento 2: Plan B para celulares o archivos locales
                copiarALaAntigua(alias);
            }
        });
    }

    // BOTÓN FINAL
    document.getElementById('btn-finish-order').addEventListener('click', finishOrder);
}

function updateStickyCart() {
    const stickyCart = document.getElementById('sticky-cart');
    const totalItems = getCartCount();
    const totalPrice = getCartTotal();

    if (totalItems > 0) {
        stickyCart.classList.remove('hidden');
    } else {
        stickyCart.classList.add('hidden');
        document.getElementById('checkout-section').classList.add('hidden');
        document.getElementById('btn-go-checkout').classList.remove('hidden');
        document.getElementById('btn-finish-order').classList.add('hidden');
    }

    document.getElementById('cart-total-items').textContent = `${totalItems} items`;
    document.getElementById('cart-total-price').textContent = formatCurrency(totalPrice);
}

function finishOrder() {
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const zone = document.getElementById('zone').value;
    const deliveryTime = document.getElementById('delivery-time').value;

    if (!name || !address || !zone || !deliveryTime) {
        alert("Por favor, completá todos los datos (Nombre, Dirección, Zona y Horario).");
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const userData = { name, address, zone };
    saveUserData(userData);

    const message = generateOrderText(userData, paymentMethod, deliveryTime);
    const waLink = `https://wa.me/${MY_PHONE_NUMBER}?text=${message}`;
    
    window.open(waLink, '_blank');
}

function formatCurrency(amount) {
    return "$" + amount.toLocaleString('es-AR');
}

function copiarALaAntigua(texto) {
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    
    // Lo hacemos invisible pero "tocable"
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert("¡Alias copiado! 📋");
    } catch (err) {
        alert("No se pudo copiar. Tu alias es: " + texto);
    }
    
    document.body.removeChild(textArea);
}