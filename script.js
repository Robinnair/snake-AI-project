const canvas=document.getElementById('snake')
const ctx=canvas.getContext('2d');

const ROWS=20;
const COLS=20;

const moveInterval=300;
let lastTime=0;

canvas.width=COLS*20;
canvas.height=ROWS*20;

ctx.scale(20,20);
let direction={x:0,y:1};
document.addEventListener('keydown', event=>{
    if(event.key=='ArrowDown'){
        direction={x:0,y:1};
    }
    if(event.key=='ArrowUp'){
        direction={x:0,y:-1};
    }
    if(event.key=='ArrowLeft'){
        direction={x:-1,y:0};
    }
    if(event.key=='ArrowRight'){
        direction={x:1,y:0};
    }
});

function createSnake(){
    return{
        body:[{x:10,y:0},
              {x:10,y:1},
              {x:10,y:2}],
        direction:"DOWN"
    };
}

const Snake=createSnake();

function drawSnake()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="lightgreen";
    for(let segment of Snake.body){
        ctx.fillRect(segment.x,segment.y,1,1);
    }
}

function movesnake(dir){
    const head=Snake.body[0];
    const newhead={
        x:(head.x+dir.x+COLS)%COLS,
        y:(head.y+dir.y+ROWS)%ROWS
    }
    Snake.body.unshift(newhead);
    Snake.body.pop();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSnake();
}

function gameLoop(time=0){
    if(time-lastTime>moveInterval){
        movesnake(direction);
        lastTime=time;
    }
    requestAnimationFrame(gameLoop);
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