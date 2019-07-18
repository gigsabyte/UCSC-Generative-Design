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

		this.sprite = [];
		this.color = [];

		this.body = null;
		this.eyes = null;
		this.bangs = null;
		this.hair = null;
		this.clothes = null;
		this.hat = null;

		this.name = null;

		this.hasSprite = false;

	}

	// draw terrain
	draw() {

		if(!this.hasSprite) {
			this.p5.push();

			this.p5.image(this.origsprite, 0, 0);

			this.p5.pop();

			return;
		}

		for(let i = 0; i < this.sprite.length; i++) {
			this.p5.push();

			this.p5.tint(this.color[i]);

			this.p5.image(this.sprite[i], 0, 0);

			this.p5.pop();
		}
		
	}

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
				console.log('you fucked up');
				return;
		}

		if(type == 'hair') {
			this.sprite.unshift(image);
			this.color.unshift(color);
		}
		else {
			this.sprite.push(image);
			this.color.push(color);
		}
		this.hasSprite = true;
	}

	clearSprite() {
		this.sprite = [];
		this.color = [];
		this.hasSprite = false;

		this.body = this.eyes = this.bangs = this.hair = this.clothes = this.hat = null;

	}

	assignName(name) {
		this.name = name;
	}

	clearName() {
		this.name = null;
	}

	
	
	
}