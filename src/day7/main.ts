import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const memory = inputText.split(',').map(s => s.trim()).filter(x => x.length > 0).map(Number);

const amplify = async (phaseSettings: number[]) => {
  const computers = phaseSettings.map(phaseSetting => new Computer(memory, [phaseSetting]));
  computers[0].inputSeed.write(0);
  computers[1].input = computers[0].output;
  computers[2].input = computers[1].output;
  computers[3].input = computers[2].output;
  computers[4].input = computers[3].output;

  computers.forEach(computer => computer.run());

  return await computers[4].output.read();
}

const feedback = async (phaseSettings: number[]) => {
    // // Make a batch of 5 computers from the same memory
    const computers = phaseSettings.map(phaseSetting => new Computer(memory, [phaseSetting]));
    for (let curr = 0; curr < 5; curr++) {
      const next = (curr + 1) % 5;
      computers[next].input = computers[curr].output;
    }

    // Seed the input of the first with an additional value
    computers[0].inputSeed.write(0);

    // Setup a loop to wait for all computers to terminate before returning
    const p = new Promise<number>((resolve, _reject) => {
      const waiting = setInterval(() => {
        const terminationStatuses = computers.map(computer => computer.terminated);
        if (!terminationStatuses.includes(false)) {
          clearInterval(waiting);
          resolve(computers[4].output.readSync());
        }
      }, 0);
    });

    // Start all of the computers
    computers.forEach(computer => computer.run());

    return p;
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

const findMaxPermutation = async (inputs: number[], runner: (params: number[]) => Promise<number>) => {
    const permutations = permutator(inputs);
    const promises = permutations.map(runner);
    const results = await Promise.all(promises);
    return Math.max(...results);
}

// amplify([0,1,2,3,4]).then(x => { console.log('done', x); }).catch(x => { console.log('err', x); }).finally(() => console.log('fin'));

// console.log(findMaxPermutation([5,6,7,8,9], feedback));

// feedback([9,8,7,6,5]).then(x => { console.log('done', x); }).catch(x => { console.log('err', x); }).finally(() => console.log('fin'));
findMaxPermutation([5,6,7,8,9], feedback).then(x => { console.log('done', x); }).catch(x => { console.log('err', x); }).finally(() => console.log('fin'));
