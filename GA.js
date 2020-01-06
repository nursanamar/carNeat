class GA {

    population = [];
    highScore = 0;
    bestSpices;
    generation = 1;

    constructor(populationNumber,mutationRate,species){
        this.mutationRate = mutationRate;
        this.populationNumber = populationNumber;
        this.species = species;
        this.originalMutationRate = mutationRate;

        for (let index = 0; index < populationNumber; index++) {
           this.population.push(new species);
        }
    }

    newGeneration(){
        let pools = [];

        let scores = [];

        let addedRate = 0.1;

        this.population.forEach(species => {
            scores.push(species.score);
            
            if (species.score > this.highScore) {
                this.highScore = species.score
                this.bestSpices = species;
                addedRate = 0;
                this.mutationRate = this.originalMutationRate;
            }
        })

        // this.mutationRate += addedRate;

        let maxScores = max(scores);
        
        this.population.forEach(spices => {
            let fitnes = (spices.score) / maxScores * 10;
            
            for (let i = 0; i < Math.round(fitnes); i++) {
                pools.push(spices);
            }
        });

        for (let j = 0; j < 10; j++) {
            pools.push(this.bestSpices);
        }
        

        this.population = [];

        for (let i = 0; i < this.populationNumber; i++) {
            let child = this.crossover(random(pools),random(pools));
            this.population.push(child);
        }

        this.generation += 1;
        pools = [];
    }

    crossover(parent1,parent2){
        
        let child = new this.species;
        let dna1;
        let dna2;
        try {
             dna1 = parent1.getDna();
             dna2 = parent2.getDna();
        } catch (error) {
            return child;
        }

        let newDna = [];

        let midle = Math.round(random(0, dna1.length));

        for (let l = 0; l < dna1.length; l++) {
            let gnome = 0;

            if (l < midle) {
                gnome = dna1[l];
            }else{
                gnome = dna2[l];
            }

            if (random(0,1) <= this.mutationRate) {
                gnome = random(-1,1);
            }

            newDna.push(gnome);
        }

        child.setDna(newDna);

        return child;
    }

}