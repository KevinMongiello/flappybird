const Bird = require('./bird');
const Pipe = require('./pipe');
const Constants = require('./game_constants');

const Game = function() {
  this.pipes = [];
  this.DIM_X = Constants.WIDTH;
  this.DIM_Y = Constants.HEIGHT;

};

Game.prototype.startUpTest = function(ctx) {
  ctx.fillStyle = "yellow";
  ctx.fillRect(0,0, 10, 200);
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.allObjects = function () {
  return this.pipes.concat(this.bird);
};

Game.prototype.moveObjects = function() {
  this.allObjects().forEach(function (object) {
    object.move();
  });
};

Game.prototype.step = function(gameFrame) {
  this.moveObjects();
  this.isCollision();
  if (gameFrame % 100 === 0) { this.addPipes(); }
};

Game.prototype.addBird = function() {
  const bird = new Bird({
    pos: [150, 20],
    game: this
  });
  this.bird = bird;

  return bird;
};

function _randNum() {
  return Math.floor(Math.random() * 15) + 1;
}

Game.prototype.addPipes = function () {
  let pipes = Pipe.prototype.addPipes({
    game: this,
    pos: [this.DIM_X - 30, 0],
    gapNum: _randNum()
  });

  pipes.forEach((pipe) => this.pipes.push(pipe) );
  this.removePipes();
};

Game.prototype.isOutOfBounds = function(obj) {
  let x = obj.pos[0], y = obj.pos[1];

  if (x < 0 || y < 0 || y > this.DIM_Y) {
    return true;
  }
  return false;
};

Game.prototype.removePipes = function() {
  if (this.isOutOfBounds(this.pipes[0])) {
    this.pipes.shift();
  }
};

function RectCircleColliding(bird,pipe){
    var distX = Math.abs(bird.pos[0] - pipe.pos[0]-pipe.w/2);
    var distY = Math.abs(bird.pos[1] - pipe.pos[1]-pipe.h/2);

    if (distX > (pipe.w/2 + bird.radius)) { return false; }
    if (distY > (pipe.h/2 + bird.radius)) { return false; }

    if (distX <= (pipe.w/2)) { return true; }
    if (distY <= (pipe.h/2)) { return true; }

    var dx=distX-pipe.w/2;
    var dy=distY-pipe.h/2;
    return (dx*dx+dy*dy<=(bird.radius*bird.radius));
}

Game.prototype.isCollision = function() {
  this.pipes.forEach( (pipe) => {
    if (RectCircleColliding(this.bird, pipe)) {
      pipe.color = "red";
    }

  });
};

module.exports = Game;
