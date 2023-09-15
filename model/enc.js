// Dependencies
const crypto = require("crypto");
require("dotenv").config();

const algorithm = "aes-256-cbc";
const secretKey = process.env.CRYPTO_KEY; 

/**
 * Encrypts a string using the secret key stored in the env file (32 bytes max length)
 * @param {string} string Plain string to be encrypted
 * @returns Encrypted string
 */
function encryptString (string) {
    const vector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), vector);
    let encrypted = cipher.update(string, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return `${vector.toString("hex")}:${encrypted}`
}

/**
 * Decrypts a string using the secret key stored in the env file (32 bytes max length)
 * @param {string} string Encrypted string to be decrypted 
 * @returns Decrypted string
 */
function decryptString (string) {
    const [ vector, encrypted ] = string.split(":");
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(vector, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}

// Export functions
exports.encryptString = encryptString;
exports.decryptString = decryptString;