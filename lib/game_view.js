const Game = require('./game');

const GameView = function(ctx) {
  this.game = new Game(this);
  this.ctx = ctx;
  this.bird = this.game.addBird();
  this.game.addPipes();
  this.bindKeyHandlers();
  this.jumpCount = this.game.jumpCount;
  this.start();
};

GameView.MOVES = ["w", "up"];

GameView.prototype.keypress = function(e) {
  if (e.key === "ArrowUp" || e.key === "w") {
    if (this.jumpCount < 1) {
      this.game.foreground[0].vel = [-1, 0];
      this.bird.accel = [0, 0.28];
      //  switch on pipes
      this.game.gameSwitch = true;
      this.bird.jump();
      this.jumpCount++;
    } else {
      this.bird.jump();
      this.jumpCount++;
    }
  }
};

GameView.prototype.bindKeyHandlers = function() {
  document.addEventListener("keydown", this.keypress.bind(this));
};

GameView.prototype.removeHandlers = function() {
  document.removeEventListener("keydown", this.keypress);
};

GameView.prototype.animateCallBack = function () {

  if (this.gameOver === true) {
    this.stop();
    return;
  }
  this.gameFrame ++;
  this.game.step(this.gameFrame);
  this.game.draw(this.ctx);
  requestAnimationFrame(this.animateCallBack.bind(this));
};

GameView.prototype.startInterval = function () {
  this.animateCallBack();
  // this.interval = setInterval(this.animateCallBack.bind(this), 33);
};

GameView.prototype.start = function () {
  this.gameOver = false;
  this.bird.pos = [100, 100];
  this.gameFrame = 0;
  this.startInterval();
};

GameView.prototype.stop = function () {
  // clearInterval(this.interval);
  this.removeHandlers();
  let resetHandler = (e) => {
    if (e.keyCode === 13) {
      new GameView(this.ctx);
      window.removeEventListener('keydown', resetHandler);
    }
  };
  window.addEventListener('keydown', resetHandler);
};


module.exports = GameView;
