import { readFileSync } from 'fs';
import Computer from '../compute/Computer';
import Memory from '../compute/Memory';

const FILENAME = 'src/day2/input.txt';

const inputText = readFileSync(FILENAME).toString().trim();
const program = inputText.split(',').map(Number);

const testInputs = (noun: number, verb: number): number => {
    const memory = [...program];
    memory[1] = noun;
    memory[2] = verb;
    const computer = new Computer(new Memory(memory), []);
    computer.run();
    return computer.memory.read(0);
}

outer: for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb ++) {
        try {
            const result = testInputs(noun, verb);
            if (result === 19690720) {
                console.log('got it', (100 * noun) + verb);
                break outer;
            }
        } catch (ignored) {
            console.log(ignored.toString());
        }
    }
}
