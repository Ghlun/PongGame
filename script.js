const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

let player1Name = "Player 1";
let player2Name = "Player 2";
let gameStarted = false;
let isPaused = false;
let player1Score = 0, player2Score = 0;
let player1MatchWins = 0, player2MatchWins = 0;
let roundWinner = null;

const paddleWidth = 10, paddleHeight = 60;
let x1 = 0, y1 = (canvas.height - paddleHeight) / 2, ySpeed1 = 0;  // Left paddle
let x2 = canvas.width - paddleWidth, y2 = (canvas.height - paddleHeight) / 2, ySpeed2 = 0;  // Right paddle
let ballX = canvas.width / 2, ballY = canvas.height / 2, ballSpeedX = 5, ballSpeedY = 3;  // Ball

const hitPaddleSound = new Audio('hitPaddle.mp3');
const hitWallSound = new Audio('hitWall.mp3');
const scorePointSound = new Audio('scorePoint.mp3');

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') {
    ySpeed2 = -5;
  } else if (event.key === 'ArrowDown') {
    ySpeed2 = 5;
  } else if (event.key === 'Control') {
    ySpeed1 = -5;
  } else if (event.key === 'Meta') {
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
  } else if (event.key === 'Control' || event.key === 'Meta') {
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
      hitWallSound.play();
    }

    // Ball collision with paddles
    if (ballX - 10 < paddleWidth && ballY > y1 && ballY < y1 + paddleHeight ||
        ballX + 10 > canvas.width - paddleWidth && ballY > y2 && ballY < y2 + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      ballSpeedX *= 1.01;  // Increase speed by 1%
      hitPaddleSound.play();
    }

    // Ball out of bounds
    if (ballX - 10 < 0) {
      player2Score++;
      roundWinner = player2Name;
      scorePointSound.play();
      setTimeout(resetBall, 2000);
      checkGameWinner();
    } else if (ballX + 10 > canvas.width) {
      player1Score++;
      roundWinner = player1Name;
      scorePointSound.play();
      setTimeout(resetBall, 2000);
      checkGameWinner();
    }

    // Paddle movement
    y1 += ySpeed1;
    y2 += ySpeed2;

    // Paddle collision with top and bottom
    if (y1 < 0) {
      y1 = 0;
    } else if (y1 + paddleHeight > canvas.height) {
      y1 = canvas.height - paddleHeight;
    }

    if (y2 < 0) {
      y2 = 0;
    } else if (y2 + paddleHeight > canvas.height) {
      y2 = canvas.height - paddleHeight;
    }
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5;
  ballSpeedY = 3;
}

function checkGameWinner() {
  if (player1Score >= 10 || player2Score >= 10) {
    if (player1Score > player2Score) {
      player1MatchWins++;
    } else {
      player2MatchWins++;
    }
    updateScoreboard();
    if (player1MatchWins >= 2 || player2MatchWins >= 2) {
      alert('Game Over! ' + (player1MatchWins > player2MatchWins ? player1Name : player2Name) + ' wins!');
      resetGame();
    } else {
      alert('Match Over! ' + (player1Score > player2Score ? player1Name : player2Name) + ' wins the match!');
      resetMatch();
    }
  }
}

function resetMatch() {
  player1Score = 0;
  player2Score = 0;
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  player1MatchWins = 0;
  player2MatchWins = 0;
  document.getElementById('player-form').style.display = 'block';
  document.getElementById('scoreboard').style.display = 'none';
  gameStarted = false;
}

function updateScoreboard() {
  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = '';
  const players = [
    { name: player1Name, wins: player1MatchWins },
    { name: player2Name, wins: player2MatchWins }
  ];
  players.sort((a, b) => b.wins - a.wins);
  players.forEach(player => {
    const listItem = document.createElement('li');
    listItem.textContent = `${player.name}: ${player.wins} wins`;
    scoreList.appendChild(listItem);
  });
}

function startGame() {
  player1Name = document.getElementById('player1').value || "Player 1";
  player2Name = document.getElementById('player2').value || "Player 2";
  gameStarted = true;
  document.getElementById('player-form').style.display = 'none';
  document.getElementById('scoreboard').style.display = 'block';
  updateScoreboard();
  gameLoop();
}

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

// Initialize game
document.getElementById('player-form').style.display = 'block';