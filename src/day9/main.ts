import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';
import Cluster from '../compute/Cluster';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const program = inputText.trim().split(',').map(Number);

const computer = new Computer(program, [2]);

// "Test 0"
// const computer = new Computer([109,19,204,-34, 99], []);
// computer.memory.relativeBase = 2000;
// computer.memory.write({num: 1985, mode: "position"}, 444);

// TODO: proper bounds check on large numbers

const run = async () => {
    computer.run();
    const cluster = new Cluster([computer]);
    await cluster.awaitAllTerminated();
    console.log('answer', computer.output.flush());
};

run();
