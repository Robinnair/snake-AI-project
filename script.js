const canvas = document.getElementById('snake')
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 20;

let gameover = false;
const moveInterval = 100;
let lastTime = 0;

let apple = { x: 0, y: 0 };

canvas.width = COLS * 20;
canvas.height = ROWS * 20;

const deathSound = new Audio("sound/actually-good-fahhhh-sfx.mp3");
deathSound.volume = 1;

let musicstart = false;
let bgmusic = new Audio("sound/Toby Fox - DELTARUNE Chapters 3+4 OST - 33 SWORD.mp3");
bgmusic.volume = 0.3;
let appleSoundEffect = new Audio("snd-crownshrink.mp3");
appleSoundEffect.volume = 0.6;
bgmusic.loop = true;

const DIRS =
    [{ x: 0, y: 1 },//down
    { x: 0, y: -1 },//up
    { x: 1, y: 0 },//right
    { x: -1, y: 0 }//left
    ];

ctx.scale(20, 20);
let direction = { x: 0, y: -1 };
document.addEventListener('keydown', event => {
    if (event.key == 'ArrowDown' && direction.y !== -1) {
        if (!musicstart) {
            bgmusic.play();
            musicstart = true;
        }
        direction = { x: 0, y: 1 };
    }
    if (event.key == 'ArrowUp' && direction.y !== 1) {
        if (!musicstart) {
            bgmusic.play();
            musicstart = true;
        }
        direction = { x: 0, y: -1 };
    }
    if (event.key == 'ArrowLeft' && direction.x !== 1) {
        if (!musicstart) {
            bgmusic.play();
            musicstart = true;
        }
        direction = { x: -1, y: 0 };
    }
    if (event.key == 'ArrowRight' && direction.x !== -1) {
        if (!musicstart) {
            bgmusic.play();
            musicstart = true;
        }
        direction = { x: 1, y: 0 };
    }
});

function createSnake() {
    return {
        body: [{ x: 10, y: 0 },
        { x: 10, y: 1 },
        { x: 10, y: 2 }],
    };
}

const Snake = createSnake();

function checkCollision(newhead, willgrow) {
    const length = Snake.body.length;
    const limit = willgrow ? length : length - 1;

    for (let i = 0; i < limit; i++) {
        if (
            newhead.x === Snake.body[i].x &&
            newhead.y === Snake.body[i].y
        ) {
            return true;
        }
    }
    return false;
}


function collide(newhead, willgrow) {
    const length = Snake.body.length;
    const limit = willgrow ? length : length - 1;
    for (let i = 0; i < limit; i++) {
        if (newhead.x === Snake.body[i].x && newhead.y === Snake.body[i].y) {
                bgmusic.pause();
                deathSound.currentTime = 0;
                deathSound.play();
            return true;
        }
    }
    return false;
}

function spawnapple() {
    while (true) {
        let x = Math.floor(Math.random() * COLS);
        let y = Math.floor(Math.random() * ROWS);
        const onsnake = Snake.body.some(seg => seg.x === x && seg.y === y);
        if (!onsnake) {
            apple = { x: x, y: y };
            break;
        }
    }
}

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lightgreen";
    for (let segment of Snake.body) {
        if(Snake.body[0]===segment)
        {
            ctx.fillStyle = "violet";
            ctx.fillRect(segment.x, segment.y, 1, 1);
        }
        else
        {
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(segment.x, segment.y, 1, 1);
        }
    }
    ctx.fillStyle = "red"
    ctx.fillRect(apple.x, apple.y, 1, 1)
}

function movesnake(dir) {
    const head = Snake.body[0];
    const newhead = {
        x: (head.x + dir.x + COLS) % COLS,
        y: (head.y + dir.y + ROWS) % ROWS
    }

    const willgrow = newhead.x === apple.x && newhead.y === apple.y;

    if (collide(newhead, willgrow)) {
        gameover = true;
        return;
    }

    if (willgrow) {
        appleSoundEffect.currentTime = 0;
        appleSoundEffect.play();
        Snake.body.unshift(newhead);
        spawnapple();
    }
    else {
        Snake.body.unshift(newhead);
        Snake.body.pop();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
}

function gameLoop(time = 0) {
    if (!gameover && time - lastTime > moveInterval) {
        const aidir = aichoosepath();
        movesnake(aidir);
        lastTime = time;
    }
    if (gameover) {
        bgmusic.pause();
        deathSound.currentTime = 0;
        deathSound.play();
        document.querySelector('#Bottom_text').innerHTML = "Game Over";
        return;
    }
    requestAnimationFrame(gameLoop);
}

//BFS LOGIC:

function key(x, y) {
    return `${x},${y}`;
}

function getBlockedSet() {
    const blocked = new Set();
    for (let i = 0; i < Snake.body.length - 1; i++) {
        const s = Snake.body[i];
        blocked.add(key(s.x, s.y));
    }
    return blocked;
}

function bfsPath(start, target, snakeBody) {
    const queue = [];
    const visited = new Set();
    const parent = new Map();

    const blocked = new Set();
    for (let i = 0; i < snakeBody.length - 1; i++) {
        blocked.add(key(snakeBody[i].x, snakeBody[i].y));
    }

    queue.push(start);
    visited.add(key(start.x, start.y));

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.x === target.x && current.y === target.y) {
            return reconstructPath(parent, current, start);
        }

        for (const d of DIRS) {
            const nx = (current.x + d.x + COLS) % COLS;
            const ny = (current.y + d.y + ROWS) % ROWS;
            const k = key(nx, ny);

            if (visited.has(k)) continue;
            if (blocked.has(k)) continue;

            visited.add(k);
            parent.set(k, current);
            queue.push({ x: nx, y: ny });
        }
    }

    return null; 
}

function reconstructPath(parent, end) {
    const path = [];
    let cur = end;
    while (parent.has(key(cur.x, cur.y))) {
        path.push(cur);
        cur = parent.get(key(cur.x, cur.y));
    }
    path.push(cur);
    path.reverse();
    return path;
}

function getdirection(a, b) {
    const dx=b.x-a.x;
    const dy=b.y-a.y;
    if(dx>1) return {x:-1,y:0};
    if(dx<-1) return {x:1,y:0};
    if(dy>1) return {x:0,y:-1};
    if(dy<-1) return {x:0,y:1};

    return {x:Math.sign(dx),y:Math.sign(dy)};
}

function aichoosepath() {
    let path = bfsPath(Snake.body[0],apple,Snake.body);
    if (path && path.length > 1&&isAppleSafe()) {
        const head = Snake.body[0];
        const next = path[1];
        return getdirection(head, next);
    }
    path = bfsPath(Snake.body[0],Snake.body[Snake.body.length-1],Snake.body);
    if (path && path.length > 1) {
        const head = Snake.body[0];
        const next = path[1];
        return getdirection(head, next);
    }
    return safefallback();
}

function safefallback() {
    const head = Snake.body[0];
    for (const d of DIRS) {
        const nx = (head.x + d.x + COLS) % COLS;
        const ny = (head.y + d.y + ROWS) % ROWS;
        if (!checkCollision({ x: nx, y: ny }, false)) {
            return d;
        }
    }

    return direction;
}

function isAppleSafe(){
    const head=Snake.body[0];
    const pathtoapple=bfsPath(head,apple,Snake.body);
    if(!pathtoapple){
        return false;
    }
    const simulatedbody=Snake.body.map(seg=>({...seg}));
    for(let i=1;i<pathtoapple.length;i++){
        simulatedbody.unshift(pathtoapple[i]);
        simulatedbody.pop();
    }

     const new_head=simulatedbody[0];
     const new_tail=simulatedbody[simulatedbody.length-1];
     const pathtotail=bfsPath(new_head,new_tail,simulatedbody);
    return (pathtotail!==null);

}

gameLoop();
/*
function moveDown(){
    const head=Snake.body[0];
    const newhead={
        x:head.x,
        y:(head.y+1+ROWS)%ROWS
    };
    Snake.body.unshift(newhead);
    Snake.body.pop();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSnake();
}

function moveUp(){
    const head=Snake.body[0];
    const newhead={
        x:head.x,
        y:(head.y-1+ROWS)%ROWS
    }
    Snake.body.unshift(newhead);
    Snake.body.pop();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSnake();
}

function moveLeft(){
    const head=Snake.body[0];
    const newhead={
        x:(head.x-1+COLS)%COLS,
        y:head.y
    };

    Snake.body.unshift(newhead);
    Snake.body.pop();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSnake();
}

function moveRight(){
    const head=Snake.body[0];
    const newhead={
        x:(head.x+1+COLS)%COLS,
        y:head.y
    };

    Snake.body.unshift(newhead);
    Snake.body.pop();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSnake();
}*/