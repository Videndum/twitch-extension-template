import { getProcesses, ProcessObject } from 'memoryjs'
import { promisify } from 'util'
import { exec as execUtil } from 'child_process'

const exec = promisify(execUtil)

type DetailsExtends = ProcessObject & ProcessData

interface Details extends Partial<DetailsExtends> {
    name: string | null
    process?: string
}
interface ProcessData {
    ImageName: string
    PID: number
    SessionName: string
    Session: number
    MemUsage: string
    Status: string
    UserName: string
    CPUTime: string
    WindowTitle: string
}

export class GameHandler {
    details: Details = {
        name: process.env.NPM_PACKAGE_GAME_NAME?.toLowerCase() || process.env.NPM_PACKAGE_GAME?.toLowerCase() || null,
        process: process.env.NPM_PACKAGE_GAME_PROCESS?.toLowerCase()
    }
    GameToFind: string | undefined
    CurOS: "darwin" | "win32" | undefined = (process.platform == "win32" || process.platform == "darwin") ? process.platform : undefined

    async setGame(process?: string) {
        if (process) {
            this.GameToFind = process
            return process
        } else {
            if (this.details.process) this.GameToFind = this.details.process
            else this.GameToFind = this.details.name + ".exe"
            return this.GameToFind
        }
    }

    async findGame() {
        const game = getProcesses().find(p => p.szExeFile.toLowerCase() == this.GameToFind?.toLowerCase())
        this.details = { name: this.details.name, process: this.details.process, ...game }
        if (game) return game
        else return null
    }

    windows = {
        GetGameWindow: async () => {
            let stout = (await exec(`(tasklist /FI "PID eq ${this.details.th32ProcessID}" /fo list /v)`)).stdout
            let execDetails: { [x: string]: string } = {}

            stout.split("\r\n").forEach(line => {
                let param = line.split(":")
                if (!param[1]) return
                execDetails[param[0].trim()] = param[1].trim()
            })
            console.log(execDetails)
            const details: Details = {
                ...this.details,
                ImageName: execDetails["Image Name"],
                PID: Number(execDetails["PID"]),
                SessionName: execDetails["Session Name"],
                Session: Number(execDetails["Session#"]),
                MemUsage: execDetails["Mem Usage"],
                Status: execDetails["Status"],
                UserName: execDetails["User Name"],
                CPUTime: execDetails["CPU Time"],
                WindowTitle: execDetails["Window Title"]
            }
            this.details = details
            return this.details
        }
    }

    darwin = {
        GetGameWindow: async () => {
            let stout = (await exec(`ps -ax`)).stdout
            let execDetails: { [x: string]: string } = {}

            stout.split("\n").forEach(line => {
                let param = line.split(":")
                if (!param[1]) return
                execDetails[param[0].trim()] = param[1].trim()
            })
            console.log(execDetails)
            const details: Details = {
                ...this.details,
                ImageName: execDetails["Image Name"],
                PID: Number(execDetails["PID"]),
                SessionName: execDetails["Session Name"],
                Session: Number(execDetails["Session#"]),
                MemUsage: execDetails["Mem Usage"],
                Status: execDetails["Status"],
                UserName: execDetails["User Name"],
                CPUTime: execDetails["CPU Time"],
                WindowTitle: execDetails["Window Title"]
            }
            this.details = details
            return this.details
        }
    }

    checkPlatform() {
        if (this.CurOS == undefined) return false
        return true
    }

    getGameWindow = this.CurOS == "win32" ? this.windows.GetGameWindow : this.darwin.GetGameWindow
}

// let gamewindow: ProcessData = await JSON.parse(stout)
// game = {
//   ...game,
//   status: gamewindow["Status"],
//   window: gamewindow["Window Title"]
// }
// console.log(game)