const iconos = {
    piedra: '✊',
    papel: '✋',
    tijera: '✌️'
};

const botones = document.querySelectorAll('.boton-eleccion');
const iconoJugador = document.getElementById('icono-jugador');
const iconoMaquina = document.getElementById('icono-maquina');
const resultado = document.getElementById('resultado');

function obtenerResultado(jugador, maquina) {
    if (jugador === maquina) {
        return 'empate';
    }

    const ganaJugador =
        (jugador === 'piedra' && maquina === 'tijera') ||
        (jugador === 'papel' && maquina === 'piedra') ||
        (jugador === 'tijera' && maquina === 'papel');

    return ganaJugador ? 'jugador' : 'maquina';
}

function jugar(eleccionJugador) {
    const opciones = Object.keys(iconos);
    const eleccionMaquina = opciones[Math.floor(Math.random() * opciones.length)];
    const ganador = obtenerResultado(eleccionJugador, eleccionMaquina);

    botones.forEach((boton) => {
        boton.disabled = true;
    });

    [iconoJugador, iconoMaquina].forEach((icono) => {
        icono.className = 'icono';
    });

    iconoJugador.textContent = iconos[eleccionJugador];
    iconoMaquina.textContent = iconos[eleccionMaquina];
    iconoJugador.classList.add('visible', 'animando');
    iconoMaquina.classList.add('visible', 'animando');
    resultado.textContent = '¡Choque!';

    window.setTimeout(() => {
        iconoJugador.classList.remove('animando');
        iconoMaquina.classList.remove('animando');

        if (ganador === 'empate') {
            iconoMaquina.classList.add('perdedor');
            iconoJugador.classList.add('ganador');
            resultado.textContent = `¡Empate! Ambos elegisteis ${eleccionJugador}.`;
        } else {
            const iconoGanador = ganador === 'jugador' ? iconoJugador : iconoMaquina;
            const iconoPerdedor = ganador === 'jugador' ? iconoMaquina : iconoJugador;
            iconoGanador.classList.add('ganador');
            iconoPerdedor.classList.add('perdedor');
            resultado.textContent = ganador === 'jugador'
                ? `¡Has ganado! ${capitalizar(eleccionJugador)} vence a ${eleccionMaquina}.`
                : `La máquina gana: ${capitalizar(eleccionMaquina)} vence a ${eleccionJugador}.`;
        }

        botones.forEach((boton) => {
            boton.disabled = false;
        });
    }, 700);
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

botones.forEach((boton) => {
    boton.addEventListener('click', () => jugar(boton.dataset.eleccion));
});
