const Bird = require('./bird');
const Pipe = require('./pipe');
const Foreground = require('./foreground');
const Util = require('./util');

const Game = function(gv, Constants) {
  this.gv = gv;
  this.Constants = Constants;
  this.updateConstants();
  this.score = 0;
  this.pipes = [];
  this.background = document.getElementById('background');
  this.foreground = [new Foreground(this, { pos: [0, 410], vel: [0, 0] } )];
  this.gameOver = false;
  this.GROUND_Y = 410;
  this.gameSwitch = false;
  this.jumpCount = 0;
  this.addPipes();
};

Game.prototype.updateConstants = function() {
  this.pipeSpawnRate = Util.clampNum(this.Constants.PIPE_SPAWN_RATE, 100, 150);
  this.DIM_X = this.Constants.WIDTH;
  this.DIM_Y = this.Constants.HEIGHT;
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.drawImage(this.background, 0, 0, 350, 525);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });

  this.mainText(ctx);
};

Game.prototype.mainText = function (ctx) {
  ctx.fillStyle = "white";
  if (!this.gameSwitch) {
    ctx.font = '20px serif';
    ctx.fillText("To Start:", 50, 20);
    ctx.fillText("Press 'w' or 'up' arrow to jump!", 50, 40);
  } else{
    ctx.font = '48px serif';
    ctx.fillText(`${this.score}`, 160, 50);
    ctx.font = '12px serif';
    ctx.fillText(`HIGHSCORE: ${localStorage["flappybirdHighScore" + this.Constants.DIFFICULTY]}`, 30, 30);
    if (this.gameOver) {
      this.gameoverText(ctx);
    }
  }
};

Game.prototype.gameoverText = function(ctx) {
  ctx.fillStyle = "white";
  ctx.font = '24px serif';
  ctx.fillText("GAME OVER", 50, 100);
  ctx.fillText("Press 'Enter' to play again!", 50, 130);
};

Game.prototype.allObjects = function () {
  // Foreground is last for render
  return this.pipes.concat(this.bird).concat(this.foreground);
};

Game.prototype.moveObjects = function(timeDelta) {
  this.allObjects().forEach(function (object) {
    object.move(timeDelta);
  });
};

Game.prototype.checkForeground = function() {
  if (this.foreground[0].pos[0] + this.Constants.WIDTH < 0) {
    this.foreground.shift();
  }
  // debugger
  if (this.foreground[0].pos[0] < 0 && this.foreground.length < 2) {
    this.foreground.push(new Foreground(this, { pos: [350, 410], vel: this.Constants.GAME_VELOCITY }));
  }
};


Game.prototype.step = function(gameFrame, timeDelta) {
  this.moveObjects(timeDelta);
  this.isCollision();
  this.checkForeground();
  if (this.isOutOfBounds(this.bird)) {
    this.stopGame();
  }
  if (gameFrame % this.pipeSpawnRate === 0 && !this.gameOver) { this.addPipes();}
};

Game.prototype.addBird = function() {
  const bird = new Bird({
    pos: [110, 20],
    game: this
  }, this.Constants);
  this.bird = bird;

  return bird;
};

function _randNum() {
  return Math.floor(Math.random() * 10) + 1;
}

Game.prototype.addPipes = function () {
  if (!this.gameSwitch) {
    return;
  }
  this.score++;
  let pipes = Pipe.prototype.addPipes({
    game: this,
    pos: [this.DIM_X + 10, 0],
    gapNum: _randNum()
  }, this.Constants);

  pipes.forEach((pipe) => this.pipes.push(pipe) );
  this.removePipes();
};

Game.prototype.isOutOfBounds = function(obj) {
  let x = obj.pos[0], y = obj.pos[1];

  if (x < 0 || y > this.GROUND_Y - 15) {
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
      this.stopGame();
    }
  });
};

Game.prototype.stopGame = function() {
  this.gameOver = true;
  // debugger
  if (Number(localStorage["flappybirdHighScore" + this.Constants.DIFFICULTY]) < this.score) {
    localStorage["flappybirdHighScore" + this.Constants.DIFFICULTY] = `${this.score}`;
  }
  this.allObjects().forEach( (obj) =>  obj.vel = [0, 0] );
  this.bird.accel = [0, 0];
  this.gv.gameOver = true;
  // this.gv.start();
};

Game.prototype.delete = function () {
  this.allObjects().forEach( (obj) => obj = null );
};

module.exports = Game;
