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
    position: { x: 200, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    imageSrc: './img/player1/Idle.png',
    framesMax: 8,
    scale: 3.3,
    offset: { x: 215, y: 280 },
    sprites: {
        idle: { imageSrc: './img/player1/Idle.png', framesMax: 8 },
        run: { imageSrc: './img/player1/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/player1/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/player1/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/player1/Attack1.png', framesMax: 6 },
        takeHit: { imageSrc: './img/player1/Take Hit.png', framesMax: 4 },
        death: { imageSrc: './img/player1/Death.png', framesMax: 6 },
    },
    attackBox: {
        offset: { x: 165, y: -90 },
        width: 245,
        height: 210,
    },
});

const enemy = new Fighter({
    position: { x: 900, y: 100 },
    velocity: { x: 0, y: 0 },
    offset: { x: -50, y: 0 },
    imageSrc: './img/player2/Idle.png',
    framesMax: 4,
    scale: 3.3,
    offset: { x: 215, y: 298 },
    sprites: {
        idle: { imageSrc: './img/player2/Idle.png', framesMax: 4 },
        run: { imageSrc: './img/player2/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/player2/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/player2/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/player2/Attack1.png', framesMax: 4 },
        takeHit: { imageSrc: './img/player2/Take hit.png', framesMax: 3 },
        death: { imageSrc: './img/player2/Death.png', framesMax: 7 },
    },
    attackBox: {
        offset: { x: -175, y: -90 },
        width: 245,
        height: 210,
    },
});

const key = {
    q: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
};

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player1 movements
    if (key.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (key.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // player2 movements
    if (key.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (key.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //collision detection
    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: enemy.health + '%',
        });
    }

    // missed
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    //get hit
    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealth', {
            width: player.health + '%',
        });
    }

    // missed
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    //game over based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerID });
    }
}

animate();

window.addEventListener('keydown', event => {
    if (!player.dead) {
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
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                key.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                key.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
            case 'Shift':
                enemy.attack();
                break;
        }
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
    }

    switch (event.key) {
        case 'ArrowRight':
            key.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            key.ArrowLeft.pressed = false;
            break;
    }
});