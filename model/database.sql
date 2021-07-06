CREATE DATABASE tracker_database;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	password VARCHAR (50),
	name VARCHAR (50) UNIQUE
);