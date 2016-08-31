const MovingObject = require('./moving_object');
const Util = require('./util');

const Pipe = function(options) {
  vel = options.vel;
  pos = options.pos;
  MovingObject.call(this, {game: options.game, vel: vel, pos: pos, color: "green"} );
  this.w = 20;
  this.rotate = options.rotate;
  this.h = options.h;
  this.image = options.image;
  this.image_origin = options.image_origin;
  this.pipe_bottom = options.pipe_bottom;
  this.pipe_bottom_origin = options.pipe_bottom_origin;
};
Util.inherits(Pipe, MovingObject);

Pipe.prototype.addPipes = function(options, Constants) {
  // Top Pipe
  options.vel = Constants.GAME_VELOCITY;
  options.h = 30 * options.gapNum;
  options.image = document.getElementById("pipe_180");
  options.image_origin = (options.h - 50);
  options.pipe_bottom = document.getElementById("pipe_bottom_180");
  options.pipe_bottom_origin = -10;
  let pipe1 = new Pipe(options);

  // Bottom Pipe
  let posX = options.pos[0];
  let pipeWidth = 90 + Util.clampNum(Constants.EXTRA_PIPE_WIDTH, 0, 30);
  options.pos = [posX, (30 * options.gapNum) + pipeWidth];

  options.h = 600;
  options.image = document.getElementById("pipe");
  options.pipe_bottom = document.getElementById("pipe_bottom");
  options.image_origin = options.pos[1];
  options.pipe_bottom_origin = options.image_origin;
  let pipe2 = new Pipe(options);

  return [pipe1, pipe2];
};

// function clampWidth(ExtraWidth) {
//   return Math.min(Math.max(ExtraWidth, 0), 30);
// }


Pipe.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.pos[0], this.pos[1], 20, this.h);
  ctx.drawImage(this.pipe_bottom, this.pos[0], this.pipe_bottom_origin, 20, this.h);
  ctx.drawImage(this.image, this.pos[0] - 2, this.image_origin, 24, 50);
};



module.exports = Pipe;
