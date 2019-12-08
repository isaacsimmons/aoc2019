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

    readonly memory: Memory;

    constructor(program: number[], inputSeed: number[] = [], input: Buffer<number> | undefined = undefined) {
        this.memory = new Memory(program);
        this.inputSeed = new Buffer(inputSeed);
        this.input = input;
    }

    async runStep() {
        const opCode = this.memory.read({ num: this.address, mode: 'position' });
        const { operator, paramModes } = parseOperator(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }
        const paramValues = this.memory.readParams(this.address, operator.numParams);
        const params = paramValues.map((value, idx):Parameter => ({num: value, mode: paramModes[idx]}));

        // Run the current operator
        const { terminate, newAddress, writeAddresses } = await operator.operate(params, this);
 
        if (terminate) {
            this.terminated = true;
            this.output.close();
        }

        // If we overwrote our current instruction, skip the usual advancement of the instruction pointer
        const currentAddressWasOverwritten = writeAddresses && writeAddresses.includes(this.address);
        if (!currentAddressWasOverwritten) {
            this.address += operator.numParams + 1;
        }

        if (newAddress !== undefined) {
            this.address = newAddress;
        }
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
}
