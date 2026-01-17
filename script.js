const canvas=document.getElementById('snake')
const ctx=canvas.getContext('2d');

const ROWS=20;
const COLS=20;

ctx.scale(20,20);

canvas.width=COLS*20;
canvas.height=ROWS*20;

ctx.fillStyle="lightgreen";
ctx.fillRect(200,0,10,10);

function createSnake(){
    return{
        body:[{x:200,y:0},
              {x:200,y:10},
              {x:200,y:20}],
        direction:"DOWN"
    };
}

const Snake=createSnake();

function drawSnake()
{
    ctx.fillStyle="lightgreen";
    for(let segment of Snake.body){
        ctx.fillRect(segment.x,segment.y,10,10);
    }
}

function moveDown(){
    for(let segment of Snake.body){
        segment.y+=10;
    }
    drawSnake();
}

drawSnake();