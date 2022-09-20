import http from "http"
import { stdin, stdout } from "process"

import easel from "./easel.js"
import webviewer from "./webviewer.js"
import parsecmd from "./cli.js"

http.createServer((req, res) => {
    // This routes requests to the HTML or image generation endpoints
    if (req.method === "GET" && req.url === "/api/canvas") {
        res.setHeader("Content-Type", "image/jpeg");
        easel.pipe_canvas_jpeg(res);
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
            break;
        default:
            const errlen = Math.max(1, cmd.length);
            stdout.write(`${" ".repeat(PROMPT.length + cmd.end - errlen)}${"^".repeat(errlen)} ${cmd.message}\n`)
    }
    stdout.write(PROMPT);
})