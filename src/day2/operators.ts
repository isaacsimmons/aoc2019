import Memory from "./Memory";

export interface Operator {
    code: number;
    numParams: number;
    operate: (params: number[], memory: Memory) => boolean;
}

const add: Operator = {
    code: 1,
    numParams: 3,
    operate: ([idx1, idx2, idxStore], memory) => {
        const n1 = memory.read(idx1);
        const n2 = memory.read(idx2);
        const result = n1 + n2;
        memory.write(idxStore, result);
        return false;
    },
};

const multiply: Operator = {
    code: 2,
    numParams: 3,
    operate: ([idx1, idx2, idxStore], memory) => {
        const n1 = memory.read(idx1);
        const n2 = memory.read(idx2);
        const result = n1 * n2;
        memory.write(idxStore, result);
        return false;
    },
};

const terminate: Operator = {
    code: 99,
    numParams: 0,
    operate: () => true,
};


export const AllOperators = new Map<number, Operator>([
    [add.code, add],
    [multiply.code, multiply],
    [terminate.code, terminate],
]);
