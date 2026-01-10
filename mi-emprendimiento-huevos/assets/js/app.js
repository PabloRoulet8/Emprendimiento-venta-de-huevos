document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Mostrar Precio del Maple
    const priceEl = document.getElementById('product-price');
    if (priceEl) {
        priceEl.textContent = formatCurrency(PRODUCT.price);
    }

    // 2. Cargar Horarios en el Select
    loadDeliveryOptions();

    // 3. Autocompletar datos guardados
    autofillForm();

    // 4. Iniciar Eventos
    initEventListeners();
}

function loadDeliveryOptions() {
    const select = document.getElementById('delivery-time');
    // Limpiamos opciones anteriores
    select.innerHTML = '<option value="" disabled selected>Elegí un horario...</option>';
    
    // Cargamos las nuevas desde config.js
    DELIVERY_OPTIONS.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function initEventListeners() {
    // Botones + y - (Ahora solo controlan el Maple)
    document.querySelectorAll('.btn-circle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.classList.contains('btn-increase') ? 'increase' : 'decrease';
            // Como solo hay un producto, usamos el ID fijo 'maple'
            const newQty = updateCart('maple', action);
            
            document.getElementById('qty-maple').textContent = newQty;
            updateStickyCart();
        });
    });

    // ... (El resto de los listeners: checkout, pago, alias siguen igual) ...
    // Solo asegúrate de que finishOrder capture el nuevo campo
    
    document.getElementById('btn-finish-order').addEventListener('click', finishOrder);
    
    // ... Copia los listeners de pago y alias del anterior app.js ...
}

// ... updateStickyCart y formatCurrency siguen igual ...

function finishOrder() {
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const zone = document.getElementById('zone').value;
    const deliveryTime = document.getElementById('delivery-time').value; // NUEVO

    if (!name || !address || !zone || !deliveryTime) {
        alert("Por favor, completá todos los datos, incluyendo el horario.");
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const userData = { name, address, zone };
    saveUserData(userData);

    // Generamos mensaje con el nuevo campo horario
    const message = generateOrderText(userData, paymentMethod, deliveryTime);
    const waLink = `https://wa.me/${MY_PHONE_NUMBER}?text=${message}`;
    
    window.open(waLink, '_blank');
}document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Mostrar Precio del Maple
    const priceEl = document.getElementById('product-price');
    if (priceEl) {
        priceEl.textContent = formatCurrency(PRODUCT.price);
    }

    // 2. Cargar Horarios en el Select
    loadDeliveryOptions();

    // 3. Autocompletar datos guardados
    autofillForm();

    // 4. Iniciar Eventos
    initEventListeners();
}

function loadDeliveryOptions() {
    const select = document.getElementById('delivery-time');
    // Limpiamos opciones anteriores
    select.innerHTML = '<option value="" disabled selected>Elegí un horario...</option>';
    
    // Cargamos las nuevas desde config.js
    DELIVERY_OPTIONS.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function initEventListeners() {
    // Botones + y - (Ahora solo controlan el Maple)
    document.querySelectorAll('.btn-circle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.classList.contains('btn-increase') ? 'increase' : 'decrease';
            // Como solo hay un producto, usamos el ID fijo 'maple'
            const newQty = updateCart('maple', action);
            
            document.getElementById('qty-maple').textContent = newQty;
            updateStickyCart();
        });
    });

    // ... (El resto de los listeners: checkout, pago, alias siguen igual) ...
    // Solo asegúrate de que finishOrder capture el nuevo campo
    
    document.getElementById('btn-finish-order').addEventListener('click', finishOrder);
    
    // ... Copia los listeners de pago y alias del anterior app.js ...
}

// ... updateStickyCart y formatCurrency siguen igual ...

function finishOrder() {
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const zone = document.getElementById('zone').value;
    const deliveryTime = document.getElementById('delivery-time').value; // NUEVO

    if (!name || !address || !zone || !deliveryTime) {
        alert("Por favor, completá todos los datos, incluyendo el horario.");
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const userData = { name, address, zone };
    saveUserData(userData);

    // Generamos mensaje con el nuevo campo horario
    const message = generateOrderText(userData, paymentMethod, deliveryTime);
    const waLink = `https://wa.me/${MY_PHONE_NUMBER}?text=${message}`;
    
    window.open(waLink, '_blank');
}