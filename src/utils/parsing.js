/**
 * Parses a duration in milliseconds into a human-readable format.
 * @param {number} ms - The duration in milliseconds to parse
 * @returns {string} a string representing the duration in days, hours,
 * minutes, and seconds.
 */
function parseDuration(ms) {
    let seconds = ms / 1000,
        days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;

    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    if (days) {
        return `${days} day, ${hours} hours, ${minutes} minutes`;
    } else if (hours) {
        return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else if (minutes) {
        return `${minutes} minutes, ${seconds} seconds`;
    }

    return `${seconds} second(s)`;
};

/**
 * Formats a number of bytes into a human-readable string.
 * @param {number} a - The number of bytes to format
 * @param {number} b - The number of decimal places to include (2 if nothing)
 * @returns {string} A human-readable string representation of the byte value
 */
function formatBytes (a, b) {
    if (0 == a) {
        return "0 Bytes";
    }

    let c = 1024,
        d = b || 2,
        e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

module.exports = { parseDuration, formatBytes };