import { readInputFile } from '../utils/file';
import { readSif } from '../image/SpaceImageFormat';
import { countMatching, minIndex } from '../utils/array';

const data = readInputFile(Number(process.env.DAY), process.env.FILE);
const image = readSif(data);

const min0Idx = minIndex(image.layers.map(layer => countMatching(layer.pixels, '0')));
const count0 = countMatching(image.layers[min0Idx].pixels, '0');
const count1 = countMatching(image.layers[min0Idx].pixels, '1');
const count2 = countMatching(image.layers[min0Idx].pixels, '2');
console.log(`Layer ${min0Idx} (${count0} zeroes) 1x2: ${count1 * count2}`);

image.flatten().print();
