/*
 * code/asg5/sketch.js
 * holds p5 sketch.js code for asg4
 * creates p5 sketch with a set of boxcars that race and evolve
 * written by gigsabyte
 */

 let world;

const asg5 = ( p ) => {

  // html elements
  let canvas;

  let bach;
  let brah;
  let scar;
  let tchai;

  let play;

  let newSong;

  let msg;
  let sampleText;
  let sizeText;

  let canGenerate = false;
  let loading = false;

  // music
  let bgm = [3];
  let bgmStarted = false;
  let lastIndex = 2;
  let currentSong = null;

  // world
  let bgcolor;

  let sampleset = [];

  let markov;

  // preload font and music
  p.preload = function() {
    p.soundFormats('mp3', 'ogg');
  }

  // setup
  p.setup = function() {
    
    // create canvas element and style it
    canvas = p.createCanvas(p.windowWidth * 7/10, p.windowWidth* 3.5/10);
    p.setAttributes('antialias', true);

    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    msg = p.createP('Click on the composer buttons to add them to the sampleset. Once there is at least one composer in your sampleset, you can generate a song.'); 
      p.createP('Press the play button or use the spacebar to play/pause generated songs.'); // empty space for formatting


    sampleText = p.createP(''); // empty space for formatting

    midiPlayer = new MidiPlayer(this);

    // create buttons

    // start race button
    bach = p.createButton('Bach');
    p.stylizeButton(bach);
    bach.mousePressed(p.addBachToSampleSet);

    brahms = p.createButton('Brahms');
    p.stylizeButton(brahms);
    brahms.mousePressed(p.addBrahmsToSampleSet);

    scar = p.createButton('Scarlatti');
    p.stylizeButton(scar);
    scar.mousePressed(p.addScarToSampleSet);

    tchai = p.createButton('Tchaikovsky');
    p.stylizeButton(tchai);
    tchai.mousePressed(p.addTchaiToSampleSet);

    sampleText = p.createP('Current sample set:'); // empty space for formatting
    sizeText = p.createP('Current sample size: 0 songs');

    newSong = p.createButton('Generate new song');
    p.stylizeButton(newSong);
    newSong.mousePressed(p.generateNewSong);
    newSong.style('display', 'none');

    msg = p.createP('');

    play = p.createButton('Play song');
    p.stylizeButton(play);
    play.mousePressed(p.togglePause);
    play.style('display', 'none');

    // set background color
    bgcolor = p.color(200, 200, 255);

  }

  

  // draw function (runs every frame when enabled)
  p.draw = function() {
    // color background
    p.background(bgcolor);

    midiPlayer.draw();
}

  p.addBachToSampleSet = function() {
    if(!loading) {
      canGenerate = false;
      loading = true;
      msg.html('Loading samples... please wait!');
      sampleText.html(' Bach', true);
      bach.style('display', 'none');
      newSong.style('display', 'none');
      midiPlayer.loadMidis("assets/midi/bach.json", p.onMIDIsLoaded);
    }
  }

  p.addBrahmsToSampleSet = function(name, button) {
    if(!loading){
      canGenerate = false;
      loading = true;
      msg.html('Loading samples... please wait!');
      sampleText.html(' Brahms', true);
      brahms.style('display', 'none');
      newSong.style('display', 'none');
      midiPlayer.loadMidis("assets/midi/brahms.json", p.onMIDIsLoaded);
    }
  }

  p.addScarToSampleSet = function(name, button) {
    if(!loading){
      canGenerate = false;
      loading = true;
      msg.html('Loading samples... please wait!');
      sampleText.html(' Scarlatti', true);
      scar.style('display', 'none');
      newSong.style('display', 'none');
      midiPlayer.loadMidis("assets/midi/scar.json", p.onMIDIsLoaded);
    }
  }

  p.addTchaiToSampleSet = function(name, button) {
    if(!loading) {
      canGenerate = false;
      loading = true;
      msg.html('Loading samples... please wait!');
      sampleText.html(' Tchaikovsky', true);
      tchai.style('display', 'none');
      newSong.style('display', 'none');
      midiPlayer.loadMidis("assets/midi/tchai.json", p.onMIDIsLoaded);
    }
  }

  p.clearSampleSet = function() {
    sampleset = [];
    markov = null;

    sampleText.html('Current sample set:');
    bach.style('display', 'inline-block');
    brahms.style('display', 'inline-block');
    scar.style('display', 'inline-block');
    tchai.style('display', 'inline-block');

  }

  p.onMIDIsLoaded = function(pianoRolls) {
    console.log("loaded midis");
    // Encode the piano roll (2D array) as string
    for(let i = 0; i < pianoRolls.length; i++) {
      let midiText = midiPlayer.pianoRoll2Text(pianoRolls[i]);

      sampleset.push(midiText);
    }

    markov = new MarkovChain();

    markov.train(sampleset);

    canGenerate = true;
    loading = false;
    newSong.style('display', 'inline-block');
    msg.html('Ready to generate new song!');
    sizeText.html('Current sample size: ' + sampleset.length + ' songs!');
}

  p.generateNewSong = function() {
    if (_midiPlayer.isPlaying) {
            _midiPlayer.pause();
        }
    _midiPlayer.isPlaying = false;

    play.style('display', 'none');
    loading = false;

    if(canGenerate) {
        let song = markov.generate();

      console.log(song);

      let mid = midiPlayer.text2Midi(song);
      let midiData = midiPlayer.parseMidi(mid);

      console.log(mid);

      pianoRoll = midiPlayer.notes2PianoRoll(midiData.duration, midiData.notes);
      
      midiPlayer.g1 = p.color(Math.random() * 150 + 105, Math.random() * 150 + 105, Math.random() * 150 + 105);
      midiPlayer.g2 = p.color(Math.random() * 150 + 105, Math.random() * 150 + 105, Math.random() * 150 + 105);
      midiPlayer.bg = p.lerpColor(midiPlayer.g1, midiPlayer.g2, 0.5);
      midiPlayer.bg = p.lerpColor(midiPlayer.bg, p.color(255), 0.7);

      midiPlayer.setPianoRoll(pianoRoll, p.tsCallback);
      play.style('display', 'inline-block');
    } else {
      msg.html('Please wait! Still loading');
    }
  }


  p.tsCallback = function(currentTs, notesOn) {
     console.log(currentTs, notesOn);
}


  // on window resize, resize canvas
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth * 7/10, p.windowWidth * 3.5/10);
  }

  p.keyPressed = function() {

    if(p.keyCode === 32 && canGenerate) {
        _midiPlayer.isPlaying = !_midiPlayer.isPlaying;

        if (_midiPlayer.isPlaying) {
            _midiPlayer.start();
            play.html('Pause song');
        }
        else {
            _midiPlayer.pause();
            play.html('Play song');
        }
    }
}

  p.togglePause = function() {
    if(canGenerate) {
        _midiPlayer.isPlaying = !_midiPlayer.isPlaying;

        if (_midiPlayer.isPlaying) {
            _midiPlayer.start();
            play.html('Pause song');
        }
        else {
            _midiPlayer.pause();
            play.html('Play song');
        }
    }
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

