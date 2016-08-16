# Flappy Bird Clone

## MVP

Flappy Bird is a endless side-scroller game where the player tries to navigate between the pipes for as long as possible. This game is built with pure Javascript, HTML, and CSS.

0. Game physics
  - onKey EventListener to fly
  - downward acceleration (gravity)
  - sideways velocity of pipes ("side-scrolling")

0. Pipe generation with random hole
  - Generate pipes every x seconds
  - Randomly generate the placement of pipe-gap
  - Increment score

0. Collision Detection
  - Use player coordinates to check if the bird has collided with anything.
    - Check pipe collision


## Technologies, Libraries, APIs

Flappy Bird will be created with JavaScript, HTML, and CSS, and Canvas.

The core architecture consists of three components
  0. the physics for flapping & moving the pipes
  0. Random generation of pipes
  0. The collision detection

The gravity of the bird can be simulated by using an interval to change the relative velocity of the bird every interval.  As the downward velocity increased, the bird will travel greater distances proportional to it's velocity value.  When the jump button has been pressed the bird will be given a positive velocity and then continue to have a negative gravity force applied to it.

The pipes will initialize with a default -x velocity and move at a constant rate.

On initialization, the pipes gap positioning can be randomly generated to ensure variability, yet also constrained to fall within a given acceptable range.

The collision detection is only necessary for the bird, so the the only thing to check is wither the birds geometry overlaps with any of the pipes geometry.  This can be done with a set of AND'ed conditionals checking the axis of the pipe and the positioning & width of the bird.

# Backend

There will be no backend for this project.

# WireFrames

[wireframes]: wireframes

# Timeline

* Phase 1 - Initialize game and create physics
  0. Initialize screen display
    - Create screen
    - Generate box (bird) on the screen
  0. Create bird physics
    - Use an interval to update birds "velocity"
    - Update birds position each frame based on its velocity value
    - Listen for a keypress to offset the velocity with a "jump/flap"
  0. Generate boxes (pipes) with initial velocity
    - Use canvas to generate a box
    - Assign the box an initial velocity in its constructor

* Phase 2 - Random generation of pipes
  0. Make an algorithm for random pipe gaps
    - Random number generator constrained to x possible outcomes
    - For each possible outcome, make the pipe gap a different position
  0. Style the board / draw images for pipes and bird.
    - Create / Find an illustration for the bird and pipes
    - Overlay the images on the box nodes

* Phase 3 - Collision Detection
  0. Set an interval and check the bird vs all pipes
    - Use conditional logic to check if the birds extremity coordinates are crossing the axis of any pipe.

Live Project

- [ ] Includes links to your Portfolio, Github and LinkedIn.
- [ ] Landing page/modal with obvious, clear instructions.
- [ ] Interactivity of some kind.
- [ ] Well styled, clean frontend.
- [ ] If it has music, the option to mute or stop it.
- [ ] Hosted from your portfolio site on GitHub pages.

Repo and README

- [ ] Link to live version.
- [ ] Instructions on how to play/use the project.
- [ ] List of techs/languages/plugins/APIs used.
- [ ] Technical implementation details with code snippets (make sure it looks good).
- [ ] To-dos/future features.
- [ ] No .DS_Stores / debuggers / console.logs.
- [ ] Organize into /assets and /lib.
