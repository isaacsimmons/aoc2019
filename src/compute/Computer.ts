import { parseOperator } from './operators';
import Memory from './Memory';
import Buffer from './Buffer';

export type Status = 'running' | 'waiting' | 'terminated';
export type Mode = 'position' | 'immediate' | 'relative';
export interface Parameter {
    num: number;
    mode: Mode;
}

export default class Computer {
    address: number = 0;
    status: Status = 'running';

    readonly output = new Buffer<number>();
    readonly inputSeed = new Buffer<number>();
    input: Buffer<number> | undefined;

    readonly memory: Memory;

    constructor(program: number[], inputSeed: number[] = [], input: Buffer<number> | undefined = undefined) {
        this.memory = new Memory(program);
        this.inputSeed = new Buffer(inputSeed);
        this.input = input;
    }

    runStep() {
        if (this.status === 'terminated') {
            throw new Error('Tried to runStep() when terminated');
        }

        this.status = 'running';

        const opCode = this.memory.read({ num: this.address, mode: 'position' });
        const { operator, paramModes } = parseOperator(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }
        const paramValues = this.memory.readParams(this.address, operator.numParams);
        const params = paramValues.map((value, idx):Parameter => ({num: value, mode: paramModes[idx]}));

        // Run the current operator
        const { changeBase, newStatus, newAddress, writeAddresses } = operator.operate(params, this);
 
        if (newStatus === 'terminated') {
            this.output.close(); // TODO: maybe don't bother closing the stream? people can still read from it
            return 'terminated';
        } else if (newStatus === 'waiting') {
            return 'waiting';
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

    runUntilBlockedOrTerminated() {
        this.status = 'running';
        while(this.status === 'running') {
            this.status = this.runStep();
        }
    }

    async runUntilTerminated() {
        this.status = 'running';
        while(this.status !== 'terminated') {
            this.status = this.runStep();
            if (this.status === 'waiting') {
                await this.input!.waitAvailable();
                this.status = 'running';
            }
        }
    }
}
