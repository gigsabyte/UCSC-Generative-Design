/*
 * code/asg4/sketch.js
 * holds p5 sketch.js code for asg4
 * creates p5 sketch with a set of boxcars that race and evolve
 * written by gigsabyte
 */

 let world;

const asg4 = ( p ) => {

  // html elements
  let canvas;
  let start;
  let eurobeat;
  let font;

  // music
  let bgm = [3];
  let bgmStarted = false;
  let lastIndex = 2;
  let currentSong = null;

  // world
  let cars;
  let race;
  let camera;
  let bgcolor;

  // GA
  let ga;
  let gen = 1;
  let trophyCar;
  let bestFit;

  // preload font and music
  p.preload = function() {
    p.soundFormats('mp3', 'ogg');
    bgm[0] = p.loadSound('assets/audio/eurobeat/dejavu.mp3');
    font = p.loadFont('assets/fonts/inconsolata.ttf');

  }

  // setup
  p.setup = function() {

    // load the other music
    bgm[1] = p.loadSound('assets/audio/eurobeat/90s.mp3');
    bgm[2] = p.loadSound('assets/audio/eurobeat/gas.mp3');
    
    // create canvas element and style it
    canvas = p.createCanvas(p.windowWidth * 7/10, p.windowWidth* 63/160, p.WEBGL);
    p.setAttributes('antialias', true);

    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    p.createP(''); // empty space for formatting

    // create buttons

    // start race button
    start = p.createButton('Start race');
    p.stylizeButton(start);
    start.mousePressed(p.startRace); // call toggleMusic when button is pressed

    p.createP(''); // empty space for formatting

    // play eurobeat button
    eurobeat = p.createButton('Play Eurobeat');
    p.stylizeButton(eurobeat);
    eurobeat.mousePressed(p.playEurobeat); // call toggleMusic when button is pressed

    // Initialize box2d physics and create the world
    world = createWorld();
    camera = p.createCamera();

    // Create Camera
    camera.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height /2, 0, 10);
    camera.setPosition(0, 0, 0);

    // create genetic algorithm
    ga = new GeneticAlgorithm(10, 0.1, this);
    
    // Create a list of cars
    cars = [];
    for(let i = 0; i < 10; i++) {
        cars[i] = new Car(ga.cars[i].x,ga.cars[i].y,ga.cars[i].name, ga.cars[i].feats, this);
    } 

    // Create a terrain
    let pos = p.createVector(-p.width/2, 10);
    terrain = new Terrain(pos.x, pos.y, 100, 100, 1, this);    

    // set background color
    bgcolor = p.color(200, 200, 255);

  }

  

  // draw function (runs every frame when enabled)
  p.draw = function() {
    // color background
    p.background(bgcolor);

    // get time since last frame
    let deltaTime = window.performance.now() - canvas._pInst._lastFrameTime;
    
    // if race is running, update and draw frame
    if(race && race.running) {
      race.update();
      race.draw(deltaTime);
      
      // Update physics. 2nd and 3rd arguments are velocity and position iterations
      let timeStep = 1.0 / 30;
      world.Step(timeStep, 10, 10);

      // Get race leaderboards
      let leaderboard = race.getLeaderboards();

      // Follow first car with the camera
      let firstCar = leaderboard[0].car;

      // if the first car has been removed, find the next car to follow
      let i = 0;
      while(race.cars.indexOf(firstCar) == -1) {
        i++;
        if(i >= 10) break;
        firstCar = leaderboard[i].car;
      }

      // if the first car exists
      if (firstCar) {
          let firstPos = firstCar.getPosition();
          camera.setPosition(firstPos.x + p.width/5, firstPos.y, camera.eyeZ);
      }

      // display generation text and best car of prev generation
      let text = "Generation " + gen;
      if(trophyCar) {
        trophyCar.draw(deltaTime);
        text += ("\nGeneration " + (gen -1) +"'s winner: " + trophyCar.name +"\nwith a fitness of " + bestFit);
      } 
      p.textFont(font);
      p.fill(81);
      p.textAlign(p.RIGHT, p.TOP);
      p.textSize(Math.floor(14/800 * p.width));
      p.text(text, camera.eyeX + p.width/2, camera.eyeY - p.height/2);
    }
}

  /* Callback function for when the race is over */
  p.raceOverCallback = function(finalLeaderboards) {

      // increment generation
      ++gen;

      // evolve generation and get best individual from prev generation
      let best = ga.evolve(finalLeaderboards);

      bestFit = Math.floor(best.fitness * 100)/100;

      // make a trophy car from the best car
      trophyCar = new TrophyCar(best.car.x, best.car.y, best.car.name, best.car.feats, best.car.bodyColor, best.car.wheelsColor, camera, best.car.p5);

      // set terrain/background colors based on previous generation
      bgcolor = p.lerpColor(best.car.bodyColor, p.color(255), 0.8);
      terrain.color = best.car.wheelsColor;
      terrain.stroke = p.lerpColor(bgcolor, terrain.color, 0.5);

      // make new car array
      cars = [];
      for(let i = 0; i < 10; i++) {
        cars[i] = new Car(ga.cars[i].x,ga.cars[i].y,ga.cars[i].name, ga.cars[i].feats, ga.cars[i].p5);
        cars[i].bodyColor = ga.cars[i].bodyColor;
        cars[i].wheelsColor = ga.cars[i].wheelsColor;
      } 

      // start new race
      race = new Race(terrain, cars, p.raceOverCallback);
      race.start();
    }

  // start race from button press
  p.startRace = function() {
    if(race) {
      p.raceOverCallback(race.getLeaderboards());
    } else {
      race = new Race(terrain, cars, p.raceOverCallback);
      race.start();
      start.html("Evolve and start new race");
    }
  }

  // play eurobeat
  p.playEurobeat = function() {
    if(!bgmStarted) {
      eurobeat.html("Pause Eurobeat");
      p.shuffleMusic();
    } 
    else {
      if(currentSong.isPaused()) {
        currentSong.play();
        eurobeat.html("Pause Eurobeat");
      } else {
        currentSong.pause();
        eurobeat.html("Resume Eurobeat");
      } 
    }
  }

  // handle music play/pause
  p.shuffleMusic = function() {
    if(bgmStarted) {
      if(currentSong.isPaused()) {
        return;
      }
    }
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
    currentSong = bgm[index];
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

};

