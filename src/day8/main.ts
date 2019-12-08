import { readInputFile } from '../utils/file';
import Buffer from '../compute/Buffer';

const rawNumbers = readInputFile(Number(process.env.DAY), process.env.FILE).trim().split('').map(Number);
// const width = 2;
// const height = 2;
const width = 25;
const height = 6;
const size = width * height;

type Layer = number[];

const layers: Layer[] = [];

let i = 0;

for (let i = 0; i < rawNumbers.length / size; i++) {
    layers[i] = rawNumbers.slice(i * size, (i+1) * size);
}

const countDigits = (layer: Layer, digit: number) => {
    return layer.filter(n => n === digit).length;
};

//console.log(layers);

// let maxZeroes = 10000000;
// let maxZeroLayer = 0;

// for (let i = 0; i < layers.length; i++) {
//     const zeroes = countDigits(layers[i], 0);
//     if (zeroes < maxZeroes) {
//         maxZeroes = zeroes;
//         maxZeroLayer = i;
//     }
// }

const combineLayers = (top: Layer, bottom: Layer): Layer => {
    const result = [...top];
    for (let i = 0; i < result.length; i++) {
        if (result[i] === 2) {
            result[i] = bottom[i];
        }
    }
    return result;
}

// const merged = layers.reduce(combineLayers, layers[0]);
// console.log(merged);


let i2 = 0;
let tmp = layers[i2];

do {
    tmp = combineLayers(tmp, layers[i2]);
    i2++;
} while (i2 < layers.length);

console.log(tmp);

const rows = [];
for (let i = 0; i < tmp.length / width; i++) {
    rows[i] = tmp.slice(i * width, (i+1) * width);
}
for (const row of rows) {
    console.log(row.map(digit => digit === 1 ? 'X' : ' ').join(''));
}
// console.log(rows);



// console.log('layer', maxZeroLayer, 'with', maxZeroes, 'zeroes');
// console.log(countDigits(layers[maxZeroLayer], 2) * countDigits(layers[maxZeroLayer], 1));