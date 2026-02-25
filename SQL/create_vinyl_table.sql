CREATE  TABLE vinyl
(
    vinyl_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    release_year INT NOT NULL,
    genre VARCHAR(255) NOT NULL
)