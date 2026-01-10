// js/cart.js

// Estado inicial del carrito (Solo vendemos Maple por ahora)
let cart = {
    "maple": 0
};

/**
 * Suma o resta una unidad
 * @param {string} productId - Siempre será 'maple' en esta versión
 * @param {string} action - 'increase' o 'decrease'
 */
function updateCart(productId, action) {
    // Si el producto no existe en el objeto cart, lo iniciamos en 0
    if (!cart[productId]) cart[productId] = 0;

    if (action === 'increase') {
        cart[productId]++;
    } else if (action === 'decrease' && cart[productId] > 0) {
        cart[productId]--;
    }
    return cart[productId]; 
}

/**
 * Calcula el total en pesos
 * (NUEVO: Ahora usa la constante PRODUCT de config.js)
 */
function getCartTotal() {
    // Multiplicamos la cantidad de maples por el precio configurado
    return cart['maple'] * PRODUCT.price;
}

/**
 * Cuenta cuántos ítems hay en total
 */
function getCartCount() {
    return cart['maple'];
}

/**
 * Genera el texto para el mensaje de WhatsApp
 * (NUEVO: Ahora recibe el parámetro deliveryTime)
 */
function generateOrderText(userData, paymentMethod, deliveryTime) {
    let text = `*¡Hola! Quiero realizar un pedido:*%0A%0A`; // %0A es salto de línea
    
    const qty = cart['maple'];
    
    // Solo agregamos línea si hay cantidad mayor a 0
    if (qty > 0) {
        const subtotal = qty * PRODUCT.price;
        // Usamos el nombre definido en config.js
        text += `- ${qty}x ${PRODUCT.name} ($${subtotal})%0A`;
    }

    text += `%0A*Total a pagar: $${getCartTotal()}*%0A`;
    text += `--------------------------------%0A`;
    
    // Datos del Cliente
    text += `*Cliente:* ${userData.name}%0A`;
    text += `*Dirección:* ${userData.address} (${userData.zone})%0A`;
    
    // (NUEVO: Agregamos el horario al mensaje)
    text += `*Horario:* ${deliveryTime}%0A`; 
    
    text += `*Pago:* ${paymentMethod.toUpperCase()}%0A`;

    if (paymentMethod === 'transferencia') {
        text += `_(Envío comprobante en breve)_`;
    }

    return text;
}