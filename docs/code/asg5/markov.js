/*
 * markov.js
 * holds the MarkovChain class for evolving a population between generations
 * as well as the Individual class that makes up the population
 * written by gigsabyte, based on the model provided by lucasnfe:
 * https://github.com/lucasnfe/Generative-Design/blob/master/Examples/L08%20-%20Markov%20Models/sketch.js
 */

class MarkovChain {
    // constructor
    constructor() {
        this.sampleset = null;
        this.pd = null;
    }

    train(sampleset) {
        this.sampleset = sampleset;
        
        let pd = {};

        console.log(pd);

        // load all states
        // go through every sample
        for(let sample of sampleset) {

            sample = "# " + sample + " #"; // add beginning and end markers
            
            let steps = sample.split(" "); // split string into steps

            for(let step of steps) { // add a state for each step
                if(!(step in pd)) pd[step] = {}; 
            }
        }

        console.log(pd);

        // estimate probability distribution
        for(let sample of sampleset) {
            sample = "# " + sample + " #"; // add beginning and end markers
            
            let steps = sample.split(" "); // split string into steps

            for(let i = 0; i < steps.length - 1; i++) {
                let cstate = steps[i];
                if(cstate in pd) {

                    let nstate = steps[i+1];

                    if(!(nstate in pd[cstate])) {
                        pd[cstate][nstate] = Math.floor(1.0);
                    }
                    else pd[cstate][nstate] = pd[cstate][nstate] + 1;
                    //console.log(pd[cstate][nstate]);
                    
                }
            }
        }

        console.log(pd);

        // normalize probability distribution
        for(let cstate in pd) {
            let ctotal = 0;

            for(let nstate in pd[cstate]) {
                ctotal += pd[cstate][nstate];
            }

            for(let nstate in pd[cstate]) {
                pd[cstate][nstate] /= ctotal;
            }
        }

        console.log(pd);

        this.pd = pd;
    }

    generate() {
        let nstate = this.sample("#");

        let mid = "";

        for(;;) {
            mid += nstate;

            nstate = this.sample(nstate);

            if(nstate == "#") break;

            mid += " ";
        }

        return mid;
    }

    sample(istate) {
        let prob = Math.random();

        let tracker = 0;

        for(let nstate in this.pd[istate]) {
            tracker += this.pd[istate][nstate];

            if(prob < tracker) return nstate;
        }
    }

    
}