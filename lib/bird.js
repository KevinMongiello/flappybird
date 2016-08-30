// const Constants = require('./game_constants');
const MovingObject = require('./moving_object');
const Util = require('./util');

const Bird = function(obj, Constants) {
  MovingObject.call(this, {game: obj.game, pos: obj.pos, vel: [0, 0], radius: 15, color: "green"});
  this.Constants = Constants;
  this.accel = [0, 0];
  // FINAL ACCEL = [0, 0.28];
  this.image = document.getElementById('bird');
  this.sx = 0;
  this.birdFrame = 0;
  this.flapSpeed = 8;
};

Util.inherits(Bird, MovingObject);

Bird.prototype.jump = function() {
  if (this.vel[1] > -1) {
    this.vel = [0, -5];
  } else {
    this.vel[1] += -3;
  }
};

Bird.prototype.draw = function (ctx) {

  ctx.fillStyle = "transparent";
  // ctx.fillStyle = "green";
  ctx.beginPath();

  ctx.arc(
    this.pos[0] - 46,
    this.pos[1] - 32,
    this.radius,
    0,
    2 * Math.PI,
    false
  );
  ctx.closePath();
  ctx.fill();

  ctx.drawImage(
    this.image,
    this.sx,
    0,
    92,
    64,
    this.pos[0] - 16,
    this.pos[1] - 15,
    33,
    28
  );
};


Bird.prototype._getVel = function(vel) {
  return Util.clampNum(vel, -this.Constants.BIRD_MAX_VEL, this.Constants.BIRD_MAX_VEL);
};

Bird.prototype.move = function (timeDelta) {
  let moveRatio = this.Constants.NORMAL_TIME_DELTA / timeDelta;
  moveRatio = 1;
  this.birdFrame ++;
  if (this.birdFrame % this.flapSpeed === 0) {
    this.sx = (this.sx + 92) % 276;
  }
  this.vel[1] = this._getVel(this.vel[1]);
  this.vel[1] += (this.accel[1]);

  if (this.vel[1] <= -1) {
    this.flapSpeed = 4;
  } else if (this.vel[0] === 0){
    this.flapSpeed = 17;
  } else {
    this.flapSpeed = 7;
  }

  if (moveRatio === moveRatio) {
    this.pos[0] += (this.vel[0] * moveRatio);
    this.pos[1] += (this.vel[1] * moveRatio);
  }
};

module.exports = Bird;
