import { Parameter } from "./Computer";

export default class Memory {
    readonly memory: number[];
    relativeBase: number = 0;

    constructor(memory: number[]) {
        this.memory = [...memory];
    }

    read({num, mode}: Parameter): number {
        if (mode === 'immediate') {
            return num;
        }

        const address = mode === 'relative' ? this.relativeBase + num : num;

        if (address < 0) {
            throw new Error(`Out of bounds: Attempted to read from address ${address}`);
        }

        return this.memory[address] || 0;
    }

    write({num, mode}: Parameter, val: number) {
        if (mode === 'immediate') {
            throw new Error('Tried to store result in immediate mode');
        }

        const address = mode === 'relative' ? this.relativeBase + num : num;
        if (address < 0) {
            throw new Error(`Out of bounds: Attempted to write to address ${address}`);
        }
        this.memory[address] = val;
    }

    readParams(address: number, length: number): number[] {
        if (address < 0 || address >= this.memory.length || length < 0 || address + length >= this.memory.length) {
            // TODO: not sure if parameters should be readable out of bounds or not??
            throw new Error(`Out of bounds: Attempted to read range from address ${address}:${length}`);
        }
        return this.memory.slice(address + 1, address + length + 1);
    }

    changeBase(delta: number) {
        this.relativeBase += delta;
    }
}
