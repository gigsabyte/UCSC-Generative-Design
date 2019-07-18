/*
 * code/asg3/fashionista.js
 * holds Fashionista class
 * Fashionista assigns the player an appearance
 * based on the output of a nondeterministic generative grammar
 * written by gigsabyte
 */

class Fashionista extends NPC {

	// constructor
	constructor(sprite, player, p5, images) {

		super(sprite, player, p5);

		/* variables */
		this.type = 'fashionista';

		this.images = images;

		this.races = ['human', 'mouse', 'cat', 'dog', 'pig'];
		this.racecolors = [];
		this.eyes = ['bored', 'pleasant', 'shy', 'sneaky', 'wild'];
		this.bangs = [];
		this.hairs = ['a bun', 'long hair', 'pigtails', 'a ponytail', 'short hair'];
		this.haircolors = ['blonde', 'red', 'brown', 'black', 'blue'];
		this.outfits = ['chef', 'detective', 'hero', 'mafioso', 'plumber'];
		this.hats = ['chef', 'detective', 'hero', 'mafioso', 'plumber'];
		this.colors = [];

		this.bangsSetup();
		this.colorSetup();

		this.rules = this.probability = null;

		this.makeRules();

		this.generator = new GeneratedCharacter(this.rules, this.probability);

		this.result = null;

		this.prompt = "Yo!!!!!!+Being a circle is noooo fun!+Ya wanna be somethin' else?+Type 'y' to get a makeover,\n or 'n' to leave.";

		this.reprompt = "Type 'y' if ya want a new makeover,\n or 'n' to leave!"

		this.goodbye = "See ya!";

	}

	// function to generate a new player sprite
	generate() {
		this.player.clearSprite(); // clear old sprite
		this.result = this.generator.generate(); // get new one

		let out = this.result.generatedOutput;

		// start assigning new sprites to player based on grammar output

		// player hair
		let type = out['hair'];
		let color = this.colors['bangs'][out['haircolor']];
		let image = this.images['hair'][out['hair']];
		this.player.assignSprite('hair', type, color, image);

		// player body
		type = out['race'];
		color = this.colors[out['race']][out['racecolor']];
		image = this.images['race'][out['race']];
		this.player.assignSprite('body', type, color, image);

		// player eyes
		type = out['eyes'];
		color = this.p5.color(255, 255, 255);
		image = this.images['eyes'][out['eyes']];
		this.player.assignSprite('eyes', type, color, image);


		// player bangs
		type = out['bangs'];
		color = this.colors['bangs'][out['haircolor']];
		image = this.images['bangs'][out['race']][out['bangs']];
		this.player.assignSprite('bangs', type, color, image);

		// player outfit
		type = out['outfit'];
		color = this.p5.color(255, 255, 255);
		image = this.images['outfit'][out['outfit']];
		this.player.assignSprite('clothes', type, color, image);

		// player hat
		type = out['hat'];
		image = this.images['hat'][out['hat']];
		this.player.assignSprite('hat', type, color, image);

	}

	// function that constructs the rules and probabilities to pass to the grammar
	makeRules() {
		// rules to make: race, racecolor, eyes, haircolor, bangs, hair, outfit, hat
		this.rules = [];
		this.probability = [];

		// race rules and probability
		this.rules['race'] = this.races;
		this.probability['race'] = [0.2, 0.2, 0.2, 0.2, 0.2];

		// racecolor rules and probability
		this.rules['racecolor'] = [];
		this.probability['racecolor'] = [];

		this.rules['racecolor']['human'] = ['pale skin','medium skin', 
											'dark skin','warm skin', 
											'ruddy skin','tan skin'];
		this.probability['racecolor']['human'] = [0.15, 0.15, 0.15, 0.15, 0.2, 0.2];

		this.rules['racecolor']['mouse'] = 
		this.rules['racecolor']['cat'] =
		this.rules['racecolor']['dog'] = ['white fur', 'light grey fur', 
										  'dark grey fur', 'black fur', 
										  'brown fur', 'yellow fur', 'blue fur'];

		this.probability['racecolor']['mouse'] = 
		this.probability['racecolor']['cat'] =
		this.probability['racecolor']['dog'] = [0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.1];
		
		this.rules['racecolor']['pig'] = ['pink skin', 'red skin', 
										  'brown skin', 'blue skin', 'black skin'];
		this.probability['racecolor']['pig'] = [0.2, 0.2, 0.2, 0.2, 0.2];

		// eyes rules and probability
		this.rules['eyes'] = this.eyes;
		this.probability['eyes'] = [0.2, 0.2, 0.2, 0.2, 0.2];

		// haircolor rules and probability
		this.rules['haircolor'] = this.haircolors;
		this.probability['haircolor'] = [0.2, 0.2, 0.2, 0.2, 0.2];

		// bangs rules and probability
		this.rules['bangs'] = this.bangs['human'];
		this.probability['bangs'] = [0.3, 0.3, 0.4];

		// hair rules and probability
		this.rules['hair'] = this.hairs;
		this.probability['hair'] = [0.2, 0.2, 0.2, 0.2, 0.2];

		// outfit rules and probability
		this.rules['outfit'] = this.outfits;
		this.probability['outfit'] = [0.2, 0.2, 0.2, 0.2, 0.2];

		// hat rules and probability
		this.rules['hat'] = this.hats;
		this.probability['hat'] = [0.2, 0.2, 0.2, 0.2, 0.2];
	}


	// assigning bang names
	bangsSetup() {
		this.bangs['human'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['mouse'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['cat'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['dog'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['pig'] = ['sideswept', 'middle parted', 'long'];
	}

	// hell function for assigning colors
	colorSetup() {

		// human skin tones
		this.colors['human'] = [];
		this.colors['human']['pale skin']   = this.p5.color(255, 246, 224);
		this.colors['human']['medium skin'] = this.p5.color(227, 190, 145);
		this.colors['human']['dark skin']   = this.p5.color(79, 61, 52);
		this.colors['human']['warm skin']   = this.p5.color(125, 94, 80);
		this.colors['human']['ruddy skin']  = this.p5.color(196, 144, 124);
		this.colors['human']['tan skin']    = this.p5.color(135, 100, 69);

		// fur colors for mice
		this.colors['mouse'] = [];
		this.colors['mouse']['white fur'] 	   = this.p5.color(255, 255, 255);
		this.colors['mouse']['light grey fur'] = this.p5.color(175, 175, 175);
		this.colors['mouse']['dark grey fur']  = this.p5.color(125, 125, 125);
		this.colors['mouse']['black fur']      = this.p5.color(65, 65, 65);
		this.colors['mouse']['brown fur']      = this.p5.color(125, 80, 71);
		this.colors['mouse']['yellow fur']     = this.p5.color(240, 202, 127);
		this.colors['mouse']['blue fur']       = this.p5.color(161, 179, 214);

		// fur colors for cats
		this.colors['cat'] = [];
		this.colors['cat']['white fur'] 	 = this.p5.color(255, 255, 255);
		this.colors['cat']['light grey fur'] = this.p5.color(175, 175, 175);
		this.colors['cat']['dark grey fur']  = this.p5.color(125, 125, 125);
		this.colors['cat']['black fur']      = this.p5.color(65, 65, 65);
		this.colors['cat']['brown fur']      = this.p5.color(125, 80, 71);
		this.colors['cat']['yellow fur']     = this.p5.color(240, 202, 127);
		this.colors['cat']['blue fur']       = this.p5.color(161, 179, 214);

		// fur colors for dogs
		this.colors['dog'] = [];
		this.colors['dog']['white fur'] 	 = this.p5.color(255, 255, 255);
		this.colors['dog']['light grey fur'] = this.p5.color(175, 175, 175);
		this.colors['dog']['dark grey fur']  = this.p5.color(125, 125, 125);
		this.colors['dog']['black fur']      = this.p5.color(65, 65, 65);
		this.colors['dog']['brown fur']      = this.p5.color(125, 80, 71);
		this.colors['dog']['yellow fur']     = this.p5.color(240, 202, 127);
		this.colors['dog']['blue fur']       = this.p5.color(161, 179, 214);

		// skin colors for pigs
		this.colors['pig'] = [];
		this.colors['pig']['pink skin']  = this.p5.color(255, 192, 189);
		this.colors['pig']['red skin']   = this.p5.color(171, 82, 82);
		this.colors['pig']['brown skin'] = this.p5.color(140, 74, 74);
		this.colors['pig']['blue skin']  = this.p5.color(101, 93, 133);
		this.colors['pig']['black skin'] = this.p5.color(165, 65, 65);

		// hair colors
		this.colors['bangs'] = [];
		this.colors['bangs']['blonde'] = this.p5.color(255, 240, 207); 
		this.colors['bangs']['red']    = this.p5.color(204, 101, 78);
		this.colors['bangs']['brown']  = this.p5.color(92, 57, 57);
		this.colors['bangs']['black']  = this.p5.color(36, 36, 36);
		this.colors['bangs']['blue']   = this.p5.color(92, 90, 138);

		this.colors['hair'] = this.colors['bangs'];
		
	}

	
	
	
}