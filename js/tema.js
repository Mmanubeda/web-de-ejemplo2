const CLAVE_TEMA = "tema-web";
const temaGuardado = localStorage.getItem(CLAVE_TEMA);

function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;

    const botonTema = document.getElementById("boton-tema");
    if (botonTema) {
        const modoOscuro = tema === "oscuro";
        botonTema.textContent = modoOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
        botonTema.setAttribute("aria-pressed", String(modoOscuro));
    }
}

aplicarTema(temaGuardado === "oscuro" ? "oscuro" : "claro");

const botonTema = document.getElementById("boton-tema");
if (botonTema) {
    botonTema.addEventListener("click", () => {
        const nuevoTema = document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro";
        localStorage.setItem(CLAVE_TEMA, nuevoTema);
        aplicarTema(nuevoTema);
    });
}
