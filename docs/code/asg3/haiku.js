/*
 * code/asg3/haiku.js
 * holds GeneratedHaiku class
 * which will generate a haiku based on its axiom
 * given a set of rules and probabilities
 * see the note about structure in parser.js
 * written by gigsabyte
 */

class GeneratedHaiku extends GenerativeGrammar {

	// constructor
	constructor(rules, probability) {

		/* variables */

		super(rules, probability);

		this.axiom = [
		[
		"opening",
		"question",
		"ending"
		],
		["start 5",
		 "mid 7",
		 "end 5"]
		];

		this.result = {
			'haikuoutput': [3],
			'soundoutput': [3]
		};

	}

	// generate a new haiku and music piece
	generate() {
		this.result.text = "";

		for(let i = 0; i < 3; i++) {
			this.generateHaikuLine(this.axiom[0][i], i);
			this.generateArpeggio(this.axiom[1][i], i);
		}

		return(this.result);
	}

	// generate line of haiku
	generateHaikuLine(ax, index) {
		let tokens = ax.split(" ");

		this.result.haikuoutput[index] = (this.getTokenFromRule(tokens[0]));

	}

	// generate sequence of notes
	generateArpeggio(ax, index) {
		let tokens = ax.split(" ");
		let chord = this.getTokenFromRule(tokens[0]);

		this.result.soundoutput[index] = [];
		for(let i = 0; i < parseInt(tokens[1]); i++) {
			this.result.soundoutput[index].push(chord[i]);
		}
	}

	
	
	
}