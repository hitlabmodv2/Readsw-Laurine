const fs = require('fs');
const path = require('path');

/**
 * Story Tracker Library
 * Digunakan untuk mencatat story yang sudah direaksi agar tidak terlewat
 * meskipun bot restart.
 */

const trackerPath = path.join(__dirname, '../database/story_tracker.json');

// Pastikan file database ada
if (!fs.existsSync(trackerPath)) {
    fs.mkdirSync(path.dirname(trackerPath), { recursive: true });
    fs.writeFileSync(trackerPath, JSON.stringify([], null, 2));
}

module.exports = {
    /**
     * Mengecek apakah story sudah pernah direaksi
     * @param {string} id - ID story (mek.key.id)
     * @returns {boolean}
     */
    isReacted: (id) => {
        try {
            if (!fs.existsSync(trackerPath)) return false;
            const data = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
            return data.includes(id);
        } catch (e) {
            console.error('Error reading story tracker:', e);
            return false;
        }
    },

    /**
     * Mencatat story sebagai sudah direaksi
     * @param {string} id - ID story
     */
    addReacted: (id) => {
        try {
            let data = [];
            if (fs.existsSync(trackerPath)) {
                data = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
            }
            if (!data.includes(id)) {
                data.push(id);
                // Batasi penyimpanan (misal 1000 ID terakhir) agar file tidak terlalu besar
                if (data.length > 1000) data.shift();
                fs.writeFileSync(trackerPath, JSON.stringify(data, null, 2));
            }
        } catch (e) {
            console.error('Error adding to story tracker:', e);
        }
    }
};
