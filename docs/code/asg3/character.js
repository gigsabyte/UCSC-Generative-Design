/*
 * code/asg3/character.js
 * holds GeneratedCharacter class
 * which will generate a description of a character based on its axiom
 * given a set of rules and probabilities
 * see the note about structure in parser.js
 * written by gigsabyte
 */

class GeneratedCharacter extends GenerativeGrammar {

	// constructor
	constructor(rules, probability) {

		/* variables */

		super(rules, probability);

		this.axiom = [
		"OK, so like...",
		"You're gonna be a <race> with <racecolor>",
		"Ya usually have a kinda <eyes> look on your face",
		"Ya got <haircolor> <bangs> bangs and <hair>",
		"Usually ya work as a <outfit>",
		"But ya also work as a <hat>"
		]

		this.race = null;

	}

	// generate character
	generate() {
		this.result.text = "";

		for(let i = 0; i < this.axiom.length; i++) {
			let tokens = this.axiom[i].split(" ");
			for(let j = 0; j < tokens.length; j++) {
				if(tokens[j].charAt(0) == '<') {
					let adjtoken = tokens[j].substring(1, tokens[j].length - 1);

					let generated;
					if(adjtoken == 'racecolor') generated = this.getRaceColor(adjtoken);
					else generated = this.getTokenFromRule(adjtoken);
					if(adjtoken == 'race') this.race = generated;
					this.result.text += generated;
					this.result.generatedOutput[adjtoken] = generated;

				} else {
					this.result.text += tokens[j];
				}
				if(j == Math.floor(tokens.length/2)) this.result.text += "\n";
				else this.result.text += " ";
			}
			this.result.text = this.result.text.trim();
			this.result.text += "!+";
			console.log(this.result.text);
		}
		this.result.text = this.result.text.substring(0, this.result.text.length-1);
		return(this.result);
	}

	// get skin/fur color depending on race
	getRaceColor(type) {
		let prob = Math.random();
		let tracker = 0;
		for(let i = 0; i < this.probability[type][this.race].length; i++) {
			tracker += this.probability[type][this.race][i];
			if(prob <= tracker) {
				return this.rules[type][this.race][i];
			}
		}
	}
	
	
}