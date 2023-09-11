class User 
{
    /**
     * Creates a user object 
     * @param {number} id 
     * @param {string} username 
     * @param {string} password 
     * @param {string} permission 
     * @param {string} secret 
     */
    constructor (id, username, password, permission, secret)
    {
        this.id = id;
        this.username = username;
        this.password = password;
        this.permission = permission;
        this.secret = secret;
    }
}

module.exports = User;