import { readInputFile } from '../utils/file';
import Computer from '../compute/Computer';
import Buffer from '../compute/Buffer';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);
const program = inputText.trim().split(',').map(Number);
const computer = new Computer(program);

type Heading = 'up' | 'right' | 'down' | 'left';

const turnLeft = (initial: Heading): Heading => {
    switch (initial) {
        case 'up':
            return 'left';
        case 'down':
            return 'right';
        case 'left':
            return 'down';
        case 'right':
            return 'up';
    }
};

const turnRight = (initial: Heading): Heading => {
    switch (initial) {
        case 'up':
            return 'right';
        case 'down':
            return 'left';
        case 'left':
            return 'up';
        case 'right':
            return 'down';
    }
};

let heading: Heading = 'up';
let x = 0;
let y = 0;

const whitePanels = new Set<string>();
const paintedPanels = new Set<string>();

const input = new Buffer<number>();
computer.input = input;


const goRun = async () => {
    computer.run();
    do {
        const key = `${x}_${y}`;
        const inputValue = whitePanels.has(key) ? 0 : 1;
        input.write(inputValue);
    
        // Paint current square
        let colorToPaint;
        try {
            colorToPaint = await computer.output.read();
        } catch (e) {
            console.log('Error reading color to paint');
            break;
        }
        paintedPanels.add(key);
        if (colorToPaint === 0) {
            // Paint black
            whitePanels.delete(key);
        } else if (colorToPaint === 1) {
            // Paint white
            whitePanels.add(key);
        } else {
            throw new Error('Unexpected paint color command');
        }
    
        // Turn
        let directionToTurn;
        try {
            directionToTurn = await computer.output.read();
        } catch (e) {
            console.log('Error reading direction to turn');
            break;
        }
        if (directionToTurn === 0) {
            heading = turnLeft(heading);
        } else if (directionToTurn === 1) {
            heading = turnRight(heading);
        } else {
            throw new Error('Unexpected turn command');
        }

        console.log(`(${x}, ${y}) paint ${colorToPaint === 1 ? 'white' : 'black'}, turn ${directionToTurn === 0 ? 'left' : 'right'}, facing ${heading}`)
    
        // Advance a space
        switch (heading) {
            case 'up':
                y--;
                break;
            case 'down':
                y++;
                break;
            case 'right':
                x++;
                break;
            case 'left':
                x--;
                break;
        }
        console.log(paintedPanels.size);
    } while (computer.status !== 'terminated');
    console.log('final', whitePanels);
}


goRun();



