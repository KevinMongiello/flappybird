const Game = require('./game');
// const Constants = require('./game_constants');

const GameView = function(ctx, Constants) {
  this.Constants = Constants;
  this.game = new Game(this, this.Constants);
  this.ctx = ctx;
  this.bird = this.game.addBird(this.Constants);
  this.game.addPipes();
  this.bindKeyHandlers();
  this.jumpCount = this.game.jumpCount;
  this.start();
};

GameView.MOVES = ["w", "up"];

GameView.prototype.keypress = function(e) {
  if (e.key === "ArrowUp" || e.key === "w") {
    if (this.jumpCount < 1) {
      this.game.foreground[0].vel = this.Constants.GAME_VELOCITY;
      this.bird.accel = this.Constants.GRAVITY;
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

GameView.prototype.animateCallBack = function (time) {
  if (this.gameOver === true) {
    this.stop();
    return;
  }

  let timeDelta = time - this.lastTime;
  this.gameFrame ++;
  this.game.step(this.gameFrame, timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;
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
  this.lastTime = 0;
  this.startInterval();
};

GameView.prototype.stop = function () {
  // clearInterval(this.interval);
  this.removeHandlers();
  let resetHandler = (e) => {
    if (e.keyCode === 13) {
      let hardness = document.getElementById('game-level').value;
      this.Constants.hardness(hardness);
      new GameView(this.ctx, this.Constants);
      window.removeEventListener('keydown', resetHandler);
    }
  };
  window.addEventListener('keydown', resetHandler);
};


module.exports = GameView;
