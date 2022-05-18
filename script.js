'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 720;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png',
});

const player = new Fighter({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    imageSrc: './img/player1/Idle.png',
    framesMax: 8,
    scale: 3.3,
    offset: { x: 50, y: 280 },
    sprites: {
        idle: { imageSrc: './img/player1/Idle.png', framesMax: 8 },
        run: { imageSrc: './img/player1/Run.png', framesMax: 8 },
    },
});

const enemy = new Fighter({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    offset: { x: 50, y: 0 },
    color: 'green',
});

player.draw();
enemy.draw();

const key = {
    q: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    z: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({ player, enemy, timerID }) {
    clearTimeout(timerID);
    document.getElementById('displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        document.getElementById('displayText').innerHTML = 'DRAW!';
    } else if (player.health > enemy.health) {
        document.getElementById('displayText').innerHTML = 'PLAYER 1 WINS!';
    } else if (player.health < enemy.health) {
        document.getElementById('displayText').innerHTML = 'PLAYER 2 WINS!';
    }
}

let timer = 90;
let timerID;

function decreaseTimer() {
    if (timer > 0) {
        timerID = setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById('timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerID });
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    //enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    player.image = player.sprites.idle.image;
    if (key.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5;
        player.image = player.sprites.run.image;
    } else if (key.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.image = player.sprites.run.image;
    }

    if (key.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (key.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        enemy.health -= 10;
        document.getElementById('enemyHealth').style.width = enemy.health + '%';
    }

    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health -= 10;
        document.getElementById('playerHealth').style.width = player.health + '%';
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerID });
    }
}

animate();

window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'd':
            key.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'q':
            key.q.pressed = true;
            player.lastKey = 'q';
            break;
        case 'z':
            player.velocity.y = -20;
            break;
        case ' ':
            player.attack();
            break;
        case 'ArrowRight':
            key.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            key.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            key.ArrowUp.pressed = true;
            enemy.velocity.y = -20;
            break;
        case 'Shift':
            enemy.isAttacking = true;
            break;
    }
});

window.addEventListener('keyup', event => {
    switch (event.key) {
        case 'd':
            key.d.pressed = false;
            break;
        case 'q':
            key.q.pressed = false;
            break;
        case 'z':
            key.z.pressed = false;
            break;
    }

    switch (event.key) {
        case 'ArrowRight':
            key.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            key.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            key.ArrowUp.pressed = false;
            break;
    }
});