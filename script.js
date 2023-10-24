const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// ... (rest of your Pong game code)

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();