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

console.log(amplify([1,0,4,3,2]));