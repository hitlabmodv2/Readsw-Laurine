
// Decoded logic from AntiTagSW
// Source: attached_assets/Pasted--antitagsw-var-0x2b51d5-0xbfce-function-0x122bdf-0x53ac_1767882160268.txt

/**
 * Decoded logic summary:
 * 1. Checks if antitagsw is enabled in database for the current chat.
 * 2. Checks if mtype is 'groupStatusMentionMessage'.
 * 3. If it is a status mention:
 *    - If sender is Admin: Sends "OW NER MAH UD AH PASTI B EBAS😹" (Owner/Admin bypass).
 *    - If sender is Creator/Owner: Sends "MIN MAH BE BAS😹" (Admin/Owner bypass).
 *    - Otherwise:
 *      a. Deletes the message.
 *      b. Sends warning: "```「 Tag Status Terdeteksi 」```\n\n@user KAMU MENGTAG STATUSNYA\n> KAMU DI KICK😹".
 *      c. Removes (kicks) the participant from the group.
 */

async function antitagswHandler(client, m, { isAdmins, isBotAdmins, isOwner, db }) {
    const from = m.chat;
    const sender = m.sender;

    // Check if feature is enabled for this chat
    if (!db.chats[from]?.antitagsw) return;

    // Check for Status Mention Message Type
    // Based on the decoded string: 'groupStatusMentionMessage'
    if (m.mtype === 'groupStatusMentionMessage') {
        
        // Bypass for Admins or Owners
        if (isAdmins) {
            return client.sendMessage(from, { text: "```「 Tag Status Terdeteksi 」```\n\nADMIN MAH BEBAS😹" });
        }
        
        if (isOwner) {
            return client.sendMessage(from, { text: "```「 Tag Status Terdeteksi 」```\n\nOWNER MAH UDAH PASTI BEBAS😹" });
        }

        // Action for regular members
        try {
            // 1. Send warning message
            await client.sendMessage(from, {
                text: ````「 Tag Status Terdeteksi 」```\n\n@${sender.split('@')[0]} KAMU MENGTAG STATUSNYA\n> KAMU DI KICK😹`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: m });

            // 2. Delete the offending message
            if (isBotAdmins) {
                await client.sendMessage(from, {
                    delete: {
                        remoteJid: from,
                        fromMe: false,
                        id: m.id,
                        participant: sender
                    }
                });
            }

            // 3. Kick the user
            if (isBotAdmins) {
                await client.groupParticipantsUpdate(from, [sender], 'remove');
            }
            
            console.log(`[AntiTagSW] User ${sender} kicked from ${from} for status mention.`);
        } catch (e) {
            console.error('[AntiTagSW] Error taking action:', e);
        }
    }
}

module.exports = { antitagswHandler };
