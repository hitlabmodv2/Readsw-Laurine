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
        if (wily.autotyping) {
            await client.sendPresenceUpdate('composing', from);
        }
        if (wily.autorecord) {
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
┃ ▢ ${prefix}welcome on/off
┃ ▢ ${prefix}goodbye on/off
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
┃ ▢ ${prefix}notifgc
┃ ▢ ${prefix}typing
┃ ▢ ${prefix}record
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
            case "notifgc": {
                if (!isOwner) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.notifgc) return reply(`╭━━━『 *NOTIFIKASI* 』━━━┄\n┃\n┃ ⚠️ *Status:* Sudah Aktif\n┃ 📝 *Info:* Fitur Notif GC sudah dalam keadaan ON\n┃\n┣━━『 *PANDUAN* 』━━┄\n┃\n┃ 💡 *Matikan:* Ketik ${prefix + command} off\n┃ 📖 *Penjelasan:* Bot akan mengirimkan notifikasi setiap ada perubahan di grup.\n┃\n╰━━━━━━━━━━━━━━━━━━┄`);
                    wily.notifgc = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply(`╭━━━『 *NOTIFIKASI* 』━━━┄\n┃\n┃ ✅ *Status:* Berhasil Diaktifkan\n┃ 🕒 *Waktu:* ${moment().tz("Asia/Jakarta").format("HH:mm:ss")} WIB\n┃\n┣━━『 *PANDUAN* 』━━┄\n┃\n┃ 📖 *Penjelasan:* Bot sekarang akan mengirimkan notifikasi setiap ada perubahan di grup.\n┃\n╰━━━━━━━━━━━━━━━━━━┄`);
                } else if (action === 'off') {
                    if (!wily.notifgc) return reply(`╭━━━『 *NOTIFIKASI* 』━━━┄\n┃\n┃ ⚠️ *Status:* Sudah Mati\n┃ 📝 *Info:* Fitur Notif GC sudah dalam keadaan OFF\n┃\n┣━━『 *PANDUAN* 』━━┄\n┃\n┃ 💡 *Aktifkan:* Ketik ${prefix + command} on\n┃ 📖 *Penjelasan:* Bot tidak akan lagi mengirimkan notifikasi perubahan grup.\n┃\n╰━━━━━━━━━━━━━━━━━━┄`);
                    wily.notifgc = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply(`╭━━━『 *NOTIFIKASI* 』━━━┄\n┃\n┃ ❌ *Status:* Berhasil Dimatikan\n┃ 🕒 *Waktu:* ${moment().tz("Asia/Jakarta").format("HH:mm:ss")} WIB\n┃\n┣━━『 *PANDUAN* 』━━┄\n┃\n┃ 📖 *Penjelasan:* Bot tidak akan lagi mengirimkan notifikasi perubahan grup.\n┃\n╰━━━━━━━━━━━━━━━━━━┄`);
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "antitagsw": {
                reply("Fitur ini telah dihapus.");
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
                    reply('Fitur Welcome Message berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.welcome) return reply(`maaf fitur tersebut sedang keadaan off bila mau mengaktifkan ketik ${prefix + command} on`);
                    wily.welcome = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Welcome Message berhasil dimatikan ❌');
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
                    reply('Fitur Goodbye Message berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.goodbye) return reply(`maaf fitur tersebut sedang keadaan off bila mau mengaktifkan ketik ${prefix + command} on`);
                    wily.goodbye = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Goodbye Message berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "eval": {
                if (!isBot) return;
                try {
                    let evaled = await eval(text);
                    if (typeof evaled !== "string") evaled = util.inspect(evaled);
                    reply(evaled);
                } catch (e) {
                    reply(String(e));
                }
            }
            break;
            case "exec": {
                if (!isBot) return;
                exec(text, (err, stdout) => {
                    if (err) return reply(String(err));
                    if (stdout) reply(stdout);
                });
            }
            break;
            case "csesi": {
                if (!isBot) return reply(config.message.owner);
                try {
                    const sessionPath = `./${config.session}`;
                    if (fs.existsSync(sessionPath)) {
                        fs.rmSync(sessionPath, { recursive: true, force: true });
                        reply("Folder session berhasil dihapus. Bot akan restart.");
                        process.exit(0);
                    } else {
                        reply("Folder session tidak ditemukan.");
                    }
                } catch (e) {
                    reply(`Gagal menghapus session: ${e.message}`);
                }
            }
            break;
            case "tagall": {
                if (!isGroup) return reply(config.message.group);
                if (!isAdmins && !isBot) return reply(config.message.admin);
                let teks = `*👥 TAG ALL*\n\n*Pesan:* ${text || 'Tidak ada pesan'}\n\n`;
                for (let mem of participants) {
                    teks += `▢ @${mem.id.split('@')[0]}\n`;
                }
                client.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m });
            }
            break;
            case "typing": {
                if (!isBot) return reply(config.message.owner);
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
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                const action = text.toLowerCase();
                if (action === 'on') {
                    if (wily.autorecord) return reply(`Fitur Auto Recording sudah aktif.`);
                    wily.autorecord = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Recording berhasil diaktifkan ✅');
                } else if (action === 'off') {
                    if (!wily.autorecord) return reply(`Fitur Auto Recording sudah mati.`);
                    wily.autorecord = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Recording berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "addemoji": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} <emoji>`);
                let emojis = JSON.parse(fs.readFileSync('./settings/emoji.json'));
                if (emojis.includes(text)) return reply("Emoji sudah ada dalam daftar.");
                emojis.push(text);
                fs.writeFileSync('./settings/emoji.json', JSON.stringify(emojis, null, 2));
                reply(`Emoji ${text} berhasil ditambahkan ✅`);
            }
            break;
            case "delemoji": {
                if (!isBot) return reply(config.message.owner);
                if (!text) return reply(`Gunakan: ${prefix + command} <emoji>`);
                let emojis = JSON.parse(fs.readFileSync('./settings/emoji.json'));
                if (!emojis.includes(text)) return reply("Emoji tidak ditemukan dalam daftar.");
                const index = emojis.indexOf(text);
                emojis.splice(index, 1);
                fs.writeFileSync('./settings/emoji.json', JSON.stringify(emojis, null, 2));
                reply(`Emoji ${text} berhasil dihapus ❌`);
            }
            break;
            case "listemoji": {
                let emojis = JSON.parse(fs.readFileSync('./settings/emoji.json'));
                reply(`*LIST EMOJI REACTION SW:*\n\n${emojis.join(' ')}`);
            }
            break;
            case "setppbot": {
                if (!isBot) return reply(config.message.owner);
                if (!/image/.test(mime)) return reply(`Kirim/Reply foto dengan caption ${prefix + command}`);
                if (/webp/.test(mime)) return reply(`Kirim/Reply foto (bukan stiker) dengan caption ${prefix + command}`);
                
                try {
                    let media = await client.downloadMediaMessage(quoted);
                    await client.updateProfilePicture(client.user.id, media);
                    reply('Berhasil mengganti foto profil bot ✅');
                } catch (e) {
                    console.error(e);
                    reply(`Gagal mengganti foto profil: ${e.message}`);
                }
            }
            break;
            case "get": {
                if (!text) return reply("Masukkan URL!");
                try {
                    const res = await axios.get(text);
                    reply(util.inspect(res.data).slice(0, 1000));
                } catch (e) {
                    reply(String(e));
                }
            }
            break;
            case "insp": {
                if (!text) return reply("Harap berikan data untuk di-inspect.");
                try {
                    const parsed = eval(text);
                    reply(util.inspect(parsed));
                } catch (e) {
                    reply(String(e));
                }
            }
            break;
            default:
                if (budy.startsWith('=>')) {
                    if (!isBot) return;
                    try {
                        let evaled = await eval(budy.slice(2));
                        if (typeof evaled !== "string") evaled = util.inspect(evaled);
                        reply(evaled);
                    } catch (err) {
                        reply(String(err));
                    }
                }

                if (budy.startsWith('>')) {
                    if (!isBot) return;
                    try {
                        let evaled = await eval(`(async () => { ${budy.slice(1)} })()`);
                        if (typeof evaled !== "string") evaled = util.inspect(evaled);
                        reply(evaled);
                    } catch (err) {
                        reply(String(err));
                    }
                }

                if (budy.startsWith('$')) {
                    if (!isBot) return;
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return reply(String(err));
                        if (stdout) reply(stdout);
                    });
                }
        }
    } catch (e) {
        console.log(e);
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});