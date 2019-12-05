import Memory from "./Memory";
import { parseOperator } from './operators';

export default class Computer {
    address: number = 0;
    terminated: boolean = false;
    readonly output: number[] = [];
    inputPosition = 0;

    constructor(readonly memory: Memory, readonly input: number[]) {}

    runStep() {
        const opCode = this.memory.read(this.address);
        const { operator, paramModes } = parseOperator(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }

        const params = this.memory.readMany(this.address + 1, operator.numParams);
        operator.operate(params, paramModes, this);

        // If we have overwritten the current instruction, leave the pointer where it is and don't advance
        const newOpCode = this.memory.read(this.address);
        if (newOpCode !== opCode) {
            return;
        }

        this.address += 1 + operator.numParams;
    }

    run() {
        // this.terminated = false;
        // this.inputPosition = 0;
        // this.output.splice(0, this.output.length);
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
}
