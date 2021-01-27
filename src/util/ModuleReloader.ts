import Client from "../Client.ts";
import { serve }from 'https://deno.land/std@0.84.0/http/mod.ts';
import { acceptWebSocket }from 'https://deno.land/std@0.84.0/ws/mod.ts';

export default class ModuleReloader {
	private client: Client;
	private dir?: string; // Optionally only filter one directory
	private main: string;

	private static authed: boolean = false;

	public constructor(client: Client, dir: string = Deno.cwd(), main: string) {
		this.client = client;
		this.dir = dir;
		this.main = main;	
	}

	/**
	 * ModuleReloader start function (Websocket based)
	 */
	public async start(token: string) {
		if(await Deno.readTextFile(Deno.cwd() + "/auth.lock") !== '1') {this.client.connect(token);};
		await Deno.writeTextFile(Deno.cwd() + "/auth.lock", '1');
		const watcher = Deno.watchFs(this.dir ?? Deno.cwd(), { recursive: true });
		try {
			let worker: Worker = new Worker(new URL(this.main, import.meta.url).href, {deno: true, name: "Assistant Hot Reload" , type: 'module'});
			for await (const e of watcher) { 
				if(e.kind === 'modify') {
					// worker = new Worker(new URL(this.main, import.meta.url).href, {deno: true, name: "Assistant Hot Reload" , type: 'module'});
				}
			}
		} catch (err) {
			console.log(`<Hot Reload Error>: ${err.message}`);
		}
	}
	/**
	 * ModuleReloader start function (IPC based)
	 */
	public startIPC() {

	}
}


