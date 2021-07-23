CREATE DATABASE tracker_database;

CREATE TABLE users (
	name VARCHAR (50) PRIMARY KEY,
	password VARCHAR (50),
	points INT DEFAULT 0
);

CREATE TABLE journals (
	name VARCHAR(50) REFERENCES users(name),
	id SERIAL,
	title VARCHAR(255),
	content VARCHAR(255)
);

CREATE TABLE todos (
	name VARCHAR(50) REFERENCES users(name),
	id SERIAL,
	title VARCHAR(255),
	content VARCHAR(255),
	todo_date DATE,
	done BOOLEAN DEFAULT false
);

CREATE TABLE habits (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) REFERENCES users(name),
	title VARCHAR(50),
	label VARCHAR(50)
);

CREATE TABLE habitcompletion (
	name VARCHAR(50) REFERENCES users(name),
	id INTEGER REFERENCES habits(id),
	habit_date DATE,
	status BOOLEAN
);

//tests
SELECT * FROM habits LEFT JOIN habitcompletion ON habits.name = habitcompletion.name AND habits.id = habitcompletion.id
WHERE EXTRACT(DAY FROM habit_date) > 21 AND EXTRACT(DAY FROM habit_date) < 25 AND status = true;

INSERT INTO habits (title, name, label) VALUES ('writing', 'aaa', 'important');
INSERT INTO habits (title, name, label) VALUES ('journaling', 'aaa', 'basic');

INSERT INTO habits (title, name, label) VALUES ('writing', 'aaaa', 'important');
INSERT INTO habits (title, name, label) VALUES ('journaling', 'aaaa', 'basic');
INSERT INTO habitcompletion (name, id, habit_date, status) VALUES ('aaaa', '3', '2021-07-22', 'true');
INSERT INTO habitcompletion (name, id, habit_date, status) VALUES ('aaa', '3', '2021-07-23', 'true');
INSERT INTO habitcompletion (name, id, habit_date, status) VALUES ('aaaa','3', '2021-07-24', 'false');