import { readFileSync } from 'fs';
import Computer from '../day2/Computer';
import Memory from '../day2/memory';

const FILENAME = 'src/day5/input.txt';

const inputText = readFileSync(FILENAME).toString().trim();
//TODO: input array should come from file as well
const program = inputText.split(',').map(Number);

const computer = new Computer(new Memory(program), [5]);
computer.run();
console.log(computer.output);
