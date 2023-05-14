module.exports = {
  aliases: ["komut"],
  name: "komutlar",
  execute: async (client, message, args, embed, author, channel, guild, prefix) => {
    let list = client.commands
      .filter((x) => x.help)
      .sort((a, b) => b.help - a.help)
      .map((x) => `\`${prefix}${x.help}\``)
      .join("\n");

    channel.send(embed.setDescription(list));
  }
};
