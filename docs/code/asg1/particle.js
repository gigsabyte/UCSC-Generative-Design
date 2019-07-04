/*
 * code/asg1/particle.js
 * holds Particle class
 * particle that, when emitted, shoots out from a point at a velocity
 * before fading out and "dying"
 * written by gigsabyte
 */

class Particle {

	// constructor
	constructor(x, y, theta, v, accel, lifetime, p5, color, finalcolor, size) {

		/* intialize variables */

		this.dead = true; // dead on creation :(

		// position and scale
		this.origpos = [x, y];
		this.pos = [x, y];
		this.scale = size;

		// velocity
		this.origvelocity = [Math.cos(theta) * v, Math.sin(theta) * v];
		this.velocity = [Math.cos(theta) * v, Math.sin(theta) * v];

		// acceleration
		this.accel = [Math.cos(accel)/(2.5), Math.sin(accel)/(2.5)];

		// lifespan and age
		this.lifespan = lifetime;
		this.age = 0;				

		// color
		this.color = [3];
		this.finalcolor = [3];
		for(let i = 0; i < color.length; i++) {
			this.color[i] = color[i] * 255;
			this.finalcolor[i] = finalcolor[i] * 255; // color is stored as 0-1, convert it to 0-255
		}

		this.p5 = p5; // save ref to p5 canvas
	}

	// update is called once per frame before draw()
	// if the particle is alive
	update() {

		this.age += 1; // increment age

		if(this.age > this.lifespan) { // if age is at lifespan, die
			this.die();
		} else { // otherwise update velocity and position
			this.velocity[0] += this.accel[0];
			this.velocity[1] += this.accel[1];

			this.pos[0] += this.velocity[0];
			this.pos[1] += this.velocity[1];
		}
	}

	// draw is called once per frame after update()
	// if the particle is alive
	draw() {

		// set alpha and color
		let alpha = 255 - ((this.age/this.lifespan) * 120);

		let color = [3];
		for(let i = 0; i < 3; i++) {
			color[i] = this.p5.lerp(this.color[i], this.finalcolor[i], this.age/this.lifespan);
		}

		// p5 formatting
		this.p5.strokeWeight(this.age/this.lifespan * 10);
		this.p5.stroke(255, 200, 255, alpha);
		this.p5.fill(color[0], color[1], color[2], alpha);

		// adjust size and scale
		let size = this.age * Math.log(this.age)/ (this.lifespan * 2);
		let scale = this.scale;

		// draw arc
		this.p5.arc(this.pos[0], this.pos[1],  size * scale, size * scale, 0,
		 Math.min((Math.PI * 12) * this.age/(this.lifespan * 2), Math.PI * 2), this.p5.CHORD);
	}

	// function that kills a particle and resets position/velocity/acceleration
	die() {
		this.dead = true;

		this.pos[0] = this.origpos[0];
		this.pos[1] = this.origpos[1];

		this.velocity[0] = this.origvelocity[0];
		this.velocity[1] = this.origvelocity[1];

		this.age = 0;
	}

	// function that revives a particle
	emit() {
		this.dead = false;
	}
}