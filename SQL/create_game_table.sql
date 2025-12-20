CREATE TABLE game (
gameid SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
platform int REFERENCES gameplatform (platformid),
releaseyear int NOT NULL,
genre VARCHAR(255) NOT NULL,
orderindex int NOT NULL,
finished boolean NOT NULL
)