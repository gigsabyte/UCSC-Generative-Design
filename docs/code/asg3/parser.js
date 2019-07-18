/*
 * code/asg3/parser.js
 * holds GenerativeGrammar class
 * structured in a way inverse to traditional grammar implementation
 * in that it holds only the axiom and must be supplied rules/probability
 * to allow for more modular use in this program
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
			'generatedOutput': []
		};

	}

	generate() {
		return this.result;
	}

	getTokenFromRule(type) {
		console.log(type);
		console.log(this.rules[type]);
		let prob = Math.random();
		let tracker = 0;
		for(let i = 0; i < this.probability[type].length; i++) {
			tracker += this.probability[type][i];
			if(prob <= tracker) {
				console.log(this.rules[type][i]);
				return this.rules[type][i];
			}
		}
		return this.rules[type][this.probability[type].length-1];
	}

	
	
	
}