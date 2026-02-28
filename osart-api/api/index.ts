import { createApp } from '../src/main';
import type { IncomingMessage, ServerResponse } from 'http';

let cachedApp: any = null;

async function getApp() {
    if (!cachedApp) {
        const app = await createApp();
        // Required: init without starting a TCP server
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const app = await getApp();
    app(req, res);
}
