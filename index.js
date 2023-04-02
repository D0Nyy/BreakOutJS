"use strict";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const buttonEl = document.getElementById("start");
buttonEl.addEventListener("click", () => startGame());

const game = {
    start: performance.now(),
    elapsed: 0,
    refreshRate: 10,
    speed: 5,
};

const ball = {
    body: new Path2D(),
    radius: 10,
    speed: 5,
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: game.speed * (Math.random() * 2 - 1),
    dy: +game.speed,
};

const player = {
    body: new Path2D(),
    speed: 10,
    width: 100,
    height: 10,
    left: false,
    right: false,
    x: canvas.width / 2 - 100 / 2,
    y: canvas.height - 50
}

let bricks = []

document.addEventListener("keydown", (ev) => {
    if (ev.key.toLowerCase() === "d" || ev.key === "ArrowRight") player.right = true
    if (ev.key.toLowerCase() === "a" || ev.key === "ArrowLeft") player.left = true
})
document.addEventListener("keyup", (ev) => {
    if (ev.key.toLowerCase() === "d" || ev.key === "ArrowRight") player.right = false
    if (ev.key.toLowerCase() === "a" || ev.key === "ArrowLeft") player.left = false
})

function startGame() {
    console.log("Game Started!");
    reset()
    ball.body.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill(ball.body);
    frame(0);
}

function reset() {
    ball.body = new Path2D;
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2
    ball.dx = game.speed * (Math.random() * 2 - 1)
    ball.dy = +game.speed

    player.x = canvas.width / 2 - 100 / 2
    player.y = canvas.height - 50

    bricks = []
    let rows = 3;
    let cols = 22;
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            const brick = {
                width: 30,
                height: 20,
                x: 10 + (32 * j),
                y: 100 + (i * 22)
            }
            bricks.push(brick)
        }
    }
}

function frame(timestamp) {
    game.elapsed = timestamp - game.start;
    if (game.elapsed > game.refreshRate) {
        game.start = timestamp;
        //console.log(`${player.left} ${player.right}`);
        paint();
        update();
    }
    requestAnimationFrame(frame);
}

function paint() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    player.body = new Path2D;
    player.body.rect(player.x, player.y, player.width, player.height)
    ctx.fill(player.body)

    ball.body = new Path2D();
    ball.body.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fill(ball.body);

    for (const brick of bricks) {
        let brickBody = new Path2D;
        brickBody.rect(brick.x, brick.y, brick.width, brick.height)
        ctx.fill(brickBody)
    }

}

function update() {
    if (ball.x + ball.dx > canvas.width || ball.x + ball.dx < 0) {
        ball.dx = -ball.dx
    }
    if (ball.y + ball.dy < 0) {
        ball.dy = -ball.dy
    }
    if (ball.y + ball.dy > canvas.height) {
        return reset()
    }
    if (player.left) {
        player.x -= player.speed;
    }
    if (player.right) {
        player.x += player.speed
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width
    }
    if (player.x <= 0) {
        player.x = 0
    }

    // Collision detection
    if (ball.y + ball.radius >= player.y) {
        if (ball.x + ball.radius >= player.x && ball.x <= player.x + player.width) {
            ball.dy = -ball.dy;
        }
    }

    for (const brick of bricks) {
        if (ball.y < brick.y + brick.height && ball.y + ball.radius > brick.y) {
            if (ball.x + ball.radius >= brick.x && ball.x <= brick.x + brick.width) {
                bricks.splice(bricks.indexOf(brick), 1)
                if (ball.x + 2 * ball.radius - ball.dx <= brick.x || ball.x - ball.dx >= brick.x + brick.width) {
                    ball.dx = -ball.dx;
                    break;
                }
                ball.dy = -ball.dy
                break;
            }
        }
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}
