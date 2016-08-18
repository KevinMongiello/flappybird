const MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color;
  this.radius = options.radius;
  this.game = options.game;
};

MovingObject.prototype.move = function () {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};


module.exports = MovingObject;
