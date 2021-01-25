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

/**
 * This test is only to test whether or not slash commands work.
 *
 * @template slash
 */
import Client from "../src/Client.ts";
import { ApplicationOptionType, InteractionDataOption, InteractionResponseType } from "../src/net/common/Types.ts";
import { Payload } from "../src/net/ws/packet/Packet.ts";
import AppCommand from "../src/structures/application/AppCommand.ts";
import Interaction from "../src/structures/application/Interaction.ts";
import Message from "../src/structures/Message.ts";
import Embed from "../src/util/Embed.ts";

const client = new Client({
	sharding: {
		useDiscord: true
	},
	connection: {
		emitPayloads: true,
		autoReconnect: true,
		compress: false,
		maxReconnectTries: 1,
		maxResumeTries: 1,
		respectDiscordGateway: true,
		timeout: 1000
	}
});

client.on('message', (message: Message)=> {
	if (message.content === '!assistant') {
		message.channel.send("Recieved response!");
		message.channel.send(new Embed().setTitle('Test'));
	}
})

client.on('ws', (m: Payload) => {
	//console.log(Deno.inspect(m, { depth: 2 }));
})

await client.connect(JSON.parse(new TextDecoder().decode(Deno.readFileSync('./tests/config.json'))).token);

client.on("interactionCreate", async (interaction: Interaction) => {
	const cmd: string = interaction.data.name;

	if (cmd === "eval") {
		if (interaction.member.user.id !== client.application?.owner.id) {
			interaction.respond({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: "You can't use this."
				}
			});
			return;
		}
		try {
			let code = (interaction.data.options as InteractionDataOption[])[0].value;
			let evaled = eval(code);
			evaled = Deno.inspect(evaled, {
				depth: 2,
				colors: false,
				getters: true
			});
			if (evaled.length >= 2000) {
				evaled = evaled.split("").slice(0, 1971).join("") +
					"\nMessage shortened";
			}
			interaction.respond({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: '```js\n' + evaled + '\n```'
				}
			});
		} catch (err) {
			interaction.respond({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: '```xl\n' + err + '\n```'
				}
			}).catch((e) => {});
		}
	}

	if (cmd === "ping") {
		interaction.respond({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `:ping_pong: **Pong!** ${Math.max(Math.floor((Date.now() - interaction.createdAt)), 10)} ms`
			}
		})
	}

	if (cmd === "embed") {
		let title = (interaction.data.options as InteractionDataOption[])[0].value;
		let description = (interaction.data.options as InteractionDataOption[])[1].value;
		let color = (interaction.data.options as InteractionDataOption[])[2]
			? (interaction.data.options as InteractionDataOption[])[2].value || "#fff000"
			: "#fff000";

		const embed: Embed = new Embed()
			.setTitle(title)
			.setDescription(description)
			.setColor(color);

		const channel = interaction.channel ?? await interaction.getChannel();
		channel?.send(embed);

		interaction.respond({
			type: InteractionResponseType.ACKNOWLEDGE
		}).catch(e => {})
	}
})

setTimeout(() => {
	AppCommand.create(client, {
		name: 'eval',
		description: 'Evaluates JS Code.',
		application_id: client.user.id,
		options: [
			{
				name: 'code',
				description: 'Code to evaluate',
				type: ApplicationOptionType.STRING,
				required: true
			}
		],
		guildId: '759244023562108938'
	});

	AppCommand.create(client, {
		name: 'ping',
		description: 'Ping Assistant.',
		application_id: client.user.id,
		guildId: '759244023562108938'
	});


	AppCommand.create(client, {
		name: 'embed',
		description: 'Make an embed',
		application_id: client.user.id,
		options: [
			{
				name: 'title',
				description: 'The title of the embed',
				type: ApplicationOptionType.STRING,
				required: true
			},
			{
				name: 'description',
				description: 'The description of the embed',
				type: ApplicationOptionType.STRING,
				required: true
			},
			{
				name: 'color',
				description: 'The color of the embed (hex)',
				type: ApplicationOptionType.STRING,
				required: false
			}
		],
		guildId: '759244023562108938'
	});
}, 2000);