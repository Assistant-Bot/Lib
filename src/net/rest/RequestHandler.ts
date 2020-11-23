import Client from "../../Client.ts";
import Queue from "../../util/Queue.ts";
import Sleep from "../../util/Sleep.ts";

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
export interface RequestHandlerOptions {
    /**
     * The maximum amount of times to attempt a request
     */
    attempts: number;

    /**
     * The useragent to use
     */
    userAgent: string;
}

export interface ResponseError {
    reason: string;
    d: any;
}

export interface Header {
    name: string;
    value: string;
}

export const ErrorCodes = [
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    407,
    408,
    409,
    410,
    411,
    412,
    413,
    414,
    415,
    416,
    417,
    418,
    421,
    422,
    425,
    426,
    428,
    429,
    431,
    451,
    500,
    501,
    502,
    503,
    504,
    505,
    506,
    511
];

export default class RequestHandler {
    #options: RequestHandlerOptions;
    #client: Client;
    #headers: Header[];
    #rateLimits: { [key: string]: number };
    #globalBlock: boolean | number;

    public constructor(client: Client, opts: RequestHandlerOptions, specialHeaders: Header[]) {
        this.#options = opts;
        this.#client = client;
        this.#headers = specialHeaders;
        this.#rateLimits = {};
        this.#globalBlock = false;
    }

    /**
     * Makes a request with respect to client settings.
     * Please note this does not handle responses.
     * @param req
     * @param immediate
     */
    public request(req: Request, immediate: boolean = false): Promise<Response | Array<ResponseError | Error>> {
        // queues this promise until it's resolved.
        const errors: Array<ResponseError|Error> = [];

        return new Promise(async (resolve, reject) => {
            let attempts: number = 0;
            let wait: number = 0;

            for (let header of this.#headers) {
                req.headers.set(header.name, header.value);
            }

            req.headers.set('User-Agent', this.#options.userAgent);
            req.headers.set('X-RateLimit-Precision', 'millisecond');

            if (this.#globalBlock !== false) {
                await Sleep(this.#globalBlock as number);
            }

            if (immediate) {
                return resolve(await fetch(req));
            }

            while (attempts < this.#options.attempts) {
                attempts++;

                if (wait) {
                    await Sleep(wait);
                }

                try {
                    const res: Response = await fetch(req);
                    const json: any = await res.json();

                    const ratelimit = {
                        remaining: parseFloat(res.headers.get('X-RateLimit-Remaining') || 'NaN') || false,
                        limit: parseFloat(res.headers.get('X-RateLimit-Limit') || 'NaN') || false,
                        reset: parseFloat(res.headers.get('X-RateLimit-Reset') || 'NaN') || false,
                        resetAfter: parseFloat(res.headers.get('X-RateLimit-Reset-After') || 'NaN') || false,
                        global: res.headers.get('X-RateLimit-Global') || null
                    }

                    if (ratelimit.limit) {
                        this.#rateLimits[req.url] = ratelimit.limit as number;
                    }

                    if (ratelimit.global != null && ratelimit.resetAfter) {
                        this.#globalBlock = Date.now();
                    }

                    if (ratelimit.resetAfter) {
                        wait = ratelimit.resetAfter as number;
                        errors.push({ reason: 'RateLimited', d: wait });
                        continue;
                    }

                    if (res.status === 403 || res.status === 401) {
                        return resolve([ new Error('Unauthorized or Forbidden.') ]);
                    }

                    if (res.status === 405) {
                        return resolve([ new Error('Method requested not allowed.') ]);
                    }

                    if (res.status === 502 && attempts < 3) {
                        setTimeout(() => {
                            this.request(req, immediate).then(resolve).catch(reject);
                        }, Math.floor(Math.random() * 3000 + 100));
                        return;
                    }

                    if (ErrorCodes.includes(res.status)) {
                        errors.push({ reason: res.statusText, d: res });
                        continue;
                    }

                    return resolve(res);
                } catch (e) {
                    errors.push(e);
                }
            }

            return resolve(errors);
        });
    }
}