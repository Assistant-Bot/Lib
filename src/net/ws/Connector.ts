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
import EventPacket from "./packet/EventPacket.ts";
import HeartBeatPacket from "./packet/HeartbeatPacket.ts";
import LoginPacket from "./packet/LoginPacket.ts";
import Packet, { OPCode, Payload } from "./packet/Packet.ts";
import ResumePacket from "./packet/ResumePacket.ts";

export type ConnectionStates = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'INITIALIZED';

export abstract class Connector {
    public ws!: WebSocket;
    public sequence: number;
    public sessionId: string;
    #gateway: string;
    #token!: string;
    #lastSeq: number;
    #lastAck: number;
    #state: ConnectionStates;
    #heartInterval?: number;

    public constructor(gateway: string) {
        this.#gateway = gateway;
        this.sequence = 0;
        this.sessionId = 'INITIALIZED';
        this.#lastSeq = 0;
        this.#lastAck = -1;
        this.#state = 'INITIALIZED';
    }

    /**
     * Connects to the discord websocket based on the token.
     * @param token - The token to pass to the Discord gateway
     */
    public async connect(token: string): Promise<void> {
        this.#token = token;
        this.#state = 'CONNECTING';
        this.#lastSeq = 0;
        this.ws = new WebSocket(this.#gateway);
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
     * Send a payload to discord.
     * @param payload
     */
    public async send(payload: Payload): Promise<void> {
        try {
            // to-do handle zlib
            this.ws.send(JSON.stringify(payload));
            return;
        } catch {
            return;
        }
    }

    /**
     * Send a packet to discord.
     * @param packet
     */
    public async sendPacket(packet: Packet): Promise<void> {
        return this.send(packet.encode());
    }

    /**
     * Close the websocket
     */
    public async close(): Promise<void> {
        try {
            this.ws.close();
        } catch (e) {
            return;
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
     * Called when the websocket recieves a payload from discord.
     * @param p
     */
    public abstract wsPacket(p: Payload): any;

    /**
     * Called when the websocket encounters an error.
     * @param error
     */
    public abstract wsError(error: Event | ErrorEvent | Error): any;

    private wsMessage(ev: MessageEvent): void {
        const payload: Payload = JSON.parse(ev.data) || false;
        let packet: EventPacket | HeartBeatPacket | ResumePacket;

        if (!payload) {
            this.wsError(new Error('Invalid payload recieved'));
        }

        switch(payload.op) {
            case OPCode.HELLO:
                packet = HeartBeatPacket.from(payload);
                if (this.#heartInterval) {
                    this.close();
                    this.wsError(new Error('Already initialized'));
                    return;
                } else {
                    this.#heartInterval = setInterval(() => {
                        // @ts-ignore
                        this.sendPacket(packet);
                    }, packet.interval);
                }
                this.sendPacket(new LoginPacket(this.#token, false, 0, false));
                return;
            case OPCode.RECONNECT:
                packet = new ResumePacket(this.#token, this.sessionId, this.#lastSeq);
                this.sendPacket(packet);
                return;
            case OPCode.DISPATCH:
                packet = EventPacket.from(payload);
                this.#lastSeq = packet.sequence || this.#lastSeq;

                if (packet.event === 'READY') {
                    this.sessionId = packet.data.session_id;
                }
                break;
            case OPCode.HEARTBEAT_ACK:
                this.#lastAck = Date.now();
                return;
            default:
                break;
        }

        this.wsPacket(payload);
    }
}