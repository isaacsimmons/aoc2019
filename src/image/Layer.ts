import Dimensions from "./Dimensions";
import { chunk } from "../utils/array";

const COLOR_RESET = '\x1b[0m';

// More colors here: https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
const COLOR_ESCAPE: {[key: string]: string} = {
    '0': '\x1b[40;37m', // BLACK: black bg, white fg
    '1': '\x1b[107;90m', // WHITE: bright white bg, bright black fg
    '2': '\x1b[97;101m', // TRANSPARENT: red bg, bright white fg
};

const colorize = (pixel: string) => (COLOR_ESCAPE[pixel] || COLOR_RESET) + pixel;

export default class Layer {
    static readonly TRANSPARENT = '2';

    constructor(public dimensions: Dimensions, public pixels: string[]) {}

    print() {
        const rows = chunk(this.pixels, this.dimensions.x);
        for (const row of rows) {
            console.log(row.map(colorize).join('') + COLOR_RESET);
        }
    }

    // Merges another layer behind the current one
    // Mutates the object!
    merge(background: Layer) {
        let anyTransparent = false;
        this.pixels.forEach((pixel, idx) => {
            if (pixel === Layer.TRANSPARENT) {
                anyTransparent = true;
                this.pixels[idx] = background.pixels[idx];
            }
        });
        return anyTransparent;
    }
}
