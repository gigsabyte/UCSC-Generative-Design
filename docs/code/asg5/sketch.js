/*
 * code/asg5/sketch.js
 * holds p5 sketch.js code for asg5
 * creates p5 sketch that can parse, analyze and generate songs based on midi files
 * written by gigsabyte
 */

 let world;

const asg5 = ( p ) => {

  /* html elements */

  // canvas
  let canvas;

  // buttons
  let bach;
  let brah;
  let scar;
  let tchai;
  let play;
  let newSong;

  // text
  let msg;
  let sampleText;
  let sizeText;

  // bools
  let canGenerate = false;
  let loading = false;

  // markov
  let sampleset = [];
  let markov;

  // setup
  p.setup = function() {
    
    // create canvas element and style it
    canvas = p.createCanvas(p.windowWidth * 7/10, p.windowWidth* 3.5/10);
    p.setAttributes('antialias', true);

    canvas.style('border', '4px solid #3d3d3d');
    canvas.style('border-radius', '4px');

    // create message
    msg = p.createP('Click on the composer buttons to add them to the sampleset. Once there is at least one composer in your sampleset, you can generate a song.'); 
    p.createP('Press the play button or use the spacebar to play/pause generated songs.'); // empty space for formatting


    sampleText = p.createP(''); // empty space for formatting

    // create midi player
    midiPlayer = new MidiPlayer(this);

    // create buttons

    // start composer buttons
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

    // create more messages
    sampleText = p.createP('Current sample set:'); // empty space for formatting
    sizeText = p.createP('Current sample size: 0 songs');

    // generate song button
    newSong = p.createButton('Generate new song');
    p.stylizeButton(newSong);
    newSong.mousePressed(p.generateNewSong);
    newSong.style('display', 'none');

    msg = p.createP('');

    // play/pause song button
    play = p.createButton('Play song');
    p.stylizeButton(play);
    play.mousePressed(p.togglePause);
    play.style('display', 'none');

  }

  

  // draw function (runs every frame when enabled)
  p.draw = function() {

    midiPlayer.draw();

}

  /* add to sample set functions */

  // bach
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

  // brahms
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

  // scarlatti
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

  // tchaikovsky
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

  // when MIDIs are loaded
  p.onMIDIsLoaded = function(pianoRolls) {
    
    console.log("loaded midis");
    
    // convert piano rolls to text and add to sample set
    for(let i = 0; i < pianoRolls.length; i++) {
      let midiText = midiPlayer.pianoRoll2Text(pianoRolls[i]);

      sampleset.push(midiText);
    }

    // create new markov chain
    markov = new MarkovChain();

    // train it
    markov.train(sampleset);

    // set bools
    canGenerate = true;
    loading = false;

    // update html
    newSong.style('display', 'inline-block');
    msg.html('Ready to generate new song!');
    sizeText.html('Current sample size: ' + sampleset.length + ' songs!');
}

  // create new song
  p.generateNewSong = function() {

    // manage play/pause
    if (_midiPlayer.isPlaying) {
            _midiPlayer.pause();
        }
    _midiPlayer.isPlaying = false;

    play.style('display', 'none');
    loading = false;

    // if the generator can generate
    if(canGenerate) {
      
      // make a new song
      let song = markov.generate();

      // convert to midi and get data
      let mid = midiPlayer.text2Midi(song);
      let midiData = midiPlayer.parseMidi(mid);

      // set piano roll and recolor it
      pianoRoll = midiPlayer.notes2PianoRoll(midiData.duration, midiData.notes);
      
      midiPlayer.g1 = p.color(Math.random() * 150 + 105, Math.random() * 150 + 105, Math.random() * 150 + 105);
      midiPlayer.g2 = p.color(Math.random() * 150 + 105, Math.random() * 150 + 105, Math.random() * 150 + 105);
      midiPlayer.bg = p.lerpColor(midiPlayer.g1, midiPlayer.g2, 0.5);
      midiPlayer.bg = p.lerpColor(midiPlayer.bg, p.color(255), 0.7);

      midiPlayer.setPianoRoll(pianoRoll, p.tsCallback);

      // html
      play.style('display', 'inline-block');
    } else {
      msg.html('Please wait! Still loading');
    }
  }

  // callback function for midi player
  p.tsCallback = function(currentTs, notesOn) {
     console.log(currentTs, notesOn);
}

  /* event handling */

  // on window resize, resize canvas
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth * 7/10, p.windowWidth * 3.5/10);
  }

  // on key press
  p.keyPressed = function() {

    if(p.keyCode === 32) { // spacebar
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
  // toggle play/pause of music
  p.togglePause = function() {
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

