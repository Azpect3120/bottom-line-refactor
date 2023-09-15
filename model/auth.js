// Dependencies
const speakeasy = require("speakeasy");

/**
 * Generates a base32 encoded secret for 2FA 
 * @returns {string} Base32 encoded generated key
 */
function createSecret () {
    return speakeasy.generateSecret().base32;
}

/**
 * Validates the token using the secret
 * @param {string} token 6 digit token from the authenticator app
 * @param {string} secret secret used for connecting with the authenticator app
 * @returns {boolean} Token was validated using the secret 
 */
function validateToken (token, secret) {
    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
    });
}


exports.createSecret = createSecret;
exports.validateToken = validateToken;