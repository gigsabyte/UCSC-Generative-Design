const asg1 = ( p ) => {

  var timeX = 0;
  var timeY = 10000;

  let k = 0.01;

  p.preload = function() {
  	//bgm = loadSound('assets/audio/bla.mp3');
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth/2, p.windowWidth/2 * 9/16);

  };

  p.draw = function() {
  	timeX += k;
  	timeY += k;

  	let x = p.noise(timeX) * p.windowWidth/2;
  	let y = p.noise(timeY) * p.windowWidth/2 * 9/16;

    p.background(255);

    p.stroke(0);
    p.fill(0);

    p.ellipse(x, y, 30);
    

  p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth/2, p.windowWidth/2 * 9/16);
  }


  };
};

