import { ServerResponse } from "http";
import { createReadStream, existsSync, statSync } from "fs";
import { join } from "path";
import ErrorUR from "./ErrorUR";

class Response extends ServerResponse {

    status(code: number) {
        this.statusCode = code
        return this
    }

    json(data: object) {
        const json = JSON.stringify(data)
        this.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(json)
        });
        return this.end(json)
    }

    sendFile(path: string) {
        if (!require.main?.path) throw new Error
        this.writeHead(200, { 'Content-Type': 'text/html' });
        const finPath = join(require.main.path, 'views', path)
        console.log(finPath)
        if (!existsSync(finPath)) throw new ErrorUR("File not found", `Cannot find \`views\` folder or \`${path}\` file`)

        this.writeHead(200, { 'Content-Type': 'text/html' });
        createReadStream(finPath).pipe(this);
        return this
    }
}

export = Response