// assets/js/cart.js

// Estado inicial
let cart = {
    "maple": 0
};

function updateCart(productId, action) {
    if (!cart[productId]) cart[productId] = 0;

    if (action === 'increase') {
        cart[productId]++;
    } else if (action === 'decrease' && cart[productId] > 0) {
        cart[productId]--;
    }
    return cart[productId]; 
}

function getCartTotal() {
    return cart['maple'] * PRODUCT.price;
}

function getCartCount() {
    return cart['maple'];
}

function generateOrderText(userData, paymentMethod, deliveryTime) {
    let text = `*¡Hola! Quiero realizar un pedido:*%0A%0A`;
    
    const qty = cart['maple'];
    
    if (qty > 0) {
        const subtotal = qty * PRODUCT.price;
        text += `- ${qty}x ${PRODUCT.name} ($${subtotal})%0A`;
    }

    text += `%0A*Total a pagar: $${getCartTotal()}*%0A`;
    text += `--------------------------------%0A`;
    text += `*Cliente:* ${userData.name}%0A`;
    text += `*Dirección:* ${userData.address} (${userData.zone})%0A`;
    text += `*Horario:* ${deliveryTime}%0A`; 
    text += `*Pago:* ${paymentMethod.toUpperCase()}%0A`;

    if (paymentMethod === 'transferencia') {
        text += `_(Envío comprobante en breve)_`;
    }

    return text;
}