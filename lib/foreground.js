const MovingObject = require('./moving_object');
const Util = require('./util');

const Foreground = function(game, options) {
  this.image = document.getElementById('ground_chopped');
  MovingObject.call(this, {pos: options.pos, vel: [-1, 0], game: game});
};
Util.inherits(Foreground, MovingObject);

Foreground.prototype.draw = function(ctx) {
  ctx.drawImage(this.image, this.pos[0], this.pos[1], 350, 194);
};

module.exports = Foreground;
