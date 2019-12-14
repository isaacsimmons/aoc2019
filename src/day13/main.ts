import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';
import Buffer from '../compute/Buffer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const program = inputText.trim().split(',').filter(code => code.length > 0).map(Number);
program[0] = 2; // Free play mode!

const computer = new Computer(program);
computer.input = new Buffer();

const go = async () => {
    let score = 0;
    let ballX: number | undefined;
    let paddleX: number | undefined;

    while (true) {
        computer.runUntilBlockedOrTerminated();

        const outputs = computer.output.flush();
    
        for (let i = 0; i < outputs.length; i += 3) {
            const x = outputs[i];
            const y = outputs[i + 1];
            const value = outputs[i + 2];

            console.log('read', x, y, value);
    
            if (x === -1 && y === 0) {
                score = value;
                console.log('score', score);
            } else if (value === 3) { // paddle
                paddleX = x;
            } else if (value === 4) { // ball
                ballX = x;
            }
        }

        let direction = 0;
        if (paddleX === undefined || ballX === undefined) {
            console.warn('Got output array without paddle and ball');
        } else if (paddleX > ballX) {
            direction = -1;
        } else if (paddleX < ballX) {
            direction = 1;
        }
        console.log('paddle direction', direction);
        computer.input!.write(direction);

        if (computer.status === 'terminated') {
            console.log('DONE');
            break;
        } else if (computer.status === 'waiting') {
            await computer.input!.waitAvailable();
        } else {
            throw new Error('Unexpected computer status');
        }
    }
};

// Max X = 36
// Max Y = 19
// Make the screen uh, 37x20? 40x20? 40x40?

go();