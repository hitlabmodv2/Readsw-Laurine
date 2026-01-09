
/**
 * BASE dari Bang kiuur sumber https://github.com/kiuur/laurine-wabot
 * Recode & Fix oleh Bang Wily (6289688206739) sumber https://github.com/kominiyou
 * 
 * 📅 Last Update: Jumat, 09 Januari 2026
 * ⚠️ Ingat: Script ini FREE ya, no enc 100%, NO JUAL! 
 * 🛑 Ketahuan jual gue kagak bakal update lagi.
 * 💡 Hargailah developer dan recoder yang sudah fix fitur ini.
 */

const chalk = require('chalk')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
  return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

const Lognyong = (text, color) => {
  return !color ? chalk.yellow('[ ! ] ') + chalk.green(text) : chalk.yellow('=> ') + chalk.keyword(color)(text)
}

module.exports = {
  color,
  bgcolor,
  Lognyong
}
