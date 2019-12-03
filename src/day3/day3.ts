import { readFileSync } from 'fs';

const FILENAME = 'src/day3/input.txt';

const inputLines = readFileSync(FILENAME).toString().trim().split('\n');

type Heading = 'U' | 'D' | 'R' | 'L';

interface Instruction {
    heading: Heading;
    distance: number;
}

const parseInstruction = (s: string): Instruction =>  ({
    heading: s[0] as Heading,
    distance: Number(s.substr(1)),
});

const parseInstructions = (s: string): Instruction[] => s.trim().split(',').map(parseInstruction);

const instructions = inputLines.map(parseInstructions);

console.log(inputLines, instructions);

interface Point {
    x: number;
    y: number;
}

interface Segment {
    start: Point;
    end: Point;
}

const intersects = (s1: Segment, s2: Segment): Point|null => {
    const intersectXMin = Math.max(s1.start.x, s2.start.x);
    const intersectXMax = Math.min(s1.end.x, s2.end.x);
    if (intersectXMin > intersectXMax) {
        return null;
    }

    const intersectYMin = Math.max(s1.start.y, s2.start.y);
    const intersectYMax = Math.min(s1.end.y, s2.end.y);
    if (intersectYMin > intersectYMax) {
        return null;
    }

    return { x: intersectXMin, y: intersectYMin };
}

const move = (initial: Point, { heading, distance }: Instruction): Point => {
    switch (heading) {
        case 'D':
            return { ...initial, y: initial.y - distance };
        case 'U':
            return { ...initial, y: initial.y + distance };
        case 'R':
            return { ...initial, x: initial.x + distance };
        case 'L':
            return { ...initial, x: initial.x - distance };
    }
}

const makeSegment = (p1: Point, p2: Point, heading: Heading): Segment => {
    switch (heading) {
        case 'U':
        case 'R':
            return { start: p1, end: p2 };
        case 'D':
        case 'L':
            return { start: p2, end: p1 };
    }
};

const buildWire = (instructions: Instruction[]): Segment[] => {
    const segments: Segment[] = [];
    let currentPoint: Point = { x: 0, y: 0 };
    for (const instruction of instructions) {
        // TODO: drop any with instruction.distance = 0?
        const nextPoint = move(currentPoint, instruction);
        segments.push(makeSegment(currentPoint, nextPoint, instruction.heading));
        currentPoint = nextPoint;
    }
    return segments;
}

const wires = instructions.map(buildWire);
console.log(JSON.stringify(wires));

const intersections: Point[] = [];
const [wire1, wire2] = wires;
for (const segment1 of wire1) {
    for (const segment2 of wire2) {
        const intersection = intersects(segment1, segment2);
        if (intersection) {
            intersections.push(intersection);
        }
    }
}

const distanceOrigin = (p: Point): number => {
    return Math.abs(p.x) + Math.abs(p.y)
}

console.log('intersections', intersections);
const intersectionDistances = intersections.map(distanceOrigin).filter(x => x > 0);
const shortest = Math.min(...intersectionDistances);
console.log('Closest intersection distance', shortest);