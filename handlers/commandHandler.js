const fs = require('fs');
const path = require("path");

function loadCommands(client) {
  const mainFolder = path.resolve(path.dirname(__filename), "../");
  const commandsFolder = `${mainFolder}//commands`;
  const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
  }

  return console.log("Loaded Commands");
}

module.exports = { loadCommands };