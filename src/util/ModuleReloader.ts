import Client from "../Client.ts";

export default class ModuleReloader {
	private client: Client<EventAdapter>;
	private dir?: string; // Optionally only filter one directory
	private main: string;

	private static authed: boolean = false;

	public constructor(client: Client<EventAdapter>, dir: string = Deno.cwd(), main: string) {
		this.client = client;
		this.dir = dir;
		this.main = main;
	}

	/**
	 * ModuleReloader start function (Websocket based)
	 */
	public async start(token: string) {
		if(import.meta.url) {
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
	}
	/**
	 * ModuleReloader start function (IPC based)
	 */
	public startIPC() {

	}
}


