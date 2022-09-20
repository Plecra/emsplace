import http from "http"

import easel from "./easel.js"
import webviewer from "./webviewer.js"

http.createServer((req, res) => {
    // This routes requests to the HTML or image generation endpoints
    if (req.method === "GET" && req.url === "/api/canvas") {
        res.setHeader("Content-Type", "image/jpeg");
        easel.pipe_canvas_jpeg(res);
    } else {
        webviewer(req, res);
    }
}).listen(80);