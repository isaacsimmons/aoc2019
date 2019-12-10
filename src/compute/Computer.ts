import { parseOperator } from './operators';
import Memory from './Memory';
import Buffer from './Buffer';

export type Status = 'init' | 'running' | 'terminated';
export type Mode = 'position' | 'immediate' | 'relative';
export interface Parameter {
    num: number;
    mode: Mode;
}

export default class Computer {
    address: number = 0;
    status: Status = 'init';

    readonly output = new Buffer<number>();
    readonly inputSeed = new Buffer<number>();
    input: Buffer<number> | undefined;

    readonly memory: Memory;

    constructor(program: number[], inputSeed: number[] = [], input: Buffer<number> | undefined = undefined) {
        this.memory = new Memory(program);
        this.inputSeed = new Buffer(inputSeed);
        this.input = input;
    }

    async runStep() {
        if (this.status !== 'running') {
            throw new Error('Tried to runStep() when not in running state');
        }

        const opCode = this.memory.read({ num: this.address, mode: 'position' });
        const { operator, paramModes } = parseOperator(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }
        const paramValues = this.memory.readParams(this.address, operator.numParams);
        const params = paramValues.map((value, idx):Parameter => ({num: value, mode: paramModes[idx]}));

        // Run the current operator
        const { changeBase, terminate, newAddress, writeAddresses } = await operator.operate(params, this);
        // TODO: just let the operator mess with the computer directly?
 
        if (terminate) {
            this.output.close();
            return 'terminated';
        }

        if (changeBase) {
            this.memory.changeBase(changeBase);
        }

        // If we overwrote our current instruction, skip the usual advancement of the instruction pointer
        const currentAddressWasOverwritten = writeAddresses && writeAddresses.includes(this.address);
        if (!currentAddressWasOverwritten) {
            this.address += operator.numParams + 1;
        }

        if (newAddress !== undefined) {
            this.address = newAddress;
        }
        return 'running';
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
        if (this.status !== 'init') {
            throw new Error('Called run multiple times on computer');
        }
        this.status = 'running';
        while(this.status !== 'terminated') {
            this.status = await this.runStep();
        }
    }
}
