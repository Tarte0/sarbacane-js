import {PetriDish} from './sarbacane'

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?,.;/:!*";
const word = "Stev mange 6 choux par seconde";
let petriD = new PetriDish({
    startingPopulationSize: 500,
    genomeSize: word.length,
    weakPercentage: 0.25,
    mutationRate: 0.01,
    elitism: 5,
    getRandomGene: () => {
        return letters.charAt(Math.floor(Math.random() * letters.length));
    },
    getFitness: (individual) => {
        let fitnessSum = 0;
        for (let i = 0; i < individual.getGenomeSize(); i++) {
            fitnessSum += individual.genes[i] === word.charAt(i) ? 1 : 0;
        }
        return individual.getGenomeSize() > 0 ? fitnessSum / individual.getGenomeSize() : 0;
    },
    printIndividual: (individual) => {
        let i = "";
        individual.genes.forEach((g) => {
            i += g;
        });
        return i;
    },
});

const nextgen = () => {
    petriD.nextGeneration();
    document.getElementById("nb").innerHTML = `"generation n° ${petriD.generationNb}`;
    document.getElementById("total").innerHTML = `"Total fitness : ${petriD.totalPopulationFitness()}`;
    document.getElementById("avg").innerHTML = `"Average fitness : ${petriD.averagePopulationFitness()}`;
    document.getElementById("fis").innerHTML = `"Fittest individual score : ${petriD.getFitness(petriD.getFitest())}`;
    document.getElementById("ind").innerHTML = `"Fittest individual : ${petriD.printIndividual(petriD.getFitest())}`;

    console.log(petriD.getFitest());
};


document.getElementById("next").onclick = nextgen;

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey) {
        nextgen();
    }
});