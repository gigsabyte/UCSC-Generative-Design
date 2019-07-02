class Particle {

	constructor(x, y, theta, v, accel, lifetime, p5) {
		this.dead = true;

		this.pos = [x, y];
		this.velocity = [cos(theta) * v, sin(theta) * v];

		this.accel = [cos(accel), sin(accel)];

		this.lifespan = lifetime;

		this.age = 0;

		this.p5 = p5;
	}
}