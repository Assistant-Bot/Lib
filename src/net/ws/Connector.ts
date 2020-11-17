/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 John Bergman
 *
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */
import { GATEWAY, BASE_URL } from '../rest/Endpoints.ts';

export type ConnectionStates = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'INITIALIZED';

export abstract class Connector {
    public ws!: WebSocket;
    #state: ConnectionStates;

    public constructor() {
        this.#state = 'INITIALIZED';
    }

    /**
     * Connects to the discord websocket based on the token.
     * @param token - The token to pass to the Discord gateway
     */
    public async connect(token: string): Promise<void> {
        this.#state = 'CONNECTING';
        this.ws = new WebSocket(this.getGateway(token));
        this.ws.onmessage = this.wsMessage.bind(this);
        this.ws.onerror = this.wsError.bind(this);
        this.ws.onopen = () => {
            this.#state = 'CONNECTED';
        }
        this.ws.onclose = () => {
            this.#state = 'DISCONNECTED';
        }
    }

    /**
     * Gets the gateway for the specified token.
     * @param token
     */
    public getGateway(token: string): string {
        if (token.startsWith('Bot')) {
            return BASE_URL + GATEWAY + '/bot';
        } else {
            return BASE_URL + GATEWAY;
        }
    }

    /**
     * Gets the state of the connection
     * @readonly
     */
    public get state(): ConnectionStates {
        return this.#state;
    }

    /**
     * Called when the websocket recieves a message.
     * @param ev
     */
    public abstract wsMessage(ev: MessageEvent): any;

    /**
     * Called when the websocket encounters an error.
     * @param error
     */
    public abstract wsError(error: Event | ErrorEvent): any;
}