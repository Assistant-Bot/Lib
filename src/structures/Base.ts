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
import type Client from "../Client.ts";
import type { AnyStructureData } from "../net/common/Types.ts";

export default abstract class Base {
    protected client: Client;
    public id: string;

    public constructor(client: Client, id: string) {
        this.id = id;
        this.client = client;
    }

    /**
     * Calculated date that a structure was created using 1420070400000 as EPOCH
     */
    public get createdAt() {
        return Math.floor(parseInt(this.id) / 4194304) + 1420070400000;
    }

    /**
     * Called by assistant to update structure data.
     * This should be similar, if not equal to creating a new structure.
     * @param data - The data to update the structure
     */
    public abstract update(data: AnyStructureData): any;
}