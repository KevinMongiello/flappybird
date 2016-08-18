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

	function draw() {
	  const canvas = document.getElementById("flappy-bird");
	  const canvasCtx = canvas.getContext("2d");
	  const gv = new GameView(canvasCtx)
	  gv.start();
	}

	document.addEventListener("DOMContentLoaded", () => {
	  draw();
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);

	const GameView = function(ctx) {
	  this.game = new Game();
	  this.ctx = ctx;
	  this.bird = this.game.addBird();
	  this.game.addPipes();
	};

	GameView.MOVES = ["w", "up"];
	GameView.prototype.bindKeyHandlers = function() {
	  const bird = this.bird;
	  GameView.MOVES.forEach((move) => {
	    key(move, function() { bird.jump(); });
	  });
	};

	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  let gameFrame = 0;
	  const animateCallBack = function () {
	    gameFrame ++;
	    this.game.step(gameFrame);
	    this.game.draw(this.ctx);
	    this.game.startUpTest(this.ctx);
	    requestAnimationFrame(animateCallBack);
	  }.bind(this);

	  animateCallBack();
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Bird = __webpack_require__(3);
	const Pipe = __webpack_require__(6);
	const Constants = __webpack_require__(7);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);

	const Bird = function(obj) {
	  MovingObject.call(this, {game: obj.game, pos: obj.pos, vel: [0, 1], radius: 20, color: "green"});
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
	  ctx.drawImage(this.image, this.pos[0]- 38, this.pos[1]-42, 80, 84);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
	  inherits (childClass, parentClass) {
	    let Surrogate = function () {};
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	    childClass.prototype.constructor = childClass;
	  }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const GameConstants = __webpack_require__(7);
	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);

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


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
	  WIDTH: 400,
	  HEIGHT: 600
	};


/***/ }
/******/ ]);