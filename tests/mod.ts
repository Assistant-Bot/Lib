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
import { Sleep } from "../src/util/Async.ts";
import * as Collector from "./Collector.ts";
import * as Hello from './Hello.ts';
export interface TestOptions {
	name: string;
	description: string;
	timeout?: number;
}

const commonOpts = {
	sanitizeResources: false,
	sanitizeOps: false
}

const tests: { settings: TestOptions, default: Function }[] = [
	Hello,
	Collector
];

for await (let test of tests) {
	Deno.test({
		name: test.settings.name,
		fn: Hello.default,
		...commonOpts
	});
}
await Sleep(10000);
Deno.test({
	name: "Completed",
	fn() {
		Deno.exit();
	}
})