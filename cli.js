const COLOURS = [
    ["White",   0xFFFFFF],
    ["Black",   0x000000],
    ["Red",     0xFF0000],
    ["Green",   0x00FF00],
    ["Blue",    0x0000FF],
    ["Cyan",    0x00FFFF],
    ["Magenta", 0xFF00FF],
    ["Yellow",  0xFFFF00],
];
const NAMES = COLOURS.map(col => col[0].toLowerCase());
export default function(line) {
    const input = new Cursor(line);
    try {
        const cmd = word(input);
        switch (cmd) {
            case "set":
                const [x, y, colouri] = list([num("x"), num("y"), choose("colour", NAMES)])(input);
                return { name: "set", x, y, colour: COLOURS[colouri][1] };
            case "": return e("use a command here: try `set <x> <y> <colour>`", 0, 1);
            default: return e("unknown command", input.index, cmd.length);
        }
    } catch (e) {
        return e;
    }
}
const list = params => input => params.map(param => param(input));
// parse an argument matching one of the `choices`
// returns the index of choices that was found
const choose = (name, choices) => input => {
    const w = word(input).toLowerCase();
    const i = choices.findIndex(choice => w === choice);
    return i === -1 ? e(`expected \`${name}\` to be one of ${choices}`, input.index, w.length) : i;
};
// parse a number argument
const num = name => input => {
    const w = word(input);
    const n = parseInt(w, 10);
    return isNaN(n) ? e(`expected number for \`${name}\``, input.index, w.length) : n;
}
// parse a \s*(\S+) from input
function word(input) {
    input.skip_matching(is_whitespace)
    const i = input.index;
    input.skip_matching(c => !is_whitespace(c))
    return input.buffer.slice(i, input.index).toString("utf8");
}
const is_whitespace = n => n === 32 || n === 10 || n === 13;

// Parsing helper code

function e(s, end, length) {
    const err = Error(s);
    err.end = end;
    err.length = length;
    throw err;
}
// tracks the offset into the input buffer, to allow errors to point at user input
class Cursor {
    constructor(buffer) {
        this.buffer = buffer;
        this.index = 0;
    }
    skip_matching(predicate) {
        while (this.index < this.buffer.length && predicate(this.buffer[this.index])) this.index++;
    }
}