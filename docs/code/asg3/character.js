/*
 * code/asg3/character.js
 * holds GeneratedCharacter class
 * written by gigsabyte
 */

class GeneratedCharacter extends GenerativeGrammar {

	// constructor
	constructor(rules, probability) {

		/* variables */

		super(rules, probability);

		this.axiom = [
		"You are a <race> with <racecolor>",
		"You have a <eyes> look on your face",
		"You have <haircolor> <bangs> bangs and <hair>",
		"Usually you work as a <outfit>",
		"You picked up a job as a <hat> in your spare time"
		]

	}

	generate() {
		this.result.text = "";

		for(let i = 0; i < this.axiom.length; i++) {
			let tokens = this.axiom[i].split(" ");
			for(let j = 0; j < tokens.length; j++) {
				if(tokens[j].charAt(0) == '<') {
					let adjtoken = tokens[j].substring(1, tokens[j].length - 1);
					let generated = getTokenFromRule(adjtoken);
					this.result.text += generated;
					this.result.generatedOutput[adjtoken] = generated;

				} else {
					this.result.text += tokens[j];
				}
				this.result.text += " ";
			}
			this.result.text = this.result.text.trim();
			this.result.text += "\n";
		}

		return(this.result);
	}
	
	
}