import { IncomingMessage } from "node:http";

export default class Request extends IncomingMessage {
    body: Object = {};
    params: { [key: string]: string } = {};
}