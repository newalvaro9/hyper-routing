import { createServer } from 'http';



    server: any

    constructor() {
        this.server = createServer(this.handleRequest.bind(this))
    }

    }


    }
}

export = ultraRouting