CREATE TABLE game_tag_assignment(
game_id int REFERENCES game(game_id),
game_tag_id int REFERENCES game_tag(tag_id),
PRIMARY KEY(game_id, game_tag_id)
)