/*
 * code/asg3/parser.js
 * holds GenerativeGrammar class
 * written by gigsabyte
 */

class GenerativeGrammar {

	// constructor
	constructor(rules, probability) {

		/* variables */

		this.rules = rules;

		this.probability = probability;

		this.axiom = null;

		this.result = {
			'textoutput': "",
			'generatedOutput' = [];
		};

	}

	generate() {
		return this.result;
	}

	getTokenFromRule(type) {
		let prob = Math.random();
		let tracker = 0;
		for(let i = 0; i < this.probability[type].length; i++) {
			tracker += this.probability[type][i];
			if(prob <= tracker) {
				return this.rules[type][i];
			}
		}
	}

	
	
	
}