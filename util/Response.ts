import { ServerResponse } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join } from "node:path";

import httpcodes from './data/httpcodes.json';
import ErrorUR from "./ErrorUR";

class Response extends ServerResponse {

    private getCode(code: string): number {
        for (const [codeNumber, value] of Object.entries(httpcodes)) {
            if (value === code) {
                return Number(codeNumber);
            }
        }
        throw new ErrorUR("Invalid Status Code", `${code} is not a valid status string code. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Status`)
    }

    status(code: number | string) {
        if (typeof code === 'string') {
            this.statusCode = this.getCode(code)
        } else {
            this.statusCode = code
        }
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

    send(data: any) {
        if (typeof data === 'object') {
            this.json(data)
        } else {
            data = data.toString()
            this.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Length': Buffer.byteLength(data)
            });
            this.write(data)
        }
        return this
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