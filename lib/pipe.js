const GameConstants = require('./game_constants');
const MovingObject = require('./moving_object');
const Util = require('./util');

const Pipe = function(options) {
  vel = [-1, 0];
  pos = options.pos;
  MovingObject.call(this, {game: options.game, vel: vel, pos: pos, color: "green"} );
  this.w = 20;
  this.h = options.h;
};
Util.inherits(Pipe, MovingObject);

Pipe.prototype.addPipes = function(options) {
  // Top Pipe
  options.h = 30 * options.gapNum;
  let pipe1 = new Pipe(options);

  // Bottom Pipe
  let pos1 = options.pos[0];
  options.pos = [pos1, (30 * options.gapNum) + 90];
  options.h = 600;
  let pipe2 = new Pipe(options);

  return [pipe1, pipe2];
};


Pipe.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.pos[0], this.pos[1], 20, this.h);
};



module.exports = Pipe;
