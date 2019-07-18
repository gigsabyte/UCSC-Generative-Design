/*
 * code/asg3/npc.js
 * holds NPC class
 * written by gigsabyte
 */

class Fashionista extends NPC {

	// constructor
	constructor(sprite, file, player, p5, images) {

		super(sprite, file, player, p5);

		/* variables */

		this.races = ['human', 'mouse', 'cat', 'dog', 'pig'];
		this.eyes = ['bored', 'pleasant', 'shy', 'sneaky', 'wild'];
		this.bangs = [];
		this.hairs = ['a bun', 'long hair', 'pigtails', 'a ponytail', 'short hair'];
		this.outfits = ['chef', 'detective', 'hero', 'mafioso', 'plumber'];
		this.hats = ['chef', 'detective', 'hero', 'mafioso', 'plumber'];
		this.colors = [];

		this.bangsSetup();
		this.colorSetup();




	}

	// draw
	draw() {
		
	}

	bangsSetup() {
		this.bangs['human'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['mouse'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['cat'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['dog'] = ['sideswept', 'middle parted', 'long'];
		this.bangs['pig'] = ['sideswept', 'middle parted', 'long'];
	}
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