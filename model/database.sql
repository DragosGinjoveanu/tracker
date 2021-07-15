CREATE DATABASE tracker_database;

CREATE TABLE stats? references users(name) ??? pt top
Points
pages
done/undone todos

ar trebui updatata de fiecare data cand creem/stergem un anumit task/pagina jurnal etc

CREATE TABLE users (
	name VARCHAR (50) PRIMARY KEY,
	password VARCHAR (50),
	points INT DEFAULT 0
);

CREATE TABLE journals (
	name varchar(50) references users(name),
	id SERIAL,
	title varchar(255),
	content varchar(255)
);

CREATE TABLE todos (
	name varchar(50) references users(name),
	id SERIAL,
	title varchar(255),
	content varchar(255),
	todo_date date,
	done BOOLEAN DEFAULT false
);