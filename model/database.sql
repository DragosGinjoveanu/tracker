CREATE DATABASE tracker_database;

CREATE TABLE users (
	name VARCHAR (50) PRIMARY KEY,
	password VARCHAR (50)
);

CREATE TABLE journals (
	name varchar(50) references users(name),
	id SERIAL,
	title varchar(255),
	content varchar(255)
);