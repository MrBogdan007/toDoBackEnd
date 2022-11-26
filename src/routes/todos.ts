import { pool } from "@src/databasePostgreSQL/db";
import { Router } from "express";
import { authenticateToken } from "./users";
import  { Request, Response } from "express";

const todoRoute = Router();

//all todos
todoRoute.get("", authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.users;
    if (status) {
      const allTodos = await pool.query(
        "SELECT * FROM todo WHERE user_id = $1 AND status = $2",
        [userId, status]
      );
      res.json(allTodos.rows);
    } else {
      const allTodos = await pool.query(
        "SELECT * FROM todo WHERE user_id = $1",
        [userId]
      );
      res.status(200).json(allTodos.rows);
    }
  } catch {
    return res.status(404).send("Cannot find user");
  }
});

//create a new todo
todoRoute.post("", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { description, status, name } = req.body;
    const userId = req.users;
    const newTodo = await pool.query(
      "INSERT INTO todo (description,status,user_id,name) VALUES ($1,$2,$3,$4) RETURNING *",
      [description, status, userId, name]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    return res.status(200).status(404).send("Bad request");
  }
});
//update a todo
todoRoute.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status, name } = req.body;
    const userId = req.users;
    const updateToDo = await pool.query(
      "UPDATE todo SET description = $1, status = $2, name = $3 WHERE id = $4 AND user_id = $5",
      [description, status, name, id, userId]
    );
    if (updateToDo.rowCount >= 1) {
      res.status(200).json("Todo was updated!");
    } else {
      return res.status(400).send("Bad request");
    }
  } catch (err) {
    return res.status(404).send("Not Found");
  }
});
//delete a todo
todoRoute.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users;
    const deleteToDo = await pool.query(
      "DELETE FROM todo WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (deleteToDo.rowCount >= 1) {
      res.status(200).json("ToDo was successfuly deleted!");
    } else {
      return res.status(404).send("Resource does not exist");
    }
  } catch (err) {
    return res.status(404).send("Resource does not exist");
  }
});
export default todoRoute;
