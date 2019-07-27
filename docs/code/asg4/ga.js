/*
 * ga.js
 * holds the GeneticAlgorithm class for evolving a population between generations
 * as well as the Individual class that makes up the population
 * written by lucasnfe, modified by gigsabyte
 */

class Individual {
    // constructor
    constructor(indSize) {
        this.indSize = indSize; // size of an individual's chromosome array
        this.gens = new Array(indSize);
        this.fitness = 0; // proportional fitness (entire population adds up to 1)

        this.car; // reference to car
    }

    // initializer
    init(index, p5, initgens) {
        if(initgens) this.gens = Car.randomFeatures(); // if genes haven't been initialized, make them random
        let pos = p5.createVector(0, -100); // dummy position
        let car = new Car(pos.x, pos.y, "car" + index, this.gens, p5); // make new car
        this.car = car; // store reference to car
    }
}


class GeneticAlgorithm {
    // constructor
    constructor(popSize, mutationRate, p5) {
        this.indSize = (Car.angAmount * 2) + (Car.wheAmount * 2); // set chromosome size to number of genes in a car
        this.popSize = popSize;
        this.mutationRate = mutationRate;

        // array of references to cars
        this.cars;

        // reference to p5 canvas
        this.p5 = p5;

        // initialize
        this.init(p5);
    }

    // initialize population
    init(p5) {
        this.population = new Array(this.popSize);
        this.cars = new Array(this.popSize);
        for(let i = 0; i < this.popSize; i++) {
            // Initialize individual i randomly
            this.population[i] = new Individual(this.indSize);
            this.population[i].init(i, p5, true);
            this.cars[i] = this.population[i].car;
        }

    }

    // evolve to next generation
    evolve(leaderboard) {

        // evaluate fitness of the current generation
        this.evaluate(leaderboard);

        // get reference car with best fitness
        let best = this.best();

        // create mating pool based on roulette selection
        let matingPool = this.select();

        // reproduce to make new generation
        let newPopulation = this.reproduce(matingPool);

        // mutate new generation
        this.mutate(newPopulation);

        // set population to new generation
        this.population = newPopulation;

        // update car array
        this.setCars();

        return best;
    }

    // evaluate population's fitness based on leaderboard position
    evaluate(leaderboard) {
        let totalprog = 0;
        let fitness = [this.population.length];

        // get total progress
        for(let i = 0; i < this.population.length; i++) {
            let name = leaderboard[i].car.name;
            let progress = leaderboard[i].progress;
            
            fitness[name] = progress;
            totalprog += progress;
        }

        // find each member's progress proportional to the total
        for(let member of this.population) {
            fitness[member.car.name] = fitness[member.car.name] / totalprog;

            member.fitness = fitness[member.car.name];
        }

    }

    // select mating pool of the current generation
    select() {
        let matingPool = new Array();

        // Select this.popSize Individual to be the parents
        for(let i = 0; i < this.popSize; i++) {
            let survivor = this.rouletteWheel();
            matingPool.push(survivor);
        }

        return matingPool;
    }

    // roulette wheel selection
    rouletteWheel() {

        let spin = Math.random();

        let tracker = 0;

        for(let i = 0; i < this.popSize; i++) {
            tracker += this.population[i].fitness;
            if(spin <= tracker) return this.population[i];
        }

        return this.population[this.popSize-1];


    }

    // reproduce with mating pool
    reproduce(matingPool) {
        let newPopulation = new Array(this.popSize);

        for(let i = 0; i < this.popSize; i++) {
            let a = this.p5.int(this.p5.random(this.popSize));
            let b = this.p5.int(this.p5.random(this.popSize));

            newPopulation[i] = this.crossover(matingPool[a], matingPool[b], i);
        }

        return newPopulation;
    }

    // 2-point crossover reproduction
    crossover(parentA, parentB, index) {

        // make child
        let child = new Individual(parentA.indSize);

        // choose crossover points
        let p1 = Math.floor(Math.random() * parentA.gens.length);
        let p2 = Math.floor(Math.random() * (parentA.gens.length - p1) + p1);

        // randomize parents
        let parent1 = parentA;
        let parent2 = parentB;
        if(Math.random() > 0.5) {
            parent1 = parentB;
            parent2 = parentA;
        }

        // cross genes

        let i;
        
        for(i = 0; i < p1; i++) {
            child.gens[i] = parent1.gens[i];
        }
        for(i = p1; i < p2; i++) {
            child.gens[i] = parent2.gens[i];
        }
        for(i = p2; i < parentA.indSize; i++) {
            child.gens[i] = parent1.gens[i];
        }

        // initialize child with inherited genes
        child.init(index, parentA.car.p5, false);

        // set child's colors to lerp between parents
        child.car.bodyColor = parent1.car.p5.lerpColor(parent1.car.bodyColor, parent2.car.bodyColor, p1/p2);
        child.car.wheelsColor = parent1.car.p5.lerpColor(parent1.car.wheelsColor, parent2.car.wheelsColor, p1/p2);

        return child;

    }

    // mutate new population
    mutate(newPopulation) {

        for(let member of newPopulation) {
            let i;
            // mutate body
            for(i = 0; i < Car.angAmount * 2; i++) {
                if(Math.random() <= this.mutationRate) {
                    if(i % 2) { // if magnitude changes, change body's red value
                       member.car.feats[i] = Car.randomMagnitude();
                       member.car.bodyColor.setRed(Math.random() * 255);
                    }
                    else { // if angle changes, change body's blue value
                        member.car.feats[i] = Car.randomAngle();
                        member.car.bodyColor.setBlue(Math.random() * 255);
                    }
                }
            }

            // mutate wheels
            for(i = Car.angAmount * 2; i < (Car.angAmount * 2) + (Car.wheAmount * 2); i++) {
                if(Math.random() <= this.mutationRate) {
                    if(i % 2) { // if wheel size changes, change wheels' blue value
                       member.car.feats[i] = Car.randomRadius();
                       member.car.wheelsColor.setBlue(Math.random() * 255);
                    }
                    else { // if wheel position changes, change wheels' green value
                        member.car.feats[i] = Car.randomVertex();
                        member.car.wheelsColor.setGreen(Math.random() * 255);

                    }
                }
            }
        }
    }

    // reassign car array
    setCars() {
        this.cars = new Array(this.popSize);
        for(let i = 0; i < this.popSize; i++) {
            this.cars[i] = this.population[i].car;
        }
    }

    // select member of population with highest fitness
    best() {
        let best;
        let fit = 0;
        for(let member of this.population) {
            if(member.fitness > fit) {
                best = member;
                fit = member.fitness;
            }
        }
        return best;

    }
}
