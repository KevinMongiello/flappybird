const Constants = require('./game_constants');

const MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color;
  this.radius = options.radius;
  this.game = options.game;
};


MovingObject.prototype.move = function (timeDelta) {
  let moveRatio = Constants.NORMAL_TIME_DELTA / timeDelta;
  moveRatio = 1;
  if (moveRatio === moveRatio) {
    this.pos[0] += (this.vel[0] * moveRatio);
    this.pos[1] += (this.vel[1] * moveRatio);
  }
};


module.exports = MovingObject;
