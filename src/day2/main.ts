import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';

const inputText = readInputFile(2, 'input');
const program = inputText.split(',').map(Number);

const testInputs = (noun: number, verb: number): number => {
    const memory = [...program];
    memory[1] = noun;
    memory[2] = verb;
    const computer = new Computer(memory, []);
    computer.run();
    return computer.readMemory(0);
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
