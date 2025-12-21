CREATE TABLE game_tag_assignment(
game_id int NOT NULL,
game_tag_id int NOT NULL,
PRIMARY KEY(game_id, game_tag_id)
)