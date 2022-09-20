import jpeg from "jpeg-js";

// Create a bytebuffer of RGBA values to store the canvas
const SIZE = 24;
const data = Buffer.alloc(SIZE * SIZE * 4);
let cached_jpeg = make_jpeg(data);

export default {
    set_colour(x, y, colour) {
        console.log(x, y, colour);
        data.writeInt32LE(colour << 8 | 0xFF, 4 * (x + y * SIZE));
        cached_jpeg = make_jpeg(data);
    },
    pipe_canvas_jpeg(writable) {
        writable.end(cached_jpeg);
    }
}

function make_jpeg(colour_data) {
    return jpeg.encode({
        width: SIZE,
        height: SIZE,
        data: colour_data,
    }, 100).data;
}
