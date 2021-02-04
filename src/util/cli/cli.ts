import * as colors from "https://deno.land/std@0.84.0/fmt/colors.ts";	
import generateDefault from "./generators/generateDefault.ts";	

const COLOR = 0x455a8b;	

function blue(s: string) {	
	return colors.rgb24(s, COLOR);	
}	


(async() => {	
	const args = Deno.args;

	switch(args[0]) {	
		case 'gen': {
			const name = Deno.args[1] ?? 'Assistant Bot';	
			const token = Deno.args[2] ?? 'TOKEN';	
			await generateDefault(name, token);	
			console.log(colors.bold(colors.green(`Successfully created Assistant Project! (Name: ${name})`)));	
			break;	
		}

		default:	
			const msg: string[] = [	
				colors.bold(blue('ASSISTANT CLI')),	
				`USAGE: ast ${blue('<command>')} [options]\n`,	
				`COMMANDS:`,	
				`${blue('gen')} - Generate a boilerplate Assistant Project`	
			];	
			console.log(msg.join('\n'));	
	}	
})(); 