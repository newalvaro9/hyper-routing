import { createServer, IncomingMessage, ServerResponse } from 'http';
import Response from './util/Response'

type handlers = (req: any, res: Response, next?: Function) => any

interface urls {
    path: string;
    method: string;
    handlers: Array<Function>
}

class ultraRouting {
    server: any
    urls: Array<urls>

    constructor() {
        this.urls = []
        this.server = createServer(this.handleRequest.bind(this))
    }

    private handleRequest(req: IncomingMessage, res: ServerResponse) {
        Object.setPrototypeOf(res, Response.prototype);

        this.urls.forEach(url => {
            if (req.url == url.path && req.method?.toLowerCase() == url.method) {
                console.log(url)
                // Call each handler in sequence, passing in the req, res, and next functions
                const handlers = url.handlers || []
                let i = 0
                const next = () => {
                    i++
                    if (i < handlers.length) {
                        handlers[i](req, res as Response, next)
                    }
                }
                handlers[0](req, res as Response, next)
            }
        })
    }

    get(path: string, ...handlers: Array<handlers>) {
        this.urls.push({ path: path, method: "get", handlers: handlers })
    }

    post(path: string, ...handlers: Array<handlers>) {
        this.urls.push({ path: path, method: "post", handlers: handlers })
    }

    listen(port: number, callback: () => any) {
        this.server.listen(port);
        if (callback) callback()
    }
}

export = ultraRouting