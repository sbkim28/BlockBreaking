
var canvas;
var cc;

var ballX;
var ballY;
var ballSpeedX = 2;
var ballSpeedY = 3.5;
const SPEED_RATE = 0.15;
const BALL_RADIUS = 10;
const FPS = 60;
const CONTROL_RATE = 0.15;

var playerX;
const PADDLE_MARGIN = 10;
const PADDLE_LENGTH = 100;
const PADDLE_THICKNESS = 20;

var playerLife = 3;

var hasGameEnded = false;
var doesPlayerWin = false;

window.onload = function(){

	canvas = document.getElementById("gameCanvas");
	cc = canvas.getContext("2d");
	ballReset();
	blockInit();
	setInterval(()=>{
		move();
		draw();
	}, 1000 / FPS);

	canvas.addEventListener("mousemove", event =>{
		var mousePos = calculateMousePosition(event);
		playerX = mousePos.x - PADDLE_LENGTH / 2;
	});

	canvas.addEventListener("mousedown", event =>{
		if(hasGameEnded){
			hasGameEnded = false;
			playerLife = 3;
			ballSpeedY = 3.5;
			blockInit();
			ballReset();
		}
	});

}

function calculateMousePosition(event){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = event.clientX - rect.left - root.scrollLeft;
	var mouseY = event.clientY - rect.top - root.scroolTop;

	return {
		x : mouseX,
		y : mouseY
	};
}

function ballReset(){
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;

	if(ballSpeedY > 5.25){
		ballSpeedY /= 1.5;
	}

	if(--playerLife<0){
		hasGameEnded = true;
		doesPlayerWin = false;
	}
}	

function move(){
	if(hasGameEnded) return;

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX < 0 + BALL_RADIUS){
		ballSpeedX = Math.abs(ballSpeedX);
	} 
	if(ballX > canvas.width - BALL_RADIUS){
		ballSpeedX = -Math.abs(ballSpeedX);
	}

	if(ballY < 0 + BALL_RADIUS){
		ballSpeedY = Math.abs(ballSpeedY);
	}
	if( ballY > canvas.height - BALL_RADIUS){
		ballReset();
	}
	if(ballY > canvas.height - PADDLE_THICKNESS - PADDLE_MARGIN - BALL_RADIUS
		&& ballY < canvas.height - 10 + BALL_RADIUS
		&& ballX > playerX 
		&& ballX < playerX + PADDLE_LENGTH ){
		var playerCenterX = playerX + PADDLE_LENGTH / 2;
		var playerCenterY = canvas.height - PADDLE_THICKNESS / 2 - PADDLE_MARGIN;

		if(ballY >= playerCenterY){
			ballSpeedY = -Math.abs(ballSpeedY) 
			if(ballSpeedY > - PADDLE_THICKNESS / 2){
				ballSpeedY -= SPEED_RATE;
			}
		}else{
			ballSpeedY = Math.abs(ballSpeedY) + SPEED_RATE;
			if(ballSpeedY > PADDLE_THICKNESS / 2){
				ballSpeedY += SPEED_RATE;
			}
		}

		ballSpeedX = (ballX - playerCenterX) * CONTROL_RATE;

		ballSpeedY = -ballSpeedY - SPEED_RATE;
	}

	var flag = true;
	for(var i = 0;i<blocks.length;i++){
		if(blocks[i]!=undefined){
			if(blocks[i].onCollide()){
				if(--blocks[i].life < 0){
					blocks[i] = undefined;
				}
			}
			flag = false;
		}
	}
	if(flag){
		hasGameEnded = doesPlayerWin = true;
	} 
}

function Block(topX, topY, life){
	this.topX = topX;
	this.topY = topY;
	this.life = life;
}

Block.prototype = {
	drawBlock : function(){
		drawRect(this.topX, this.topY, BLOCK_WIDTH, BLOCK_HEIGHT,BLOCK_COLOR[this.life]);
		cc.strokeStyle = "white";
		cc.strokeRect(this.topX, this.topY, BLOCK_WIDTH, BLOCK_HEIGHT);

	},
	onCollide : function(){
		var flag= ballX > this.topX - BALL_RADIUS && ballX < this.topX + BLOCK_WIDTH
		&&ballY > this.topY - BALL_RADIUS && ballY < this.topY + BLOCK_HEIGHT + BALL_RADIUS;
		if(flag){
			var blockCenterX = this.topX + BLOCK_WIDTH/2;
			var blockCenterY = this.topY + BLOCK_HEIGHT/2

			if(ballY >= blockCenterY){
				ballSpeedY = Math.abs(ballSpeedY);
			}else{
				ballSpeedY = -Math.abs(ballSpeedY);
			}
			
			if(ballX >= blockCenterX ){
				ballSpeedX = Math.abs(ballSpeedX) 
			}else{
				ballSpeedX = -Math.abs(ballSpeedX);
			}
		}
		return flag;
	}
};


const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 30;
const BLOCK_COLOR = ["red", "yellow", "lime"];

var blocks;

const BLOCK_ROW = 7;
const BLOCK_MARGIN_ROW = 16;
const BLOCK_COL = 3;
const BLOCK_MARGIN_COL = 15;

function blockInit(){
	blocks = [];
	for(var i =0;i<BLOCK_ROW;i++){
		for(var j = 0; j<BLOCK_COL;j++){
			var block = new Block(i*(BLOCK_WIDTH+BLOCK_MARGIN_ROW), j*(BLOCK_HEIGHT+BLOCK_MARGIN_COL) + BLOCK_MARGIN_COL ,BLOCK_COL - j - 1);
			blocks.push(block);
		}
	}
}

function draw(){
	drawRect(0,0,canvas.width, canvas.height, "black");

	if(hasGameEnded){
		cc.font = "30px Calibri"
		cc.fillStyle = "white";
		if(doesPlayerWin){
			cc.fillText("You Won!",350,200);
		}else{
			cc.fillText("You Lost",350,200);
		}
		cc.fillText("Click to continue...",300,500);
		return;
	} 

	drawCircle(ballX, ballY, BALL_RADIUS, "white");
	drawRect(playerX, canvas.height - PADDLE_THICKNESS - PADDLE_MARGIN, PADDLE_LENGTH, PADDLE_THICKNESS);
	
	for(var i = 0;i<blocks.length;i++){
		if(blocks[i]!=undefined){
			blocks[i].drawBlock();
		}
	}
	cc.font = "20px Calibri"
	cc.fillStyle = "white";
	cc.fillText("Life left : " + playerLife, 700,590);
}




function drawRect(topX, topY, width, height, color){
	cc.fillStyle = color;
	cc.fillRect(topX, topY, width, height);
}

function drawCircle(centerX, centerY, radius, color){
	cc.fillStyle = color;
	cc.beginPath();
	cc.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	cc.fill();
}