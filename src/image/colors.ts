export type Formatter<PixelType> = (row: PixelType[]) => string;

export const COLOR_RESET = '\x1b[0m';

// More colors here: https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
const BLK_WHT_TRANS: {[key: string]: string} = {
    '0': '\x1b[40;37m', // BLACK: black bg, white fg
    '1': '\x1b[107;90m', // WHITE: bright white bg, bright black fg
    '2': '\x1b[97;101m', // TRANSPARENT: red bg, bright white fg
};

// More shapes here: https://en.wikipedia.org/wiki/Geometric_Shapes
const BREAKOUT_BLOCKS: {[key: number]: string} = {
    0: ' ', // Empty
    1: '■', // Wall
    2: '□', // Block
    3: '=', // Paddle
    4: '○', // Ball
};

export const BLACK_AND_WHITE: Formatter<string> = (row: string[]) => {
    return row.map(pixel => (BLK_WHT_TRANS[pixel] || COLOR_RESET) + pixel).join('') + COLOR_RESET;
}
export const BREAKOUT_BOARD: Formatter<number> = (row: number[]) => {
    return row.map(pixel => BREAKOUT_BLOCKS[pixel] || pixel).join('');
};