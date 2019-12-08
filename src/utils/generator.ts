export const filtered = function *filtered<T>(source: Generator<T>, filter: (value: T) => boolean) {
    for (const candidate of source) {
        if (filter(candidate)) {
            yield candidate;
        }
    }
};

export const combined = function *combined<T>(sources: Generator<T>[]) {
    for (const source of sources) {
        yield* source;
    }
}
