/*
 * code/asg2/sketch.js
 * holds p5 sketch.js code for asg2
 * creates p5 sketch with a generated terrain, music and external html button
 * pressing the button generates a new seed and new terrain
 * also contains controls for moving the camera around the 3d space of the sketch
 * written by gigsabyte
 */

const asg3 = ( p ) => {

  // html elements
  let canvas;
  let button;

  // camera
  let camerapos;
  let lookat;
  let up;

  let lastX;
  let lastY;


  // music
  let bgm = [6];
  let bgmStarted = false;
  let lastIndex = 3;

  // preload textures and at least one music track
  p.preload = function() {
  	p.soundFormats('mp3', 'ogg');
  	bgm[0] = p.loadSound('assets/audio/minecraft/dryhands.ogg');
  }

  // setup
  p.setup = function() {

    // load more music
    bgm[1] = p.loadSound('assets/audio/minecraft/wethands.ogg');
    bgm[2] = p.loadSound('assets/audio/minecraft/clark.ogg');
    bgm[3] = p.loadSound('assets/audio/minecraft/chris.ogg');
    bgm[4] = p.loadSound('assets/audio/minecraft/oxygene.ogg');
    bgm[5] = p.loadSound('assets/audio/minecraft/sweden.ogg');

    // create canvas element and style it
    canvas = p.createCanvas(p.windowWidth * 7/10, p.windowWidth* 63/160, p.WEBGL);

    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    p.createP(''); // empty space for formatting

    // create button and format it
    button = p.createButton('Generate new terrain');
    p.stylizeButton(button);
    //button.mousePressed(p.makeNew); // call toggleMusic when button is pressed

    // camera setup
    camerapos = p.createVector(width, depth*-4, height*2);
    lookat = p.createVector(width, 0, height);
    up = p.createVector(0, 1, 0);

    // disable draw loop
    p.noLoop();

  };

  // draw function (runs every frame when enabled)
  p.draw = function() {

    // set background color
    p.background(200, 200, 255);

    // update camera
    p.moveCamera();

    if(p.mouseIsPressed) {
      p.rotateCamera();
    }

    // set up camera in sketch
    //camera([x], [y], [z], [centerX], [centerY], [centerZ], [upX], [upY], [upZ])
    p.camera(camerapos.x, camerapos.y, camerapos.z, lookat.x, lookat.y, lookat.z, 0, 1, 0);
    //perspective([fovy], [aspect], [near], [far])
    p.perspective(120, 16/9, 0.1, depth*16);

    // draw terrain
    wg.draw();


    
  }

  // camera movement controls
  // you can tell I wrote this because I didn't realize
  // that the p5 camera can do this for me
  p.moveCamera = function() {

    // get the view vector
    let view = lookat.copy();
    view.sub(camerapos);
    view.normalize();

    // scale to increase/decrease movement distance
    view.mult(1);

    // get vector perpendicular to the view vector
    let perp = view.cross(up);

    if(p.keyIsDown(87)) { // if W
      camerapos.add(view); // dolly camera forward
      lookat.add(view);


    } else if(p.keyIsDown(83)) { // if S
      camerapos.sub(view); // dolly camera backward
      lookat.sub(view);

    }

    if(p.keyIsDown(65)) { // if A
      camerapos.sub(perp); // truck camera left
      lookat.sub(perp);

    }  else if(p.keyIsDown(68)) { // if D
      camerapos.add(perp); // truck camera right
      lookat.add(perp);
    }
    
    if(p.keyIsDown(32)) { // if Spacebar
      camerapos.sub(up); // pedestal camera up
      lookat.sub(up);
      console.log(up);
    }
    else if(p.keyIsDown(16)) { // Shift key
      camerapos.add(up); // pedestal camera down
      lookat.add(up);
    }

  }

  // camera rotate controls
  // you can tell I wrote this because I didn't realize
  // that the p5 camera can do this for me
  p.rotateCamera = function() {

    // get the current view vector
    let view = lookat.copy();
    view.sub(camerapos);
    view.normalize();

    // get the vector perpendicular to the view vector
    let perp = view.cross(up);
    perp.normalize();

    // set the view vector to the up vector (just to reuse the variable)
    view = up.copy();

    // scale down the vecs
    view.mult(0.1);
    perp.mult(0.1);

    // find how far the mouse moved in the last frame
    let xdiff = p.mouseX - lastX;
    let ydiff = p.mouseY - lastY;

    // scale vectors by the differences
    perp.mult(xdiff);
    view.mult(ydiff);

    // combine x and y differences
    view.add(perp);

    // add to lookat position
    lookat.add(view);
  }

  // generate new seed and new terrain from seed
  p.makeNew = function() {
    seed = Math.round(Math.random() * 1000);
    console.log(seed);

    let p5 = wg.p5;

    wg = new WorldGenerator(width, height, depth, seed, textures, p5);
  }

  // handle music play/pause
  p.shuffleMusic = function() {
    bgmStarted = true;

    let canPlay = false;

    let index;

    while(canPlay == false) {
      index = Math.floor(Math.random() * bgm.length);
      if(index == lastIndex) continue;
      try {
        bgm[index].play();
      } catch(error) {
        continue;
      }
      canPlay = true;
    } 
    bgm[index].setLoop(false);
    bgm[index].onended(p.shuffleMusic);

    lastIndex = index;
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

  /* event functions */

  // on window resize, resize canvas
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth * 7/10, p.windowWidth * 63/160);
  }

  // when the mouse is pressed, enable draw loop
  p.mousePressed = function() {
    p.loop();
    if(!bgmStarted) p.shuffleMusic(); // begin music playback here so chrome doesn't yell at me

  }

  // update stored mouse position when the mouse moves
  p.mouseMoved = function() {
    lastX = p.mouseX;
    lastY = p.mouseY;
  }

  // rotate the camera when the mouse is dragged
  p.mouseDragged = function() {
    p.rotateCamera();
    lastX = p.mouseX;
    lastY = p.mouseY;
  }

  // disable draw loop if no mouse/key buttons are pressed
  p.mouseReleased = function() {
    if(!p.keyIsPressed) p.noLoop(); 
  }

  // enable draw loop if key is pressed
  p.keyPressed = function() {
    p.loop();
    if(!bgmStarted) p.shuffleMusic(); // begin music playback here so chrome doesn't yell at me
  }

  // disable draw loop if no mouse/key buttons are pressed
  p.keyReleased = function() {
    if(!p.keyIsPressed && !p.mousePressed) p.noLoop();
  }

};

