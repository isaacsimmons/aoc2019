import { parseOperator } from './operators';
import Memory from './Memory';

export type Mode = 'position' | 'immediate';
export interface Parameter {
    num: number;
    mode: Mode;
}

export default class Computer {
    address: number = 0;
    terminated: boolean = false;
    paused: boolean = false;
    readonly output: number[] = [];
    inputPosition = 0;
    outputPosition = 0;
    readonly memory: Memory;

    constructor(program: number[], readonly input: number[]) {
        this.memory = new Memory(program);
    }

    runStep() {
        const opCode = this.memory.read(this.address);
        const { operator, paramModes } = parseOperator(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }
        const paramValues = this.memory.readParams(this.address, operator.numParams);
        const params = paramValues.map((value, idx):Parameter => ({num: value, mode: paramModes[idx]}));

        operator.operate(params, this);

        if (this.paused) {
            return;
        }

        // If we have overwritten the current instruction, leave the pointer where it is and don't advance
        const newOpCode = this.memory.read(this.address);
        if (newOpCode !== opCode) {
            return;
        }
        this.address += 1 + operator.numParams;
    }

    run() {
        this.paused = false;
        while (!this.terminated && !this.paused) {
            this.runStep();
        }
    }

    readInput() {
        if (this.inputPosition >= this.input.length) {
            this.paused = true;
            return;
        }
        return this.input[this.inputPosition++];
    }

    writeInput(val: number) {
        this.input.push(val);
    }

    readOutput() {
        if (this.output.length > this.outputPosition) {
            this.outputPosition++;
            return this.output[this.outputPosition - 1];
        }
        return undefined;
    }

    writeOutput(val: number) {
        this.output.push(val);
    }

    readMemory({num, mode}: Parameter) {
        return mode === 'immediate' ? num : this.memory.read(num);
    }

    writeMemory({num, mode}: Parameter, val: number) {
        if (mode === 'immediate') {
            throw new Error('Tried to store result in immediate mode');
        }
        this.memory.write(num, val);
    }
}
