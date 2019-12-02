import { readFileSync } from 'fs';

const FILENAME = 'src/day2/input.txt';

const inputText = readFileSync(FILENAME).toString().trim();
const program = inputText.split(',').map(Number);

program[1] = 12;
program[2] = 2;

type AccessType = 'operator' | 'read' | 'write';
enum Operator {
    addition = 1,
    multiplication = 2,
    terminate = 99,
}

let state: ProgramState = { position: 0, terminated: false };

const checkBounds = (idx: number, accessType: AccessType) => {
    if (idx < 0 || idx >= program.length) {
        throw new Error(`Attempted ${accessType} access at position ${idx} (program at ${state.position})`);
    }
}

function assertIsOperator(n: number): asserts n is Operator {
    if (!Object.values(Operator).includes(n)) {
        throw new Error(`Unknown command: ${n}`);
    }
};

interface ProgramState {
    position: number;
    terminated: boolean;
}

const doAddition = (position: number) => {
    arity2(position, (x, y) => x + y);
}

const doMultiplication = (position: number) => {
    arity2(position, (x, y) => x * y);
}

const arity2 = (position: number, operator: (n1: number, n2: number) => number) => {
    checkBounds(position + 1, 'operator');
    checkBounds(position + 2, 'operator');
    checkBounds(position + 3, 'operator');
    const idx1 = program[position + 1];
    const idx2 = program[position + 2];
    const idxTarget = program[position + 3];

    checkBounds(idx1, 'read');
    checkBounds(idx2, 'read');
    const n1 = program[idx1];
    const n2 = program[idx2];
    const result = operator(n1, n2);
    checkBounds(idxTarget, 'write');
    program[idxTarget] = result;
}

const runStep = (initial: ProgramState): ProgramState => {
    const { position, terminated } = initial;
    if (terminated) {
        throw new Error('Trying to run an already terminated program');
    }
    checkBounds(position, 'operator');
    const operator = program[initial.position];
    assertIsOperator(operator);
    switch (operator) {
        case Operator.addition:
            doAddition(position);
            break;
        case Operator.multiplication:
            doMultiplication(position);
            break;
        case Operator.terminate:
            return { ...initial, terminated: true };
    }
    return { position: position + 4, terminated: false };
} 

console.log('Input', program);
while (!state.terminated) {
    state = runStep(state);
}
console.log('Final state', program);