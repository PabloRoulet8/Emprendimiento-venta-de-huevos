// Estado inicial del carrito
let cart = {
    "docena": 0,
    "maple": 0
};

/**
 * Suma o resta una unidad
 * @param {string} productId - 'docena' o 'maple'
 * @param {string} action - 'increase' o 'decrease'
 */
function updateCart(productId, action) {
    if (action === 'increase') {
        cart[productId]++;
    } else if (action === 'decrease' && cart[productId] > 0) {
        cart[productId]--;
    }
    return cart[productId]; // Devuelve la nueva cantidad
}

/**
 * Calcula el total en pesos
 */
function getCartTotal() {
    let total = 0;
    for (const [id, qty] of Object.entries(cart)) {
        if (PRODUCTS_DB[id]) {
            total += PRODUCTS_DB[id].price * qty;
        }
    }
    return total;
}

/**
 * Cuenta cuántos ítems hay en total
 */
function getCartCount() {
    return Object.values(cart).reduce((acc, curr) => acc + curr, 0);
}

/**
 * Genera el texto para el mensaje de WhatsApp
 */
function generateOrderText(userData, paymentMethod) {
    let text = `*¡Hola! Quiero realizar un pedido:*%0A%0A`; // %0A es salto de línea
    
    // Detalle de productos
    for (const [id, qty] of Object.entries(cart)) {
        if (qty > 0) {
            const productName = PRODUCTS_DB[id].name;
            const subtotal = PRODUCTS_DB[id].price * qty;
            text += `- ${qty}x ${productName} ($${subtotal})%0A`;
        }
    }

    text += `%0A*Total: $${getCartTotal()}*%0A`;
    text += `--------------------------------%0A`;
    text += `*Cliente:* ${userData.name}%0A`;
    text += `*Dirección:* ${userData.address} (${userData.zone})%0A`;
    text += `*Pago:* ${paymentMethod.toUpperCase()}%0A`;

    if (paymentMethod === 'transferencia') {
        text += `_(Envío comprobante en breve)_`;
    }

    return text;
}