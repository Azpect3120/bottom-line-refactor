// Dependencies
const bcrypt = require("bcrypt");

// Hash a password
/**
 * Creates a hash that can be used to validate against a string 
 * @param {string} string String to be later compared against
 * @returns {string} Hashed string
 */
function hashString (string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(string, salt);
    return hash;
};

/**
 * Compares a password to a hash
 * @param {string} password Password to test
 * @param {string} hash Hash used to compare to
 * @returns {boolean} Password matched with the hash
 */
function compareHash (password, hash) {
    const result = bcrypt.compareSync(password, hash);
    return result;
}

// Export functions
exports.hashString = hashString;
exports.compareHash = compareHash;