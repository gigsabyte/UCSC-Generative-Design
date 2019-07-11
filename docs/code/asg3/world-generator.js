/*
 * code/asg2/world-generator.js
 * holds WorldGenerator class, which generates a voxel terrain of
 * any given width, height and depth using seeded 2D perlin noise
 * written by gigsabyte
 */

class WorldGenerator {

	// constructor
	constructor(w, h, d, seed, textures, p5) {

		/* variables */

		// reference to p5 sketch
		this.p5 = p5;

		// width, height and depth
		this.w = w;
		this.h = h;
		this.d = d;

		// texture array
		this.textures = textures;

		// grids
		this.voxelGrid = [w]; // stores depth at a given [x][y] coordinate
		this.textureGrid = [w]; // stores texture at a given [x][y] coordinate
		this.drawGrid = [w]; // stores whether or not a voxel at [x][y][z] should be drawn


		// seed the noise function and set detail
		this.p5.noiseSeed(seed);
		this.p5.noiseDetail(2, 0.8);

		// set up grids
		for(let i = 0; i < w; i++) {

			// make grids 2d
			this.voxelGrid[i] = [];
			this.textureGrid[i] = [];
			this.drawGrid[i] = [h];


			for(let j = 0; j < h; j++) {

				let n = this.p5.noise(i/10, j/10);
				this.voxelGrid[i][j] = Math.round(n * d); // integer depth at [i][j]

				this.textureGrid[i][j] = Math.floor(n * this.textures.length); // appropriate texture at [i][j]

				// if [x][y] is water, bring it up to sea level
				if(this.textureGrid[i][j] == 0) this.textureGrid[i][j] = 1;
				if(this.textureGrid[i][j] == 1) this.voxelGrid[i][j] = Math.floor(2/this.textures.length * d)-2;

				// make sure texture is within bounds of array
				if(this.textureGrid[i][j] == this.textures.length) --this.textureGrid[i][j];

				// make draw grid ~3d~
				this.drawGrid[i][j] = [this.voxelGrid[i][j]];
			}
		}

		// set up drawGrid
		this.determineDrawGrid();
	}

	// draw terrain
	draw() {
		let count = 0;
		for(let i = 0; i < this.w; i++) { // x
			for(let j = 0; j < this.h; j++) { // z
				for(let k = 0; k < this.voxelGrid[i][j]; k++) { // y
					if(this.drawGrid[i][j][k]) { // if we need to draw this voxel

						this.p5.push();

						// style cube
						this.p5.noStroke();
						this.p5.texture(this.textures[Math.round(k/this.d * this.textures.length)]);

						// move cube
						this.p5.translate(i*2, k*-2, j*2);

						// make cube
						this.p5.box(2, 2, 2);

						this.p5.pop();
						count++;
					}

				}
				
			}
		}
		console.log(count); // log the number of voxels drawn
	}

	// determine if each voxel in the terrain should be drawn
	// helps fps
	determineDrawGrid() {

		for(let i = 0; i < this.w; i++) { // x
			let horizontal = false;
			if(i == 0 || i == (this.w - 1)) horizontal = true; // determine if voxel is on the left or right edge of the terrain
			for(let j = 0; j < this.h; j++) {
				let vertical = false;
				if(j == 0 || j == (this.h - 1)) vertical = true; // determine if voxel is on the upper or lower edge of the terrain
				for(let k = 0; k < this.voxelGrid[i][j]; k++) {
					if(horizontal || vertical) { // if voxel is on an edge
						this.drawGrid[i][j][k] = true; // draw it
						continue;
					}

					// if voxel is not on an edge, check if the surrounding voxel stacks are taller
					// if yes, then don't draw it (because it's not visible anyway)
					if((this.voxelGrid[i-1][j] > k) &&
					   (this.voxelGrid[i+1][j] > k) &&
					   (this.voxelGrid[i][j-1] > k) &&
					   (this.voxelGrid[i][j+1] > k)) {
						this.drawGrid[i][j][k] = false;
					} else this.drawGrid[i][j][k] = true;
				}

				// always draw the top voxel of a stack
				this.drawGrid[i][j][this.voxelGrid[i][j] - 1] = true;
			}
		}
	}
}