const Game = require('./game');

const GameView = function(ctx) {
  this.game = new Game(this);
  this.ctx = ctx;
  this.bird = this.game.addBird();
  this.game.addPipes();
  // this.initKeyHandler
  this.bindKeyHandlers();
};

GameView.MOVES = ["w", "up"];

GameView.prototype.bindKeyHandlers = function() {
  const bird = this.bird;
  GameView.MOVES.forEach((move) => {
    key(move, function() { bird.jump(); });
  });
};

GameView.prototype.start = function () {
  this.gameOver = false;
  this.bird.pos = [50, 100];
  let gameFrame = 0;
  const animateCallBack = function () {
    if (this.gameOver === true) {
      return;
    }
    gameFrame ++;
    this.game.step(gameFrame);
    this.game.draw(this.ctx);
    requestAnimationFrame(animateCallBack);
  }.bind(this);

  this.anim = animateCallBack();
};

GameView.prototype.stop = function () {

};

module.exports = GameView;