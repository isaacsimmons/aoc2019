import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

//TODO: input array should come from file as well
const program = inputText.split(',').map(Number);

const computer = new Computer(program, [5]);
computer.run();
console.log(computer.output);
