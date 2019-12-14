import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';
import Buffer from '../compute/Buffer';
import Image from '../image/Image';
import { BLACK_AND_WHITE } from '../image/colors';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const program = inputText.trim().split(',').map(Number);
const computer = new Computer(program);

type Heading = 'up' | 'right' | 'down' | 'left';

const turnLeft = (initial: Heading): Heading => {
    switch (initial) {
        case 'up':
            return 'left';
        case 'down':
            return 'right';
        case 'left':
            return 'down';
        case 'right':
            return 'up';
    }
};

const turnRight = (initial: Heading): Heading => {
    switch (initial) {
        case 'up':
            return 'right';
        case 'down':
            return 'left';
        case 'left':
            return 'up';
        case 'right':
            return 'down';
    }
};

let heading: Heading = 'up';
let x = 0;
let y = 0;

const whitePanels = new Set<string>();
const paintedPanels = new Set<string>();

whitePanels.add('0_0');

const input = new Buffer<number>();
computer.input = input;

do {
    const key = `${x}_${y}`;
    const inputValue = whitePanels.has(key) ? 1 : 0;
    input.write(inputValue);
    computer.runUntilBlockedOrTerminated();

    // Paint current square
    const colorToPaint = computer.output.readSync();

    paintedPanels.add(key);
    if (colorToPaint === 0) {
        // Paint black
        whitePanels.delete(key);
    } else if (colorToPaint === 1) {
        // Paint white
        whitePanels.add(key);
    } else {
        throw new Error('Unexpected paint color command');
    }

    // Turn
    const directionToTurn = computer.output.readSync();

    if (directionToTurn === 0) {
        heading = turnLeft(heading);
    } else if (directionToTurn === 1) {
        heading = turnRight(heading);
    } else {
        throw new Error('Unexpected turn command');
    }

    // console.log(`(${x}, ${y}) paint ${colorToPaint === 1 ? 'white' : 'black'}, turn ${directionToTurn === 0 ? 'left' : 'right'}, facing ${heading}`)

    // Advance a space
    switch (heading) {
        case 'up':
            y--;
            break;
        case 'down':
            y++;
            break;
        case 'right':
            x++;
            break;
        case 'left':
            x--;
            break;
    }
    // console.log(paintedPanels.size);
    computer.runUntilBlockedOrTerminated();
} while (computer.status !== 'terminated');
//    console.log('final', whitePanels);

const tmp = [...whitePanels.keys()].map(s => s.split('_').map(Number));
const xs = tmp.map(coord => coord[0]);
const ys = tmp.map(coord => coord[1]);
const minx = Math.min(...xs);
const maxx = Math.max(...xs);
const miny = Math.min(...ys);
const maxy = Math.max(...ys);
const width = maxx - minx + 1;
const height = maxy - miny + 1;
const l = Image.init<string>(width, height, '0', BLACK_AND_WHITE);
tmp.forEach(coords => {
    l.setValue(coords[0] - minx, coords[1] - miny, '1');
});
l.print();


