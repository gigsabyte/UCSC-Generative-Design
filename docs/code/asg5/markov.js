/*
 * markov.js
 * holds the MarkovChain class, which can be trained based on a sample set of strings in order to
 * generate a string in line with the sample set
 * written by gigsabyte, based on the model provided by lucasnfe:
 * https://github.com/lucasnfe/Generative-Design/blob/master/Examples/L08%20-%20Markov%20Models/sketch.js
 */

class MarkovChain {
    // constructor
    constructor() {
        this.sampleset = null;
        this.pd = null;
    }

    // train the chain based on a sample set
    train(sampleset) {
        this.sampleset = sampleset;

        let pd = {};

        // load all states
        // by going through every sample
        for(let sample of sampleset) {

            sample = "# " + sample + " #"; // add beginning and end markers
            
            let steps = sample.split(" "); // split string into steps

            for(let step of steps) { // add a state for each step
                if(!(step in pd)) pd[step] = {}; 
            }
        }

        // estimate probability distribution
        for(let sample of sampleset) {
            sample = "# " + sample + " #"; // add beginning and end markers
            
            let steps = sample.split(" "); // split string into steps

            // log frequency of every state's next state
            for(let i = 0; i < steps.length - 1; i++) {
                let cstate = steps[i];
                if(cstate in pd) {

                    let nstate = steps[i+1];

                    if(!(nstate in pd[cstate])) {
                        pd[cstate][nstate] = Math.floor(1.0);
                    }
                    else pd[cstate][nstate] = pd[cstate][nstate] + 1;                    
                }
            }
        }


        // normalize probability distribution
        for(let cstate in pd) {
            let ctotal = 0;

            // find total probability
            for(let nstate in pd[cstate]) {
                ctotal += pd[cstate][nstate];
            }

            // normalize each probability based on total
            for(let nstate in pd[cstate]) {
                pd[cstate][nstate] /= ctotal;
            }
        }

        // set probability distribution
        this.pd = pd;
    }

    // generate string based on probability distribution
    // pre-req: train() called first with a sample set
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

    // grab a random sample state based on a previous state
    sample(istate) {
        let prob = Math.random();

        let tracker = 0;

        for(let nstate in this.pd[istate]) {
            tracker += this.pd[istate][nstate];

            if(prob < tracker) return nstate;
        }
    }

    
}