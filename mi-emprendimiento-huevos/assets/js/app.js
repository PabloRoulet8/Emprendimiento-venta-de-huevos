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
    // ⚠️ COMENTADO: Lo desactivamos para que NO borre tus opciones nuevas del HTML (Lunes, Martes, etc.)
    // loadDeliveryOptions(); 

    // 3. Autocompletar formulario si hay datos guardados
    autofillForm();

    // 4. Iniciar los botones (+, -, Continuar, etc.)
    initEventListeners();
}

// Esta función ya no se usa automáticamente, pero la dejamos por si acaso
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

    // Botón Continuar (scrollea hasta el formulario)
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

    // Control de Pago y Alias (Muestra/Oculta la caja del alias)
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

    // Botón Copiar Alias
    const btnCopy = document.getElementById('btn-copy-alias');
    if(btnCopy) {
        btnCopy.addEventListener('click', () => {
            const alias = "HUEVOS.ROSARIO.MP"; // <--- TU ALIAS

            // Intento 1: Forma moderna
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(alias)
                    .then(() => alert("¡Alias copiado! 📋"))
                    .catch(() => copiarALaAntigua(alias));
            } else {
                // Intento 2: Fallback
                copiarALaAntigua(alias);
            }
        });
    }

    // BOTÓN FINAL: FINALIZAR PEDIDO
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

// 👇👇👇 AQUÍ ESTÁ LA LÓGICA ACTUALIZADA 👇👇👇
function finishOrder() {
    // 1. Capturamos los datos básicos
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const zone = document.getElementById('zone').value;
    
    // 2. Capturamos DÍA y HORA por separado
    const diaEntrega = document.getElementById('delivery-day').value;
    const horaEntrega = document.getElementById('delivery-time').value;

    // 3. Validamos que TODO esté completo
    if (!name || !address || !zone || !diaEntrega || !horaEntrega) {
        alert("Por favor, completá todos los datos:\n- Nombre\n- Dirección\n- Zona\n- Día de entrega\n- Horario");
        return;
    }

    // 4. Preparamos los datos
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const userData = { name, address, zone };
    saveUserData(userData);

    // 5. Combinamos Día y Hora en una sola frase para WhatsApp
    // Esto hace que la función vieja 'generateOrderText' reciba todo junto y no se rompa
    const infoEntregaCompleta = `${diaEntrega} - ${horaEntrega}`;

    // 6. Generamos el mensaje y abrimos WhatsApp
    // (generateOrderText está en cart.js, le pasamos la info combinada)
    const message = generateOrderText(userData, paymentMethod, infoEntregaCompleta);
    const waLink = `https://wa.me/${MY_PHONE_NUMBER}?text=${message}`;
    
    window.open(waLink, '_blank');
}

function formatCurrency(amount) {
    return "$" + amount.toLocaleString('es-AR');
}

function copiarALaAntigua(texto) {
    const textArea = document.createElement("textarea");
    textArea.value = texto;
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