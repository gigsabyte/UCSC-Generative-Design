/*
 * code/asg3/sketch.js
 * holds p5 sketch.js code for asg3
 * creates p5 sketch with a generated terrain, music and external html button
 * pressing the button generates a new seed and new terrain
 * also contains controls for moving the camera around the 3d space of the sketch
 * written by gigsabyte
 */

const asg3 = ( p ) => {

  // html elements
  let canvas;
  let button;

  // images
  let chef;
  let water;

  // music
  let bgm = [6];
  let bgmStarted = false;
  let lastIndex = 3;

  // actors
  let player = p.createVector(0, 0);
  let fashionista = p.createVector(0.75, 0.75);
  let singer = p.createVector(0.5, 0.9);

  // fashionista etc
  let characterParts = [];

  // worldState
  let indialogue = false;

  // preload textures and at least one music track
  p.preload = function() {
  	p.soundFormats('mp3', 'ogg');
  	bgm[0] = p.loadSound('assets/audio/minecraft/dryhands.ogg');

    chef = p.loadImage('assets/imgs/chef.png');
    water = p.loadImage('assets/imgs/water.gif');

    p.loadCharacters();

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
    canvas = p.createCanvas(960, 540);//(p.windowWidth * 7/10, p.windowWidth* 63/160);

    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    p.createP(''); // empty space for formatting

    // create button and format it
    button = p.createButton('Generate new terrain');
    p.stylizeButton(button);

    console.log(characterParts);
    //button.mousePressed(p.makeNew); // call toggleMusic when button is pressed

    // disable draw loop
    //p.noLoop();

  };

  // draw function (runs every frame when enabled)
  p.draw = function() {

    // set background color
    p.background(200, 200, 255);

    if(!indialogue) {
      p.movePlayer();
    }
    else {
      console.log('aaaaa');
    }

    p.drawActors();

    p.tint(255, 2, 120);
    p.image(chef, 0, 0, 400, 400);
    p.image(water, -100, -100, 100, 100);
    p.tint(0, 153, 204);
    
  }

  p.movePlayer = function() {

    let movement = p.createVector(0, 0);

    if(p.keyIsDown(87) || p.keyIsDown(p.UP_ARROW)) { // if W or ^
        movement.y -= 9;

    } 
    if(p.keyIsDown(83) || p.keyIsDown(p.DOWN_ARROW)) { // if S or v
        movement.y += 9;
    }

    if(p.keyIsDown(65) || p.keyIsDown(p.LEFT_ARROW)) { // if A or <
      movement.x -=1;

    }
    if(p.keyIsDown(68) || p.keyIsDown(p.RIGHT_ARROW)) { // if D or >
      movement.x += 1;
    }
    movement.normalize();

    movement.mult(0.01);

    player.add(movement);
    
    if(player.x > 1) {
      player.x = 1;
    }
    else if(player.x < 0) {
      player.x = 0;
    }
    if(player.y > 1) {
      player.y = 1;
    }
    else if(player.y < 0) {
      player.y = 0;
    }

  }

  p.drawActors = function() {
    let x, y, scale;

    scale = 0.1;

    // draw player
    x = p.map(player.x, 0, 1, 0, p.width, true);
    y = p.map(player.y, 0, 1, 0, p.height, true);
    scale = p.map(scale, 0, 1, 0, p.height, true);

    p.circle(x, y, scale);

    // draw fashionista
    x = p.map(fashionista.x, 0, 1, 0, p.width, true);
    y = p.map(fashionista.y, 0, 1, 0, p.height, true);

    p.circle(x, y, scale);

    // draw singer
    x = p.map(singer.x, 0, 1, 0, p.width, true);
    y = p.map(singer.y, 0, 1, 0, p.height, true);
    p.circle(x, y, scale);
  }

  p.startDialogue = function() {
    let maxdist = 0.05;

    let dist = p5.Vector.sub(fashionista, player);

    if(Math.abs(dist.mag()) < maxdist) {
      console.log('Conversation started with fashionista');

      return;
    }

    dist = p5.Vector.sub(singer, player);

    if(Math.abs(dist.mag()) < maxdist) {
      console.log('Conversation started with singer');
      return;
    }


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
    p.resizeCanvas(960, 540);//(p.windowWidth * 7/10, p.windowWidth * 63/160);
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
  }

  // disable draw loop if no mouse/key buttons are pressed
  p.mouseReleased = function() {
    if(!p.keyIsPressed) p.noLoop(); 
  }

  // enable draw loop if key is pressed
  p.keyPressed = function() {
    p.loop();
    if(p.keyIsDown(32)) {
      if(!indialogue) {
        p.startDialogue();
      }
    }
    //if(!bgmStarted) p.shuffleMusic(); // begin music playback here so chrome doesn't yell at me
  }

  // disable draw loop if no mouse/key buttons are pressed
  p.keyReleased = function() {
    if(!p.keyIsPressed && !p.mousePressed) p.noLoop();
  }

  p.loadCharacters = function() {
    characterParts['race'] = [];
    characterParts['race']['human'] = p.loadImage('assets/imgs/char/races/human.png');
    characterParts['race']['mouse'] = p.loadImage('assets/imgs/char/races/mouse.png');
    characterParts['race']['cat']   = p.loadImage('assets/imgs/char/races/cat.png');
    characterParts['race']['dog']   = p.loadImage('assets/imgs/char/races/dog.png');
    characterParts['race']['pig']   = p.loadImage('assets/imgs/char/races/pig.png');

    characterParts['eyes'] = [];
    characterParts['eyes']['bored']    = p.loadImage('assets/imgs/char/eyes/bored.png');
    characterParts['eyes']['pleasant'] = p.loadImage('assets/imgs/char/eyes/pleasant.png');
    characterParts['eyes']['shy']      = p.loadImage('assets/imgs/char/eyes/shy.png');
    characterParts['eyes']['sneaky']   = p.loadImage('assets/imgs/char/eyes/sneaky.png');
    characterParts['eyes']['wild']     = p.loadImage('assets/imgs/char/eyes/wild.png');

    // load bangs
    characterParts['bangs'] = [];
    characterParts['bangs']['human'] = [];
    characterParts['bangs']['human']['long']      = p.loadImage('assets/imgs/char/bangs/long/human.png');
    characterParts['bangs']['human']['middle']    = p.loadImage('assets/imgs/char/bangs/middle/human.png');
    characterParts['bangs']['human']['sideswept'] = p.loadImage('assets/imgs/char/bangs/sideswept/human.png');

    characterParts['bangs']['mouse'] = [];
    characterParts['bangs']['mouse']['long']      = p.loadImage('assets/imgs/char/bangs/long/mouse.png');
    characterParts['bangs']['mouse']['middle']    = p.loadImage('assets/imgs/char/bangs/middle/mouse.png');
    characterParts['bangs']['mouse']['sideswept'] = p.loadImage('assets/imgs/char/bangs/sideswept/mouse.png');

    characterParts['bangs']['cat'] = [];
    characterParts['bangs']['cat']['long']      = p.loadImage('assets/imgs/char/bangs/long/cat.png');
    characterParts['bangs']['cat']['middle']    = p.loadImage('assets/imgs/char/bangs/middle/cat.png');
    characterParts['bangs']['cat']['sideswept'] = p.loadImage('assets/imgs/char/bangs/sideswept/cat.png');

    characterParts['bangs']['dog'] = [];
    characterParts['bangs']['dog']['long']      = p.loadImage('assets/imgs/char/bangs/long/dog.png');
    characterParts['bangs']['dog']['middle']    = p.loadImage('assets/imgs/char/bangs/middle/dog.png');
    characterParts['bangs']['dog']['sideswept'] = p.loadImage('assets/imgs/char/bangs/sideswept/dog.png');

    characterParts['bangs']['pig'] = [];
    characterParts['bangs']['pig']['long']      = p.loadImage('assets/imgs/char/bangs/long/pig.png');
    characterParts['bangs']['pig']['middle']    = p.loadImage('assets/imgs/char/bangs/middle/pig.png');
    characterParts['bangs']['pig']['sideswept'] = p.loadImage('assets/imgs/char/bangs/sideswept/pig.png');

    // load hair
    characterParts['hair'] = [];
    characterParts['hair']['bun']      = p.loadImage('assets/imgs/char/hair/bun.png');
    characterParts['hair']['long']     = p.loadImage('assets/imgs/char/hair/long.png');
    characterParts['hair']['pigtails'] = p.loadImage('assets/imgs/char/hair/pigtails.png');
    characterParts['hair']['ponytail'] = p.loadImage('assets/imgs/char/hair/ponytail.png');
    characterParts['hair']['short']    = p.loadImage('assets/imgs/char/hair/short.png');


    characterParts['outfit'] = [];
    characterParts['outfit']['chef']      = p.loadImage('assets/imgs/char/outfits/chef.png');
    characterParts['outfit']['detective'] = p.loadImage('assets/imgs/char/outfits/detective.png');
    characterParts['outfit']['hero']      = p.loadImage('assets/imgs/char/outfits/hero.png');
    characterParts['outfit']['mafioso']   = p.loadImage('assets/imgs/char/outfits/mafioso.png');
    characterParts['outfit']['plumber']   = p.loadImage('assets/imgs/char/outfits/plumber.png');

    characterParts['hat'] = [];
    characterParts['hat']['chef']      = p.loadImage('assets/imgs/char/hats/chef.png');
    characterParts['hat']['detective'] = p.loadImage('assets/imgs/char/hats/detective.png');
    characterParts['hat']['hero']      = p.loadImage('assets/imgs/char/hats/hero.png');
    characterParts['hat']['mafioso']   = p.loadImage('assets/imgs/char/hats/mafioso.png');
    characterParts['hat']['plumber']   = p.loadImage('assets/imgs/char/hats/plumber.png');
  }

};

