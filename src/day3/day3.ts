import { readFileSync } from 'fs';

const FILENAME = 'src/day3/test1.txt';

const inputLines = readFileSync(FILENAME).toString().trim().split('\n');

type Heading = 'U' | 'D' | 'R' | 'L';

interface Segment {
    heading: Heading;
    distance: number;
}

const parseSegment = (s: string): Segment =>  ({
    heading: s[0] as Heading,
    distance: Number(s.substr(1)),
});

const parseWire = (s: string): Wire => s.trim().split(',').map(parseSegment);

type Wire = Segment[];

const wires = inputLines.map(parseWire);

console.log(inputLines, wires);