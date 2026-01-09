/**
 * BASE dari Bang kiuur sumber https://github.com/kiuur/laurine-wabot
 * Recode & Fix oleh Bang Wily (6289688206739) sumber https://github.com/kominiyou
 * 
 * 📅 Last Update: Jumat, 09 Januari 2026
 * ⚠️ Ingat: Script ini FREE ya, no enc 100%, NO JUAL! 
 * 🛑 Ketahuan jual gue kagak bakal update lagi.
 * 💡 Hargailah developer dan recoder yang sudah fix fitur ini.
 */

const config = require('./settings/config');
const fs = require('fs');
const axios = require('axios');
const chalk = require("chalk");
const jimp = require("jimp")
const util = require("util");
const crypto  = require("crypto")
const fetch = require("node-fetch")
const moment = require("moment-timezone");
const path = require("path")
const os = require('os');
const speed = require('performance-now')
const { spawn, exec, execSync } = require('child_process');
const { default: baileys, getContentType } = require("@shennmine/baileys");
module.exports = client = async (client, m, chatUpdate, store) => {
    try {
        const body = (
            m.mtype === "conversation" ? m.message.conversation :
            m.mtype === "imageMessage" ? m.message.imageMessage.caption :
            m.mtype === "videoMessage" ? m.message.videoMessage.caption :
            m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
            m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
            m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
            m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
            m.mtype === "interactiveResponseMessage" ? (
                (() => {
                    try {
                        const params = JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson);
                        return params.id || m.text;
                    } catch (e) {
                        return m.text;
                    }
                })()
            ) :
            m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
            m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId ||
            m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
        ) || "";
        
        const sender = m.key.fromMe ? client.user.id.split(":")[0] + "@s.whatsapp.net" ||
              client.user.id : m.key.participant || m.key.remoteJid;
        
        const senderNumber = sender.split('@')[0];
        const budy = (typeof m.text === 'string' ? m.text : '');
        const prefa = ["", "!", ".", ",", "🐤", "🗿"];

        const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
        const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const botNumber = config.botNumber + "@s.whatsapp.net";
        const isBot = [botNumber, ...config.owner.map(v => v + "@s.whatsapp.net")].includes(sender);
        const wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
        const isPublic = wily.public;
        
        // Log for debugging
        if (body.startsWith(prefix)) {
            // Debug removed
        }

        if (!isPublic && !isBot) return;

        const isCmd = body.startsWith(prefix) || ["row_1", "row_2", "row_3", "ping"].includes(body);
        const command = isCmd ? (body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : body.toLowerCase()) : '';
        const command2 = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || (m.key.fromMe ? (client.user.name || client.user.id.split(':')[0]) : "No Name");
        const text = q = args.join(" ");
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        const qmsg = (quoted.msg || quoted);
        const isMedia = /image|video|sticker|audio/.test(mime);
        
        const { smsg, fetchJson, sleep, formatSize, runtime } = require('./w-shennmine/lib/myfunction');     
        const cihuy = fs.readFileSync('./w-shennmine/lib/media/w-shennmine.jpg')
        const { fquoted } = require('./w-shennmine/lib/fquoted')

        // group
        const groupMetadata = m?.isGroup ? await client.groupMetadata(m.chat).catch(() => ({})) : {};
        const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
        const participants = m?.isGroup ? groupMetadata.participants?.map(p => {
            let admin = null;
            if (p.admin === 'superadmin') admin = 'superadmin';
            else if (p.admin === 'admin') admin = 'admin';
            return {
                id: p.id || null,
                jid: p.jid || null,
                admin,
                full: p
            };
        }) || []: [];
        const groupOwner = m?.isGroup ? participants.find(p => p.admin === 'superadmin')?.jid || '' : '';
        const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);
        const isBotAdmins = m?.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = m?.isGroup ? groupAdmins.includes(m.sender) : false;
        const isGroupOwner = m?.isGroup ? groupOwner === m.sender : false;
        const isOwner = [botNumber, ...config.owner.map(v => v + "@s.whatsapp.net")].includes(sender);

        // Auto typing/record logic
        if (wily.autotyping && !isCmd && !isBot) {
            await client.sendPresenceUpdate('composing', from);
        }
        if (wily.autorecord && !isCmd && !isBot) {
            await client.sendPresenceUpdate('recording', from);
        }
        
        if (m.message && m.key.remoteJid !== "status@broadcast") {
            if (isCmd && command) {
                const now = moment().tz("Asia/Jakarta").locale('id');
                const hari = now.format("dddd");
                const tanggal = now.format("DD MMM YYYY");
                const waktu = now.format("HH:mm:ss");
                let ucapanLog = 'Malam';
                const hourLog = now.hour();
                if (hourLog >= 4 && hourLog < 10) ucapanLog = 'Pagi';
                else if (hourLog >= 10 && hourLog < 15) ucapanLog = 'Siang';
                else if (hourLog >= 15 && hourLog < 18) ucapanLog = 'Sore';

                console.log(chalk.bgHex("#4a69bd").bold(`▢ New Command`));
                console.log(
                    `▢ 📅 Hari      : ${hari}\n` +
                    `▢ 🗓️  Tanggal   : ${tanggal}\n` +
                    `▢ ⌚ Waktu     : ${waktu} ${ucapanLog}\n` +
                    `▢ 🚀 Command   : ${command}\n` +
                    `▢ 📩 Pesan     : Ke Kirim\n` +
                    `▢ 👤 Pengirim  : ${pushname}\n` +
                    `▢ 🆔 JID       : ${senderNumber}\n` +
                    `▢ 👑 Owner     : ${isOwner ? 'Ya ✅' : 'Tidak ❌'}\n` +
                    `▢ 🤖 Bot       : ${isBot ? 'Ya ✅' : 'Tidak ❌'}\n` +
                    `▢ 🔓 isPublic  : ${isPublic ? 'Ya ✅' : 'Tidak ❌'}\n` +
                    `----------------------------------`
                );
            }
        }
        
        const reaction = async (jidss, emoji) => {
            client.sendMessage(jidss, {
                react: {
                    text: emoji,
                    key: m.key 
                } 
            })
        };
        
        async function reply(text) {
            client.sendMessage(m.chat, {
                text: "\n" + text + "\n",
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title: config.settings.title,
                        body: config.settings.description,
                        thumbnailUrl: config.thumbUrl,
                        sourceUrl: config.socialMedia.Telegram,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fquoted.packSticker })
        }
        
        const pluginsLoader = async (directory) => {
            let plugins = [];
            const folders = fs.readdirSync(directory);
            folders.forEach(file => {
                const filePath = path.join(directory, file);
                if (filePath.endsWith(".js")) {
                    try {
                        const resolvedPath = require.resolve(filePath);
                        if (require.cache[resolvedPath]) {
                            delete require.cache[resolvedPath];
                        }
                        const plugin = require(filePath);
                        plugins.push(plugin);
                    } catch (error) {
                        console.log(`${filePath}:`, error);
                    }
                }
            });
            return plugins;
        };

        const pluginsDisable = true;
        const plugins = await pluginsLoader(path.resolve(__dirname, "./command"));
        const plug = {
            client,
            prefix,
            command, 
            reply, 
            text, 
            isBot,
            reaction,
            pushname, 
            mime,
            quoted,
            sleep,
            fquoted,
            fetchJson 
        };

        for (let plugin of plugins) {
            if (plugin.command.find(e => e == command.toLowerCase())) {
                if (plugin.isBot && !isBot) {
                    return
                }
                
                if (plugin.private && !plug.isPrivate) {
                    return m.reply(config.message.private);
                }

                if (typeof plugin !== "function") return;
                await plugin(m, plug);
            }
        }
        
        if (!pluginsDisable) return;  

        switch (command) {
            case "row_1": {
                reply("Anda memilih baris 1: @dittsans (b!cth)");
            }
            break;
            case "row_2": {
                reply("Anda memilih baris 2: @kyuucode (sh3nnmine)");
            }
            break;
            case "row_3": {
                reply("Anda memilih baris 3: @devorsixcore (rock and roll)");
            }
            break;
            case "ping": {
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const formattedUsedMem = formatSize(usedMem);
                const formattedTotalMem = formatSize(totalMem);
                const freeMemFormatted = formatSize(freeMem);
                const cpu = os.cpus();
                const cpuModel = cpu[0].model;
                const cpuSpeed = cpu[0].speed;
                const platform = os.platform();
                const arch = os.arch();
                const loadAvg = os.loadavg().map(v => v.toFixed(2)).join(", ");
                const uptime = os.uptime();
                
                // Real-time Date & Time (Asia/Jakarta)
                const now = moment().tz("Asia/Jakarta").locale('id');
                const hari = now.format("dddd");
                const tanggal = now.format("DD MMMM YYYY");
                const waktu = now.format("HH:mm:ss");
                
                let timestamp = speed();
                let latensi = speed() - timestamp;
                
                let pingMsg = `╭━━━『 *SERVER STATUS* 』━━━┄
┃
┃ 📅 *Hari:* ${hari}
┃ 📆 *Tanggal:* ${tanggal}
┃ ⌚ *Waktu:* ${waktu} WIB
┃
┃ 🚀 *Latensi:* ${latensi.toFixed(4)} ms
┃ ⏳ *Runtime Bot:* ${runtime(process.uptime())}
┃ 🕒 *Uptime Server:* ${runtime(uptime)}
┃
┃ 📊 *Resource Usage:*
┃ ▢ *RAM:* ${formattedUsedMem} / ${formattedTotalMem}
┃ ▢ *Free:* ${freeMemFormatted}
┃ ▢ *Load:* ${loadAvg}
┃
┃ 💻 *System Info:*
┃ ▢ *CPU:* ${cpuModel}
┃ ▢ *Speed:* ${cpuSpeed} MHz
┃ ▢ *OS:* ${platform} (${arch})
┃
╰━━━━━━━━━━━━━━━━━━┄`;
                reply(pingMsg);
            }
            break;
            case "menu":{
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const formattedUsedMem = formatSize(usedMem);
                const formattedTotalMem = formatSize(totalMem);
                let timestamp = speed()
                let latensi = speed() - timestamp

                // Personalized Greeting
                const time = moment.tz('Asia/Jakarta');
                let ucapan = 'Selamat Malam';
                const hour = time.hour();
                if (hour >= 4 && hour < 10) ucapan = 'Selamat Pagi';
                else if (hour >= 10 && hour < 15) ucapan = 'Selamat Siang';
                else if (hour >= 15 && hour < 18) ucapan = 'Selamat Sore';

                let menu = `Halo (@${sender.split('@')[0]}), ${ucapan}! 👋\n\n`
                menu += `╭━━━『 *LAURINE BOT* 』━━━┄
┃
┃ 🚀 *Speed:* ${latensi.toFixed(4)} s
┃ ⏳ *Runtime:* ${runtime(process.uptime())}
┃ 📊 *RAM:* ${formattedUsedMem} / ${formattedTotalMem}
┃
┣━━『 *OWNER MENU* 』━━┄
┃ ▢ ${prefix}eval
┃ ▢ ${prefix}exec
┃ ▢ ${prefix}csesi
┃ ▢ ${prefix}setppbot
┃
┣━━『 *GROUP MENU* 』━━┄
┃ ▢ ${prefix}tagall
┃
┣━━『 *TOOLS MENU* 』━━┄
┃ ▢ ${prefix}get
┃ ▢ ${prefix}insp
┃ ▢ ${prefix}ping
┃ ▢ ${prefix}mesinfo
┃
┣━━『 *UTILITIES* 』━━┄
┃ ▢ ${prefix}mode public/self
┃ ▢ ${prefix}terminal
┃ ▢ ${prefix}reactionsw
┃ ▢ ${prefix}addemoji
┃ ▢ ${prefix}delemoji
┃ ▢ ${prefix}listemoji
┃
╰━━━━━━━━━━━━━━━━━━┄`
                    await client.sendMessage(m.chat, {
                        interactiveMessage: {
                            title: menu,
                            footer: config.settings.footer,
                            thumbnail: "./w-shennmine/lib/media/anime_girl.png",
                            contextInfo: {
                                mentionedJid: [sender]
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "✦ LAURINE - DASHBOARD ✦",
                                            sections: [
                                                {
                                                    title: "# SERVER INFO",
                                                    highlight_label: "HOT",
                                                    rows: [
                                                        {
                                                            title: "Ping Server ⚡",
                                                            description: "Cek kecepatan respon & info server akurat ✅",
                                                            id: "ping"
                                                        }
                                                    ]
                                                }
                                            ]
                                        })
                                    },
                                    {
                                        name: "cta_copy",
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "shennminè",
                                            id: "123456789",
                                            copy_code: "https://t.me/sh3nnmine"
                                        })
                                    }
                                ]
                            }
                        }
                    }, { quoted: fquoted.packSticker });
            }
            break
            case "mesinfo": {
                if (!m.quoted) return reply("harap reply ke sebuah pesan untuk mengecek mtype dan id-nya.");
             
                const type = m.quoted.mtype;
                const id = m.quoted.id;
                reply(`Pesan yang di-reply memiliki:\n- Tipe pesan: *${type}*\n- ID pesan: *${id}*`);
            }
            break;
            case "mode": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} public/self`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'public') {
                    if (wily.public) return reply(`maaf fitur tersebut sedang keadaan on bila mau mematikan ketik ${prefix + command} self\n\n*Penjelasan:* Bot sekarang dapat digunakan oleh semua orang di chat pribadi maupun di dalam grup. Pastikan bot tetap diawasi untuk menghindari penyalahgunaan.`);
                    wily.public = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    client.public = true;
                    reply(`Bot berhasil diubah ke *Public Mode* ✅\n\n*Penjelasan:* Bot sekarang dapat digunakan oleh semua orang di chat pribadi maupun di dalam grup. Pastikan bot tetap diawasi untuk menghindari penyalahgunaan.`);
                } else if (action === 'self') {
                    if (!wily.public) return reply(`maaf fitur tersebut sedang keadaan off bila mau mengaktifkan ketik ${prefix + command} public\n\n*Penjelasan:* Bot sekarang hanya merespon perintah dari Owner saja. Pengguna lain tidak akan mendapatkan respon saat bot berada di mode ini.`);
                    wily.public = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    client.public = false;
                    reply(`Bot berhasil diubah ke *Self Mode* ❌\n\n*Penjelasan:* Bot sekarang hanya merespon perintah dari Owner saja. Pengguna lain tidak akan mendapatkan respon saat bot berada di mode ini.`);
                } else {
                    reply(`Gunakan: ${prefix + command} public/self`);
                }
            }
            break;
            case "terminal": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.terminal) return reply(`maaf fitur tersebut sedang keadaan on bila mau mematikan ketik ${prefix + command} off`);
                    wily.terminal = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Terminal Mode berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.terminal) return reply(`maaf fitur tersebut sedang keadaan off bila mau mengaktifkan ketik ${prefix + command} on`);
                    wily.terminal = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Terminal Mode berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "reactionsw": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.reactionsw) return reply(`maaf fitur tersebut sedang keadaan on bila mau mematikan ketik ${prefix + command} off`);
                    wily.reactionsw = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Reaction SW berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.reactionsw) return reply(`maaf fitur tersebut sedang keadaan off bila mau mengaktifkan ketik ${prefix + command} on`);
                    wily.reactionsw = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Reaction SW berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "antitagsw": {
                reply("Fitur ini telah dihapus.");
            }
            break;
            case "addemoji": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} [emoji]`);
                let emojis = JSON.parse(fs.readFileSync('./settings/emoji.json'));
                const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[\u2700-\u27bf]|[\u2600-\u26ff]|[\u2b50-\u2b55])/g;
                let newEmojis = text.match(emojiRegex);
                
                if (!newEmojis || newEmojis.length === 0) return reply("Tidak ada emoji valid yang ditemukan.");
                
                let added = [];
                let existed = [];
                newEmojis.forEach(emoji => {
                    if (!emojis.includes(emoji)) {
                        emojis.push(emoji);
                        added.push(emoji);
                    } else {
                        existed.push(emoji);
                    }
                });

                if (added.length > 0) {
                    fs.writeFileSync('./settings/emoji.json', JSON.stringify(emojis, null, 2));
                    delete require.cache[require.resolve('./settings/emoji.json')];
                    let msg = `╭━━━『 ADD EMOJI 』━━━┄\n`;
                    msg += `┃\n`;
                    msg += `┃ ✅ Berhasil (${added.length}): ${added.join(' ')}\n`;
                    if (existed.length > 0) {
                        msg += `┃ ⚠️ Sudah ada (${existed.length}): ${existed.join(' ')}\n`;
                    }
                    msg += `┃\n`;
                    msg += `┃ 📊 Total: ${emojis.length} emoji\n`;
                    msg += `┃ Daftar: ${emojis.join(' ')}\n`;
                    msg += `╰━━━━━━━━━━━━━━━┄`;
                    reply(msg);
                } else {
                    let msg = `╭━━━『 ADD EMOJI FAILED 』━━━┄\n`;
                    msg += `┃\n`;
                    msg += `┃ ⚠️ Sudah ada (${existed.length}): ${existed.join(' ')}\n`;
                    msg += `┃ ❌ Keterangan: Gunakan emoji yang belum ada di daftar listemoji.\n`;
                    msg += `┃\n`;
                    msg += `┃ 📊 Total: ${emojis.length} emoji\n`;
                    msg += `┃ Daftar: ${emojis.join(' ')}\n`;
                    msg += `┃\n`;
                    msg += `╰━━━━━━━━━━━━━━━┄`;
                    reply(msg);
                }
            }
            break;
            case "delemoji": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} [emoji]`);
                let emojis = JSON.parse(fs.readFileSync('./settings/emoji.json'));
                const index = emojis.indexOf(text);
                if (index > -1) {
                    emojis.splice(index, 1);
                    fs.writeFileSync('./settings/emoji.json', JSON.stringify(emojis, null, 2));
                    reply(`Emoji ${text} berhasil dihapus.`);
                } else {
                    reply(`Emoji ${text} tidak ditemukan.`);
                }
            }
            break;
            case "typing": {
                if (!isOwner) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.autotyping) return reply(`Fitur Auto Typing sudah aktif.`);
                    wily.autotyping = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Typing berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.autotyping) return reply(`Fitur Auto Typing sudah mati.`);
                    wily.autotyping = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Typing berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "record": {
                if (!isOwner) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.autorecord) return reply(`Fitur Auto Record sudah aktif.`);
                    wily.autorecord = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Record berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.autorecord) return reply(`Fitur Auto Record sudah mati.`);
                    wily.autorecord = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Record berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "delemojibanyak": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} [emoji]`);
                let emojis = JSON.parse(fs.readFileSync('./settings/emoji.json'));
                const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[\u2700-\u27bf]|[\u2600-\u26ff]|[\u2b50-\u2b55])/g;
                let toDelete = text.match(emojiRegex);
                
                if (!toDelete || toDelete.length === 0) return reply("Tidak ada emoji valid yang ditemukan.");

                let deleted = [];
                let notFound = [];
                toDelete.forEach(emoji => {
                    const index = emojis.indexOf(emoji);
                    if (index !== -1) {
                        emojis.splice(index, 1);
                        deleted.push(emoji);
                    } else {
                        notFound.push(emoji);
                    }
                });

                if (deleted.length > 0) {
                    fs.writeFileSync('./settings/emoji.json', JSON.stringify(emojis, null, 2));
                    delete require.cache[require.resolve('./settings/emoji.json')];
                    let msg = `╭━━━『 DELETE EMOJI 』━━━┄\n`;
                    msg += `┃\n`;
                    msg += `┃ ✅ Berhasil (${deleted.length}): ${deleted.join(' ')}\n`;
                    if (notFound.length > 0) {
                        msg += `┃ ⚠️ Tidak ada (${notFound.length}): ${notFound.join(' ')}\n`;
                    }
                    msg += `┃\n`;
                    msg += `┃ 📊 Total: ${emojis.length} emoji\n`;
                    msg += `┃ Daftar: ${emojis.join(' ')}\n`;
                    msg += `╰━━━━━━━━━━━━━━━┄`;
                    reply(msg);
                } else {
                    let msg = `╭━━━『 DELETE EMOJI FAILED 』━━━┄\n`;
                    msg += `┃\n`;
                    msg += `┃ ⚠️ Tidak ada (${notFound.length}): ${notFound.join(' ')}\n`;
                    msg += `┃ ❌ Keterangan: Emoji tidak ditemukan.\n`;
                    msg += `┃\n`;
                    msg += `┃ 📊 Total: ${emojis.length} emoji\n`;
                    msg += `┃ Daftar: ${emojis.join(' ')}\n`;
                    msg += `┃\n`;
                    msg += `╰━━━━━━━━━━━━━━━┄`;
                    reply(msg);
                }
            }
            break;
            case "listemoji": {
                if (!isBot) return reply(config.message.owner);
                let emojis = JSON.parse(fs.readFileSync('./settings/emoji.json'));
                let msg = `╭━━━『 LIST EMOJI 』━━━┄\n`;
                msg += `┃\n`;
                msg += `┃ 📊 Total: ${emojis.length} emoji\n`;
                msg += `┃ Daftar: ${emojis.join(' ')}\n`;
                msg += `┃\n`;
                msg += `╰━━━━━━━━━━━━━━━┄`;
                reply(msg);
            }
            break;
            case "welcome": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.welcome) return reply(`maaf fitur tersebut sedang keadaan on bila mau mematikan ketik ${prefix + command} off`);
                    wily.welcome = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Welcome berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.welcome) return reply(`maaf fitur tersebut sedang keadaan off bila mau mengaktifkan ketik ${prefix + command} on`);
                    wily.welcome = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Welcome berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "goodbye": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.goodbye) return reply(`maaf fitur tersebut sedang keadaan on bila mau mematikan ketik ${prefix + command} off`);
                    wily.goodbye = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Goodbye berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.goodbye) return reply(`maaf fitur tersebut sedang keadaan off bila mau mengaktifkan ketik ${prefix + command} on`);
                    wily.goodbye = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Goodbye berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "setppbot": {
                if (!isBot) return reply(config.message.owner);
                let qmsg = m.quoted ? m.quoted : m;
                let mime = (qmsg.msg || qmsg).mimetype || '';
                if (!/image/.test(mime)) return reply(`Kirim/Reply gambar dengan caption ${prefix + command}`);
                try {
                    let media = await client.downloadAndSaveMediaMessage(qmsg, 'anime_girl', false);
                    let targetPath = './w-shennmine/lib/media/anime_girl.png';
                    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
                    fs.renameSync(media, targetPath);
                    await client.updateProfilePicture(client.user.id, { url: targetPath });
                    reply("Berhasil mengganti foto profil bot dan thumbnail menu ✅");
                } catch (e) {
                    console.log(e);
                    reply("Gagal mengganti foto profil bot ❌");
                }
            }
            break;
            case "get":{
                if (!isBot) return reply(config.message.owner);
                if (!/^https?:\/\//.test(text)) return reply(`*ex:* ${prefix + command} https://kyuurzy.site`);
                const ajg = await fetch(text);
                await reaction(m.chat, "⚡")
                
                if (ajg.headers.get("content-length") > 100 * 1024 * 1024) {
                    throw `Content-Length: ${ajg.headers.get("content-length")}`;
                }

                const contentType = ajg.headers.get("content-type");
                if (contentType.startsWith("image/")) {
                    return client.sendMessage(m.chat, {
                        image: { url: text }
                    }, { quoted: fquoted.packSticker });
                }
        
                if (contentType.startsWith("video/")) {
                    return client.sendMessage(m.chat, {
                        video: { url: text } 
                    }, { quoted: fquoted.packSticker });
                }
                
                if (contentType.startsWith("audio/")) {
                    return client.sendMessage(m.chat, {
                        audio: { url: text },
                        mimetype: 'audio/mpeg', 
                        ptt: true
                    }, { quoted: fquoted.packSticker });
                }
        
                let alak = await ajg.buffer();
                try {
                    alak = util.format(JSON.parse(alak + ""));
                } catch (e) {
                    alak = alak + "";
                } finally {
                    return reply(alak.slice(0, 65536));
                }
            }
            break
            case "insp": {
                if (!isBot) return reply(config.message.owner);
                if (!text && !m.quoted) return reply(`*reply:* ${prefix + command}`);
                let quotedType = m.quoted?.mtype || '';
                let penis = JSON.stringify({ [quotedType]: m.quoted }, null, 2);
                const acak = `insp-${crypto.randomBytes(6).toString('hex')}.json`;
                
                await client.sendMessage(m.chat, {
                    document: Buffer.from(penis),
                    fileName: acak,
                    mimetype: "application/json"
                }, { quoted: fquoted.packSticker })
            }
            break
            case 'tagall':{
                if (!isBot) return reply(config.message.owner);
                const textMessage = args.join(" ") || "nothing";
                let teks = `tagall message :\n> *${textMessage}*\n\n`;
                const groupMetadata = await client.groupMetadata(m.chat);
                const participants = groupMetadata.participants;
                for (let mem of participants) {
                    teks += `@${mem.id.split("@")[0]}\n`;
                }

                client.sendMessage(m.chat, {
                    text: teks,
                    mentions: participants.map((a) => a.id)
                }, { quoted: fquoted.packSticker });
            }
            break
            case "exec": {
                if (!isBot) return reply(config.message.owner);
                if (!budy.startsWith(".exec")) return;
                
                const { exec } = require("child_process");
                const args = budy.trim().split(' ').slice(1).join(' ');
                if (!args) return reply(`*ex:* ${prefix + command} ls`);
                exec(args, (err, stdout) => {
                    if (err) return reply(String(err));
                    if (stdout) return reply(stdout);
                });
            }
            break;
            case "eval": {
                if (!isBot) return reply(config.message.owner);
                if (!budy.startsWith(".eval")) return;
                
                const args = budy.trim().split(' ').slice(1).join(' ');
                if (!args) return reply(`*ex:* ${prefix + command} m.chat`);
                let teks;
                try {
                    teks = await eval(`(async () => { ${args.startsWith("return") ? "" : "return"} ${args} })()`);
                } catch (e) {
                    teks = e;
                } finally {
                    await reply(require('util').format(teks));
                }
            }
            break;
            default:
        }
    } catch (err) {
        console.log(require("util").format(err));
    }
};

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
