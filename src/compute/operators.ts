import Computer, { Parameter, Mode } from "./Computer";

export interface Operator {
    numParams: number;
    operate: (params: Parameter[], computer: Computer) => void;
}

const add: Operator = {
    numParams: 3,
    operate: ([p1, p2, p3], cpu) => {
        const result = cpu.readMemory(p1) + cpu.readMemory(p2);
        cpu.writeMemory(p3, result);
    },
};

const multiply: Operator = {
    numParams: 3,
    operate: ([p1, p2, p3], cpu) => {
        const result = cpu.readMemory(p1) * cpu.readMemory(p2);
        cpu.writeMemory(p3, result);
    },
};

const read: Operator = {
    numParams: 1,
    operate: ([p1], cpu) => {
        const val = cpu.readInput();
        cpu.writeMemory(p1, val);
    },
}

const write: Operator = {
    numParams: 1,
    operate: ([p1], cpu) => {
        const val = cpu.readMemory(p1);
        cpu.writeOutput(val);
    },
}

const jumpTrue: Operator = {
    numParams: 2,
    operate: ([p1, p2], cpu) => {
        if (cpu.readMemory(p1) !== 0) {
            cpu.address = cpu.readMemory(p2);
        }
    },
}

const jumpFalse: Operator = {
    numParams: 2,
    operate: ([p1, p2], cpu) => {
        if (cpu.readMemory(p1) === 0) {
            cpu.address = cpu.readMemory(p2);
        }
    },
}

const lessThan: Operator = {
    numParams: 3,
    operate: ([p1, p2, p3], cpu) => {
        const val = cpu.readMemory(p1) < cpu.readMemory(p2);
        cpu.writeMemory(p3, val ? 1 : 0);
    },
}

const equals: Operator = {
    numParams: 3,
    operate: ([p1, p2, p3], cpu) => {
        const val = cpu.readMemory(p1) === cpu.readMemory(p2);
        cpu.writeMemory(p3, val ? 1 : 0);
    },
}

const terminate: Operator = {
    numParams: 0,
    operate: (_params, cpu) => {
        cpu.terminated = true;
    },
};

const AllOperators = new Map<number, Operator>([
    [1, add],
    [2, multiply],
    [3, read],
    [4, write],
    [5, jumpTrue],
    [6, jumpFalse],
    [7, lessThan],
    [8, equals],
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
