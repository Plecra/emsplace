const { ServerResponse, IncomingMessage, createServer } = require("http");
const jpeg = require("jpeg-js");

const SIZE = 100;
const canvas = Buffer.alloc(SIZE * SIZE * 4);
let cachedjpegdata = buffertojpeg(canvas, SIZE, SIZE);

createServer(request_handler).listen(80);

/**
 * @param {IncomingMessage} request 
 * @param {ServerResponse} response 
 */
function request_handler(request, response) {
    switch (request.url) {
        case "/image":
            response.setHeader("Content-Type", "image/jpeg");
            response.end(cachedjpegdata);
        default:
            response.statusCode = 404;
            response.end(`"place.frost.red${request.url}" not found on this server`);
    }
}

function buffertojpeg(data, width, height) {
    return jpeg.encode({ data, width, height }).data
}