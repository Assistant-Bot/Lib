/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 Bavfalcon9
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 */
 import Base from "../../structures/Base.ts";
 import Channel from "../../structures/channel/Channel.ts";
 import Emoji from "../../structures/guild/Emoji.ts";
 import Guild from "../../structures/guild/Guild.ts";
 import Message from "../../structures/Message.ts";
 import User from "../../structures/User.ts";
 import DataManager from "../DataManager.ts";
 import AsyncRuntimeStore from "./AsyncRuntimeStore.ts";
 
 export default class AsyncRuntimeManager extends DataManager {
	 #channels: AsyncRuntimeStore<string, typeof Channel & Base>;
	 #emojis: AsyncRuntimeStore<string, typeof Emoji & Base>;
	 #guilds: AsyncRuntimeStore<string, typeof Guild & Base>;
	 #messages: AsyncRuntimeStore<string, typeof Message & Base>;
	 #users: AsyncRuntimeStore<string, typeof User & Base>;
	 #reactions: AsyncRuntimeStore<string, typeof Channel & Base>;
 
	 /**
	  * Hard limit for how many structures are allowed in this store.
	  */
	 private static hardLimit: number = 100;
 
	 public constructor(limit?: number) {
		 super(limit);
		 this.#channels = new AsyncRuntimeStore<string, typeof Channel & Base>(Channel as typeof Channel & Base, this.limit);
		 this.#emojis = new AsyncRuntimeStore<string, typeof Emoji & Base>(Emoji as typeof Emoji & Base, this.limit);
		 this.#guilds = new AsyncRuntimeStore<string, typeof Guild & Base>(Guild as typeof Guild & Base, this.limit);
		 this.#messages = new AsyncRuntimeStore<string, typeof Message & Base>(Message as typeof Message & Base, this.limit);
		 this.#users = new AsyncRuntimeStore<string, typeof User & Base>(User as typeof User & Base, this.limit);
		 // to-do Reactions!
		 this.#reactions = new AsyncRuntimeStore<string, typeof Channel & Base>(Channel as typeof Channel & Base, this.limit);
	 }
 
	 /**
	  * Deletes a structure in the datastore based on it's id.
	  * @param id
	  */
	 public delete(id: string): boolean {
		 return false;
	 }
 
	 /**
	  * Get all channels stored within the store.
	  */
	 public get channels(): any {
		 return this.#channels;
	 }
 
	 /**
	  * Gets all the emoijs stored within the store.
	  */
	 public get emojis(): any {
		 return this.#emojis;
	 }
 
	 /**
	  * Get all guidls stored within the store.
	  */
	 public get guilds(): any {
		 return this.#guilds;
	 }
 
	 /**
	  * Get all messages stored within the store.
	  */
	 public get messages(): any {
		 return this.#messages;
	 }
 
	 /**
	  * Gets all the users stored within the store.
	  */
	 public get users(): any {
		 return this.#users;
	 }
 
	 /**
	  * Gets all the reactions stored within the store.
	  */
	 public get reactions(): any {
		 return this.#reactions;
	 }
 }