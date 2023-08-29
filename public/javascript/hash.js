// Dependencies
const bcrypt = require("bcrypt");

// Hash a password
function hashString (string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(string, salt);
    return hash;
};

function unHash (password) {

}

// Check if a password is valid: compare a password to a hash
function compareHash (password, hash) {
    const result = bcrypt.compareSync(password, hash);
    return result;
}

// Export functions
exports.hashString = hashString;
exports.compareHash = compareHash;