/*
 * code/asg3/character.js
 * holds GeneratedCharacter class
 * written by gigsabyte
 */

class GeneratedHaiku extends GenerativeGrammar {

	// constructor
	constructor(rules, probability) {

		/* variables */

		super(rules, probability);

		this.axiom = [
		[
		"four particle",
		"six  particle",
		"ending"
		],
		["start 5",
		 "mid 7",
		 "end 5"]
		];

		this.result = {
			'haikuoutput' = [3],
			'soundoutput' = [3]
		};

	}

	generate() {
		this.result.text = "";

		for(let i = 0; i < 3; i++) {
			generateHaikuLine(this.axiom[0][i], i);
			generateArpeggio(this.axiom[1][i], i);
		}

		return(this.result);
	}

	generateHaikuLine(ax, index) {
		let tokens = ax.split(" ");

		if(ax.length > 1) {

			let first = getTokenFromRule(tokens[0]);
			this.result.haikuoutput[index].push(first);

			let particle = getTokenFromRule(tokens[1]);
			if(index == 1) {
				while(particle == this.result.haikuoutput[0][1]) {
					particle = getTokenFromRule(tokens[1]);
				}
			}
			this.result.haikuoutput[index].push(particle);
		}
		else {
			this.result.haikuoutput[index].push(getTokenFromRule(tokens[0]));
		}

	}

	generateArpeggio(ax, index) {
		let tokens = ax.split(" ");
		let chord = getTokenFromRule(tokens[0]);

		for(let i = 0; i < parseInt(tokens[1])) {
			this.result.soundoutput[index].push(chord[i]);
		}
	}

	
	
	
}