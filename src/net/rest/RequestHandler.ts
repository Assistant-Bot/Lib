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
import { Sleep } from "../../util/Async.ts";
import type { HTTPMethod } from "../common/Types.ts";
import { BASE_URL } from "./Endpoints.ts";

export interface RequestHandlerOptions {
	/**
	 * The maximum amount of times to attempt a request
	 */
	attempts: number;

	/**
	 * How many time to attempt a request that is ratelimited.
	 * @default 3
	 */
	attemptsRatelimit: number;

	/**
	 * The useragent to use
	 */
	userAgent: string;
}

/**
 * Class for interfacing with errors during responses.
 */
export class ResponseError extends Error {
	public response: Response;
	public data: any;

	public constructor(message: string, response: Response, data?: any) {
		super(message);
		this.response = response;
		this.data = data;
	}
}

export interface Header {
	name: string;
	value: string;
}

export interface RateLimit {
	time: number;
	remaining: number;
}

export interface IParams {
	$params: { [key: string]: string, value: any };
}

export default class RequestHandler {
	#options: RequestHandlerOptions;
	#headers: Header[];
	#rateLimits: { [key: string]: RateLimit };
	#globalBlock: boolean | number;

	public constructor(opts: Partial<RequestHandlerOptions>, specialHeaders: Header[]) {
		const defaults: RequestHandlerOptions = {
			attempts: 10,
			attemptsRatelimit: 3,
			userAgent: 'Discord Bot (https://github.com/Bavfalcon9/Assistant) v3'
		}
		this.#options = Object.assign(defaults, opts);
		this.#headers = specialHeaders;
		this.#rateLimits = {};
		this.#globalBlock = false;
	}

	/**
	 * Not really intented for public use, however, quickly makes a request
	 * and a request body, and returns the request with special headers.
	 * @param url
	 * @param method
	 * @param headers
	 * @param body
	 * @param immediate
	 */
	public makeAndSend(url: string, method: HTTPMethod = "GET", body?: any, headers: Header[] = [], immediate: boolean = false): Promise<Response> {
		url = BASE_URL + url;

		if (body.$params || Object.keys(body.$params ?? {}).length) {
			// check instance
			if (!(body.$params instanceof Object)) {
				throw  "$params must be an instance of IParams: { [key: string]: string, value: string };";
			}

			for (let param of Object.keys(body.$params)) {
				const value: any = body.$params[param];
				if(!value) continue;
				const symbol: '?' | '&' = url.includes('?') ? '&' : '?';
				url += `${symbol}${param}=${encodeURIComponent(JSON.stringify(value)?.replace(/("|')+/igm, ''))}`;
			}

			// delete body.$params;
			body = undefined;
		}

		const request: Request = new Request(url, { body: JSON.stringify(body), method });

		for (let header of headers) {
			request.headers.set(header.name, header.value);
		}

		return this.request(request, immediate);
	}

	/**
	 * Makes a request with respect to client settings.
	 * Please note this does not handle responses.
	 * @param req
	 * @param immediate
	 * @throws {ResponseError|Error}
	 */
	public request(req: Request, immediate: boolean = false): Promise<Response> {
		// queues this promise until it's resolved.
		return new Promise((resolve, reject) => {
			try {
				(async () => {
					let attempts: number = 0;
					let wait: number = 0;
					let res: Response;
					let lastError: ResponseError | Error = new Error();

					for (let header of this.#headers) {
						req.headers.set(header.name, header.value);
					}

					req.headers.set('User-Agent', this.#options.userAgent);
					req.headers.set('Content-Type', 'application/json');

					if (immediate) {
						fetch(req).then(resolve).catch(reject);
						return;
					}

					for (; attempts < this.#options.attempts + 1; attempts++) {
						if (attempts >= this.#options.attempts) {
							return reject(lastError);
						}

						if (typeof this.#globalBlock === 'number') {
							await Sleep(this.#globalBlock);
							this.#globalBlock = false;
						}

						if (this.#rateLimits[req.url]) {
							if (this.#rateLimits[req.url].remaining == 0) {
								wait = this.#rateLimits[req.url].time;
								console.log(`%cWARN: %c${req.url} has a ratelimit of %c${wait} ms %cand is in progress`, "color: #fc3246;font-weight: bold;", "color: grey;", "color: #fc3246;", "color: white;");
								this.#rateLimits[req.url].remaining = 5;
							}
						}

						if (wait) {
							await Sleep(wait);
							wait = 0;
						}

						res = await fetch(req);
						const ratelimit = {
							remaining: parseFloat(res.headers.get('x-ratelimit-remaining') || 'NaN') || false,
							limit: parseFloat(res.headers.get('x-ratelimit-limit') || 'NaN') || false,
							reset: parseFloat(res.headers.get('x-ratelimit-reset') || 'NaN') || false,
							resetAfter: parseFloat(res.headers.get('x-ratelimit-reset-after') || 'NaN') || false,
							global: res.headers.get('x-ratelimit-global') || null
						}

						if (ratelimit.limit) {
							this.#rateLimits[req.url] = {
								time: ratelimit.limit as number * 1000,
								remaining: ratelimit.remaining === false ? 5 : ratelimit.remaining as number
							}
						}

						if (ratelimit.global != null && ratelimit.resetAfter) {
							this.#globalBlock = ratelimit.resetAfter as number * 1000;
							continue;
						}

						if (ratelimit.resetAfter) {
							wait = ratelimit.resetAfter as number * 1000;
							lastError = new ResponseError('RateLimited', res, { reason: 'RateLimited', d: wait * 1000 });
						}

						if (res.status === 400) {
							reject(new ResponseError('Bad Request', res));
						}

						if (res.status === 403 || res.status === 401) {
							reject(new ResponseError('Unauthorized or Forbidden.', res));
						}

						if (res.status === 405) {
							reject(new ResponseError('Method requested not allowed.', res));
						}

						if (res.status === 502 && attempts < 3) {
							await Sleep(Math.floor(Math.random() * 3000 + 100));
						}

						if ((res.status - 200) > 100) {
							lastError = new ResponseError(res.statusText, res, { reason: res.statusText, d: res });
						} else {
							return resolve(res);
						}
					}
				})();
			} catch (e) {
				reject(e);
			}
		});
	}
}