const config = require('../settings/config');
const { readdirSync, statSync, unlinkSync, existsSync } = require('fs');
const { join } = require('path');

let handler = async (m, { reply }) => {
  const sessionDir = config.session;
  if (!existsSync(sessionDir)) return reply("Folder session tidak ditemukan.");

  const files = readdirSync(sessionDir);
  const safeFiles = ['creds.json'];
  const deletedCounts = {};
  const keptFiles = [];

  files.forEach(file => {
    const fullPath = join(sessionDir, file);
    const stats = statSync(fullPath);

    if (safeFiles.includes(file) || stats.isDirectory()) {
      keptFiles.push(file);
    } else {
      try {
        unlinkSync(fullPath);
        // Improved prefix grouping (e.g., pre-key, session, sender-key, app-state)
        const prefix = file.includes('-') ? file.split('-').slice(0, 2).join('-').replace(/\.json$/, '') : file.split('.')[0];
        deletedCounts[prefix] = (deletedCounts[prefix] || 0) + 1;
      } catch (err) {
        keptFiles.push(`${file} (error)`);
      }
    }
  });

  let message = `*Real-time Session Cleaner*\n\n`;
  
  message += `✅ *File yang Aman:*\n`;
  if (keptFiles.length > 0) {
    keptFiles.forEach((f) => {
      message += ` ▢ ${f}\n`;
    });
  } else {
    message += ` ▢ Tidak ada file.\n`;
  }

  message += `\n🗑️ *File yang Dihapus:*\n`;
  const sortedEntries = Object.entries(deletedCounts).sort((a, b) => b[1] - a[1]);
  if (sortedEntries.length > 0) {
    sortedEntries.forEach(([prefix, count]) => {
      message += ` ▢ ${prefix} - ${count} file\n`;
    });
  } else {
    message += ` ▢ Tidak ada sampah.\n`;
  }

  const totalDeleted = Object.values(deletedCounts).reduce((a, b) => a + b, 0);
  message += `\n*Total:* ${totalDeleted} file sampah dibersihkan.`;
  reply(message);
};

handler.help = ['clearsession'];
handler.tags = ['owner'];
handler.command = ["csesi", "clearsesi", "clearsession"];
handler.isBot = true;

module.exports = handler;
