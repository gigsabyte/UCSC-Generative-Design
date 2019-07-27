/*
 * trophycar.js
 * holds the TrophyCar class, which generates a modified Car used for display only
 * written by gigsabyte
 */

class TrophyCar {
    static angAmount = 8;
    static wheAmount = 2;

    static angRange  = [0, 360];
    static magRange  = [0, 100];
    static radRange  = [10, 60];
    static acceler   = 50;

    constructor(x, y, name, carFeats, bcolor, wcolor, camera, p5) {
        this.name = name;
        this.feats = carFeats;

        this.x = x;
        this.y = y;

        this.camera = camera;
        this.p5 = p5;

        this.rot = this.p5.PI * -1/8;
        this.toggle = false;

        // Load angles/magnitues and sort them by angle
        let angles = new Array(Car.angAmount);

        for(let i = 0; i < Car.angAmount * 2; i += 2) {
            angles[p5.int(i/2)] = {"ang": carFeats[i], "mag": carFeats[i+1]};
        }
        angles.sort((a, b) => (a.ang > b.ang) ? 1 : -1);

        // Transform angles/magnitues into vectors
        this.vs = [];
        for(let a of angles) {
            let v = p5.createVector(p5.cos(p5.radians(a.ang)) * a.mag, p5.sin(p5.radians(a.ang)) * a.mag);
            this.vs.push(v);
        }

        // Load wheels
        this.ws = new Array(Car.wheAmount);

        for(let i = Car.angAmount * 2; i < Car.angAmount * 2 + Car.wheAmount * 2; i += 2) {
            this.ws[p5.int(i - (Car.angAmount * 2))/2] = {"v": carFeats[i], "r": carFeats[i+1]};
        }

        // Generate car colors
        this.bodyColor = bcolor;

        this.wheelsColor = wcolor;

        this.timeStopped = 0;
        this.createBody(x, y);
    }

    createBody(x, y) {
        // Define a body
        let bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_staticBody;
        bd.position = scaleToWorld(x, y);

        // Create the body
        this.body = world.CreateBody(bd);

        // Define the body fixture
        let fd = new box2d.b2FixtureDef();
        fd.shape = new box2d.b2PolygonShape();

        let vertices = [];
        for(let v of this.vs) {
            vertices.push(scaleToWorld(v.x, v.y));
        }
        fd.shape.Set(vertices, vertices.length);

        // Movement parameters
        fd.density = 0.2;
        fd.friction = 10.0;
        fd.restitution = 0.2;

        // Define wheel fixtures
        for(let w of this.ws) {
            let cs = new box2d.b2FixtureDef();
            cs.shape = new box2d.b2CircleShape();

            cs.shape.m_radius = scaleToWorld(w.r/2);
            cs.shape.m_p.x = scaleToWorld(this.vs[w.v].x);
            cs.shape.m_p.y = scaleToWorld(this.vs[w.v].y);

            cs.density = 0.2;
            cs.friction = 0.0;
            cs.restitution = 0.2;

        }

    }


    draw(deltaTime) {
        // Get the body's position
        let bodyPos = this.getPosition();

        if(this.toggle) {
            this.rot -= deltaTime/1000;
            if(this.rot < this.p5.PI * -1/8) this.toggle = false;
        } else {
            this.rot += deltaTime/1000;
            if(this.rot > this.p5.PI * 1/8) this.toggle = true;
        }
        
        // Get its angle of rotation
        let a = this.rot;

        this.p5.push();
        this.p5.translate(this.camera.eyeX + this.p5.width/3, this.camera.eyeY - this.p5.height/3);
        this.p5.rotate(a);

        // Draw body
        this.p5.fill(this.bodyColor);
        this.p5.stroke(this.wheelsColor);
        this.p5.strokeWeight(2);

        // beginShape();
        for(let i = 0; i < this.vs.length; i++) {
            // vertex(0, 0);
            // vertex(this.vs[i].x, this.vs[i].y);
            // vertex(this.vs[(i + 1) % this.vs.length].x, this.vs[(i + 1) % this.vs.length].y);
            let ax = this.vs[i].x;
            let ay = this.vs[i].y;

            let bx = this.vs[(i + 1) % this.vs.length].x;
            let by = this.vs[(i + 1) % this.vs.length].y;

            this.p5.triangle(0, 0, ax, ay, bx, by);
        }
        // endShape();

        // Draw wheels
        this.p5.fill(this.wheelsColor);
        this.p5.stroke(this.bodyColor);


        for(let w of this.ws) {
            this.p5.ellipse(this.vs[w.v].x, this.vs[w.v].y, w.r, w.r);
        }

        this.p5.pop();
    }

    getVelocity() {
        return scaleToPixels(this.body.m_linearVelocity);
    }

    getPosition() {
        return scaleToPixels(this.body.GetPosition());
    }
}
