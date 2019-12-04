const MIN = 273025;
const MAX = 767253;

const testNumber = (n: Number): boolean => {
    const digits = String(n).split('').map(Number);
    let hasDouble = false;
    const buckets = [0,0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < 5; i++) {
        if (digits[i] > digits[i+1]) {
            return false;
        }
    }
    for (let i = 0; i <= 5; i++) {
        buckets[digits[i]]++;
    }
    return buckets.filter(n => n === 2).length > 0;
}


console.log(testNumber(112233));
console.log(testNumber(123444));
console.log(testNumber(111122));

let n = 0;
for (let i = MIN; i <= MAX; i++) {
    if (testNumber(i)) {
        n++;
    }
}

console.log(n);