import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';
import Buffer from '../compute/Buffer';
import Layer from '../image/Layer';
import Dimensions from '../image/Dimensions';
import { chunk } from '../utils/array';
import { BREAKOUT_BOARD } from '../image/colors';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const program = inputText.trim().split(',').filter(code => code.length > 0).map(Number);
program[0] = 2; // Free play mode!

const computer = new Computer(program);
computer.input = new Buffer();

interface GameState {
    score: number;
    screen: Layer;
    ballAt: Dimensions;
    paddleAt: Dimensions;
}

const go = async () => {
    const state: GameState = {
        score: 0,
        paddleAt: {x: 0, y: 0},
        ballAt: {x: 0, y: 0},
        screen: Layer.init(40, 20),
    };

    while (true) {
        computer.runUntilBlockedOrTerminated();

        const outputs = computer.output.flush();
        const commands = chunk(outputs, 3);
        commands.forEach(command => {
            const [x, y, value] = command;

            if (x === -1 && y === 0) {
                state.score = value;
                return;
            }

            if (value === 3) {
                state.paddleAt = { x, y };
            } else if (value === 4) {
                state.ballAt = { x, y };
            }
            state.screen.setValue(x, y, String(value));
        });

        console.log('score', state.score);
        state.screen.print(BREAKOUT_BOARD); // TODO: make the formatter a property of the Layer

        let direction = 0;
        if (state.paddleAt.x > state.ballAt.x) {
            direction = -1;
        } else if (state.paddleAt.x < state.ballAt.x) {
            direction = 1;
        }
        // console.log('paddle direction', direction);
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