import { readFileSync } from 'fs';

const input = readFileSync('src/day1/input.txt').toString();
const numbers = input.split('\n').filter(x => x.length > 0).map(Number);

const fuelRequired = (mass: number) => Math.floor(mass / 3) - 2;

let totalFuel = numbers.map(fuelRequired).reduce((x, y) => x + y, 0);
console.log(totalFuel);
