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
import Client from "../../Client.ts";
import Sleep from "../../util/Sleep.ts";

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

export default class RequestHandler {
    #options: RequestHandlerOptions;
    #headers: Header[];
    #rateLimits: { [key: string]: number };
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

                        if (wait) {
                            await Sleep(wait);
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
                            this.#rateLimits[req.url] = ratelimit.limit as number * 1000;
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
                            throw new ResponseError('Bad Request', res);
                        }

                        if (res.status === 403 || res.status === 401) {
                            throw new ResponseError('Unauthorized or Forbidden.', res);
                        }

                        if (res.status === 405) {
                            throw new ResponseError('Method requested not allowed.', res);
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