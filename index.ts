import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:querystring'

import Response from './util/Response'
import Request from './util/Request'

type handlers = (req: Request, res: Response, next?: Function) => any

interface urls {
    path: string;
    method: string;
    handlers: Array<Function>;
    middleware?: boolean;
}

class ultraRouting {
    private server: any
    private urls: Array<urls>

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
                        handlers[i](req as Request, res as Response, next)
                    }
                }
                handlers[0](req as Request, res as Response, next)
            }
        })
    }

    use(middleware: handlers) {
        this.urls.push({ path: "*", method: "*", handlers: [middleware], middleware: true });
    }

    get(path: string, ...handlers: Array<handlers>) {
        if (this.urls[0]?.middleware) {
            return this.urls.push({ path: path, method: "get", handlers: this.urls[0].handlers.concat(handlers) })
        }
        this.urls.push({ path: path, method: "get", handlers: handlers })
    }

    post(path: string, ...handlers: Array<handlers>) {
        if (this.urls[0]?.middleware) {
            return this.urls.push({ path: path, method: "post", handlers: this.urls[0].handlers.concat(handlers) })
        }
        this.urls.push({ path: path, method: "post", handlers: handlers })
    }

    patch(path: string, ...handlers: Array<handlers>) {
        if (this.urls[0]?.middleware) {
            return this.urls.push({ path: path, method: "patch", handlers: this.urls[0].handlers.concat(handlers) })

        }
        this.urls.push({ path: path, method: "patch", handlers: handlers })
    }

    listen(port: number, callback: () => any) {
        this.server.listen(port);
        if (callback) callback()
    }

    // Middlewares

    bodyparser(options: { json: boolean; urlencoded: boolean }) {
        return (req: Request, res: Response, next: Function) => {

            if (!options || Object.keys(options).length === 0) {
                options = { json: true, urlencoded: true }
            }

            if (req.headers['content-type'] === 'application/x-www-form-urlencoded' && options.urlencoded) {

                req.on('data', (chunk) => {
                    const jsonString = chunk.toString();
                    const object = parse(jsonString)
                    req.body = object
                    next();
                })

            } else if (req.headers['content-type'] === 'application/json' && options.json) {

                req.on('data', (chunk) => {
                    const jsonString = chunk.toString();
                    req.body = JSON.parse(jsonString);
                    next();
                })

            } else {
                next();
            }
        }
    }
}

export = ultraRouting