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

module.exports = { findUserById }