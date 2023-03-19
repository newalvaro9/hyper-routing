import { ServerResponse } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

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
        if (!require.main?.path) throw new ErrorUR("File not found", `Cannot find \`views\` folder or \`${path}\` file`)

        const finPath = join(process.cwd(), 'views', path)
        if (!existsSync(finPath)) throw new ErrorUR("File not found", `Cannot find \`views\` folder or \`${path}\` file`)

        const ext = extname(path);
        let contentType: string = ''
        switch (ext) {
            case '.html':
                contentType = 'text/html';
                break;
            /* Images */
            case '.jpg':
            case '.jpeg':
            case '.jfif':
            case '.pjpeg':
            case '.pjp':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            default:
                throw new ErrorUR('Unsupported file type', `File type ${extname} is not supported.`)
        }

        this.writeHead(200, { 
            'Content-Type': contentType,
            'Content-Length': statSync(finPath).size 
        });
        createReadStream(finPath).pipe(this);
        return this
    }

    redirect(url: string, code: number | string = 302) {
        typeof code === 'string' ? this.statusCode = this.getCode(code) : this.statusCode = code;
        this.writeHead(this.statusCode, {
            "Location": url
        })
        return this
    }
}

export = Response