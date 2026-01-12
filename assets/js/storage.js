const USER_DATA_KEY = 'huevos_user_data';

/**
 * Guarda los datos del formulario en el navegador
 */
function saveUserData(userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

/**
 * Recupera los datos si existen
 */
function getUserData() {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Rellena el formulario automáticamente si hay datos guardados
 */
function autofillForm() {
    const data = getUserData();
    if (data) {
        if(document.getElementById('name')) document.getElementById('name').value = data.name || '';
        if(document.getElementById('address')) document.getElementById('address').value = data.address || '';
        if(document.getElementById('zone')) document.getElementById('zone').value = data.zone || '';
        console.log("Datos de usuario cargados automáticamente.");
    }
}