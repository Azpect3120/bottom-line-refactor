-- @block
INSERT INTO users (username, password, permission) VALUES ('Azpect', 'ea385c4489239eb598212f23c89eb52d:0664b1d824aabb4721513393aed153ab', 'Dev');

-- @block
INSERT INTO users (username, password, permission) VALUES ('ConnieH', 'd1d15c321c523cbcfe2c18f92168cb5b:78115351cc86f253e83a60a9f6183912', 'Admin');


-- @block
UPDATE users 
SET secret = null 
WHERE id = id;