/// As the main module, this script is in charge of handling IO
/// coming into the server

import http from "http"

import easel from "./easel.js"
import webviewer from "./webviewer.js"

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

let subscribers = [];
subscribers.notify = function() {
    let j = 0;
    for (let i = 0; i < this.length; i++) {
        if (this[i].notify()) this[j++] = this[i];
    }
    this.length = j;
    return this.length !== 0;
}

http.createServer((req, res) => {
    // This routes requests to the HTML or image generation endpoints
    if (req.method === "GET" && req.url.startsWith("/api/canvas")) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "no-cache");
        easel.pipe_canvas_jpeg(res);
    // Implements the EventSource API (used in index.html) to update clients when the canvas changes
    } else if (req.method === "GET" && req.url === "/api/subscribe-updates") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive"
        });
        subscribers.push({
            notify() {
                if (!res.socket.destroyed) res.write("data:\n\n");
                return !res.socket.destroyed;
            }
        });
    } else if (req.method === "POST" && req.url.startsWith("/api/set/")) {
        const args = req.url.slice("/api/set/".length).split("/");
        if (args.length !== 3) {
            res.statusCode = 404;
            res.end();
            return;
        }
        const [x_arg, y_arg, colour] = args;
        const x = parseInt(x_arg, 10);
        const y = parseInt(y_arg, 10);
        const colour_record = COLOURS.find(col => col[0].toLowerCase() === colour);
        if (isNaN(x) || isNaN(y) || colour_record === undefined) {
            res.statusCode = 404;
            res.end();
            return;
        }
        res.end();
        easel.set_colour(x, y, colour_record[1]);
        subscribers.notify();
    } else {
        webviewer(req, res);
    }
}).listen(80);
