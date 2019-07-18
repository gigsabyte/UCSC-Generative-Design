/*
 * code/asg3/singer.js
 * holds Singer class
 * Singer says a haiku and sings notes by way of the P5 PolySynth
 * based on the output of a nondeterministic generative grammar
 * written by gigsabyte
 */

class Singer extends NPC {

	// constructor
	constructor(sprite, player, synth, p5) {

		super(sprite, player, p5);

		/* variables */
		this.type = 'singer';

		this.rules = [];
		this.probability = [];

		this.setupChords();
		this.setupLines();

		this.generator = new GeneratedHaiku(this.rules, this.probability);

		this.result = null;

		this.songs = [3];

		this.voice = synth;

		this.prompt = "Hello...+I am a poet, and a singer.+I compose haiku of life's mysteries.+Type 'y' to receive a gift,\n or 'n' to leave.";

		this.reprompt = "Type 'y' if you'd like to hear \nmore musings, or 'n' to leave.";

		this.goodbye = "Good tidings to you.";

	}

	// function to generate a new haiku and song
	generate() {
		this.result = this.generator.generate();

		let s = this.result.soundoutput;

		for(let i = 0; i < 3; i++) {
			this.songs[i] = [];
			for(let j = 0; j < s[i].length; j++) {
				this.songs[i].push({pitch:this.p5.midiToFreq(s[i][j]), velocity:1, time:j, duration:0.75});
			}
			this.songs[i][s[i].length-1].duration = 1;
			this.songs[i].push({pitch:0, velocity:0, time:s[i].length, duration:1});
		}
	}

	// function to play a matching bar of music to a haiku line
	playLine(index) {
		try {
			this.canContinue = false;

			for (let i = 0; i < this.songs[index].length; i++) {
	    		let note = this.songs[index][i];
	    		this.voice.play(note.pitch, note.velocity, note.time, note.duration);
			}
			setTimeout(this.cont.bind(this), 1000 * this.songs[index].length);
		} catch(error) {
			this.canContinue = true;
		}
	}

	// function to allow dialog to continue
	cont() {
		this.canContinue = true;
	}

	// function to set up rules and probability for music
	setupChords() {

		this.rules['start'] = [ [60, 64, 67, 69, 76],
								[60, 72, 67, 69, 64],
								[60, 69, 67, 64, 64],
								[60, 72, 67, 69, 64],
								[60, 62, 69, 67, 69],
							  ];
		this.rules['mid'] = [   [64, 69, 64, 62, 64, 69, 69],
								[67, 64, 69, 65, 65, 62, 64],
								[69, 64, 67, 62, 65, 72, 69],
								[67, 62, 64, 69, 67, 64, 62],
								[62, 69, 64, 67, 67, 69, 64],
							  ];
		this.rules['end'] = [   [60, 64, 67, 69, 72],
								[60, 72, 67, 69, 72],
								[60, 69, 67, 64, 60],
								[60, 72, 67, 69, 72],
								[60, 62, 69, 67, 60],
							  ];

		this.probability['start'] = 
		this.probability['mid'] = 
		this.probability['end'] = [0.2, 0.2, 0.2, 0.2, 0.2];

	}

	// function to set up rules and probability for haiku lines
	setupLines() {
		this.rules['opening'] = [ 'I often wonder,', 'Have you ever thought,',
								  'A great man once asked,', 'I have a question:',
								  'Ask yourself but this:'
							 ];
		this.rules['question'] =  [ 'Why is the earth globular?', 'Who invented stringy cheese?',
									'How does one commit tax fraud?', 'What is the meaning of art?',
									'Should we allow dogs to vote?'
							 ]; 

		this.rules['ending'] = [ 'Tasty food for thought.', "Aren't you curious?",
								 'Something to chew on.', 'A musing for you.',
								 'Oh, how intriguing!'
							 ]; 
		this.probability['opening'] = 
		this.probability['question'] = 
		this.probability['ending'] = [0.2, 0.2, 0.2, 0.2, 0.2];

	}
}