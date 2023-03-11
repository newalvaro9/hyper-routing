import { createServer } from 'http';



    server: any

    constructor() {
        this.server = createServer(this.handleRequest.bind(this))
    }

    }


    listen(port: number, callback: () => any) {
        this.server.listen(port);
        if (callback) callback()
    }
}

export = ultraRouting