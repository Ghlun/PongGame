const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

let player1Name = "Player 1";
let player2Name = "Player 2";
let gameStarted = false;
let isPaused = false;
let player1Score = 0, player2Score = 0;
let roundWinner = null;

const paddleWidth = 10, paddleHeight = 60;
let x1 = 0, y1 = 0, ySpeed1 = 0;  // Left paddle
let x2 = canvas.width - paddleWidth, y2 = 0, ySpeed2 = 0;  // Right paddle
let ballX = canvas.width / 2, ballY = canvas.height / 2, ballSpeedX = 5, ballSpeedY = 3;  // Ball

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') {
    ySpeed2 = -5;
  } else if (event.key === 'ArrowDown') {
    ySpeed2 = 5;
  } else if (event.key === 'Control') {
    ySpeed1 = -5;
  } else if (event.key === 'Command') {
    ySpeed1 = 5;
  } else if (event.key === ' ') {
    isPaused = !isPaused;
    if (isPaused) {
      document.getElementById('pause-menu').style.display = 'block';
    } else {
      document.getElementById('pause-menu').style.display = 'none';
    }
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    ySpeed2 = 0;
  } else if (event.key === 'Control' || event.key === 'Command') {
    ySpeed1 = 0;
  }
});

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(x1, y1, paddleWidth, paddleHeight);
  ctx.fillRect(x2, y2, paddleWidth, paddleHeight);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Draw scores
  ctx.font = '30px Arial';
  ctx.fillText(player1Score, 100, 100);
  ctx.fillText(player2Score, canvas.width - 100, 100);
}

function update() {
  if (!isPaused) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY - 10 < 0 || ballY + 10 > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX - 10 < paddleWidth && ballY > y1 && ballY < y1 + paddleHeight ||
        ballX + 10 > canvas.width - paddleWidth && ballY > y2 && ballY < y2 + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      ballSpeedX *= 1.01;  // Increase speed by 1%
    }

    // Ball out of bounds
    if (ballX - 10 < 0) {
      player2Score++;
      roundWinner = player2Name;
      resetBall();
      checkGameWinner();
    } else if (ballX + 10 > canvas.width) {
      player1Score++;
      roundWinner = player1Name;
      resetBall();
      checkGameWinner();
    }
 
