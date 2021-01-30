import * as colors from 'https://deno.land/std@0.84.0/fmt/colors.ts'
import ErrorCode from "./ErrorCode.ts";

export default class DiscordError {
	public static COLOR: boolean = false;

	public static fromCode(code: number): string {
		const err = Object.values(ErrorCode).filter(e => e[0] === code)[0];
		if(!err) throw 'Invalid Error Received';
		if(this.COLOR) {
			return colors.red(`ERROR [Code => ${err[0]}]: ${err[1]}`);
		} else {
			return `ERROR [Code => ${err[0]}]: ${err[1]}`;
		}
	}
}
