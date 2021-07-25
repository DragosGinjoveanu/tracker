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
	label_color VARCHAR(255)
);

CREATE TABLE habit_completion (
	name VARCHAR(255) REFERENCES users(name) ON DELETE CASCADE,
	id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
	habit_date DATE,
	status BOOLEAN
);

//tests
SELECT * FROM habits LEFT JOIN habitcompletion ON habits.name = habitcompletion.name AND habits.id = habitcompletion.id
WHERE EXTRACT(DAY FROM habit_date) > 21 AND EXTRACT(DAY FROM habit_date) < 25 AND status = true;

INSERT INTO habits (title, name, label) VALUES ('writing', 'a', 'important');
INSERT INTO habits (title, name, label) VALUES ('journaling', 'a', 'basic');

INSERT INTO habits (title, name, label) VALUES ('writing', 'aaaa', 'important');
INSERT INTO habits (title, name, label) VALUES ('journaling', 'aaaa', 'basic');
INSERT INTO habitcompletion (name, id, habit_date, status) VALUES ('a', '2', '2021-07-22', 'true');
INSERT INTO habitcompletion (name, id, habit_date, status) VALUES ('aaa', '3', '2021-07-23', 'true');
INSERT INTO habitcompletion (name, id, habit_date, status) VALUES ('aaaa','3', '2021-07-24', 'false');