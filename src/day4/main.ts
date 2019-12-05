const MIN = 273025;
const MAX = 767253;

// The "0" element is technically wasted since "ascending" numbers will never have zeroes in them
// TODO: keep track of max and min digit as well as count of digits
type Buckets = [number, number, number, number, number, number, number, number, number, number];
type Digits = number[];

const EMPTY_BUCKETS: Buckets = [0,0,0,0,0,0,0,0,0,0];

// Number to digits
const ntod = (n: number): Digits => String(n).split('').map(Number);

// Digits to number
// TODO: write this if I ever need it
const dton = (d: Digits): number => 42;

// Buckets to digits
const btod = (b: Buckets): Digits => {
    const d: number[] = [];
    b.forEach((count, idx) => {
        d.push(...Array.from({length: count}).map(_ => idx));
    });
    return d;
}

// Digits to buckets
const dtob = (d: Digits): Buckets => {
    const b = [...EMPTY_BUCKETS] as Buckets;
    d.forEach(digit => b[digit]++);
    return b;
};

const hasDouble = (b: Buckets) => b.find(count => count === 2) !== undefined;

// Take a potentially non-ascending set of digits and increments it to the next "ascending" value
const makeAscending = (d: Digits) => {
    let min = 0;
    d.forEach((n, idx) => {
        if (n < min) {
            d[idx] = min;
        } else {
            min = n;
        }
    });
}

// Increment an already ascending set of digits to the next highest value
const incD = (d: Digits, max: Digits): boolean => {
    // TODO: pass an optional max here? (unless its just going to be exactly the same as doing the compares manually)

    // Scan the number from least significant to most significant looking for a number that we can increment
    let i = d.length - 1;
    let changedValue = d[i];
    while (i > 0 && changedValue === 9) {
        i--;
        changedValue = d[i];
    }

    // Perform the increment (to the selected digit and every one to the right)
    changedValue++;
    for (; i < d.length; i++) {
        d[i] = changedValue;
    }

    // Given that the previous number was less than the max, we only need to look at changed values
    return true;
}

// Increment an already ascending set of digits to the next highest value
const incB = (d: Buckets, max: Buckets): boolean => {
    // Scan from the highest value looking for one that you can increment
    // Scan the number from least significant to most significant looking for a number that we can increment

    // Find the first non-9 value and we can increment that
    for (let i = 8; i >= 1; i++) {
        if (i > 0) {
            d[i]--;
            d[i+1]++;
            if (i !== 8) {
                d[i+1] += d[9];
                d[9] = 0;
            }
            return true;
        }
    }

    // Wrap around to adding another digit, start at all 1's
    d[1] = d[9] + 1;
    d[9] = 0;
    return true;
}


const dx = toDigits(MIN);
console.log(dx);
makeAscending(dx);
console.log(dx);
for (let x = 0; x < 30; x++) {
    incAscending(dx);
    console.log(dx);
}
