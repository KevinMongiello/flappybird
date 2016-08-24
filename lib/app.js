const GameView = require('./game_view.js');

function draw() {
  const canvas = document.getElementById("flappy-bird");
  const canvasCtx = canvas.getContext("2d");
  if (!localStorage.highScore) {
    localStorage.highScore = "0";
  }
  const gv = new GameView(canvasCtx);
  
}

document.addEventListener("DOMContentLoaded", () => {
  draw();
});
