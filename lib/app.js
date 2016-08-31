const GameView = require('./game_view.js');
const Constants = require('./game_constants');

function initStorage() {
  if (!localStorage.flappybirdHighScoreHARD) localStorage.flappybirdHighScoreHARD = "0";
  if (!localStorage.flappybirdHighScoreMEDHARD) localStorage.flappybirdHighScoreMEDHARD = "0";
  if (!localStorage.flappybirdHighScoreMEDEASY) localStorage.flappybirdHighScoreMEDEASY = "0";
  if (!localStorage.flappybirdHighScoreEASY) localStorage.flappybirdHighScoreEASY = "0";
}

function start() {
  const canvas = document.getElementById("flappy-bird");
  const canvasCtx = canvas.getContext("2d");
  initStorage();

  const gv = new GameView(canvasCtx, Constants);
}

document.addEventListener("DOMContentLoaded", () => {
  start();
});

window.gConstants = require('./game_constants');
