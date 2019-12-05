import { readFileSync } from 'fs';
import Computer from '../compute/Computer';
import Memory from '../compute/Memory';

const FILENAME = 'src/day5/input.txt';

const inputText = readFileSync(FILENAME).toString().trim();
//TODO: input array should come from file as well
const program = inputText.split(',').map(Number);

const computer = new Computer(new Memory(program), [5]);
computer.run();
console.log(computer.output);
