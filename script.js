'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.lastKey;
    }

    draw() {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }
}

const player = new Sprite({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
});
const enemy = new Sprite({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
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

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (key.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5;
    } else if (key.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    if (key.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (key.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
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