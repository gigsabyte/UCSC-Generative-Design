/*
 * code/asg3/player.js
 * holds Player class
 * written by gigsabyte
 */

class Player {

	// constructor
	constructor(origsprite, p5) {

		/* variables */

		// reference to p5 sketch
		this.p5 = p5;

		this.origsprite = origsprite;
		this.hasSprite = false;

		// sprite and color arrays
		this.sprite = [];
		this.color = [];

		// sprite parts
		this.body = null;
		this.eyes = null;
		this.bangs = null;
		this.hair = null;
		this.clothes = null;
		this.hat = null;


	}

	// draw player
	draw() {

		if(!this.hasSprite) { // if player has not been given a sprite by the fashionista
			this.p5.push();

			let h = this.p5.map(this.origsprite.height, 0, 625, 0, this.p5.height);
			let w = h * 500/625;
			this.p5.image(this.origsprite, this.p5.width-w, 0, w, h);

			this.p5.pop();

			return;
		}

		for(let i = 0; i < this.sprite.length; i++) { // otherwise, combine sprite parts
			this.p5.push();

			let h = this.p5.map(this.sprite[i].height, 0, 625, 0, this.p5.height);
			let w = h * 500/625;

			this.p5.tint(this.color[i]);

			this.p5.image(this.sprite[i], this.p5.width-w, 0, w, h);

			this.p5.pop();
		}
		
	}

	// function to assign a certain type of sprite to the player
	assignSprite(name, type, color, image) {

		switch(name) {
			case 'body':
				this.body = type;
				break;
			case 'eyes':
				this.eyes = type;
				break;
			case 'bangs':
				this.bangs = type;
				break;
			case 'hair':
				this.hair = type;
				break;
			case 'clothes':
				this.clothes = type;
				break;
			case 'hat':
				this.hat = type;
				break;
			default:
				console.log('if this happens you typo\'d');
				return;
		}

		if(type == 'hair') { // hair goes on the bottom
			this.sprite.unshift(image);
			this.color.unshift(color);
		}
		else {
			this.sprite.push(image);
			this.color.push(color);
		}
		this.hasSprite = true;

	}

	// function to reset sprite
	clearSprite() {
		this.sprite = [];
		this.color = [];
		this.hasSprite = false;

		this.body = this.eyes = this.bangs = this.hair = this.clothes = this.hat = null;

	}
	
}