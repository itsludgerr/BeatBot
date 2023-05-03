module.exports = {
    name: 'loop',
    aliases: ['repeat', 'rp'],
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const queue = client.DisTube.getQueue(message)
        if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing playing!`)
        let mode = null
        if (args[0] == "off") {
            mode = 0
        } else if (args[0] == "song") {
            mode = 1
        } else if (args[0] == "queue") {
            mode = 2
        } else {
            mode = 1
        }
        mode = queue.setRepeatMode(mode)
        mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off'
        message.channel.send(`${client.emotes.repeat} | Set repeat mode to \`${mode}\``)
    }
}