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
            m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
            m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
            m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId ||
            m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
        );
        
        const sender = m.key.fromMe ? client.user.id.split(":")[0] + "@s.whatsapp.net" ||
              client.user.id : m.key.participant || m.key.remoteJid;
        
        const senderNumber = sender.split('@')[0];
        const budy = (typeof m.text === 'string' ? m.text : '');
        const prefa = ["", "!", ".", ",", "🐤", "🗿"];

        const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
        const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const botNumber = await client.decodeJid(client.user.id);
        const isBot = botNumber.includes(senderNumber)
        
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const command2 = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
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
        
        if (m.message && m.key.remoteJid !== "status@broadcast") {
            if (isCmd || isBot) {
                console.log(chalk.bgHex("#4a69bd").bold(`▢ New Message`));
                console.log(
                    `▢ Tanggal: ${new Date().toLocaleString()}\n` +
                    `▢ Pesan: ${m.body || m.mtype}\n` +
                    `▢ Pengirim: ${pushname}\n` +
                    `▢ JID: ${senderNumber}\n` +
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
            case "menu":{
                if (!isBot) return
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const formattedUsedMem = formatSize(usedMem);
                const formattedTotalMem = formatSize(totalMem);
                let timestamp = speed()
                let latensi = speed() - timestamp
                let menu = `
 ▢ speed: ${latensi.toFixed(4)} s
 ▢ runtime: ${runtime(process.uptime())}
 ▢ RAM: ${formattedUsedMem} / ${formattedTotalMem}
                
command:
 ▢ ${prefix}tagall
 ▢ ${prefix}get
 ▢ ${prefix}insp
 ▢ ${prefix}csesi
 ▢ ${prefix}exec
 ▢ ${prefix}eval
 ▢ ${prefix}reactionsw
 ▢ ${prefix}addemoji
 ▢ ${prefix}delemoji
 ▢ ${prefix}listemoji
 ▢ ${prefix}mesinfo`
                    await client.sendMessage(m.chat, {
                        interactiveMessage: {
                            title: menu,
                            footer: config.settings.footer,
                            thumbnail: "https://github.com/kiuur.png",
                            nativeFlowMessage: {
                                messageParamsJson: JSON.stringify({
                                    limited_time_offer: {
                                        text: "shenń, yes 1437",
                                        url: "t.me/kiuurmine",
                                        copy_code: "shenń, yes 1437",
                                        expiration_time: Date.now() * 999
                                    },
                                    bottom_sheet: {
                                        in_thread_buttons_limit: 2,
                                        divider_indices: [1, 2, 3, 4, 5, 999],
                                        list_title: "shennminè",
                                        button_title: "shenń"
                                    },
                                    tap_target_configuration: {
                                        title: "▸ X ◂",
                                        description: "bomboclard",
                                        canonical_url: "https://t.me/sh3nnmine",
                                        domain: "shop.example.com",
                                        button_index: 0
                                    }
                                }),
                                buttons: [
                                    {
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
                                    },
                                    {
                                        name: "call_permission_request",
                                        buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
                                    },
                                    {
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "shennminè",
                                            sections: [
                                                {
                                                    title: "# X - the best",
                                                    highlight_label: "label",
                                                    rows: [
                                                        {
                                                            title: "@dittsans", 
                                                            description: "b!cth",
                                                            id: "row_1"
                                                        },
                                                        { 
                                                            title: "@kyuucode",
                                                            description: "sh3nnmine",
                                                            id: "row_2"
                                                        },
                                                        { 
                                                            title: "@devorsixcore",
                                                            description: "rock and roll",
                                                            id: "row_3" 
                                                        }
                                                    ]
                                                }
                                            ],
                                            has_multiple_buttons: true
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
            case "reactionsw": {
                if (!isBot) return;
                if (!text) return reply(`Gunakan: ${prefix + command} on/off`);
                let wily = JSON.parse(fs.readFileSync('./settings/wily.json'));
                if (text.toLowerCase() === 'on') {
                    wily.reactionsw = true;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Reaction SW berhasil diaktifkan ✅');
                } else if (text.toLowerCase() === 'off') {
                    wily.reactionsw = false;
                    fs.writeFileSync('./settings/wily.json', JSON.stringify(wily, null, 2));
                    reply('Fitur Auto Reaction SW berhasil dimatikan ❌');
                } else {
                    reply(`Gunakan: ${prefix + command} on/off`);
                }
            }
            break;
            case "addemoji": {
                if (!isBot) return;
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
                if (!isBot) return;
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
                if (!isBot) return;
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
            case "get":{
                if (!isBot) return
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
                if (!isBot) return
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
                if (!isBot) return
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
                if (!isBot) return;
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
                if (!isBot) return;
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
