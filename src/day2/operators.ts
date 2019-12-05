import Computer from "./Computer";

export type Mode = 'position' | 'immediate';

export interface Operator {
    numParams: number;
    operate: (params: number[], paramModes: Mode[], computer: Computer) => void;
}

const add: Operator = {
    numParams: 3,
    operate: ([p1, p2, idxStore], [m1, m2, m3], computer) => {
        if (m3 === 'immediate') {
            throw new Error('Tried to store result in immediate mode');
        }
        const n1 = m1 === 'position' ? computer.memory.read(p1) : p1;
        const n2 = m2 === 'position' ? computer.memory.read(p2): p2;
        const result = n1 + n2;
        computer.memory.write(idxStore, result);
    },
};

const multiply: Operator = {
    numParams: 3,
    operate: ([p1, p2, idxStore], [m1, m2, m3], computer) => {
        if (m3 === 'immediate') {
            throw new Error('Tried to store result in immediate mode');
        }
        const n1 = m1 === 'position' ? computer.memory.read(p1) : p1;
        const n2 = m2 === 'position' ? computer.memory.read(p2): p2;
        const result = n1 * n2;
        computer.memory.write(idxStore, result);
    },
};

const read: Operator = {
    numParams: 1,
    operate: ([idx], [mode], computer) => {
        if (mode === 'immediate') {
            throw new Error('Tried to read in immediate mode');
        }
        const val = computer.readInput();
        computer.memory.write(idx, val);
    },
}

const write: Operator = {
    numParams: 1,
    operate: ([idx], [mode], computer) => {
        if (mode === 'immediate') {
            throw new Error('Tried to write in immediate mode');
        }
        const val = computer.memory.read(idx);
        computer.writeOutput(val);
    },
}

const terminate: Operator = {
    numParams: 0,
    operate: (_params, _paramModes, computer) => {
        computer.terminated = true;
    },
};


const AllOperators = new Map<number, Operator>([
    [1, add],
    [2, multiply],
    [3, read],
    [4, write],
    [99, terminate],
]);

// TODO: memoize this? There really just aren't that many possible options
export const parseOperator = (opCode: number): {operator: Operator; paramModes: Mode[]} => {
    const code = opCode % 100;
    const operator = AllOperators.get(code);
    if (!operator) {
        throw new Error(`Unknown operator ${opCode}`);
    }

    let remainder = (opCode - code) / 100;
    const paramModes: Mode[] = [];
    for (let i = 0; i < operator.numParams; i++) {
        const digit = remainder % 10;
        switch (digit) {
            case 0:
                paramModes.push('position');
                break;
            case 1:
                paramModes.push('immediate');
                break;
            default:
                throw new Error(`Unexpected parameter mode found in ${opCode}`);
        }
        remainder -= digit;
        remainder /= 10;
    }

    return { operator, paramModes };
};
