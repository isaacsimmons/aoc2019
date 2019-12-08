import Dimensions from "./Dimensions";
import { chunk } from "../utils/array";

export default class Layer {
    static readonly TRANSPARENT = '2';

    constructor(public dimensions: Dimensions, public pixels: string[]) {}

    print() {
        const rows = chunk(this.pixels, this.dimensions.x);
        for (const row of rows) {
            console.log(row.map(digit => digit === '1' ? 'X' : ' ').join(''));
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
