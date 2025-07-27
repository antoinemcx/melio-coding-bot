/**
 * Gets the maximum XP required for a given level.
 * @param {number} level - The level to calculate the maximum XP for
 * @return {number} The maximum XP required for the specified level
 */
function getMaxXP(level) {
    return Math.floor(level * (225 + (level > 1 ? 2*(2**(level/2)) : 0)));
}
        
/**
 * Calculates the level based on the given gained XP.
 * @param {number} xp - The XP to calculate the level for
 * @return {number} The level corresponding to the given XP
 */
function getLevel(xp) {
    let result;
    let i = 1;

    if(xp < getMaxXP(1)) {
        result = 1;
    } else {
        while(xp > getMaxXP(i)) {
            i++;
        }
        result = i;
    }

    return result - 1;
}

/**
 * Calculates the XP required to reach the next level,
 * based on the current level.
 * @param {number} currentLevel - The current level of the user
 * @returns {number} The XP required to reach the next level
 */
function getNextLevelXP(currentLevel) {
    const newLevel = currentLevel + 1;
    return Math.floor(newLevel * (
        225 + (newLevel > 1 ? 2 * (2 ** (newLevel / 2)) : 0)
    ));
}

/**
 * Determines the role associated with a specific level based on
 * the leveling roles configuration.
 * @param {number} level - The level to check
 * @param {Object} levelingRoles - An object mapping levels to roles
 * @return {Array|null} An array containing the role name and ID if the
 * level has a role, otherwise null
 */
function getRoleForLevel(level, levelingRoles) {
    const levels = getRolesLevels(levelingRoles);
    let result = null;

    if(level === levels[0]) {
        result = 1;
    } else if(level > levels[0]) {
        let i = 0;
        while(level >= levels[i]) {
            i++;
        }
        result = levels[i - 1];
    }
    return result === null ? null : levelingRoles[result];
}

/**
 * Retrieves the levels from the leveling roles configuration.
 * @param {Object} levelingRoles - An object mapping levels to roles
 * @returns {Array} An array of levels present in the leveling roles
 */
function getRolesLevels(levelingRoles) {
    let levels = [];
    for (let key in levelingRoles) {
        levels.push(parseInt(key));
    }
    return levels;
}

module.exports = { getMaxXP, getLevel, getNextLevelXP, getRoleForLevel, getRolesLevels };