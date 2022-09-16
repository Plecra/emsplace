const fs = require("fs");
const { ServerResponse, IncomingMessage, createServer } = require("http");
const jpeg = require("jpeg-js");

const indexhtml = fs.readFileSync("public/index.html");

const SIZE = 100;
const canvas = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0; i < SIZE; i++) {
    canvas[4 * (SIZE + 1) * i] = 255;
}
let cachedjpegdata = buffertojpeg(canvas, SIZE, SIZE);

createServer(request_handler).listen(80);

/**
 * @param {IncomingMessage} request 
 * @param {ServerResponse} response 
 */
function request_handler(request, response) {
    switch (request.url) {
        case "/":
            response.setHeader("Content-Type", "text/html");
            response.end(indexhtml);
            break;
        case "/image":
            response.setHeader("Content-Type", "image/jpeg");
            response.end(cachedjpegdata);
            break;
        default:
            response.statusCode = 404;
            response.end(`"place.frost.red${request.url}" not found on this server`);
    }
}

function buffertojpeg(data, width, height) {
    return jpeg.encode({ data, width, height }, 100).data
}