require('dotenv').config();
const { DISCORD_TOKEN, CLIENT_ID, SERVER_ID } = process.env;
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[AVISO] O comando localizado em ${filePath} não possui a propriedade obrigatória "data" ou "execute".`);
		}
	}
}

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Atualizando ${commands.length} comandos de aplicação (/).`);

		const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, SERVER_ID), { body: commands });

		console.log(`Atualização concluída com sucesso. ${data.length} comandos de aplicação (/) foram recarregados.`);
	} catch (error) {
		console.error(error);
	}
})();