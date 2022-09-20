import fs from "fs";

const indexhtml = fs.readFileSync("public/index.html");

export default function(req, res) {
    switch (req.url) {
        case "/":
            res.setHeader("Content-Type", "text/html");
            res.end(indexhtml);
            break;
        default:
            res.statusCode = 404;
            res.end(`"place.frost.red${req.url}" not found on this server`);
    }
}