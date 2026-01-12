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
  const sessionDir = config.session;
  if (!existsSync(sessionDir)) return reply("Folder session tidak ditemukan.");

  const files = readdirSync(sessionDir);
  const counts = {};

  files.forEach(file => {
    // Grouping by name (e.g. pre-key, session, app-state)
    const prefix = file.includes('-') ? file.split('-').slice(0, 2).join('-').replace(/\.json$/, '') : file.split('.')[0];
    counts[prefix] = (counts[prefix] || 0) + 1;
  });

  let message = `*Real-time Session Checker*\n\n`;
  message += `📊 *Daftar File di Folder Session:*\n`;
  
  const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sortedEntries.length > 0) {
    sortedEntries.forEach(([prefix, count]) => {
      message += ` ▢ ${prefix} - ${count} file\n`;
    });
  } else {
    message += ` ▢ Folder kosong.\n`;
  }

  const totalFiles = files.length;
  message += `\n*Total:* ${totalFiles} file ditemukan.`;
  reply(message);
};

handler.help = ['ceksesi'];
handler.tags = ['owner'];
handler.command = ["csesi", "ceksesi"];
handler.isBot = true;

module.exports = handler;
