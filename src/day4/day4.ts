const MIN = 273025;
const MAX = 767253;

const testNumber = (n: Number): boolean => {
    const digits = String(n);
    let hasDouble = false;
    for (let i = 0; i < 5; i++) {
        if (digits[i] === digits[i+1]) {
            hasDouble = true;
        }
        if (digits[i] > digits[i+1]) {
            return false;
        }
    }
    return hasDouble;
}


let n = 0;
for (let i = MIN; i <= MAX; i++) {
    if (testNumber(i)) {
        n++;
    }
}

console.log(n);