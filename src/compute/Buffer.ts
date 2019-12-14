interface DeferredRead<T> {
    resolve: (val: T) => void;
    reject: (err: Error) => void;
}

export default class Buffer<T> {
    buff: T[];
    closed = false;
    position = 0;

    private pendingWaits: DeferredRead<void>[] = [];

    constructor(init: T[] = []) {
        this.buff = [...init];
    }

    close() {
        this.closed = true;
        this.pendingWaits.forEach(pw => pw.resolve());
    }

    get hasData() {
        return this.position < this.buff.length;
    }

    readSync() {
        if (this.closed) {
            throw new Error('Tried to read (sync) from closed buffer');
        }

        const val = this.buff[this.position++];
        if (val === undefined) {
            throw new Error('Executed synchronous read when no data was available');
        }
        return val;
    }

    async read(): Promise<T> {
        await this.waitAvailable();
        return this.readSync();
    }

    // async readUntilClosed(): Promise<T[]> {
    // }

    async waitAvailable(): Promise<void> {
        if (this.closed) {
            throw new Error('Tried to read from closed buffer');
        }

        if (this.hasData) {
            return;
        }

        return new Promise<void>((resolve, reject) => {
            this.pendingWaits.push({ resolve, reject });
        });
    }

    write(...val: T[]) {
        if (this.closed) {
            throw new Error('Tried to write to closed buffer');
        }

        this.buff.push(...val);
        this.pendingWaits.forEach(pw => pw.resolve());
    }

    flush(): T[] {
        const vals = this.buff.slice(this.position);
        this.position = this.buff.length;
        return vals;
    }

    // TODO: a pipe this buffer to this other buffer method?
}
