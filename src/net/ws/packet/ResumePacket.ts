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
import Packet, { OPCode, Payload } from "./Packet.ts";

export default class ResumePacket extends Packet {
    public token?: string;
    public sessionId?: string;
    public lastSequence?: number;

    public static from(data: Payload): ResumePacket {
        return new this(data.d.token, data.d.session_id, data.d.seq);
    }

    constructor(token?: string, sessionId?: string, lastSequence?: number) {
        super(OPCode.RESUME);
        this.token = token;
        this.sessionId = sessionId;
        this.lastSequence = lastSequence;
    }

    protected encodeData(): void {
        this.data = {
            token: this.token,
            session_id: this.sessionId,
            seq: this.lastSequence,
        };
    }
}