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

GameView.prototype.start = function () {
  this.gameOver = false;
  this.bird.pos = [100, 100];
  let gameFrame = 0;
  const animateCallBack = function () {
    if (this.gameOver === true) {
      this.stop();
      return;
    }
    gameFrame ++;
    this.game.step(gameFrame);
    this.game.draw(this.ctx);
    requestAnimationFrame(animateCallBack);
  }.bind(this);

  animateCallBack();
};

GameView.prototype.stop = function () {
  let gv = this;
  key("enter", function() {
    gv.reset();
  });
};

GameView.prototype.reset = function() {
  // delete this.game;
  this.game = new Game(this);
  this.game.addPipes();
  this.bindKeyHandlers();
  this.bird = this.game.addBird();
  this.jumpCount = this.game.jumpCount;

  this.start();
};

module.exports = GameView;
