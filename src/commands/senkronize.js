const coin = require("../models/coin");
const config = require("../../config.json");

module.exports = {
  aliases: ["senkron"],
  name: "senkron",
  help: "senkron user [@burjuva] / [rol]",
  execute: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8)) return;
    if (args[0] === "kişi" || args[0] === "user") {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
      if (!member) return message.channel.send(embed.setDescription("Öncelikle geçerli bir kullanıcı belirtmelisin!"));

      if (client.ranks.some(x => member.roles.cache.has(x.role))) {
        let rank = client.ranks.filter(x => member.roles.cache.has(x.role));
        rank = rank[rank.length - 1];
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
        message.channel.send(embed.setDescription(`${member.toString()} kullanıcısında <@&${rank.role}> rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`));
      } else return message.channel.send(embed.setDescription(`${member.toString()} kullanıcısında sistemde ayarlı bir rol bulunamadı!`));
    } else if (args[0] === "role" || args[0] === "rol") {
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if (!role) return message.channel.send(embed.setDescription("Öncelikle geçerli bir rol belirtmelisin!"));
      if (role.members.length === 0) return message.channel.send(embed.setDescription("Bu rolde üye bulunmuyor!"));
      role.members.forEach(async member => {
        if (member.user.bot) return;
        if (!config.coin.stafs.some(x => member.roles.cache.has(x))) return;
        if (client.ranks.some(x => member.roles.cache.has(x.role))) {
          let rank = client.ranks.filter(x => member.roles.cache.has(x.role));
          rank = rank[rank.length - 1];
          await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
          message.channel.send(embed.setDescription(`${member.toString()} kullanıcısında <@&${rank.role}> rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`));
        } else return message.channel.send(embed.setDescription(`${member.toString()} kullanıcısında sistemde ayarlı bir rol bulunamadı!`));
      });
    } else return message.channel.send(embed.setDescription("Öncelikle geçerli bir argüman belirtmelisin!"));
  }
};
