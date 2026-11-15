const canvas = document.getElementById("tablero-pong");
const context = canvas.getContext("2d");
const startButton = document.getElementById("boton-pong");
const statusMessage = document.getElementById("estado-pong");
const playerScore = document.getElementById("marcador-jugador");
const machineScore = document.getElementById("marcador-maquina");

const width = canvas.width;
const height = canvas.height;
const paddleWidth = 110;
const paddleHeight = 12;
const ballRadius = 8;
const winningScore = 5;
const player = { x: (width - paddleWidth) / 2, y: height - 30, score: 0 };
const machine = { x: (width - paddleWidth) / 2, y: 18, score: 0 };
const ball = { x: width / 2, y: height / 2, vx: 4, vy: 4 };
const keys = new Set();
let playing = false;
let animationFrame;

function draw() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#0f172a";
    context.fillRect(0, 0, width, height);

    context.setLineDash([8, 10]);
    context.strokeStyle = "#475569";
    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = "#a5b4fc";
    context.fillRect(machine.x, machine.y, paddleWidth, paddleHeight);
    context.fillStyle = "#818cf8";
    context.fillRect(player.x, player.y, paddleWidth, paddleHeight);
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    context.fill();
}

function resetBall(direction) {
    ball.x = width / 2;
    ball.y = height / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.vy = 4 * direction;
}

function update() {
    if (!playing) return;

    if (keys.has("ArrowLeft") || keys.has("a")) player.x -= 7;
    if (keys.has("ArrowRight") || keys.has("d")) player.x += 7;
    player.x = Math.max(0, Math.min(width - paddleWidth, player.x));

    const machineTarget = ball.x - paddleWidth / 2;
    machine.x += Math.max(-3.5, Math.min(3.5, machineTarget - machine.x));
    machine.x = Math.max(0, Math.min(width - paddleWidth, machine.x));

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ballRadius <= 0 || ball.x + ballRadius >= width) ball.vx *= -1;

    if (
        ball.vy > 0 &&
        ball.y + ballRadius >= player.y &&
        ball.y - ballRadius <= player.y + paddleHeight &&
        ball.x >= player.x &&
        ball.x <= player.x + paddleWidth
    ) {
        ball.vy = -Math.abs(ball.vy);
        ball.vx = ((ball.x - (player.x + paddleWidth / 2)) / (paddleWidth / 2)) * 5;
    }

    if (
        ball.vy < 0 &&
        ball.y - ballRadius <= machine.y + paddleHeight &&
        ball.y + ballRadius >= machine.y &&
        ball.x >= machine.x &&
        ball.x <= machine.x + paddleWidth
    ) {
        ball.vy = Math.abs(ball.vy);
        ball.vx = ((ball.x - (machine.x + paddleWidth / 2)) / (paddleWidth / 2)) * 5;
    }

    if (ball.y < 0) {
        player.score += 1;
        playerScore.textContent = player.score;
        finishPoint(1);
    } else if (ball.y > height) {
        machine.score += 1;
        machineScore.textContent = machine.score;
        finishPoint(-1);
    }
}

function finishPoint(direction) {
    if (player.score === winningScore || machine.score === winningScore) {
        playing = false;
        startButton.textContent = "Jugar otra vez";
        statusMessage.textContent = player.score > machine.score ? "¡Has ganado!" : "La máquina ha ganado. ¡Inténtalo de nuevo!";
        return;
    }
    statusMessage.textContent = player.score > machine.score ? "¡Punto para ti!" : "Punto para la máquina.";
    resetBall(direction);
}

function gameLoop() {
    update();
    draw();
    animationFrame = requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", () => {
    if (playing) return;
    if (player.score === winningScore || machine.score === winningScore) {
        player.score = 0;
        machine.score = 0;
        playerScore.textContent = "0";
        machineScore.textContent = "0";
    }
    resetBall(Math.random() > 0.5 ? 1 : -1);
    playing = true;
    startButton.textContent = "En juego";
    statusMessage.textContent = "¡La partida ha comenzado!";
    canvas.focus();
});

canvas.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(event.key)) {
        event.preventDefault();
        keys.add(event.key.toLowerCase());
    }
});

canvas.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
canvas.addEventListener("blur", () => keys.clear());

canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse" && event.buttons === 0) return;
    const bounds = canvas.getBoundingClientRect();
    const scale = width / bounds.width;
    player.x = Math.max(0, Math.min(width - paddleWidth, (event.clientX - bounds.left) * scale - paddleWidth / 2));
});

canvas.addEventListener("pointerdown", (event) => {
    canvas.focus();
    canvas.setPointerCapture(event.pointerId);
});

draw();
animationFrame = requestAnimationFrame(gameLoop);
