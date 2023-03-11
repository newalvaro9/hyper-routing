import { createServer, IncomingMessage, ServerResponse } from 'http';

type handlers = (req: any, res: any, next?: Function) => any

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

        this.urls.forEach(url => {
            if (req.url == url.path && req.method?.toLowerCase() == url.method) {
                console.log(url)
                // Call each handler in sequence, passing in the req, res, and next functions
                const handlers = url.handlers || []
                let i = 0
                const next = () => {
                    i++
                    if (i < handlers.length) {
                        handlers[i](req, res, next)
                    }
                }
                handlers[0](req, res, next)
            }
        })
    }

    get(path: string, ...handlers: Array<handlers>) {
        this.urls.push({ path: path, method: "get", handlers: handlers })
    }

    listen(port: number, callback: () => any) {
        this.server.listen(port);
        if (callback) callback()
    }
}

export = ultraRouting