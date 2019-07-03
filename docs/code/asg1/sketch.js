const asg1 = ( p ) => {

  let x = 100; 
  let y = 100;

  let ps;
  let count = 500;
  let circles = 25;

  let bgm;
  let amplitude;

  let button;
  let canvas;

  let frameBuffer = 0;

  p.preload = function() {
  	p.soundFormats('mp3', 'ogg');
  	bgm = p.loadSound('assets/audio/whitney.mp3');
  }

  p.setup = function() {
    canvas = p.createCanvas(p.windowWidth/2, p.windowWidth/2 * 9/16);
  
    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    amplitude = new p5.Amplitude();

    ps = new ParticleSystem(count, circles, p.windowWidth/2, p.windowWidth/2 * 9/16, this);

    p.createP('');
    button = p.createButton('Play music');
    p.stylizeButton(button);
    //button.position(19, 19);
    button.mousePressed(p.toggleMusic);
  };

  p.draw = function() {
    let red = p.color(70, 10, 55);
    let blue = p.color(40, 15, 80);
    p.background(p.lerpColor(red, blue, (Math.sin(p.frameCount/60 * 119/60) + 1)/2));

    if(amplitude.getLevel() > 0.2 && frameBuffer > 5) {
        ps.emit();
        frameBuffer = 0;
    }

    frameBuffer++;
    
    ps.run();
  }

  p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth/2, p.windowWidth/2 * 9/16);
  }

  p.toggleMusic = function() {
    if(bgm != null) {
      if(bgm.isPlaying()) {
        bgm.pause();
        button.html("Play music");
      }
      else {
        bgm.play();
        button.html("Pause music");
      }
    }
  }

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

