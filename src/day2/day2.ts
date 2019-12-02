import { readFileSync } from 'fs';

const FILENAME = 'src/day2/input.txt';

const inputText = readFileSync(FILENAME).toString().trim();
const memory = inputText.split(',').map(Number);

memory[1] = 12;
memory[2] = 2;

type AccessType = 'operator' | 'read' | 'write';
enum OpCode {
    addition = 1,
    multiplication = 2,
    terminate = 99,
}

let state: ProgramState = { address: 0, terminated: false };

const checkBounds = (address: number, accessType: AccessType) => {
    if (address < 0 || address >= memory.length) {
        throw new Error(`Attempted ${accessType} access at position ${address} (program at ${state.address})`);
    }
}

function assertIsOperator(n: number): asserts n is OpCode {
    if (!Object.values(OpCode).includes(n)) {
        throw new Error(`Unknown command: ${n}`);
    }
};

interface ProgramState {
    address: number;
    terminated: boolean;
}

const doAddition = (address: number) => {
    arity2(address, (x, y) => x + y);
}

const doMultiplication = (address: number) => {
    arity2(address, (x, y) => x * y);
}

const arity2 = (address: number, operator: (n1: number, n2: number) => number) => {
    checkBounds(address + 1, 'operator');
    checkBounds(address + 2, 'operator');
    checkBounds(address + 3, 'operator');
    const idx1 = memory[address + 1];
    const idx2 = memory[address + 2];
    const idxTarget = memory[address + 3];

    checkBounds(idx1, 'read');
    checkBounds(idx2, 'read');
    const n1 = memory[idx1];
    const n2 = memory[idx2];
    const result = operator(n1, n2);
    checkBounds(idxTarget, 'write');
    memory[idxTarget] = result;
}

const runStep = (initial: ProgramState): ProgramState => {
    const { address, terminated } = initial;
    if (terminated) {
        throw new Error('Trying to run an already terminated program');
    }
    checkBounds(address, 'operator');
    const operator = memory[initial.address];
    assertIsOperator(operator);
    switch (operator) {
        case OpCode.addition:
            doAddition(address);
            break;
        case OpCode.multiplication:
            doMultiplication(address);
            break;
        case OpCode.terminate:
            return { ...initial, terminated: true };
    }
    return { address: address + 4, terminated: false };
} 

console.log('Input', memory);
while (!state.terminated) {
    state = runStep(state);
}
console.log('Final state', memory);