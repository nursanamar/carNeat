class Brain {

    nn;
    score = 0;

    constructor(){
        this.nn = new NeuralNetwork(3,3,1,4);
    }

    setDna(dna){
        this.nn.setWeights(dna);
    }

    getDna(){
        return this.nn.getWeights();
    }

    think(input){
        return this.nn.update(input);
    }
}