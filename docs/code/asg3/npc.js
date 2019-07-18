/*
 * code/asg3/npc.js
 * holds NPC class, which is to be inherited by the Fashionista and Singer
 * written by gigsabyte
 */

class NPC {

	// constructor
	constructor(sprite, player, p5) {

		/* variables */

		// reference to p5 sketch
		this.p5 = p5;

		this.sprite = sprite;

		this.player = player;

		this.prompt = "Hi! I'm an NPC.\nWould you like to do an activity?";

		this.result = "";

		this.reprompt = "Do you wanna do it again?";

		this.goodbye = "Well, bye then!";

		this.visited = false;

		this.canContinue = true;

	}

	// draw on the left side of the screen
	draw() {

		this.p5.push();

		let h = this.p5.map(this.sprite.height, 0, 625, 0, this.p5.height);
		let w = h * 500/625;
		this.p5.image(this.sprite, 0, 0, w, h);

		this.p5.pop();
		
	}

	
	
	
}