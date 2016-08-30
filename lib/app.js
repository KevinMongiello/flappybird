const GameView = require('./game_view.js');
const Constants = require('./game_constants');

function draw() {
  const canvas = document.getElementById("flappy-bird");
  const canvasCtx = canvas.getContext("2d");
  if (!localStorage.highScore) {
    localStorage.highScore = "0";
  }
  Constants.hardness(document.getElementById('game-level').value);
  const gv = new GameView(canvasCtx, Constants);

}

document.addEventListener("DOMContentLoaded", () => {
  draw();
});

window.gConstants = require('./game_constants');
