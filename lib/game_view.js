const Game = require('./game');

const GameView = function(ctx, Constants) {
  this.Constants = Constants;
  this.game = new Game(this, this.Constants);
  this.ctx = ctx;
  this.bird = this.game.bird;
  this.bindKeyHandlers();
  this.jumpCount = this.game.jumpCount;
  this.start();
  document.activeElement.blur();
};

GameView.MOVES = ["w", "up"];

GameView.prototype.keypress = function(e) {
  if (e.key === "ArrowUp" || e.key === "w") {
    // Switch between load screen and gameplay
    if (this.jumpCount < 1) {
      this.Constants.hardness(document.getElementById('game-level').value);
      this.game.updateConstants();
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

GameView.prototype.animateCallBack = function (time) {
  if (this.gameOver === true) {
    this.stop();
    return; // Return out of animation
  }
  let timeDelta = time - this.lastTime;
  this.lastTime = time;
  this.gameFrame++;
  this.game.step(this.gameFrame, timeDelta);
  this.game.draw(this.ctx);
  requestAnimationFrame(this.animateCallBack.bind(this));
};


GameView.prototype.start = function () {
  this.gameOver = false;
  this.bird.pos = [100, 100];
  this.gameFrame = 0;
  this.lastTime = 0;
  this.animateCallBack();
};

GameView.prototype.stop = function () {
  // Use fat arrow to work around binding
  let resetHandler = (e) => {
    if (e.keyCode === 13) {
      new GameView(this.ctx, this.Constants);
      window.removeEventListener('keydown', resetHandler);
    }
  };
  window.addEventListener('keydown', resetHandler);
};


module.exports = GameView;
