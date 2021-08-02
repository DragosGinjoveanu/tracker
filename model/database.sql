CREATE DATABASE tracker_database;

CREATE TABLE users (
	name VARCHAR (255) PRIMARY KEY,
	password VARCHAR (50),
	points INT DEFAULT 0
);

CREATE TABLE journals (
	name VARCHAR(255) REFERENCES users(name) ON DELETE CASCADE,
	id SERIAL,
	title VARCHAR(255),
	content VARCHAR(255)
);

CREATE TABLE todos (
	name VARCHAR(255) REFERENCES users(name) ON DELETE CASCADE,
	id SERIAL,
	title VARCHAR(255),
	content VARCHAR(255),
	todo_date DATE,
	done BOOLEAN DEFAULT false
);

CREATE TABLE habits (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) REFERENCES users(name) ON DELETE CASCADE,
	title VARCHAR(255),
	label VARCHAR(255),
	label_color VARCHAR(255),
	UNIQUE(name, title)
);

CREATE TABLE habit_completion (
	name VARCHAR(255) REFERENCES users(name) ON DELETE CASCADE,
	id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
	habit_date DATE DEFAULT CURRENT_DATE,
	status BOOLEAN
);