import {PetriDish} from './sarbacane'

let petriD = new PetriDish( {
    startingPopulationSize : 50,
    genomeSize : 50,
    weakPercentage : 0.1,
    mutationRate : 0.01,
    elitism : 5,
    getRandomGene : () => {
        return Math.random() * 10;
    },
    getFitness: (individual) => {
        let fitnessSum = 0;
        for (let i = 0; i < individual.getGenomeSize(); i++) {
            fitnessSum += individual.genes[i];
        }
        return individual.getGenomeSize() > 0 ? fitnessSum / (individual.getGenomeSize()*10) : 0;
    }
});

const nextgen = () => {
    petriD.nextGeneration();
    document.getElementById("nb").innerHTML = `"generation n° ${petriD.generationNb}`;
    document.getElementById("total").innerHTML = `"Total fitness : ${petriD.totalPopulationFitness()}`;
    document.getElementById("avg").innerHTML = `"Average fitness : ${petriD.averagePopulationFitness()}`;
    document.getElementById("fis").innerHTML = `"Fittest individual score : ${petriD.getFitness(petriD.getFitest())}`;
    console.log(petriD.getFitest());
};


document.getElementById("next").onclick = nextgen;

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        nextgen();
    }
});