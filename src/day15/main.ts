import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';
import Buffer from '../compute/Buffer';
import Dimensions from '../image/Dimensions';
import Image from '../image/Image';
import { BLACK_AND_WHITE } from '../image/colors';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

const lines = inputText.trim().split('\n').map(line => line.trim()).map(line => line.split(''));
console.log(lines);

const width = lines[0].length;
const height = lines.length;

let time = 0;

let newO2 = new Set<string>();

// Initialize with canister
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (lines[y][x] === '2') {
            newO2.add(`${x}_${y}`);
        }
    }
}


while (newO2.size > 0) {
    const lastO2 = newO2;
    newO2 = new Set<string>();
    time++;

    const trySpread = (x: number, y: number) => {
        if (lines[y][x] === '0') {
            lines[y][x] = '2';
            newO2.add(`${x}_${y}`);
        }
    };

    for (const spot of lastO2) {
        const [x, y] = spot.split('_').map(Number);
        trySpread(x + 1, y);
        trySpread(x - 1, y);
        trySpread(x, y + 1);
        trySpread(x, y - 1);
    }
}

console.log('total time', time);

// const program = inputText.split(',').map(s => s.trim()).filter(s => s.length > 0).map(Number);

// const input = new Buffer<number>();
// const computer = new Computer(program, [], input);

// const knownWalls = new Set<string>();

// let position: Dimensions = {x: 0, y: 0};

// const NORTH = 1;
// const SOUTH = 2;
// const WEST = 3;
// const EAST = 4;

// const WALL = 0;
// const MOVE = 1;
// const GOAL = 2;



// // computer.runUntilBlockedOrTerminated();
// // console.log(computer.output.flush());

// let goal: Dimensions|undefined;

// for (let i = 0; i < 1000000; i++) {
//     const tryMove = Math.floor(Math.random() * 4) + 1;
//     const nextPosition = {...position};
//     switch (tryMove) {
//         case NORTH:
//             nextPosition.y--;
//             break;
//         case SOUTH:
//             nextPosition.y++;
//             break;
//         case EAST:
//             nextPosition.x++;
//             break;
//         case WEST:
//             nextPosition.x--;
//             break;
//         default:
//             throw new Error('Wrong direction');
//     }
//     input.write(tryMove);
//     computer.runUntilBlockedOrTerminated();
//     const result = computer.output.readSync();
//     if (result === 0) {
//         knownWalls.add(`${nextPosition.x}_${nextPosition.y}`);
//         continue;
//     }

//     if (result === 2) {
//         // console.log('found it', nextPosition);
//         // console.log('walls', knownWalls);
//         position = nextPosition;
//         goal = nextPosition;
//         // break;
//     }

//     if (result === 1) {
//         position = nextPosition;
//     }
// } 

// const xs = [...knownWalls.values()].map(s => Number(s.split('_')[0]));
// const ys = [...knownWalls.values()].map(s => Number(s.split('_')[1]));
// let minX = Math.min(...xs);
// let minY = Math.min(...ys);
// const maxX = Math.max(...xs);
// const maxY = Math.max(...ys);

// console.log('x', minX, 'y', minY);

// const image = Image.init<string>(maxX - minX + 1, maxY - minY + 1, '0', BLACK_AND_WHITE);
// image.setValue(goal!.x - minX, goal!.y - minY, '2');
// image.setValue(0 - minX, 0 - minY, '2');
// const dimensions = [...knownWalls.values()].map(s => s.split('_')).map(([x, y]) => ({x: Number(x), y: Number(y)})).forEach(({x, y}) => image.setValue(x - minX, y - minY, '1'));

// image.print();