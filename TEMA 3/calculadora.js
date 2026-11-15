// Función para añadir números y operadores a la pantalla de la calculadora
function escribir(valor) {
    let pantalla = document.getElementById("pantalla");
    pantalla.value += valor;
}

// Función para calcular el resultado de la expresión matemática
function resolver() {
    let pantalla = document.getElementById("pantalla");
    try {
        // eval() calcula la operación escrita en la pantalla de forma segura en este contexto escolar
        pantalla.value = eval(pantalla.value);
    } catch (error) {
        pantalla.value = "Error";
    }
}

// Función para limpiar completamente la pantalla (botón C)
function borrar() {
    let pantalla = document.getElementById("pantalla");
    pantalla.value = "";
}