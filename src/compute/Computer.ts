import { parseOperator } from './operators';
import Memory from './Memory';
import Buffer from './Buffer';

export type Mode = 'position' | 'immediate';
export interface Parameter {
    num: number;
    mode: Mode;
}
// export type State = 'init' | 'running' | 'terminated'; // TODO: replace this.terminated with a "state" instead?

export default class Computer {
    address: number = 0;
    terminated: boolean = false;
    readonly output = new Buffer<number>();
    readonly inputSeed = new Buffer<number>();
    input: Buffer<number> | undefined;
//    lastWriteAddress: number|null = null;
//    inputPosition = 0;
//    outputPosition = 0;
    readonly memory: Memory;

    constructor(program: number[], inputSeed: number[] = [], input: Buffer<number> | undefined = undefined) {
        this.memory = new Memory(program);
        this.inputSeed = new Buffer(inputSeed);
        this.input = input;
    }

    async runStep() {
        const opCode = this.memory.read(this.address);
        const { operator, paramModes } = parseOperator(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }
        const paramValues = this.memory.readParams(this.address, operator.numParams);
        const params = paramValues.map((value, idx):Parameter => ({num: value, mode: paramModes[idx]}));

        await operator.operate(params, this);

        // If we have overwritten the current instruction, leave the pointer where it is and don't advance
        // TODO: use lastWriteAddress instead (actually, that should just be a return value from operate())
        const newOpCode = this.memory.read(this.address);
        if (newOpCode !== opCode) {
            return;
        }
        this.address += 1 + operator.numParams;
    }

    async readInput() {
        if (this.inputSeed.hasData) {
            return this.inputSeed.readSync();
        }

        if (this.input === undefined) {
            throw new Error('Tried to read past input seed with no input stream');
        }

        return this.input.read();
    }

    async run() {
        while(!this.terminated) {
            await this.runStep();
        }
    }

    async readOutput() {
        // TODO: remove this function?
        return this.output.read();
    }

    writeOutput(val: number) {
        // TODO: remove this function?
        this.output.write(val);
    }

    readMemory({num, mode}: Parameter) {
        // TODO: push this param logic into Memory?
        return mode === 'immediate' ? num : this.memory.read(num);
    }

    writeMemory({num, mode}: Parameter, val: number) {
        // TODO: push this param logic into Memory?
        if (mode === 'immediate') {
            throw new Error('Tried to store result in immediate mode');
        }
        this.memory.write(num, val);
    }
}
