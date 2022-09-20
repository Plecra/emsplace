/// As the main module, this script is in charge of handling IO
/// coming into the server

import http from "http"
import { stdin, stdout } from "process"

import easel from "./easel.js"
import webviewer from "./webviewer.js"
import parsecmd from "./cli.js"

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
        if (isNaN(x) || isNaN(y) || colour !== "red") {
            res.statusCode = 404;
            res.end();
            return;
        }
        res.end();
        easel.set_colour(x, y, 0xFF0000);
        subscribers.notify();
    } else {
        webviewer(req, res);
    }
}).listen(80);

const PROMPT = "> ";
stdout.write(PROMPT);
// Assuming that we get data from stdin every line
stdin.on("data", line => {
    const cmd = parsecmd(line);
    switch (cmd.name) {
        case "set":
            easel.set_colour(cmd.x, cmd.y, cmd.colour);
            subscribers.notify();
            break;
        default:
            const errlen = Math.max(1, cmd.length);
            stdout.write(`${" ".repeat(PROMPT.length + cmd.end - errlen)}${"^".repeat(errlen)} ${cmd.message}\n`)
    }
    stdout.write(PROMPT);
})