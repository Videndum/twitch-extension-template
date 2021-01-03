import express, { Request, Response } from 'express'
// import path from 'path'
export class OverlayHandler {
    server = express()
    port = this.normalizePort('5000')

    constructor() {
        // this.server.use(express.static(path.join(__dirname, 'public')))
        // this.server.get("/", (req: Request, res: Response) => {
        //     res.sendFile(path.join(__dirname, '../public/home.html'))
        // })
        this.server.get('/', function (req, res) {
            res.send("Hello world! Lala Seth is here!");
        })

        this.server.listen(this.port, () => {
            console.log(`server started on port ${this.port}`)
        })
    }

    normalizePort(val: string) {
        const port = parseInt(val, 10);
        if (Number.isNaN(port)) {
            // named pipe
            return 5000;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return 5000;
    }
}