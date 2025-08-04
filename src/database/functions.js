/**
 * Finds a user by ID.
 * @param {Object} client - The bot client
 * @param {string} id - The user ID
 * @returns {Promise<Object>} A promise that resolves to user xp and level
 */
async function findUserById(client, id) {
    return new Promise(async (resolve, reject) => {
        try {
            const rows = await client.db.query(
                `SELECT xp, level FROM leveling WHERE userID = ${id};`
            );
            resolve(rows[0]);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Finds a user by ID, creates them if they don't exist.
 * @param {Object} client - The bot client
 * @param {string} id - The user ID
 * @returns {Promise<Object>} A promise that resolves to user xp and level
 */
async function findOrCreateUserById(client, id) {
    try {
        const userData = await findUserById(client, id);
        
        if (userData) {
            return userData;
        } else {
            // User doesn't exist, create them
            await client.db.query(
                `INSERT INTO leveling (userID, xp, level) VALUES (${id}, 0, 0);`
            );
            return { xp: 0, level: 0 };
        }
    } catch (error) {
        throw error;
    }
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

module.exports = { findUserById, findOrCreateUserById, getRankByUserId };