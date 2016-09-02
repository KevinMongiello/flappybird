const Util = require('./util');

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
  EXTRA_PIPE_WIDTH: 30,
  // Choose PIPE_SPAWN_RATE between 100 - 150
  PIPE_SPAWN_RATE: 100,
  DIFFICULTY: "EASY",
  hardness: function(num) {

    let hardness = Util.clampNum(parseInt(num), 0, 3);
    if (hardness === 0) {
      this.EXTRA_PIPE_WIDTH = 60;
      this.PIPE_SPAWN_RATE = 180;
      this.DIFFICULTY = "EASY";
    } else if (hardness === 1) {
      this.EXTRA_PIPE_WIDTH = 40;
      this.PIPE_SPAWN_RATE = 150;
      this.DIFFICULTY = "MEDEASY";
    } else if (hardness === 2) {
      this.EXTRA_PIPE_WIDTH = 20;
      this.PIPE_SPAWN_RATE = 125;
      this.DIFFICULTY = "MEDHARD";
    } else if (hardness === 3) {
      this.EXTRA_PIPE_WIDTH = 0;
      this.PIPE_SPAWN_RATE = 100;
      this.DIFFICULTY = "HARD";
    }
  },
};
