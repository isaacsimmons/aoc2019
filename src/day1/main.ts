import { readInputFile } from '../utils/file';

const input = readInputFile(1, 'input');
const numbers = input.split('\n').filter(x => x.length > 0).map(Number);

const fuelRequired = (mass: number): number => {
    const fuel = Math.floor(mass / 3) - 2;
    if (fuel <= 0) {
        return 0;
    }
    return fuel + fuelRequired(fuel);
}

let totalFuel = numbers.map(fuelRequired).reduce((x, y) => x + y, 0);
console.log(totalFuel);
