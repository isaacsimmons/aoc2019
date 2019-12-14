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
console.log(reactions);