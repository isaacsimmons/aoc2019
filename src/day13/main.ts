import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const program = inputText.trim().split(',').filter(code => code.length > 0).map(Number);

const computer = new Computer(program);

computer.run();

const runProgram = async () => {
    const outputs: number[] = [];
    do {
        try {
            const output = await computer.output.read();
            outputs.push(output);
        } catch (e) {
            console.error(e);
            break;
        }

    } while (computer.status !== 'terminated');
    return outputs;
};

const go = async () => {
    let maxX = 0;
    let maxY = 0;
    const outputs = await runProgram();
    const screen = new Map<string, number>();
    for (let i = 0; i < outputs.length; i += 3) {
        const x = outputs[i];
        const y = outputs[i + 1];
        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);

        const type = outputs[i + 2];

        screen.set(`${x}_${y}`, type);
    }
    const numBlocks = [...screen.values()].filter(value => value === 2).length;
    console.log('blocks', numBlocks);

    console.log('x', maxX, 'y', maxY);
};

// Max X = 36
// Max Y = 19
// Make the screen uh, 37x20? 40x20? 40x40?

go();