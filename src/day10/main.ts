import { readInputFile } from '../utils/file';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

const lines = inputText.split('\n').map(s => s.trim()).filter(line => line.length > 0);
const grid = lines.map(line => line.split(''));

const height = lines.length;
const width = lines[0].length;

const scores: number[][] = new Array(height);
for (let y = 0; y < height; y++) {
    scores[y] = new Array(width).fill(0);
}

// Note: Grid[y][x]

export const gcd = (x: number, y: number) => {
    x = Math.abs(x);
    y = Math.abs(y);
    if (x === 0) {
        return y || 1;
    }
    if (y === 0) {
        return x || 1;
    }
    while(y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
};

interface Intercept {
    targetX: number;
    targetY: number;
    dx: number;
    dy: number;
    dxReduced: number;
    dyReduced: number;
    heading: number;
    key: string;
    gcd: number;
}

const stationX = 23;
const stationY = 20;
// const stationX = 11;
// const stationY = 13;

const headings = new Map<string, Intercept[]>();
// console.log('checking', originX, originY);
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (grid[y][x] === '#') {
            const dx = x - stationX;
            const dy = y - stationY;
            const dGCD = gcd(dx, dy);
            const dxReduced = dx / dGCD;
            const dyReduced = dy / dGCD;
            const key = `${dxReduced}_${dyReduced}`;
            const heading = Math.atan2(dxReduced, dyReduced);
            const h: Intercept = {
                targetX: x,
                targetY: y,
                dx,
                dy,
                dxReduced,
                dyReduced,
                heading,
                key,
                gcd: dGCD,
            };
            const match = headings.get(key);
            if (match) {
                match.push(h);
            } else {
                headings.set(key, [h]);
            }
        }
    }
}
headings.delete('0_0'); // Ignore own coords

console.log(headings);

const sorted = [...headings.keys()].sort((keyA, keyB) => {
    const headingA = headings.get(keyA)![0].heading;
    const headingB = headings.get(keyB)![0].heading;
    return headingB - headingA;
});

console.log(sorted);

const vaporized = [];

while (headings.size > 0) {
    for (const key of sorted) {
        const match = headings.get(key);
        if (!match) {
            continue;
        }
        if (match.length === 1) {
            vaporized.push(match[0]);
            headings.delete(key);
            continue;
        }
        // find lowest GCD, pluck that one out
        const lowestGCD = Math.min(...match.map(h => h.gcd));
        const lowestIndex = match.findIndex((value) => value.gcd === lowestGCD);
        vaporized.push(match[lowestIndex]);
        match.splice(lowestIndex, 1);
    }
}

console.log(vaporized[0]);
console.log(vaporized[1]);
console.log(vaporized[2]);
console.log(vaporized[199]);

// for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//         scores[y][x] = scoreLocation(x, y);
//     }
// }
// scores[3][3] = scoreLocation(3, 3);

// const maxScore = () => {
//     return Math.max(...scores.map(row => Math.max(...row)));
// }

// x 11, y 13

// current picks 10, 13

// console.log(grid);
// console.log(scores);
// console.log(maxScore());