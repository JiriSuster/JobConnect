import 'reflect-metadata';
import { server } from './api/server';
import mongo from "./persistence/mongo";
import { Config } from "../config";
import { socketServer } from "./socket/socket.server";
import {createServer} from 'http';

const port = Config.port || 3000;
const httpServer = createServer(server);

async function init() {
    await mongo.connect();

    httpServer.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
    });

    socketServer.init(httpServer);
}

init();