/*
 * code/asg1/particle-system.js
 * holds ParticleSystem class
 * a particle system that holds "circles" of particles and emits them in bursts
 * to create a fireworks effect
 * written by gigsabyte
 */

class ParticleSystem {
	
	// constructor
	constructor(count, circles, width, height, p5) {

		this.circles = [circles]; // circle array
		let perCircle = Math.floor(count / circles); // number of particles per circle

		// particle variables
		let lifetime = 100;
		let scale = 50;

		let acceleration = 90 * Math.PI/180; // acceleration given in radians
		let velocity = 2;

		// initialize each circle
		for(let i = 0; i < circles; i++) {

			// initialize array of particles in the circle
			this.circles[i] = [];

			// initial position of particles in the circle
			let x = width/circles * i + (width/(4 * circles));
			let y = Math.random() * height * 1/2;

			// intial scale, velocity and acceleration of particles in the circle
			scale = 10 + Math.random() * 40;
			velocity = scale/5;
			acceleration = (90 + ((Math.random() * 2 - 1) * 1)) * Math.PI/180;

			// start and end colors of particles in the circle
			let color = [Math.random()/2 + 0.5, Math.random()/2 + 0.5, Math.random()/2 + 0.5];
			let finalcolor = [Math.random()/2 + 0.5, Math.random()/2 + 0.5, Math.random()/2 + 0.5];


			// initialize each particle in the circle
			for(let j = 0; j < perCircle; j++) {

				// set the angle around the circle for each particle
				let theta = (j/perCircle * 360) * Math.PI/180;

				// create particle
				let p = new Particle(x, y, theta, velocity, acceleration, lifetime, p5, color, finalcolor, scale);

				this.circles[i].push(p); // add particle to circle
			}
		}

		// shuffle circles in the array
		this.circles.sort(function(a, b){return(Math.random() * 2 - 1)});

	}

	// method that calls the update() and draw() functions of
	// all alive particles
	run() {

		// loop through all particles in all circles and update them if they are alive
		for(let i = 0; i < this.circles.length; i++) {
			if(!this.circles[i][0].dead) {
				for(let j = 0; j < this.circles[i].length; j++) {
					this.circles[i][j].update();
				}
			}
		}

		// loop through all particles in all circles and draw them if they are alive
		for(let i = 0; i < this.circles.length; i++) {
			if(!this.circles[i][0].dead) {
				for(let j = 0; j < this.circles[i].length; j++) {
					this.circles[i][j].draw();
				}
			}
		}
	}

	// method that emits a burst of particles
	// by searching for a circle that is "dead" and reviving its particles
	emit() {
		for(let i = 0; i < this.circles.length; i++) {
			if(this.circles[i][0].dead) {
				for(let j = 0; j < this.circles[i].length; j++) {
					this.circles[i][j].emit();
				}
				break;
			}
			
		}
	}
}