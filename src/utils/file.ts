import { readFileSync } from 'fs';

export const readInputFile = (day: number, name: string = 'input', suffix: string = '') => {
    return readFileSync(`inputs/day${day}/${name}${suffix}.txt`).toString().trim();
};