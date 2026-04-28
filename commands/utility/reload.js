const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Recarrega um comando.')
		.addStringOption((option) => option.setName('command').setDescription('O comando que deseja recarregar.').setRequired(true)),
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`O comando \`${commandName}\` não foi encontrado.`);
		}

    delete require.cache[require.resolve(`./${command.data.name}.js`)];

    try {
      const newCommand = require(`./${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(`O comando \`${newCommand.data.name}\` foi recarregado!`);
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Ocorreu um erro ao recarregar o comando \`${command.data.name}\`:\n\`${error.message}\``,
      );
    }
	},
};