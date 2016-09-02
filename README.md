# Flappy Bird

[live][flappy-bird]
[flappy-bird]: www.kevinmongiello.com/flappybird

Flappy Bird is a browser game built in pure Javascript and uses HTML Canvas for animation.  The objective is simple: Fly between the pipes for as long as you can.  You can use the keys 'w' and 'up arrow' to fly.  When the game ends, simply follow the instructions and press 'enter' to play again.  Check your high-score in the top-left corner. If you think the game is too hard, (or too easy), just use the slider on the right of the game window to change the difficulty.

### Technical

The top-level game file extracts the canvas DOM element and passes it's 2D-context down to a GameView to be further passed down to the game and it's components in order to render themselves.  The GameView binds keys to events to make jumping possible and declares window intervals so that animations can be rendered.  The animation interval is set to 33ms in order to display animations at 30fps.  

**Inheritance**

All moving objects including the bird, the pipes, and the ground inherit core functionality from a MovingObject class.  This abstracts the virtual vector physics into one easily-manipulatable spot location and keeps things DRY. The bird has an additional acceleration parameter that acts as a constant downward pull in order to simulate gravity, which effectively increases the bird's downward velocity.

In the figure below, the Bird constructor sends its' context to MovingObject's constructor function with the parameters desired to make a new Bird.  Also, Util calls inherit on Bird and MovingObject, which uses a Surrogate class to act as a middleman between the two classes. This is used to declare a chain of inheritance while also allowing independence of the Bird class to create it's own methods.
![alt tag](docs/images/inheritance.png)
***Inheritance***

**Physics**
Since the canvas is rendered with a width and a height, it can easily mapped like a 2D cartesian plane of x,y coordinates.

**Collision Detection**

A collision detection algorithm is implemented by using the position and geometry of the bird and the pipes.  Every frame, the bird is checked for collisions against each pipe.  This is done by checking if the distance between the center of the bird and the center of the pipe is less than the radius of the bird + 1/2 width of the pipe.  There is some additional logic to check the corners of the pipe that uses Pythagoreans Theorem.

![alt tag](docs/images/start.png)
***Start Screen***

![alt tag](docs/images/game_over.png)
***Game Over Screen***
