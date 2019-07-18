/*
 * code/asg3/dialog.js
 * holds DialogBox class for managing conversations and displaying text
 * written by gigsabyte
 */

class DialogBox {

	// constructor
	constructor(player, npc, p5) {

		/* variables */

		// reference to p5 sketch
		this.p5 = p5;

		// actors
		this.player = player;
		this.npc = npc;

		// current dialogue and text
		this.cd = npc.prompt.split("+");
		this.ct = 'im gay';

		this.index = 0; // index

		// waiting for 'y' / 'n' ?
		this.waitingForPrompt = false;

		// in generation output?
		this.ingen = false;


	}

	// exit function
	exitDialogue() {
		this.waitingForPrompt = false;
		return false;
	}

	// start up dialogue
	enterDialogue() {
		if(this.npc.visited) { // if npc has been visited
			this.index = 0;
			this.cd = this.npc.reprompt.split("+"); // display 2nd prompt
			this.waitingForPrompt = true;
		}
		else { // else display their prompt
			this.npc.visited = true;
			this.cd = this.npc.prompt.split("+");
		}
	}

	// progress to next line of dialogue
	progressText() {
		if(!this.waitingForPrompt && this.npc.canContinue) {
			this.index++;
			if(this.index >= this.cd.length -1) {
				this.index = this.cd.length - 1;
				if(this.ingen) {
					this.index = 0;
					this.cd = this.npc.reprompt.split('+');
					this.ingen = false;
				}
				this.waitingForPrompt = true;
			}
			if(this.npc.type == 'singer' && this.ingen) {
				this.npc.playLine(this.index);
			}
		}
	}

	// generate new Thing
	generate() {
		this.index = 0;
		this.npc.generate();
		if(this.npc.type == 'fashionista') {
			this.cd = this.npc.result.text.split('+');
			this.cd.push("");
		} else {
			this.cd = this.npc.result.haikuoutput;
			this.cd.push("");
			this.npc.playLine(this.index);
		}
		this.waitingForPrompt = false;
		this.ingen = true;
	}



	// draw actors, dialog box and text
	draw() {

		this.ct = this.cd[this.index];

		this.p5.push();

		this.player.draw();
		this.npc.draw();

		let h = this.p5.height;
		let w = h * 500/625;

		this.p5.fill(255);
		this.p5.rectMode(this.p5.CENTER);
		this.p5.rect(w * 1.5 - w/16, h * 3/4, w * 7/8, w * 3.5/8, 20);

		this.p5.fill(0);
		this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
		this.p5.textSize(Math.floor(16/800 * this.p5.width));
		this.p5.text(this.ct, w * 1.5 - w/16, h * 3/4);

		this.p5.pop();
	}

	
	
	
}