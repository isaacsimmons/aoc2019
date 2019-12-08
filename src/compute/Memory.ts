import { Parameter } from "./Computer";

export default class Memory {
    readonly memory: number[];

    constructor(memory: number[]) {
        this.memory = [...memory];
    }

    read({num, mode}: Parameter): number {
        if (mode === 'immediate') {
            return num;
        }

        const val = this.memory[num];
        if (val === undefined) {
            throw new Error(`Out of bounds: Attempted to read from address ${num}`);
        }
        return val;
    }

    write({num, mode}: Parameter, val: number) {
        if (mode === 'immediate') {
            throw new Error('Tried to store result in immediate mode');
        }
        if (num < 0 || num >= this.memory.length) {
            throw new Error(`Out of bounds: Attempted to write to address ${num}`);
        }
        this.memory[num] = val;
    }

    readParams(address: number, length: number): number[] {
        if (address < 0 || address >= this.memory.length || length < 0 || address + length >= this.memory.length) {
            throw new Error(`Out of bounds: Attempted to read range from address ${address}:${length}`);
        }
        return this.memory.slice(address + 1, address + length + 1);
    }
}
