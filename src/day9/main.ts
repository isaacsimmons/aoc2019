import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const program = inputText.trim().split(',').map(Number);

const computer = new Computer(program, [1]);

// "Test 0"
// const computer = new Computer([109,19,204,-34, 99], []);
// computer.memory.relativeBase = 2000;
// computer.memory.write({num: 1985, mode: "position"}, 444);

const run = async () => {
    computer.run();
    while (true) {
        try {
            const result = await computer.output.read();
            // TODO: a "gentle" readAll() method on output
            console.log('answer', result);
        } catch (e) {
            console.log((e as Error).message);
            break;
        }
    }
};

run();
