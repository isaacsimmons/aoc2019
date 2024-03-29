import { equals } from "../utils/array";
import { filtered } from "../utils/generator";

const MIN = 273025;
const MAX = 767253;

// The "0" element is technically wasted since "ascending" numbers will never have zeroes in them
// TODO: keep track of max and min digit as well as count of digits
type Buckets = [number, number, number, number, number, number, number, number, number, number];

const EMPTY_BUCKETS: Buckets = [0,0,0,0,0,0,0,0,0,0];

const bukkit = (n: number): Buckets => {
    const b = [...EMPTY_BUCKETS] as Buckets;

    // Split the number into digits
    const digits = String(n).split('').map(Number);

    // Round up to the nearest ascending value while bucketing digits
    let min = 0;
    digits.forEach(digit => {
        if (digit < min) {
            b[min]++;
        } else {
            min = digit;
            b[digit]++;
        }
    });
    return b;
};

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

const ascending = function *ascending(min: number, max: number) {
    const x = bukkit(min);
    const maxB = bukkit(max + 1); // We're using a non-inclusive MAX, so add 1
    do {
        yield x;
    } while (!incB(x, maxB));
};

const passwords = filtered(ascending(MIN, MAX), hasPair);
console.log([...passwords].length);