/*
 * code/asg1/sketch.js
 * holds p5 sketch.js code for asg1
 * creates p5 sketch with particle system, music and external html button
 * pressing the button plays the music, and when music is above a certain
 * amplitude, makes the particle system emit
 * written by gigsabyte
 */

const asg2 = ( p ) => {

  // html elements
  let canvas;
  let button;

  // world generation variables
  let wg;
  let seed = 69;

  let width = 32;
  let height = 32;
  let depth = 32;


  // music
  let bgm;

  // preload music
  p.preload = function() {
  	p.soundFormats('mp3', 'ogg');
  	bgm = p.loadSound('assets/audio/whitney.mp3');
  }

  // setup
  p.setup = function() {

    // create canvas element and style it
    canvas = p.createCanvas(p.windowWidth * 9/10, p.windowWidth* 81/160, p.WEBGL);

    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    p.createP(''); // empty space for formatting

    // create button and format it
    button = p.createButton('Play music');
    p.stylizeButton(button);
    button.mousePressed(p.toggleMusic); // call toggleMusic when button is pressed

    // create world generator
    wg = new WorldGenerator(width, height, depth, seed, this);
  };

  // draw function (runs every frame)
  p.draw = function() {

    // fade back and forth between red and blue colors (for aesthetic porpoise)
    let red = p.color(60, 10, 65);
    let blue = p.color(30, 15, 90);
    p.background(p.lerpColor(red, blue, (Math.sin(p.frameCount/60 * 119/60) + 1)/2));

    //camera([x], [y], [z], [centerX], [centerY], [centerZ], [upX], [upY], [upZ])
    p.camera(width/2, height/2, depth*1.25, width/2, height/2, 0, 0, 1, 0);
    wg.draw();
    
  }

  // on window resize, resize canvas
  p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth * 9/10, p.windowWidth * 81/160);
  }

  // handle music play/pause
  p.toggleMusic = function() {
    
    console.log(wg);

    /*if(bgm != null) {
      if(bgm.isPlaying()) {
        bgm.pause();
        button.html("Play music");
      }
      else {
        bgm.play();
        button.html("Pause music");
      }
    }*/
  }

  // add CSS style to button
  p.stylizeButton = function(button) {
    button.style('background-color', 'white');
    button.style('border', '4px solid #3d3d3d');
    button.style('border-radius', '4px');
    button.style('color', '#3d3d3d');
    button.style('padding', '20px');
    button.style('text-align', 'center');
    button.style('display', 'inline-block');
    button.style('font-family', 'Consolas,monaco,monospace');
    button.style('font-size', '16px');
  }

};

