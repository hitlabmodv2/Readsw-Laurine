const fs = require('fs')

const config = {
    owner: ["6289688206739", "6289667923162"],
    botNumber: "6289667923162",
    setPair: "K1UU1212",
    thumbUrl: "https://github.com/kiuur.png",
    session: "sessions",
    message: {
        owner: "no, this is for owners only",
        group: "this is for groups only",
        admin: "this command is for admin only",
        private: "this is specifically for private chat"
    },
    settings: {
        title: "w-shennmine",
        packname: 'laurine-wabot',
        description: "this script was created by KyuuRzy",
        author: 'https://www.kyuurzy.tech',
        footer: "LAURINE~MD"
    },
    newsletter: {
        name: "kyuurzy-wb",
        id: "120363297591152843@newsletter"
    },
    socialMedia: {
        YouTube: "https://youtube.com/@kyuurzy",
        GitHub: "https://github.com/kiuur",
        Telegram: "https://t.me/kiuurmine",
        ChannelWA: "https://whatsapp.com/channel/0029Vaeqym9IHphHwvXk9k1s"
    }
}

module.exports = config;

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
