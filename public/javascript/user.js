class User 
{
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