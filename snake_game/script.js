const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;
const CANVAS_CENTER_X = 600;
const CANVAS_CENTER_Y = 400;
const BOUNDARY_X = 580;
const BOUNDARY_Y = 380;
const UPDATE_INTERVAL = 100; // ms, equivalent to 0.1s

let snake = [{x: 0, y: 0}, {x: -GRID_SIZE, y: 0}, {x: -2 * GRID_SIZE, y: 0}];
let direction = 'right';
let nextDirection = 'right';
let eatCount = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let food = generateFood();
let timer;
let blinkTimer = 0;
let eyesOpen = true;
let tongueLength = 5;
let tonguePhase = 0;
let specialFoodTimer = null;

const playButton = document.getElementById('play');
const gameOverDiv = document.getElementById('gameover');
const finalScoreDiv = document.getElementById('final-score');
const congratsDiv = document.getElementById('congrats');
const restartButton = document.getElementById('restart');
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');

playButton.addEventListener('click', () => {
    playButton.style.display = 'none';
    gameOverDiv.style.display = 'none';
    startGame();
});

restartButton.addEventListener('click', () => {
    playButton.style.display = 'none';
    gameOverDiv.style.display = 'none';
    startGame();
});

upButton.addEventListener('click', () => {
    if (direction !== 'down') {
        nextDirection = 'up';
    }
});

downButton.addEventListener('click', () => {
    if (direction !== 'up') {
        nextDirection = 'down';
    }
});

leftButton.addEventListener('click', () => {
    if (direction !== 'right') {
        nextDirection = 'left';
    }
});

rightButton.addEventListener('click', () => {
    if (direction !== 'left') {
        nextDirection = 'right';
    }
});

function startGame() {
    timer = setInterval(gameLoop, UPDATE_INTERVAL);
}

function gameLoop() {
    direction = nextDirection;
    moveSnake();
    checkCollisions();
    updateBlink();
    updateTongue();
    draw();
    updateScoreboard();
}

function moveSnake() {
    // Move body
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }
    // Move head
    if (direction === 'right') {
        snake[0].x += GRID_SIZE;
    } else if (direction === 'left') {
        snake[0].x -= GRID_SIZE;
    } else if (direction === 'up') {
        snake[0].y += GRID_SIZE;
    } else if (direction === 'down') {
        snake[0].y -= GRID_SIZE;
    }
}

function extendSnake() {
    const last = snake[snake.length - 1];
    snake.push({x: last.x, y: last.y});
}

function checkCollisions() {
    const head = snake[0];

    // Wall collision
    if (head.x > BOUNDARY_X || head.x < -BOUNDARY_X || head.y > BOUNDARY_Y || head.y < -BOUNDARY_Y) {
        resetGame();
        return;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (Math.hypot(head.x - snake[i].x, head.y - snake[i].y) < 10) {
            resetGame();
            return;
        }
    }

    // Food collision
    if (Math.hypot(head.x - food.x, head.y - food.y) < (10 + food.radius)) {
        score += food.isSpecial ? 15 : 5;
        eatCount += 1;
        if (food.isSpecial && specialFoodTimer) {
            clearTimeout(specialFoodTimer);
            specialFoodTimer = null;
        }
        extendSnake();
        food = generateFood();
    }
}

function resetGame() {
    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    finalScoreDiv.innerText = `Score: ${score}`;
    congratsDiv.innerText = isNewHighScore ? `Congratulations! New High Score: ${highScore}` : '';
    score = 0;
    eatCount = 0;
    snake = [{x: 0, y: 0}, {x: -GRID_SIZE, y: 0}, {x: -2 * GRID_SIZE, y: 0}];
    direction = 'right';
    nextDirection = 'right';
    food = generateFood();
    eyesOpen = true;
    blinkTimer = 0;
    tongueLength = 5;
    tonguePhase = 0;
    if (specialFoodTimer) {
        clearTimeout(specialFoodTimer);
        specialFoodTimer = null;
    }
    clearInterval(timer);
    gameOverDiv.style.display = 'flex';
    updateScoreboard();
}

function generateFood(forceRegular = false) {
    const isSpecial = !forceRegular && (eatCount % 5 === 4);
    const radius = isSpecial ? 15 : 5;
    const color = isSpecial ? 'red' : 'blue';
    const randomX = Math.floor(Math.random() * (BOUNDARY_X * 2 + 1)) - BOUNDARY_X;
    const randomY = Math.floor(Math.random() * (BOUNDARY_Y * 2 + 1)) - BOUNDARY_Y;
    const newFood = {x: randomX, y: randomY, isSpecial, radius, color};
    if (isSpecial) {
        specialFoodTimer = setTimeout(() => {
            food = generateFood(true); // Force regular food
        }, 10000);
    }
    return newFood;
}

function updateBlink() {
    blinkTimer += UPDATE_INTERVAL;
    if (blinkTimer > 2000 + Math.random() * 1000) { // Blink every 2-3 seconds
        eyesOpen = !eyesOpen;
        blinkTimer = eyesOpen ? 200 : 0; // Eyes closed for 200ms
    }
}

function updateTongue() {
    tonguePhase += 0.1;
    tongueLength = 5 + 5 * Math.sin(tonguePhase); // Oscillates between 5 and 10 pixels
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000'; // Black canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake body as a continuous path
    ctx.beginPath();
    ctx.strokeStyle = '#0000ff'; // Blue snake
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const head = snake[0];
    ctx.moveTo(head.x + CANVAS_CENTER_X, CANVAS_CENTER_Y - head.y);
    for (let i = 1; i < snake.length; i++) {
        const current = snake[i];
        const prev = snake[i - 1];
        const controlX = (prev.x + current.x) / 2 + CANVAS_CENTER_X;
        const controlY = CANVAS_CENTER_Y - (prev.y + current.y) / 2;
        ctx.quadraticCurveTo(controlX, controlY, current.x + CANVAS_CENTER_X, CANVAS_CENTER_Y - current.y);
    }
    for (let i = 0; i < snake.length; i++) {
        const t = i / (snake.length - 1);
        ctx.lineWidth = 20 - 10 * t; // Decrease from 20 to 10 from head to tail
        if (i === 0) ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(snake[i].x + CANVAS_CENTER_X, CANVAS_CENTER_Y - snake[i].y);
        if (i < snake.length - 1) {
            const next = snake[i + 1];
            const controlX = (snake[i].x + next.x) / 2 + CANVAS_CENTER_X;
            const controlY = CANVAS_CENTER_Y - (snake[i].y + next.y) / 2;
            ctx.quadraticCurveTo(controlX, controlY, next.x + CANVAS_CENTER_X, CANVAS_CENTER_Y - next.y);
        }
        ctx.stroke();
    }
    ctx.lineWidth = 1; // Reset line width

    // Draw yellow dots on body
    ctx.fillStyle = 'yellow';
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        ctx.beginPath();
        ctx.arc(segment.x + CANVAS_CENTER_X, CANVAS_CENTER_Y - segment.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw snake head
    ctx.fillStyle = '#0000ff';
    drawRoundedRect(head.x + CANVAS_CENTER_X - 11, CANVAS_CENTER_Y - head.y - 11, 22, 22, 5); // Larger head
    
    // Draw eyes
    ctx.fillStyle = 'white';
    if (direction === 'right' || direction === 'left') {
        ctx.beginPath();
        ctx.arc(head.x + CANVAS_CENTER_X + (direction === 'right' ? 6 : -6), CANVAS_CENTER_Y - head.y - 5, 3, 0, 2 * Math.PI);
        ctx.arc(head.x + CANVAS_CENTER_X + (direction === 'right' ? 6 : -6), CANVAS_CENTER_Y - head.y + 5, 3, 0, 2 * Math.PI);
        ctx.fill();
        if (eyesOpen) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(head.x + CANVAS_CENTER_X + (direction === 'right' ? 6 : -6), CANVAS_CENTER_Y - head.y - 5, 1, 0, 2 * Math.PI);
            ctx.arc(head.x + CANVAS_CENTER_X + (direction === 'right' ? 6 : -6), CANVAS_CENTER_Y - head.y + 5, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    } else {
        ctx.beginPath();
        ctx.arc(head.x + CANVAS_CENTER_X - 5, CANVAS_CENTER_Y - head.y + (direction === 'up' ? 6 : -6), 3, 0, 2 * Math.PI);
        ctx.arc(head.x + CANVAS_CENTER_X + 5, CANVAS_CENTER_Y - head.y + (direction === 'up' ? 6 : -6), 3, 0, 2 * Math.PI);
        ctx.fill();
        if (eyesOpen) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(head.x + CANVAS_CENTER_X - 5, CANVAS_CENTER_Y - head.y + (direction === 'up' ? 6 : -6), 1, 0, 2 * Math.PI);
            ctx.arc(head.x + CANVAS_CENTER_X + 5, CANVAS_CENTER_Y - head.y + (direction === 'up' ? 6 : -6), 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Draw tongue
    ctx.fillStyle = 'red';
    ctx.beginPath();
    if (direction === 'right') {
        ctx.rect(head.x + CANVAS_CENTER_X + 11, CANVAS_CENTER_Y - head.y - 2, tongueLength, 2);
    } else if (direction === 'left') {
        ctx.rect(head.x + CANVAS_CENTER_X - 11 - tongueLength, CANVAS_CENTER_Y - head.y - 2, tongueLength, 2);
    } else if (direction === 'up') {
        ctx.rect(head.x + CANVAS_CENTER_X - 2, CANVAS_CENTER_Y - head.y + 11, 2, tongueLength);
    } else if (direction === 'down') {
        ctx.rect(head.x + CANVAS_CENTER_X - 2, CANVAS_CENTER_Y - head.y - 11 - tongueLength, 2, tongueLength);
    }
    ctx.fill();

    // Draw yellow dot on head
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(head.x + CANVAS_CENTER_X, CANVAS_CENTER_Y - head.y, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw food
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(food.x + CANVAS_CENTER_X, CANVAS_CENTER_Y - food.y, food.radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
    ctx.lineTo(x + radius, y + height);
    ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, 3 * Math.PI / 2);
    ctx.closePath();
    ctx.fill();
}

function updateScoreboard() {
    document.getElementById('score').innerText = score;
    document.getElementById('highscore').innerText = highScore;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction !== 'down') {
        nextDirection = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        nextDirection = 'down';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        nextDirection = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        nextDirection = 'right';
    }
});

updateScoreboard();