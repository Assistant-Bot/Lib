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
import Client from "../../../Client.ts";
import { Connector } from "../Connector.ts";
import Packet, { Payload } from "../packet/Packet.ts";

export default class Shard extends Connector {
    #client: Client;

    public constructor(client: Client, gateway: string) {
        super(gateway);
        this.#client = client;
    }

    public async wsPacket(pk: Payload): Promise<void> {
        // TO-DO
    }

    public async wsError(ev: Event | ErrorEvent): Promise<void> {

    }
}