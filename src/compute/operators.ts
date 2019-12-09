import Computer, { Parameter, Mode } from "./Computer";

export interface OperatorResult {
    terminate?: true;
    writeAddresses?: number[];
    newAddress?: number;
    changeBase?: number;
}

export interface Operator {
    numParams: number;
    operate: (params: Parameter[], computer: Computer) => Promise<OperatorResult>;
}

const add: Operator = {
    numParams: 3,
    operate: async ([p1, p2, p3], cpu) => {
        const result = cpu.memory.read(p1) + cpu.memory.read(p2);
        cpu.memory.write(p3, result);
        return { writeAddresses: [p3.num] };
    },
};

const multiply: Operator = {
    numParams: 3,
    operate: async ([p1, p2, p3], cpu) => {
        const result = cpu.memory.read(p1) * cpu.memory.read(p2);
        cpu.memory.write(p3, result);
        return { writeAddresses: [p3.num] };
    },
};

const read: Operator = {
    numParams: 1,
    operate: async ([p1], cpu) => {
        cpu.memory.write(p1, await cpu.readInput());
        return {};
    },
};

const write: Operator = {
    numParams: 1,
    operate: async ([p1], cpu) => {
        cpu.output.write(cpu.memory.read(p1));
        return {};
    },
};

const jumpTrue: Operator = {
    numParams: 2,
    operate: async ([p1, p2], cpu) => {
        if (cpu.memory.read(p1) !== 0) {
            return { newAddress: cpu.memory.read(p2) };
        }
        return {};
    },
};

const jumpFalse: Operator = {
    numParams: 2,
    operate: async ([p1, p2], cpu) => {
        if (cpu.memory.read(p1) === 0) {
            return { newAddress: cpu.memory.read(p2) };
        }
        return {};
    },
};

const lessThan: Operator = {
    numParams: 3,
    operate: async ([p1, p2, p3], cpu) => {
        const val = cpu.memory.read(p1) < cpu.memory.read(p2);
        cpu.memory.write(p3, val ? 1 : 0);
        return { writeAddresses: [p3.num] };
    },
};

const equals: Operator = {
    numParams: 3,
    operate: async ([p1, p2, p3], cpu) => {
        const val = cpu.memory.read(p1) === cpu.memory.read(p2);
        cpu.memory.write(p3, val ? 1 : 0);
        return { writeAddresses: [p3.num] };
    },
};

const adjustBase: Operator = {
    numParams: 1,
    operate: async ([p1], cpu) => {
        const val = cpu.memory.read(p1);
        return { changeBase: val };
    },
};

const terminate: Operator = {
    numParams: 0,
    operate: async (_params, _cpu) => {
        return { terminate: true };
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
    [9, adjustBase],
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
            case 2:
                paramModes.push('relative');
                break;
            default:
                throw new Error(`Unexpected parameter mode found in ${opCode}`);
        }
        remainder -= digit;
        remainder /= 10;
    }

    return { operator, paramModes };
};
