import Dimensions from "./Dimensions";
import { chunk } from "../utils/array";
import { Formatter } from "./colors";

// TODO: template on pixel type
export default class Layer {
    static readonly TRANSPARENT = '2'; // TODO: belongs in SIF

    constructor(public dimensions: Dimensions, public pixels: string[]) {}

    print(formatter: Formatter) {
        const rows = chunk(this.pixels, this.dimensions.x);
        rows.map(formatter).forEach(line => console.log(line));
    }

    getValue(x: number, y: number): string {
        return this.pixels[y * this.dimensions.x + x];
    }

    setValue(x: number, y: number, value: string) {
        this.pixels[y * this.dimensions.x + x] = value;
    }

    // Merges another layer behind the current one
    // Mutates the object!
    // TODO: this belongs in SIF
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

    static init(width: number, height: number, value: string = '0') {
        return new Layer({x: width, y: height}, Array(width * height).fill(value));
    };
}
