import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const memory = inputText.split(',').map(s => s.trim()).filter(x => x.length > 0).map(Number);

const amplify = async (phaseSettings: number[]) => {
    const a = new Computer(memory, [phaseSettings[0], 0]);
    const b = new Computer(memory, [phaseSettings[1]], a.output);
    const c = new Computer(memory, [phaseSettings[2]], b.output);
    const d = new Computer(memory, [phaseSettings[3]], c.output);
    const e = new Computer(memory, [phaseSettings[4]], d.output);

    a.run();
    b.run();
    c.run();
    d.run();
    e.run();

    return await e.readOutput();
}

const feedback = (phaseSettings: number[]) => {
    // let signal: number|undefined = 0;
    // let curr = 0;
    // let next = 1;
    // // Make a batch of 5 computers from the same memory
    // const computers = phaseSettings.map(phaseSetting => new Computer(memory));
    // for (let curr = 0; i < 5; i++) {
    //   next = (curr + i) % 5;
    //   computers[next].input = mergeIncomputers[curr].readOutput;
    // }


    // computers[0].writeInput(signal);
    // do {
    //     computers[curr].run();
    //     signal = computers[curr].readOutput();
    //     while (signal !== undefined) {
    //         computers[next].writeInput(signal);
    //         signal = computers[curr].readOutput();
    //     }
    //     curr = next;
    //     next = (next + 1) % computers.length;
    // } while (computers.map(computer => computer.terminated).filter(x => !x).length > 0);
    // // console.log('done last', computers[4].output);
    // return computers[4].output[computers[4].output.length - 1];
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

amplify([0,1,2,3,4]).then(x => { console.log('done', x); }).catch(x => { console.log('err', x); }).finally(() => console.log('fin'));

// console.log(findMaxPermutation([5,6,7,8,9], feedback));
// console.log(findMaxPermutation([5,6,7,8,9], feedback));

// console.log(feedback([9,8,7,6,5]));

