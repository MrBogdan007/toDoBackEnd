import { pool } from "@src/databasePostgreSQL/db";
import { Router } from "express";

const todoRoute = Router();

//all todos
todoRoute.get("", async (req, res) => {
  try {
    // const status = await pool.query("SELECT ")
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//create a new todo
todoRoute.post("", async (req, res) => {
  try {
    console.log(req.body);
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update a todo
todoRoute.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateToDo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});
//delete a todo
todoRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteToDo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json("ToDo was successfuly deleted!")
  } catch (err) {
    console.error(err.message);
  }
});
export default todoRoute;
