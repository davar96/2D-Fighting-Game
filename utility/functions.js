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