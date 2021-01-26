import Client from "../Client.ts";
import { serve }from 'https://deno.land/std@0.84.0/http/mod.ts';
import { acceptWebSocket }from 'https://deno.land/std@0.84.0/ws/mod.ts';

export default class ModuleReloader {
	private client: Client;
	private dir?: string; // Optionally only filter one directory

	public constructor(client: Client, dir: string = Deno.cwd()) {
		this.client = client;
		this.dir = dir;	
	}
	/**
	 * ModuleReloader start function (Websocket based)
	 */
	public async start() {
		const http = serve({port: 8080});
		const ws = new WebSocket('ws://localhost:8080/assistant-dev');
		const watcher = Deno.watchFs(this.dir ?? Deno.cwd(), { recursive: true });

		for await (const req of http) {
			const { conn, r: bufReader, w: bufWriter, headers } = req;
			const ws = await acceptWebSocket({
				conn,
				bufReader,
				bufWriter,
				headers,
			});
		}

	}
	/**
	 * ModuleReloader start function (IPC based)
	 */
	public startIPC() {

	}
}