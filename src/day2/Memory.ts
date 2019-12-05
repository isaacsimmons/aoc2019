export default class Memory {
    readonly memory: number[];

    constructor(memory: number[]) {
        this.memory = [...memory];
    }

    read(address: number): number {
        const val = this.memory[address];
        if (val === undefined) {
            throw new Error(`Out of bounds: Attempted to read from address ${address}`);
        }
        return val;
    }

    write(address: number, val: number) {
        if (address < 0 || address >= this.memory.length) {
            throw new Error(`Out of bounds: Attempted to write to address ${address}`);
        }
        this.memory[address] = val;
    }

    readMany(address: number, length: number): number[] {
        if (address < 0 || address > this.memory.length || length < 0 || address + length >= this.memory.length) {
            throw new Error(`Out of bounds: Attempted to read range from address ${address}:${length}`);
        }
        return this.memory.slice(address, address + length);
    }
}
