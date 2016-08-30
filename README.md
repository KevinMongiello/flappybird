# Flappy Bird

[live][flappy-bird]
[flappy-bird]: www.kevinmongiello.com/flappybird

Flappy Bird is a browser game built in pure Javascript and uses HTML Canvas for animation.  The objective is simple: Fly between the pipes for as long as you can.  You can use the keys 'w' and 'up arrow' to fly.  When the game ends, simply follow the instructions and press 'enter' to play again.  Check your high-score in the top-left corner.

### User modifications

If you think the game is too hard, (or too easy), clone the repo and change some of the settings to fit your fancy!  Included is a `game_constants.js` file where you'll find easy-to-tune parameters to control things like the spawn rate of the pipes, speed of the bird, and gravity!(...and more).  To play the new version

### Technical

The top-level game file extracts the canvas DOM element and passes it's 2D-context down to a GameView to be further passed down to the game and it's components in order to render themselves.  The GameView binds keys to events to make jumping possible and declares window intervals so that animations can be rendered.  The animation interval is set to 33ms in order to display animations at 30fps.  

All moving objects including the bird, the pipes, and the ground inherit core functionality from a MovingObject class.  This abstracts the virtual vector physics into one easily-manipulatable spot location and keeps things DRY. The bird has an additional acceleration parameter that acts as a constant downward pull in order to simulate gravity, which effectively increases the bird's downward velocity.

A collision detection algorithm is implemented by using the position and geometry of the bird and the pipes.  Every frame, the bird is checked for collisions against each pipe.  This is done by checking if the center of the bird plus its' radius
