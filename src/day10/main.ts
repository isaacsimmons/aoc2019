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

const gcd = (x: number, y: number) => {
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

const scoreLocation = (originX: number, originY: number) => {
    const headings = new Set<string>();
    // console.log('checking', originX, originY);
    if (grid[originY][originX] !== '#') {
        return 0;
    }
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (grid[y][x] === '#') {
                const dx = x - originX;
                const dy = y - originY;
                const dGCD = gcd(dx, dy);
                const key = `${dx / dGCD}_${dy / dGCD}`;
                // console.log('seen', key);
                headings.add(key);
            }
        }
    }
    // console.log('done with', headings.size);
    return headings.size - 1; // Ignore the 0_0 entry
};

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        scores[y][x] = scoreLocation(x, y);
    }
}
// scores[3][3] = scoreLocation(3, 3);

const maxScore = () => {
    return Math.max(...scores.map(row => Math.max(...row)));
}



// console.log(grid);
// console.log(scores);
console.log(maxScore());