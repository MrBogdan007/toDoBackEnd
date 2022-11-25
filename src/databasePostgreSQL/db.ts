const Pool = require("pg").Pool

const pool = new Pool({
   user: "postgres",
   password: "ZtNv7479846",
   database: "todo_database",
   host: "localhost",
   port: 5432
});

export {pool};