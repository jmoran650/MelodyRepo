CREATE TABLE User (
  userId INT PRIMARY KEY,
  userName VARCHAR(10),
  userPassword VARCHAR(10)
);

CREATE TABLE Friends (
  userid1 INT REFERENCES Users(userId),
  userid2 INT REFERENCES Users(userId),
  PRIMARY KEY (userid1, userid2),
  friendshipStatus VARCHAR(10)
);

CREATE TABLE Posts (
  postID INT PRIMARY KEY,
  userID INT REFERENCES Users(userId),
  postType VARCHAR(10),
  postContent VARCHAR(10)
);

INSERT INTO User (userId, userName, userPassword) VALUES (1, 'Jibbum', 'Jibbum');
INSERT INTO User (userId, userName, userPassword) VALUES (2, 'Michael', 'Michael');
INSERT INTO User (userId, userName, userPassword) VALUES (3, 'Hafez', 'Hafez');

INSERT INTO Friends (userid1, userid2, friendshipStatus) VALUES (1, 2, 'ACCEPTED');

INSERT INTO Posts (postID, userID, postType, postContent) VALUES (650, 1, 'Scent', 'Blah');