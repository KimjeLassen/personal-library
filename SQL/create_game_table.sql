CREATE TABLE game (
game_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
platform int REFERENCES game_platform (platform_id),
release_year int NOT NULL,
genre VARCHAR(255) NOT NULL,
order_index SERIAL NOT NULL,
finished boolean NOT NULL
)