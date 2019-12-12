import { readInputFile } from '../utils/file';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

interface Position {
    x: number;
    y: number;
    z: number;
}

type Velocity = Position;

interface Moon {
    position: Position;
    velocity: Velocity;
}

type Moons = Moon[];

const lines = inputText.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);

const readPosition = (s: string): Position => {
    console.log(s.replace(/[^0-9-]/g, ' '));
    const coords = s.replace(/[^0-9-]/g, ' ').split(' ').map(s => s.trim()).filter(s => s.length > 0).map(Number);
    return {x: coords[0], y: coords[1], z: coords[2]};
}

const moons = lines.map(readPosition).map(position => ({position, velocity: {x: 0, y: 0, z: 0}} as Moon));


const updateVelocity = ({position: p1, velocity: v1}: Moon, {position: p2, velocity: v2}: Moon) => {
    // TODO: my type should be a n=3 array, not an {x, y, z} object
    if (p1.x > p2.x) {
        v1.x--;
        v2.x++;
    } else if (p1.x < p2.x) {
        v1.x++;
        v2.x--;
    }
    
    if (p1.y > p2.y) {
        v1.y--;
        v2.y++;
    } else if (p1.y < p2.y) {
        v1.y++;
        v2.y--;
    }
    
    if (p1.z > p2.z) {
        v1.z--;
        v2.z++;
    } else if (p1.z < p2.z) {
        v1.z++;
        v2.z--;
    }    
};

const move = (moon: Moon) => {
    // TODO: destructure position, velocity in fn param list
    moon.position.x += moon.velocity.x;
    moon.position.y += moon.velocity.y;
    moon.position.z += moon.velocity.z;
};

const moveAll = () => {
    moons.forEach(move);
}

const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
];

const energy = (vec: Position) => {
    return Math.abs(vec.x) + Math.abs(vec.y) + Math.abs(vec.z);
};

console.log(moons);
let i = 0;
console.log(0, moons);
for (i = 0; i < 1000; i++) {
    pairs.forEach(([m1, m2]) => updateVelocity(moons[m1], moons[m2]));
    moveAll();
    // console.log(i+1, moons);
}

let total = 0;
for(const moon of moons) {
    const pot = energy(moon.position);
    const kin = energy(moon.velocity);
    console.log('pot', pot, 'kin', kin);
    total += pot * kin;
}
console.log('total', total);