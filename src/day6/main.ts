import { readInputFile } from '../utils/file';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const inputTuples = inputText.split('\n').map((line) => line.trim().split(')') as [string, string]);

const orbits = new Map<string, string>();
const orbitedBy = new Map<string, Set<string>>();
inputTuples.forEach(([parent, child]) => {
    if (orbits.get(child)) {
        throw new Error(`${child} orbits about multiple objects`);
    }
    orbits.set(child, parent);

    let s = orbitedBy.get(parent);
    if (s === undefined) {
        s = new Set<string>([child]);
        orbitedBy.set(parent, s);
    } else {
        s.add(child);
    }
});

// Build an ordered array such that every object has all of its children to its right
let currentChildren = ['COM'];
const orderedObjects: string[] = [];
do {
    orderedObjects.push(...currentChildren);
    const newChildren = new Set<string>(currentChildren
        .map(obj => orbitedBy.get(obj))
        .map(s => s ? Array.from(s.values()): [])
        .flat()
    );
    currentChildren = Array.from(newChildren.values());
} while (currentChildren.length);

// Count up all transitive children starting from the leaves
const orbitCount = new Map<string, number>();
for (const obj of orderedObjects) {
    if (obj === 'COM') {
        orbitCount.set(obj, 0);
        continue;
    }

    const parent = orbits.get(obj);
    if (parent === undefined) {
        throw new Error(`Object ${obj} orbits nothing?`);
    }
    const parentCount = orbitCount.get(parent);
    if (parentCount === undefined) {
        throw new Error(`Tried to count orbits of ${obj}'s parent ${parent}, but that isn't stored`);
    }

    orbitCount.set(obj, parentCount + 1);
}

// console.log('counts', orbitCount);
const totalOrbits = Array.from(orbitCount.values()).reduce((sum, x) => sum + x);
console.log(totalOrbits);

