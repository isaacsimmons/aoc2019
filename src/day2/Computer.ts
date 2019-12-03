import Memory from "./memory";
import { AllOperators } from "./operators";

export default class Computer {
    address: number = 0;
    terminated: boolean = false;

    constructor(readonly memory: Memory) {}

    runStep() {
        const opCode = this.memory.read(this.address);
        const operator = AllOperators.get(opCode);
        if (!operator) {
            throw new Error(`Unknown opCode ${opCode} at address ${this.address}`)
        }

        const params = this.memory.readMany(this.address + 1, operator.numParams);
        this.terminated = operator.operate(params, this.memory);
        this.address += 1 + operator.numParams;
    }

    run () {
        while (!this.terminated) {
            this.runStep();
        }
    }
}
