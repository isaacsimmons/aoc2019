interface DeferredRead<T> {
    resolve: (val: T) => void;
    reject: (err: Error) => void;
}

export default class Buffer<T> {
    buff: T[];
    closed = false;
    position = 0;

    private pendingReads: DeferredRead<T>[] = [];

    constructor(init: T[] = []) {
        this.buff = [...init];
    }

    close() {
        this.closed = true;
        this.pendingReads.forEach(pendingRead => pendingRead.reject(new Error('Tried to read past end of buffer')));
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
        if (this.closed) {
            throw new Error('Tried to read from closed buffer');
        }

        if (this.hasData) {
            return this.readSync();
        }

        return new Promise<T>((resolve, reject) => {
            this.pendingReads.push({ resolve, reject });
        });
    }

    write(...val: T[]) {
        if (this.closed) {
            throw new Error('Tried to write to closed buffer');
        }

        this.buff.push(...val);
        while (this.pendingReads.length && this.hasData) {
            this.pendingReads.shift()!.resolve(this.readSync());
        }
    }

    flush(): T[] {
        if (!this.closed) {
            throw new Error('Tried to flush a non-closed buffer');
        }
        const vals = this.buff.slice(this.position);
        this.position = this.buff.length;
        return vals;
    }

    // TODO: a write batch method?
    // TODO: a pipe this buffer to this other buffer method?
}
