import Layer from "./Layer";
import { chunk } from "../utils/array";
import Dimensions from "./Dimensions";

export const readSif = (raw: string): SpaceImageFormat => {
    const lines = raw.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length !== 2) {
        throw new Error('SIF files should have 2 lines');
    }
    const dimensions = lines[0].split('x').map(Number);
    if (dimensions.length !== 2) {
        throw new Error('SIF dimensions should be #x#');
    }
    return new SpaceImageFormat({x: dimensions[0], y: dimensions[1]}, lines[1].split(''));
};

export default class SpaceImageFormat {
    layers: Layer[];

    constructor(public dimensions: Dimensions, imagePixels: string[]) {
        this.layers = chunk(imagePixels, dimensions.x * dimensions.y).map(layerPixels => new Layer(dimensions, layerPixels));
    }

    flatten(): Layer {
        // Make a copy of the top layer to mutate
        const result = new Layer(this.dimensions, [...this.layers[0].pixels]);

        // Merge successive layers into it
        for (let i = 1; i < this.layers.length; i++) {
            const changed = result.merge(this.layers[i]);
            if (!changed) {
                // Stop merging layers once we're out of transparent ones
                break;
            }
        }
        return result;
    }
}
