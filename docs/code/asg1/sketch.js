const asg1 = ( p ) => {

  let x = 100; 
  let y = 100;

  let ps;
  let count = 60;
  let circles = 6;

  let bgm;

  p.preload = function() {
  	p.soundFormats('mp3', 'ogg');
  	//bgm = loadSound('assets/audio/bla.mp3');
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth/2, p.windowWidth/2 * 9/16);

    ps = new ParticleSystem(count, circles, p.windowWidth/2, p.windowWidth/2 * 9/16, p5);
  };

  p.draw = function() {
    p.background(0);
    ps.run();

  p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth/2, p.windowWidth/2 * 9/16);
  }


  };
};

