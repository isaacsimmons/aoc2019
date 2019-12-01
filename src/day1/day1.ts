import { readFileSync } from 'fs';

const input = readFileSync('src/day1/input.txt').toString();
const numbers = input.split('\n').filter(x => x.length > 0).map(Number);

for (const number of numbers) {
  console.log('Nuber is', number);
}
