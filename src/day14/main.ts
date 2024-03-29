import { readInputFile } from '../utils/file';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

interface Reagent {
    quantity: number;
    name: string;
}

interface Reaction {
    output: Reagent;
    inputs: Reagent[];
}

const parseReagent = (s: string): Reagent => {
    const [s1, s2] = s.split(' ').map(s => s.trim());
    return { quantity: Number(s1), name: s2 };
};

const parseReaction = (s : string): Reaction => {
    const [inputStr, outputStr] = s.split('=>').map(segment => segment.trim());
    return {
        inputs: inputStr.split(', ').map(parseReagent),
        output: parseReagent(outputStr),
    };
};

const reactions = inputText.trim().split('\n').map(parseReaction);
// console.log(reactions);

const recipes = new Map<string, Reaction>(reactions.map(reaction => [reaction.output.name, reaction]));

const oreForFuel = (fuel: number) => {
    const requirements = new Map<string, number>([['FUEL', fuel]]);
    let oreNeeded = 0;
    const surplus = new Map<string, number>();
    
    const ORE = 'ORE';
    
    const withdrawSurplus = (chemical: string, amount: number) => {
        if (chemical === ORE) {
            return 0;
        }
        const amountFromSurplus = surplus.get(chemical);
        if (!amountFromSurplus) {
            return 0;
        }
    
        if (amountFromSurplus > amount) {
            surplus.set(chemical, amountFromSurplus - amount);
            return amount;
        } else {
            surplus.delete(chemical);
            return amountFromSurplus;
        }
    };
    
    const addSurplus = (chemical: string, amount: number) => {
        if (amount > 0) {
            surplus.set(chemical, amount + (surplus.get(chemical) || 0));
        }
    };
    
    const addRequirements = (chemical: string, amount: number) => {
        if (chemical === ORE) {
            oreNeeded += amount;
        } else {
            // TODO: are surplus and requirements the same Map, just with negative values allowed?
            requirements.set(chemical, amount + (requirements.get(chemical) || 0));
        }
    };
    
    do {
        // console.log('ore', oreNeeded);
        // console.log('requirements', requirements);
        // console.log('surplus', surplus);
    
        const chemical = requirements.keys().next().value;
        const amountNeeded = requirements.get(chemical)!;
        // console.log('Making', amountNeeded, 'of', chemical);
        requirements.delete(chemical);
    
        const amountFromSurplus = withdrawSurplus(chemical, amountNeeded);
        const amountToSynthesize = amountNeeded - amountFromSurplus;
    
        if (amountToSynthesize <= 0) {
            continue;
        }
    
        const ingredients = recipes.get(chemical);
        if (!ingredients) {
            throw new Error('No formula to make ' + chemical);
        }
    
        const recipeTimes = Math.ceil(amountToSynthesize / ingredients.output.quantity);
    
        // Any extra that we made gets stored in surplus
        addSurplus(chemical, recipeTimes * ingredients.output.quantity - amountToSynthesize);
        ingredients.inputs.forEach(input => {
            const inputAmountNeeded = input.quantity * recipeTimes;
            const inputFromSurplus = withdrawSurplus(input.name, inputAmountNeeded);
            addRequirements(input.name, inputAmountNeeded - inputFromSurplus);
        });
    
    } while (requirements.size > 0);
    
    return oreNeeded;
}

// Find the highest fuel amount that can be made with <= 1T ore

const oreForOneFuel = oreForFuel(1);
const ORE_MAX = 1_000_000_000_000;

let lowerBound = Math.floor(ORE_MAX / oreForOneFuel); // I know I can make this much fuel
let upperBound: number|undefined = undefined; // I know I can't make this much fuel

do {
    const valueToTest: number = upperBound === undefined
      ? (lowerBound * 2)
      : Math.floor((upperBound + lowerBound) / 2);
    // console.log('between', lowerBound, 'and', upperBound);
    // console.log('can I make', valueToTest, 'fuel?');
    const oreForTest = oreForFuel(valueToTest);
    if (oreForTest > ORE_MAX) {
        upperBound = valueToTest;
    } else {
        lowerBound = valueToTest;
    }
} while (upperBound === undefined || upperBound - lowerBound > 1);

console.log('most fuel I can make is', lowerBound);