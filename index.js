const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { emoji, token } = require('./config.json');
const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions] });

client.config = require('./config.json')
client.DisTube = new DisTube(client, {
    leaveOnStop: true,
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
})
client.commands = new Collection();
client.aliases = new Collection();
client.emotes = emoji;

client.login(token).then(() => {
    loadEvents(client);
    loadCommands(client);
});

const status = queue =>
    `Volume: \`${queue.volume}%\` | Loop: \`${
        queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
    }\``

client.DisTube.on("playSong", (queue, song) => {
    queue.textChannel.send(
        `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
            song.user
        }\n${status(queue)}`
    )
})

client.DisTube.on("addSong", (queue, song) => {
    queue.textChannel.send(
        `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
})

client.DisTube.on("addList", (queue, playlist) => {
    queue.textChannel.send(
        `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
            playlist.songs.length
        } songs) to queue\n${status(queue)}`
    )
})

client.DisTube.on("error", (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
})

client.DisTube.on("empty", (channel) => {
    channel.send('Voice channel is empty! Leaving the channel...');
})

client.DisTube.on("searchNoResult", (message, query) => {
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`);
})

client.DisTube.on("finish", (queue) => {
    queue.textChannel.send('Finished!');
})

module.exports = {client};