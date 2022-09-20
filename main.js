import http from "http"

import easel from "./easel.js"
import webviewer from "./webviewer.js"

http.createServer((req, res) => {
    if (req.url === "/api/canvas") {
        res.setHeader("Content-Type", "image/jpeg");
        easel.pipe_canvas(res);
    } else {
        webviewer(req, res);
    }
}).listen(80);