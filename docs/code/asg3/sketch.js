/*
 * code/asg3/sketch.js
 * holds p5 sketch.js code for asg3
 * creates p5 sketch with a player and 2 npcs
 * interacting with NPCs will cause them to create art for you
 * written by gigsabyte
 */

const asg3 = ( p ) => {

  // html elements
  let canvas;

  // images
  let circle;
  let fashion;
  let sing;

  // music
  let bgm = [6];
  let bgmStarted = false;
  let lastIndex = 3;

  // actors
  let player = p.createVector(0.25, 0.25);
  let playerAv;
  let fashionista = p.createVector(0.5, 0.75);
  let fashionistaAv;
  let singer = p.createVector(0.7, 0.25);
  let singerAv;

  // fashionista etc
  let characterParts = [];

  // worldState
  let indialogue = false;
  let currdialog;
  let fdialog;
  let sdialog;

  // preload textures and at least one music track
  p.preload = function() {

    // load default sprites
    circle = p.loadImage('assets/imgs/char/player.png');
    fashion = p.loadImage('assets/imgs/char/fashionista.png');
    sing = p.loadImage('assets/imgs/char/singer.png');

    p.loadCharacters(); // load all misc. character creation images

  }

  // setup
  p.setup = function() {

    
    // create canvas element and style it
    canvas = p.createCanvas(p.windowWidth*9/10, p.windowWidth*4/10);//(p.windowWidth * 7/10, p.windowWidth* 63/160);

    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    let synth = new p5.PolySynth(); // make synth

    // create avatars for player, fashionista and singer
    playerAv = new Player(circle, this);
    fashionistaAv = new Fashionista(fashion, playerAv, this, characterParts);
    singerAv = new Singer(sing, playerAv, synth, this);

    // create dialogs between fashionista and singer
    fdialog = new DialogBox(playerAv, fashionistaAv, this);
    sdialog = new DialogBox(playerAv, singerAv, this);
    
    currdialog = fdialog; // keep track of current dialog

  };

  // draw function (runs every frame when enabled)
  p.draw = function() {

    // set background color
    p.background(200, 200, 255);

    // if not in dialogue
    if(!indialogue) {
      p.movePlayer();
      p.drawActors(); // draw circles
    }
    else { // else
      currdialog.draw(); // draw current dialog
    }
    
  }

  // move player based on keyboard input
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

    movement.mult(0.025);

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

  // render circles on the screen
  p.drawActors = function() {
    p.push();
    let x, y, scale;

    scale = 0.25;

    // draw player
    x = p.map(player.x, 0, 1, 0, p.width, true);
    y = p.map(player.y, 0, 1, 0, p.height, true);
    scale = p.map(scale, 0, 1, 0, p.height, true);

    p.circle(x, y, scale);

    // draw fashionista
    x = p.map(fashionista.x, 0, 1, 0, p.width, true);
    y = p.map(fashionista.y, 0, 1, 0, p.height, true);

    p.fill(255, 255, 175);
    p.circle(x, y, scale);

    // draw singer
    x = p.map(singer.x, 0, 1, 0, p.width, true);
    y = p.map(singer.y, 0, 1, 0, p.height, true);

    p.fill(175, 255, 225);    
    p.circle(x, y, scale);
    p.pop();
  }

  // check if dialogue should be started based on distance
  p.startDialogue = function() {
    let maxdist = 0.15;

    let dist = p5.Vector.sub(fashionista, player);

    if(Math.abs(dist.mag()) < maxdist) {
      currdialog = fdialog;
      currdialog.enterDialogue();
      indialogue = true;
      return;
    }

    dist = p5.Vector.sub(singer, player);

    if(Math.abs(dist.mag()) < maxdist) {
      currdialog = sdialog;
      currdialog.enterDialogue();
      indialogue = true;
      return;
    }


  }

  /* event functions */

  // on window resize, resize canvas
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth*9/10, p.windowWidth*4/10);//(p.windowWidth * 7/10, p.windowWidth * 63/160);
  }

  // check for various key inputs
  p.keyPressed = function() {
    if(p.keyIsDown(32)) { // spacebar
      if(!indialogue) {
        p.startDialogue();
      }
      else {
        currdialog.progressText();
      }
    }
    else if(p.keyIsDown(89)) { // y
      if(indialogue) {
        if(currdialog.waitingForPrompt)currdialog.generate();
      }
    }
    else if(p.keyIsDown(78)) { // n
      if(indialogue) {
        if(currdialog.waitingForPrompt) indialogue = currdialog.exitDialogue();
      }
    }
  }

  // a hellish function to load all the images
  // i definitely could have not hardcoded this but sometimes you just take immeasurable L's
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
    characterParts['bangs']['human']['long']          = p.loadImage('assets/imgs/char/bangs/long/human.png');
    characterParts['bangs']['human']['middle parted'] = p.loadImage('assets/imgs/char/bangs/middle/human.png');
    characterParts['bangs']['human']['sideswept']     = p.loadImage('assets/imgs/char/bangs/sideswept/human.png');

    characterParts['bangs']['mouse'] = [];
    characterParts['bangs']['mouse']['long']          = p.loadImage('assets/imgs/char/bangs/long/mouse.png');
    characterParts['bangs']['mouse']['middle parted'] = p.loadImage('assets/imgs/char/bangs/middle/mouse.png');
    characterParts['bangs']['mouse']['sideswept']     = p.loadImage('assets/imgs/char/bangs/sideswept/mouse.png');

    characterParts['bangs']['cat'] = [];
    characterParts['bangs']['cat']['long']          = p.loadImage('assets/imgs/char/bangs/long/cat.png');
    characterParts['bangs']['cat']['middle parted'] = p.loadImage('assets/imgs/char/bangs/middle/cat.png');
    characterParts['bangs']['cat']['sideswept']     = p.loadImage('assets/imgs/char/bangs/sideswept/cat.png');

    characterParts['bangs']['dog'] = [];
    characterParts['bangs']['dog']['long']          = p.loadImage('assets/imgs/char/bangs/long/dog.png');
    characterParts['bangs']['dog']['middle parted'] = p.loadImage('assets/imgs/char/bangs/middle/dog.png');
    characterParts['bangs']['dog']['sideswept']     = p.loadImage('assets/imgs/char/bangs/sideswept/dog.png');

    characterParts['bangs']['pig'] = [];
    characterParts['bangs']['pig']['long']          = p.loadImage('assets/imgs/char/bangs/long/pig.png');
    characterParts['bangs']['pig']['middle parted']  = p.loadImage('assets/imgs/char/bangs/middle/pig.png');
    characterParts['bangs']['pig']['sideswept']     = p.loadImage('assets/imgs/char/bangs/sideswept/pig.png');

    // load hair
    characterParts['hair'] = [];
    characterParts['hair']['a bun']      = p.loadImage('assets/imgs/char/hair/bun.png');
    characterParts['hair']['long hair']     = p.loadImage('assets/imgs/char/hair/long.png');
    characterParts['hair']['pigtails'] = p.loadImage('assets/imgs/char/hair/pigtails.png');
    characterParts['hair']['a ponytail'] = p.loadImage('assets/imgs/char/hair/ponytail.png');
    characterParts['hair']['short hair']    = p.loadImage('assets/imgs/char/hair/short.png');


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

