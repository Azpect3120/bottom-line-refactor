SELECT * FROM users;
SELECT * FROM sessions;
SELECT * FROM clients;
SELECT * FROM accounts;


-- @block
SELECT clients.name, accounts.account_name, account_user, account_password, account_notes 
FROM clients 
INNER JOIN accounts ON clients.id = accounts.client_id;