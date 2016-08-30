/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	const Constants = __webpack_require__(4);

	function draw() {
	  const canvas = document.getElementById("flappy-bird");
	  const canvasCtx = canvas.getContext("2d");
	  if (!localStorage.highScore) {
	    localStorage.highScore = "0";
	  }
	  Constants.hardness(document.getElementById('game-level').value);
	  const gv = new GameView(canvasCtx, Constants);

	}

	document.addEventListener("DOMContentLoaded", () => {
	  draw();
	});

	window.gConstants = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	// const Constants = require('./game_constants');

	const GameView = function(ctx, Constants) {
	  this.Constants = Constants;
	  this.game = new Game(this, this.Constants);
	  this.ctx = ctx;
	  this.bird = this.game.addBird(this.Constants);
	  this.game.addPipes();
	  this.bindKeyHandlers();
	  this.jumpCount = this.game.jumpCount;
	  this.start();
	};

	GameView.MOVES = ["w", "up"];

	GameView.prototype.keypress = function(e) {
	  if (e.key === "ArrowUp" || e.key === "w") {
	    if (this.jumpCount < 1) {
	      this.game.foreground[0].vel = this.Constants.GAME_VELOCITY;
	      this.bird.accel = this.Constants.GRAVITY;
	      this.game.gameSwitch = true;
	      this.bird.jump();
	      this.jumpCount++;
	    } else {
	      this.bird.jump();
	      this.jumpCount++;
	    }
	  }
	};

	GameView.prototype.bindKeyHandlers = function() {
	  document.addEventListener("keydown", this.keypress.bind(this));
	};

	GameView.prototype.removeHandlers = function() {
	  document.removeEventListener("keydown", this.keypress);
	};

	GameView.prototype.animateCallBack = function (time) {
	  if (this.gameOver === true) {
	    this.stop();
	    return;
	  }

	  let timeDelta = time - this.lastTime;
	  this.gameFrame ++;
	  this.game.step(this.gameFrame, timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	  requestAnimationFrame(this.animateCallBack.bind(this));
	};

	GameView.prototype.startInterval = function () {
	  this.animateCallBack();
	  // this.interval = setInterval(this.animateCallBack.bind(this), 33);
	};

	GameView.prototype.start = function () {
	  this.gameOver = false;
	  this.bird.pos = [100, 100];
	  this.gameFrame = 0;
	  this.lastTime = 0;
	  this.startInterval();
	};

	GameView.prototype.stop = function () {
	  // clearInterval(this.interval);
	  this.removeHandlers();
	  let resetHandler = (e) => {
	    if (e.keyCode === 13) {
	      let hardness = document.getElementById('game-level').value;
	      this.Constants.hardness(hardness);
	      new GameView(this.ctx, this.Constants);
	      window.removeEventListener('keydown', resetHandler);
	    }
	  };
	  window.addEventListener('keydown', resetHandler);
	};


	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Bird = __webpack_require__(3);
	const Pipe = __webpack_require__(7);
	// const Constants = require('./game_constants');
	const Foreground = __webpack_require__(8);
	const Util = __webpack_require__(6);

	const Game = function(gv, Constants) {
	  this.gv = gv;
	  this.Constants = Constants;
	  this.score = 0;
	  this.pipes = [];
	  this.DIM_X = this.Constants.WIDTH;
	  this.DIM_Y = this.Constants.HEIGHT;
	  this.background = document.getElementById('background');
	  this.foreground = [new Foreground(this, { pos: [0, 410], vel: [0, 0] } )];
	  this.gameOver = false;
	  this.GROUND_Y = 410;
	  this.gameSwitch = false;
	  this.jumpCount = 0;
	  this.addPipes();
	  this.pipeSpawnRate = Util.clampNum(this.Constants.PIPE_SPAWN_RATE, 100, 150);
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
	    ctx.fillText(`HIGHSCORE: ${localStorage.highScore}`, 30, 30);
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
	  if (Number(localStorage.highScore) < this.score) {
	    localStorage.highScore = `${this.score}`;
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// const Constants = require('./game_constants');
	const MovingObject = __webpack_require__(5);
	const Util = __webpack_require__(6);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(6);

	module.exports = {
	  //// Leave These Alone...
	  WIDTH: 350,
	  HEIGHT: 525,
	  NORMAL_TIME_DELTA: 1000/60,

	  //// ...And Play With These :)
	  GRAVITY: [0.1, 0.28],
	  GAME_VELOCITY: [-1, 0],
	  BIRD_MAX_VEL: 8,
	  // Choose EXTRA_PIPE_WIDTH between 0 - 30
	  EXTRA_PIPE_WIDTH: 0,
	  // Choose PIPE_SPAWN_RATE between 100 - 150
	  PIPE_SPAWN_RATE: 100,
	  hardness: function(num) {

	    let hardness = Util.clampNum(parseInt(num), 0, 3);
	    if (hardness === 0) {
	      this.EXTRA_PIPE_WIDTH = 30;
	      this.PIPE_SPAWN_RATE = 150;
	    } else if (hardness === 1) {
	      this.EXTRA_PIPE_WIDTH = 25;
	      this.PIPE_SPAWN_RATE = 130;
	    } else if (hardness === 2) {
	      this.EXTRA_PIPE_WIDTH = 10;
	      this.PIPE_SPAWN_RATE = 115;
	    } else if (hardness === 3) {
	      this.EXTRA_PIPE_WIDTH = 0;
	      this.PIPE_SPAWN_RATE = 100;
	    }
	  },
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(4);

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


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	  inherits (childClass, parentClass) {
	    let Surrogate = function () {};
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	    childClass.prototype.constructor = childClass;
	  },
	  clampNum (num, min, max) {
	    return Math.min(Math.max(num, min), max);
	  }
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// const Constants = require('./game_constants');
	const MovingObject = __webpack_require__(5);
	const Util = __webpack_require__(6);

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Util = __webpack_require__(6);

	const Foreground = function(game, options) {
	  this.image = document.getElementById('ground_chopped');
	  MovingObject.call(this, {pos: options.pos, vel: options.vel, game: game});
	};
	Util.inherits(Foreground, MovingObject);

	Foreground.prototype.draw = function(ctx) {
	  ctx.drawImage(this.image, this.pos[0], this.pos[1], 353, 194);
	};

	module.exports = Foreground;


/***/ }
/******/ ]);