CREATE TABLE book 
(
book_id SERIAL PRIMARY KEY,
title VARCHAR (255) NOT NULL,
author VARCHAR(255) NOT NULL,
published_year int,
genre VARCHAR(255) NOT NULL,
page_count int NOT NULL,
read boolean NOT NULL,
book_category_id int REFERENCES book_category (book_category_id)
				)