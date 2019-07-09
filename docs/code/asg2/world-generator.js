/*
 * code/asg2/world-generator.js
 * holds WorldGenerator class
 *
 * written by gigsabyte
 */

class WorldGenerator {

	// constructor
	constructor(w, h, d, seed, p5) {
		this.p5 = p5;

		this.p5.noiseSeed(seed);

		this.textures = [];

		this.voxelGrid = [w];
		this.textureGrid = [w];

		for(let i = 0; i < w; i++) {
			this.voxelGrid[i] = [];
			this.textureGrid[i] = [];
			for(let j = 0; j < h; j++) {
				let n = this.p5.noise(i, j);
				this.voxelGrid[i][j] = Math.floor(n * d);
				//this.textureGrid[i][j] = Math.floor(n * this.texCount);
			}
		}

		this.w = w;
		this.h = h;
		this.d = d;

	}

	draw() {
		for(let i = 0; i < this.w; i++) {
			for(let j = 0; j < this.h; j++) {
				this.p5.push();
				this.p5.translate(i, j, this.voxelGrid[i][j]);
				this.p5.stroke(0);
				this.p5.strokeWeight(2);
				//this.p5.noFill();
				this.p5.box(1);
				this.p5.pop();
			}
		}
	}
}