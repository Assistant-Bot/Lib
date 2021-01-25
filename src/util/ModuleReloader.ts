import Client from "../Client.ts";

export default class ModuleReloader {
	private client: Client;
	private dir?: string; // Optionally only filter one directory

	public constructor(client: Client, dir?: string) {
		this.client = client;
		this.dir = dir;	
	}

	/**
	 * ModuleReloader start function (Deno.watchFS based)
	 */
	public async startWatch() {
		for await (let evt of Deno.watchFs(this.dir || Deno.cwd())) {
			switch(evt.kind) {
				case 'create':
					// Handle creation of file
					break;
				case 'modify':
					// Ok now after we resolve to here, we need to actually reload.
					// We need to tell Deno to reload the cache of each module
					// However, we only do this in the case of modify, such as here
					for (let path of evt.paths) {
						const data = `deno cache --reload ${path}`;
						// Great, we've detected the path of the file updated
						// and now we can update it by reloading the cache of,
						// the file

						// Also this doesn't really need to have an await

						Deno.run({
							cmd: data.split(" ")
						});

						console.log('Reloaded Deno Module', path);	

						// NOTE: I'm actually not sure if we're suppose to reload
						// the cache of the file that's running the Deno process
						// or the file that is being updated. I'll have to test 
						// this more, however, the current test 

						/**
						 * // I think that this code is what is suppose to be used
						 * const data = `deno cache --reload=${path}`;
						 * Deno.run({
						 *     cmd: data.split(" "),
						 *     cwd: `${Deno.cwd()}/${this.mainFile}`
						 * });
						 * 
						 * console.log('Reloaded Deno Module', path);
						 */

					}
					break;
				case 'remove':
					// Handle deletion of file
					break;
				case 'access':
					// Handles changes in file
					// permissions? We won't need
					// 
					break;
				case 'any': 
					// I assume this is a globally emitted event?
					// Which in case we don't need 
					break;
			}

		}
	}

	/**
	 * ModuleReloader start function (Websocket based)
	 */
	public startWS() {

	}

	/**
	 * ModuleReloader start function (IPC based)
	 */
	public startIPC() {

	}
}