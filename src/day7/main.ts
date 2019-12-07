import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const memory = inputText.split(',').map(s => s.trim()).filter(x => x.length > 0).map(Number);

const amplify = (phaseSettings: number[]) => {
    let signal = 0;
    const a = new Computer(memory, [phaseSettings[0], signal]);
    a.run();
    const b = new Computer(memory, [phaseSettings[1], a.output[0]]);
    b.run();
    const c = new Computer(memory, [phaseSettings[2], b.output[0]]);
    c.run();
    const d = new Computer(memory, [phaseSettings[3], c.output[0]]);
    d.run();
    const e = new Computer(memory, [phaseSettings[4], d.output[0]]);
    e.run();
    return e.output[0];
}

const feedback = (phaseSettings: number[]) => {
    let signal: number|undefined = 0;
    let curr = 0;
    let next = 1;
    const computers = phaseSettings.map(phaseSetting => new Computer(memory, [phaseSetting]));
    computers[0].writeInput(signal);
    do {
        computers[curr].run();
        signal = computers[curr].readOutput();
        while (signal !== undefined) {
            computers[next].writeInput(signal);
            signal = computers[curr].readOutput();
        }
        curr = next;
        next = (next + 1) % computers.length;
    } while (computers.map(computer => computer.terminated).filter(x => !x).length > 0);
    // console.log('done last', computers[4].output);
    return computers[4].output[computers[4].output.length - 1];
}

const permutator = (inputArr: number[]) => {
    let result: number[][] = [];
  
    const permute = (arr: number[], m: number[] = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
}

const findMaxPermutation = (inputs: number[], runner: (params: number[]) => number) => {
    const permutations = permutator(inputs);
    return Math.max(...permutations.map(runner));
}

console.log(findMaxPermutation([5,6,7,8,9], feedback));

// console.log(feedback([9,8,7,6,5]));

