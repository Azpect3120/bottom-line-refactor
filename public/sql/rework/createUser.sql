-- @block
INSERT INTO users (username, password, permission) VALUES ('Azpect', 'ea385c4489239eb598212f23c89eb52d:0664b1d824aabb4721513393aed153ab', 'Dev');

-- @block
INSERT INTO users (username, password, permission) VALUES ('ConnieH', 'd1d15c321c523cbcfe2c18f92168cb5b:78115351cc86f253e83a60a9f6183912', 'Admin');

-- @block
INSERT INTO users (username, password, permission) VALUES ('AustinH', '588b2205579a4ee48f9014f2742fd1b0:a78b1dc61508e26bdc2108134ef0a5dd', 'User');


-- @block
UPDATE users 
SET secret = null 
WHERE id = id;