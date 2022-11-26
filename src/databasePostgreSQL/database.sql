CREATE DATABASE todo_database;

-- psql -U postgres
-- \dt
--\c into todo_database
CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   email VARCHAR(255),
   password VARCHAR(255),
   created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
   updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TYPE enum AS ENUM ('NotStarted', 'OnGoing', 'Completed');

CREATE TABLE todo(
   id SERIAL PRIMARY KEY,
   user_id INT NOT NULL,
   name VARCHAR(255),
   description VARCHAR(255),
   created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
   updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
   status     enum                             NOT NULL,
   CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	      REFERENCES users(id)
   
);

INSERT INTO todo (status) VALUES('NotStarted'),('OnGoing'),('Completed')

CREATE  FUNCTION update_updated_on_user_task()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_task_updated_on
BEFORE UPDATE
ON
todo
FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_user_task();
