import Dimensions from "./Dimensions";
import { chunk } from "../utils/array";
import { Formatter } from "./colors";

export default class Image<PixelType> {
    constructor(public dimensions: Dimensions, public pixels: PixelType[], public formatter: Formatter<PixelType>) {}

    print() {
        const rows = chunk(this.pixels, this.dimensions.x);
        rows.map(this.formatter).forEach(line => console.log(line));
    }

    getValue(x: number, y: number): PixelType {
        return this.pixels[y * this.dimensions.x + x];
    }

    setValue(x: number, y: number, value: PixelType) {
        this.pixels[y * this.dimensions.x + x] = value;
    }

    static init<PixelType>(width: number, height: number, value: PixelType, formatter: Formatter<PixelType>) {
        return new Image<PixelType>({x: width, y: height}, Array(width * height).fill(value), formatter);
    };

    static clone<PixelType>(orig: Image<PixelType>) {
        return new Image<PixelType>({...orig.dimensions}, [...orig.pixels], orig.formatter);
    }
}
