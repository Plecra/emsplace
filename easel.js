import jpeg from "jpeg-js";

const SIZE = 24;
const data = Buffer.alloc(SIZE * SIZE * 4);
let cached_jpeg = make_jpeg(data);

export default {
    pipe_canvas(writable) {
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
