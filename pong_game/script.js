const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 10; // Slower paddle speed
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveUp() {
        if (this.y - this.speed >= 0) {
            this.y -= this.speed;
        }
    }

    moveDown() {
        if (this.y + this.height + this.speed <= canvas.height) {
            this.y += this.speed;
        }
    }
}

class Ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 10;
        this.dx = Math.random() < 0.5 ? -3 : 3;
        this.dy = Math.random() < 0.5 ? -2 : 2;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    bounceX() {
        this.dx *= -1;
    }

    bounceY() {
        this.dy *= -1;
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.dx = Math.random() < 0.5 ? -3 : 3;
        this.dy = Math.random() < 0.5 ? -2 : 2;
    }
}

class ScoreBoard {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.score = 0;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.font = '24px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText(`Score: ${this.score}`, this.x, this.y);
    }

    increase() {
        this.score += 1;
    }

    reset() {
        this.score = 0;
    }
}

class WinBoard {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.count = 0;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.font = '24px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText(`WINS: ${this.count}`, this.x, this.y);
    }

    increase() {
        this.count += 1;
    }

    reset() {
        this.count = 0;
    }
}

const paddle1 = new Paddle(20, canvas.height / 2 - 50, 10, 100);
const paddle2 = new Paddle(canvas.width - 30, canvas.height / 2 - 50, 10, 100);
const ball = new Ball();
const scoreBoard1 = new ScoreBoard(canvas.width / 2 - 250, 30);
const scoreBoard2 = new ScoreBoard(canvas.width / 2 + 250, 30);
const winBoard1 = new WinBoard(50, canvas.height - 30);
const winBoard2 = new WinBoard(canvas.width - 50, canvas.height - 30);

const keys = {};
let gameIsOn = false;

function drawDashedLine() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function updatePaddles() {
    if (gameIsOn) {
        if (keys['w']) paddle1.moveUp();
        if (keys['s']) paddle1.moveDown();
        if (keys['ArrowUp']) paddle2.moveUp();
        if (keys['ArrowDown']) paddle2.moveDown();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePaddles();
    paddle1.draw();
    paddle2.draw();
    ball.draw();
    scoreBoard1.draw();
    scoreBoard2.draw();
    winBoard1.draw();
    winBoard2.draw();
    drawDashedLine();

    if (gameIsOn) {
        ball.move();

        // Wall collision
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.bounceY();
        }

        // Paddle collision
        if (
            ball.x - ball.radius < paddle1.x + paddle1.width &&
            ball.y > paddle1.y &&
            ball.y < paddle1.y + paddle1.height
        ) {
            ball.bounceX();
            scoreBoard1.increase();
        } else if (
            ball.x + ball.radius > paddle2.x &&
            ball.y > paddle2.y &&
            ball.y < paddle2.y + paddle2.height
        ) {
            ball.bounceX();
            scoreBoard2.increase();
        }

        // Out of bounds
        if (ball.x < 0) {
            winBoard2.increase();
            ball.reset();
        } else if (ball.x > canvas.width) {
            winBoard1.increase();
            ball.reset();
        }
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('playButton').addEventListener('click', () => {
    gameIsOn = !gameIsOn;
    document.getElementById('playButton').textContent = gameIsOn ? 'Pause' : 'Play';
});

document.getElementById('resetButton').addEventListener('click', () => {
    scoreBoard1.reset();
    scoreBoard2.reset();
    winBoard1.reset();
    winBoard2.reset();
    ball.reset();
    gameIsOn = false;
    document.getElementById('playButton').textContent = 'Play';
});

gameLoop();