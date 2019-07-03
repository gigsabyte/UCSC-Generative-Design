class ParticleSystem {
	
	constructor(count, circles, width, height, p5) {

		this.circles = [circles];

		let lifetime = 200;

		let acceleration = 90 * Math.PI/180;

		let velocity = 2;

		let perCircle = Math.floor(count / circles);

		let scale = 50;

		for(let i = 0; i < circles; i++) {
			let x = width/circles * i + (width/(4 * circles));
			let y = Math.random() * height * 1/2;

			this.circles[i] = [];

			let color = [Math.random()/2 + 0.5, Math.random()/2 + 0.5, Math.random()/2 + 0.5];
			let finalcolor = [Math.random()/2 + 0.5, Math.random()/2 + 0.5, Math.random()/2 + 0.5];

			acceleration = (90 + ((Math.random() * 2 - 1) * 1)) * Math.PI/180;
			

			scale = 10 + Math.random() * 40;

			velocity = scale/5;

			for(let j = 0; j < perCircle; j++) {

				let theta = (j/perCircle * 360) * Math.PI/180;

				let p = new Particle(x, y, theta, velocity, acceleration, lifetime, p5, color, finalcolor, scale);

				this.circles[i].push(p);
			}
		}

		this.circles.sort(function(a, b){return(Math.random() * 2 - 1)});

		console.log(this.circles);

	}

	run() {
		for(let i = 0; i < this.circles.length; i++) {
			for(let j = 0; j < this.circles[i].length; j++) {
				if(!this.circles[i][j].dead) this.circles[i][j].update();
			}
		}

		for(let i = 0; i < this.circles.length; i++) {
			for(let j = 0; j < this.circles[i].length; j++) {
				if(!this.circles[i][j].dead) this.circles[i][j].draw();
			}
		}
	}

	emit() {
		for(let i = 0; i < this.circles.length; i++) {
			console.log(this.circles[i][0]);
			if(this.circles[i][0].dead) {
				for(let j = 0; j < this.circles[i].length; j++) {
					this.circles[i][j].emit();
				}
				break;
			}
			
		}
	}
}