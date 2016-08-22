const MovingObject = require('./moving_object');
const Util = require('./util');

const Bird = function(obj) {
  MovingObject.call(this, {game: obj.game, pos: obj.pos, vel: [0, 1], radius: 15, color: "green"});
  this.accel = [0, 0.28];
  this.image = document.getElementById('bird');
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
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );
  ctx.closePath();

  ctx.fill();
  ctx.drawImage(this.image, this.pos[0] - 16, this.pos[1] - 14, 33, 28);
};

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function _getVel(vel) {
  return vel.clamp(-8, 8);
}

Bird.prototype.move = function () {
  this.vel[1] = _getVel(this.vel[1]);
  this.vel[1] += this.accel[1];
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};

module.exports = Bird;
