class Particle {

	constructor(x, y, theta, v, accel, lifetime, p5, color, finalcolor, size) {
		this.dead = true;

		this.origpos = [x, y];
		this.pos = [x, y];

		this.origvelocity = [Math.cos(theta) * v, Math.sin(theta) * v];
		this.velocity = [Math.cos(theta) * v, Math.sin(theta) * v];

		this.origaccel = [Math.cos(accel), Math.sin(accel)];
		this.accel = [Math.cos(accel)/(2.5), Math.sin(accel)/(2.5)];
		console.log(this.accel);

		this.lifespan = lifetime;

		this.age = 0;

		this.p5 = p5;

		this.color = [3];
		this.finalcolor = [3];
		for(let i = 0; i < color.length; i++) {
			this.color[i] = color[i] * 255;
			this.finalcolor[i] = finalcolor[i] * 255;
		}

		this.scale = size;
	}

	update() {
		this.age += 1;

		if(this.age > this.lifespan) {
			this.die();
		} else {
			this.velocity[0] += this.accel[0];
			this.velocity[1] += this.accel[1];

			this.pos[0] += this.velocity[0];
			this.pos[1] += this.velocity[1];
		}
	}

	draw() {

		let alpha = 255 - ((this.age/this.lifespan) * 255);

		let color = [3];
		for(let i = 0; i < 3; i++) {
			color[i] = this.p5.lerp(this.color[i], this.finalcolor[i], this.age/this.lifespan);
		}

		this.p5.strokeWeight(this.age/this.lifespan * 10);
		//this.p5.stroke(this.finalcolor[0], this.finalcolor[1], this.finalcolor[2], alpha);
		this.p5.stroke(255, 200, 255, alpha);
		this.p5.fill(color[0], color[1], color[2], alpha);

		let size = this.age * Math.log(this.age)/ this.lifespan;
		let scale = this.scale;

		//this.p5.ellipse(this.pos[0], this.pos[1], size * scale);

		this.p5.arc(this.pos[0], this.pos[1],  size * scale, size * scale, 0, Math.min((Math.PI * 12) * this.age/this.lifespan, Math.PI * 2), this.p5.CHORD);
	}

	die() {
		this.dead = true;

		this.pos[0] = this.origpos[0];
		this.pos[1] = this.origpos[1];

		this.velocity[0] = this.origvelocity[0];
		this.velocity[1] = this.origvelocity[1];

		this.age = 0;
	}

	emit() {
		this.dead = false;
	}
}