/**
 * BASE dari Bang kiuur sumber https://github.com/kiuur/laurine-wabot
 * Recode & Fix oleh Bang Wily (6289688206739) sumber https://github.com/kominiyou
 * 
 * 📅 Last Update: Jumat, 09 Januari 2026
 * ⚠️ Ingat: Script ini FREE ya, no enc 100%, NO JUAL! 
 * 🛑 Ketahuan jual gue kagak bakal update lagi.
 * 💡 Hargailah developer dan recoder yang sudah fix fitur ini.
 */

const config = require('../settings/config');
const { readdirSync, existsSync } = require('fs');

let handler = async (m, { reply }) => {
  const sessionDir = './sessions'; // Hardcoded or from config
  if (!existsSync(sessionDir)) return reply("Folder session tidak ditemukan.");

  const files = readdirSync(sessionDir);
  const counts = {
    'pre-key': 0,
    'sender-key': 0,
    'app-state': 0,
    'creds': 0,
    'session': 0
  };

  files.forEach(file => {
    if (file.startsWith('pre-key')) counts['pre-key']++;
    else if (file.startsWith('sender-key')) counts['sender-key']++;
    else if (file.startsWith('app-state')) counts['app-state']++;
    else if (file.startsWith('creds')) counts['creds']++;
    else if (file.startsWith('session')) counts['session']++;
  });

  let message = `*Real-time Session Checker*\n\n`;
  message += `📊 *Daftar File di Folder Session:*\n`;
  
  message += ` ▢ pre-key - ${counts['pre-key']} file\n`;
  message += ` ▢ sender-key - ${counts['sender-key']} file\n`;
  message += ` ▢ app-state - ${counts['app-state']} file\n`;
  message += ` ▢ creds - ${counts['creds']} file\n`;
  message += ` ▢ session - ${counts['session']} file\n`;

  const totalFiles = files.length;
  message += `\n*Total:* ${totalFiles} file ditemukan.`;
  reply(message);
};

handler.help = ['ceksesi'];
handler.tags = ['owner'];
handler.command = ["csesi", "ceksesi"];
handler.isBot = true;

module.exports = handler;
