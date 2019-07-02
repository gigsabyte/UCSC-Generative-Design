class ParticleSystem {
	
	constructor(count, circles, width, height, p5) {

		this.circles = [circles];

		let lifetime = 1;

		let acceleration = 270;

		let velocity = 5;

		let perCircle = Math.floor(count / circles);

		for(let i = 0; i < circles; i++) {
			let x = width/circles * i;
			let y = Math.random() * height;

			this.circles[i] = [];

			for(let j = 0; j < perCircle; j++) {

				let theta = j/perCircle * 360;

				let p = new Particle(x, y, theta, 5, acceleration, lifetime, p5);

				this.circles[i].push(p);
			}
		}

	}

	run() {
		for(let i = 0; i < this.circles.length; i++) {
			for(let j = 0; j < this.circles[i].length; j++) {
				this.circles[i][j].update();
			}
		}

		for(let i = 0; i < this.circles.length; i++) {
			for(let j = 0; j < this.circles[i].length; j++) {
				this.circles[i][j].draw();
			}
		}
	}
}