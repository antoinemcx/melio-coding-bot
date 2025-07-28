async function findUserById(bot, id) {
    return new Promise(async (resolve, reject) => {
        try {
            const rows = await bot.db.query(
                `SELECT xp, level FROM leveling WHERE userID = ${id};`
            );
            resolve(rows[0]);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Retrieves the rank of a user based on their XP.
 * @param {Object} client - The bot client
 * @param {number} userId - The ID of the user to get the rank for
 * @returns {Promise<Object>} A promise that resolves to the user's rank data
 */
async function getRankByUserId(client, userId) {
    return await client.db.query(
        `SELECT count(*) AS position FROM leveling WHERE xp+0 > (
            SELECT xp FROM leveling WHERE userID = ${userId}
        );`
    );
}

module.exports = { findUserById, getRankByUserId }