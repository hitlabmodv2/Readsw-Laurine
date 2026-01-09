/**
 * BASE dari Bang kiuur sumber https://github.com/kiuur/laurine-wabot
 * Recode & Fix oleh Bang Wily (6289688206739) sumber https://github.com/kominiyou
 * 
 * 📅 Last Update: Jumat, 09 Januari 2026
 * ⚠️ Ingat: Script ini FREE ya, no enc 100%, NO JUAL! 
 * 🛑 Ketahuan jual gue kagak bakal update lagi.
 * 💡 Hargailah developer dan recoder yang sudah fix fitur ini.
 */

const fs = require('fs')

const fquoted = {
    packSticker: {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "120363400662819774@g.us"
        },
        message: {
            stickerPackMessage: {
                stickerPackId: "\000",
                name: "laurine-wb",
                publisher: "kkkk"
            }
        }
    }
};

module.exports = { fquoted };

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})

