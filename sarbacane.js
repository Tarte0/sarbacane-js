/**
 * Created by Steve Ciminera on 12/05/2018.
 */

export class PetriDish {

    population = [];
    generationNb = 0;
    genomeSize = 0;
    weakPercentage = 0;
    mutationRate = 0;
    startingPopulationSize = 0;
    elitism = 0;

    setStartingPopulationSize(startingPopulationSize) {
        this.startingPopulationSize = startingPopulationSize;
    }

    setPopulation(population) {
        this.population = population;
    }

    setGenomeSize(genomeSize) {
        this.genomeSize = genomeSize;
    }

    setWeakPercentage(weakPercentage) {
        this.weakPercentage = weakPercentage;
    }

    setMutationRate(mutationRate) {
        this.mutationRate = mutationRate;
    }

    setElitism(elitism){
        this.elitism = elitism;
    }

    setInitPopulationAdapter(fn) {
        this.setInitPopulationAdapter = fn;
    }

    setFitnessAdapter(fn) {
        this.getFitness = fn;
    }

    setNewGenesAdapter(fn) {
        this.getNewGenes = fn;
    }

    setRandomGeneAdapter(fn) {
        this.getRandomGene = fn;
    }

    setCreateIndividualAdapter(fn) {
        this.createIndividual = fn;
    }

    setNextGenerationAdapter(fn) {
        this.nextGeneration = fn;
    }

    setCrossoverAdapter(fn) {
        this.crossover = fn;
    }

    setMutateAdapter(fn) {
        this.mutate = fn;
    }

    setChooseParentAdapter(fn) {
        this.chooseParent = fn;
    }

    setPrintIndividualAdapter(fn){
        this.printIndividual = fn;
    }

    constructor(opt) {
        //const val ={...this,...opt};
        this.setStartingPopulationSize(opt.startingPopulationSize || this.startingPopulationSize);
        this.setPopulation(opt.population || this.population);
        this.setGenomeSize(opt.genomeSize || this.genomeSize);
        this.setWeakPercentage(opt.weakPercentage || this.weakPercentage);
        this.setMutationRate(opt.mutationRate || this.mutationRate);
        this.setElitism(opt.elitism || this.elitism);
        this.setFitnessAdapter(opt.getFitness || this.getFitness);
        this.setNewGenesAdapter(opt.getNewGenes || this.getNewGenes);
        this.setRandomGeneAdapter(opt.getRandomGene || this.getRandomGene);
        this.setCreateIndividualAdapter(opt.createIndividual || this.createIndividual);
        this.setNextGenerationAdapter(opt.nextGeneration || this.nextGeneration);
        this.setCrossoverAdapter(opt.crossover || this.crossover);
        this.setMutateAdapter(opt.mutate || this.mutate);
        this.setChooseParentAdapter(opt.chooseParent || this.chooseParent);
        this.setInitPopulationAdapter(opt.initPopulation || this.initPopulation);
        this.setPrintIndividualAdapter(opt.printIndividual || this.printIndividual);

        return this;
    }

    createIndividual = (initGenes = true, addToPopulation = true) => {
        let genes = [];
        if (initGenes) {
            genes = this.getNewGenes(this.genomeSize, this.getRandomGene());
        }
        let individual = new Individual({genes});
        if(addToPopulation){
            this.population.push(individual);
        }
        return individual;
    };

    initPopulation = () => {
        this.setPopulation([]);
        for (let i = 0; i < this.startingPopulationSize; i++) {
            this.createIndividual();
        }
    };

    getFitness = (individual) => {
        let fitnessSum = 0;
        for (let i = 0; i < individual.getGenomeSize(); i++) {
            fitnessSum += individual.genes[i];
        }
        return individual.getGenomeSize() > 0 ? fitnessSum / individual.getGenomeSize() : 0;
    };

    getNewGenes = () => {
        const genes = [];
        for (let i = 0; i < this.genomeSize; i++) {
            genes.push(this.getRandomGene())
        }
        return genes;
    };

    crossover = (parent1, parent2, probabilityP1 = 0.5) => {
        let child = this.createIndividual(false);
        let newGenes = child.genes;

        for (let i = 0; i < this.genomeSize; i++) {
            //coin toss for each gene
            newGenes[i] = Math.random() <= probabilityP1 ? parent1.genes[i] : parent2.genes[i];
        }

        child.setGenes(newGenes);
        return child;
    };

    getRandomGene = () => {
        return Math.random() < 0.5 ? 0 : 1;
    };

    mutate = (individual, mutationRate = this.mutationRate) => {
        for (let i = 0; i < this.genomeSize; i++) {
            if (Math.random() < mutationRate) {
                individual.genes[i] = this.getRandomGene();
            }
        }
        return individual;
    };

    chooseParent = () => {
        const parentIndex = Math.floor(Math.random() * (this.population.length - this.getWeakCount()));
        return this.population[parentIndex];
    };

    nextGeneration = () => {
        if(this.generationNb <= 0){
            this.initPopulation();
        }else{
            let newPopulation = [];
            this.population.forEach((individual, index) => {
                if(index < this.elitism && this.getPopulationSize()){
                    newPopulation.push(individual);
                }else if (index < this.getPopulationSize()){
                    let parent1 = this.chooseParent();
                    let parent2;
                    do{
                        parent2 = this.chooseParent();
                    }while(parent1 == parent2);

                    let child = this.crossover(parent1, parent2);
                    this.mutate(child);
                    newPopulation.push(child);
                }else{
                    newPopulation.push(this.createIndividual(true, false));
                }
            });
            this.setPopulation(newPopulation);
        }
        this.population.sort(this.compareFitness);
        this.generationNb++;

    };

    getWeakCount = () => {
        return Math.floor(this.population.length * this.weakPercentage);
    };

    getPopulationSize = () =>{
        return this.population.length;
    };

    getFitest=() => {
        this.population.sort(this.compareFitness);
        return this.population[0];
    };

    totalPopulationFitness = () => {
        let res = 0;
        this.population.forEach((individual) => {
            res += this.getFitness(individual);
        });
        return res;
    };

    averagePopulationFitness = () => {
        return this.totalPopulationFitness() / this.population.length;
    };

    compareFitness = (a,b) => {
        if(this.getFitness(a) > this.getFitness(b)){
            return -1;
        }
        if(this.getFitness(a) < this.getFitness(b)){
            return 1;
        }
        return 0;
    };

    printIndividual = (individual) => {
        let i = "[";
        individual.genes.forEach((g) => {
            i += g+',';

        });
        return i + "]";
    };
};


export class Individual {
    genes = [];

    constructor({genes}) {
        if(Array.isArray(genes)){
            this.setGenes(genes);
        }
    }

    setGenes(genes) {
        this.genes = genes;
    }

    getGenomeSize() {
        return this.genes.length;
    }
};