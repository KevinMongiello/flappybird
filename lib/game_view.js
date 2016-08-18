const Game = require('./game');

const GameView = function(ctx) {
  this.game = new Game();
  this.ctx = ctx;
  this.bird = this.game.addBird();
  this.game.addPipes();
};

GameView.MOVES = ["w", "up"];
GameView.prototype.bindKeyHandlers = function() {
  const bird = this.bird;
  GameView.MOVES.forEach((move) => {
    key(move, function() { bird.jump(); });
  });
};

GameView.prototype.start = function () {
  this.bindKeyHandlers();
  let gameFrame = 0;
  const animateCallBack = function () {
    gameFrame ++;
    this.game.step(gameFrame);
    this.game.draw(this.ctx);
    this.game.startUpTest(this.ctx);
    requestAnimationFrame(animateCallBack);
  }.bind(this);

  animateCallBack();
};

module.exports = GameView;
