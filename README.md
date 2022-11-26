## About
-- psql -U postgres
-- \dt
--\c into todo_database
1.Database
In order to work with db you need to login as superuser and add all the code from database.sql to CMD;
also you need to change db.ts pool config to you characteristics of db

code contains 2 tables user and todos; 2 triggers for timestamps ; 1 function for timestamps; 1 type of enum; 

2.!!!Important i attached file with postman request for quick testing; you can import it to fast checking all the routes.
File name: 
8081.postman_collection.json

also you can check the routes at requests.rest

All the available routes: 
●	POST /api/v1/signup: Sign up as an user of the system, using email & password <br/>
●	POST /api/v1/signin: Sign in using email & password. The system will return the JWT token that can be used to call the APIs that follow<br/>
●	PUT /api/v1/changePassword: Change user’s password<br/>
●	GET /api/v1/todos?status=status: Get a list of todo items. Optionally, a status query param can be included to return only items of specific status. If not present, return all items<br/>
●	POST /api/v1/todos: Create a new todo item<br/>
●	PUT /api/v1/todos/:id: Update a todo item<br/>
●	DELETE /api/v1/todos/:id: Delete a todo item<br/>

All the routes after the signin  route working with JWT token that will be generated after signin

3. ### `npm run dev`

Port by default : 8081
http://localhost:8081/
Run the server in development mode.

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).
## Available Scripts

### `npm test`

Run all unit-tests with hot-reloading.

### `npm test -- --testFile="name of test file" (i.e. --testFile=Users).`

Run a single unit-test.

### `npm run test:no-reloading`

Run all unit-tests without hot-reloading.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.


## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`. 
