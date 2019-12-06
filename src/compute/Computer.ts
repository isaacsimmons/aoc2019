import { parseOperator } from './operators';

export default class Computer {
    address: number = 0;
    terminated: boolean = false;
    readonly output: number[] = [];
    inputPosition = 0;

    constructor(readonly memory: number[], readonly input: number[]) {}

    runStep() {
        const opCode = this.readMemory(this.address);
        const { operator, paramModes } = parseOperator(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }

        const params = this.readManyMemory(this.address + 1, operator.numParams);
        operator.operate(params, paramModes, this);

        // If we have overwritten the current instruction, leave the pointer where it is and don't advance
        const newOpCode = this.readMemory(this.address);
        if (newOpCode !== opCode) {
            return;
        }

        this.address += 1 + operator.numParams;
    }

    run() {
        while (!this.terminated) {
            this.runStep();
        }
    }

    readInput() {
        if (this.inputPosition >= this.input.length) {
            throw new Error('Tried to read past end of input');
        }
        return this.input[this.inputPosition++];
    }

    writeOutput(val: number) {
        this.output.push(val);
    }

    readMemory(address: number): number {
        const val = this.memory[address];
        if (val === undefined) {
            throw new Error(`Out of bounds: Attempted to read from address ${address}`);
        }
        return val;
    }

    writeMemory(address: number, val: number) {
        if (address < 0 || address >= this.memory.length) {
            throw new Error(`Out of bounds: Attempted to write to address ${address}`);
        }
        this.memory[address] = val;
    }

    readManyMemory(address: number, length: number): number[] {
        if (address < 0 || address > this.memory.length || length < 0 || address + length > this.memory.length) {
            throw new Error(`Out of bounds: Attempted to read range from address ${address}:${length}`);
        }
        return this.memory.slice(address, address + length);
    }
}
