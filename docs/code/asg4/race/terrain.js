/*
 * terrain.js
 * holds the Terrain class, which generates a random terrain based on noise
 * written by lucasnfe, modified by gigsabyte to have modular color
 */

class Terrain {
    constructor(initX, initY, length, step, amplitute, p5) {
        this.points = [];
        this.angles = [];
        this.step   = step;
        this.length = length;
        this.thickness = 10;

        this.x = initX;
        this.y = initY;

        this.color = p5.color(81);
        this.stroke = p5.color(0);

        this.p5 = p5;

        for(let i = 0; i <= length; i++) {
            let x = initX + i * step;
            let y = initY + this.p5.noise(x) * amplitute;

            if(i % 10 == 0 & amplitute < 100) {
                amplitute *= 4;
            }

            this.points.push(this.p5.createVector(x, y));
        }

        for(let i = 0; i < length; i++) {
            let angle = this.angleBetweenPlatforms(this.points[i], this.points[i+1]);
            this.angles.push(angle);
        }

        this.createBody(step, this.thickness);
    }

    angleBetweenPlatforms(p1, p2) {
        let v1 = this.p5.createVector(p2.x - p1.x, p2.y - p1.y);
        return this.p5.atan2(v1.y, v1.x);
    }

    createBody(w, h) {
        let x = this.x;
        let y = this.y;

        for(let i = 0; i < this.angles.length; i++) {
            // Define a body
            let bd = new box2d.b2BodyDef();
            bd.type = box2d.b2BodyType.b2_staticBody;
            bd.position = scaleToWorld(x, y);
            bd.angle = this.angles[i];

            let fd = new box2d.b2FixtureDef();
            fd.shape = new box2d.b2PolygonShape();
            fd.shape.SetAsBox(scaleToWorld(w/2), scaleToWorld(h/2));

            // Create the body
            let body = world.CreateBody(bd);

            // Attach the fixture
            let fix = body.CreateFixture(fd);
            fix.m_filter.categoryBits = CATEGORY_TERRAIN;

            x += this.p5.cos(this.angles[i]) * this.step/2;
            x += this.p5.cos(this.angles[i+1]) * this.step/2;

            y += this.p5.sin(this.angles[i]) * this.step/2;
            y += this.p5.sin(this.angles[i+1]) * this.step/2;
        }
    }

    draw() {

        this.p5.fill(this.color);
        this.p5.stroke(this.stroke);
        this.p5.strokeWeight(2);
        let x = this.x;
        let y = this.y;

        for(let i = 0; i < this.angles.length; i++) {
            this.p5.push();

            this.p5.translate(x, y);
            this.p5.rotate(this.angles[i]);
            this.p5.translate(-x, -y);

            this.p5.rectMode(this.p5.CENTER);
            this.p5.rect(x, y, this.step, this.thickness);

            this.p5.pop();

            x += this.p5.cos(this.angles[i]) * this.step/2;
            x += this.p5.cos(this.angles[i+1]) * this.step/2;

            y += this.p5.sin(this.angles[i]) * this.step/2;
            y += this.p5.sin(this.angles[i+1]) * this.step/2;
        }
    }
}
