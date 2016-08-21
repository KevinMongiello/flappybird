const GameView = require('./game_view.js');

function draw() {
  const canvas = document.getElementById("flappy-bird");
  const canvasCtx = canvas.getContext("2d");
  const gv = new GameView(canvasCtx);
  gv.start();
}

document.addEventListener("DOMContentLoaded", () => {
  draw();
});
