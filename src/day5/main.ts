import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';
import Memory from '../compute/Memory';

const inputText = readInputFile(5, 'input');

//TODO: input array should come from file as well
const program = inputText.split(',').map(Number);

const computer = new Computer(new Memory(program), [5]);
computer.run();
console.log(computer.output);
