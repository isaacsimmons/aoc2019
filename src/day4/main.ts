import { equals } from "../utils/array";

const MIN = 273025;
const MAX = 767253;

// The "0" element is technically wasted since "ascending" numbers will never have zeroes in them
// TODO: keep track of max and min digit as well as count of digits
type Buckets = [number, number, number, number, number, number, number, number, number, number];

const EMPTY_BUCKETS: Buckets = [0,0,0,0,0,0,0,0,0,0];

const bukkit = (n: number): Buckets => {
    const b = [...EMPTY_BUCKETS] as Buckets;

    // Split the number into digits
    const d = String(n).split('').map(Number);

    // Round up to the nearest ascending value while bucketing digits
    let min = 0;
    d.forEach((n, idx) => {
        if (n < min) {
            d[idx] = min;
            b[min]++;
        } else {
            min = n;
            b[n]++;
        }
    });
    return b;
}

// Increment an already ascending set of digits to the next highest value
const incB = (b: Buckets, max: Buckets): boolean => {
    // Scan from the highest value looking for one that you can increment
    // Scan the number from least significant to most significant looking for a number that we can increment

    // Find the first non-9 value and we can increment that
    for (let i = 8; i >= 1; i--) {
        if (b[i] > 0) {
            b[i]--;
            b[i+1]++;
            if (i !== 8) {
                b[i+1] += b[9];
                b[9] = 0;
            }
            return equals(b, max);
        }
    }

    // Previous number was all 9'a. Adding another digit, start at all 1's
    b[1] = b[9] + 1;
    b[9] = 0;
    return equals(b, max);
}

const hasPair = (b: Buckets) => b.some(d => d === 2);

const x = bukkit(MIN);
const max = bukkit(MAX + 1); // We're using a non-inclusive MAX, so add 1

let numPasswords = 0;
do {
    if (hasPair(x)) {
        numPasswords++;
    }
} while (!incB(x, max));

console.log(numPasswords);