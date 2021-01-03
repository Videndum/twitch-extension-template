'use strict';
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { overlayWindow } from 'electron-overlay-window';
import { GameHandler } from './GameHandler';
import { OverlayHandler } from './OverlayHandler';
class Desktop extends GameHandler {
    constructor() {
        super();
        this.isDevelopment = process.env.NODE_ENV !== 'production';
        this.mainWindow = null;
        this.overlay = null;
        this.overlayHandler = new OverlayHandler();
        if (!this.checkPlatform())
            throw new Error(`The platform you are currently using is not supported. Please change platform to access this feature. You are currently on ${this.CurOS}`);
        // quit application when all windows are closed
        app.on('window-all-closed', () => {
            // on macOS it is common for applications to stay open until the user explicitly quits
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
        app.on('activate', () => {
            // on macOS it is common to re-create a window even after all windows have been closed
            if (this.mainWindow === null) {
                this.mainWindow = this.createMainWindow();
            }
        });
        // create main BrowserWindow when electron is ready
        app.on('ready', async () => {
            this.mainWindow = this.createMainWindow();
            await this.setGame();
            await this.findGame();
            await this.createOverlay();
        });
    }
    createMainWindow() {
        const browserWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
        if (this.isDevelopment) {
            browserWindow.webContents.openDevTools();
        }
        if (this.isDevelopment) {
            browserWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
        }
        else {
            browserWindow.loadURL(formatUrl({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true
            }));
        }
        browserWindow.on('closed', () => {
            this.mainWindow = null;
        });
        browserWindow.webContents.on('devtools-opened', () => {
            browserWindow.focus();
            setImmediate(() => {
                browserWindow.focus();
            });
        });
        return browserWindow;
    }
    async createOverlay() {
        this.overlay = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            },
            ...overlayWindow.WINDOW_OPTS
        });
        this.overlay.setIgnoreMouseEvents(true);
        const game = await this.getGameWindow();
        if (game.WindowTitle)
            overlayWindow.attachTo(this.overlay, game.WindowTitle);
        this.overlayContent();
        this.overlay.webContents.openDevTools();
        this.overlay.on("resize", () => {
            this.overlayContent();
        });
    }
    async overlayContent() {
        if (!this.overlay)
            return;
        const bounds = this.overlay.getContentBounds();
        this.overlay.loadURL(`data:text/html;charset=utf-8,
        <head>
          <title>overlay-demo</title>
          <style type="text/css">
            body {background:none transparent;
            }
          </style>
        </head>
        <body style="padding: 0; margin: 0;">
          <div style="position: absolute; width: 100%; height: 100%; text-align: center;">
            <h1> http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/ </h1>
            <iframe width="${bounds.width - 50}px" height="${bounds.height - 50}" src="${this.isDevelopment ? `http://localhost:19006/NotFound` : formatUrl({ pathname: path.join(__dirname, 'index.html'), protocol: 'file', slashes: true })}" frameborder="0" scrolling="no" id="iFrame1" allowtransparency="yes"/>
          </div>
        </body>
      `);
        // if (this.isDevelopment) {
        //   this.overlay.loadURL(
        //     `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/overlay`
        //   )
        // } else {
        //   this.overlay.loadURL(
        //     formatUrl({
        //       pathname: path.join(__dirname, 'index.html'),
        //       protocol: 'file',
        //       slashes: true
        //     })
        //   )
        // }
    }
}
new Desktop();
