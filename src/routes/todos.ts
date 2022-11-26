import { pool } from "@src/databasePostgreSQL/db";
import { Router } from "express";
import { authenticateToken } from "./users";
import express, { Request, Response } from 'express';

const todoRoute = Router();

//all todos
todoRoute.get("",authenticateToken,  async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.users
    if(status){
      const allTodos = await pool.query("SELECT * FROM todo WHERE user_id = $1 AND status = $2", [userId,status]);
      res.json(allTodos.rows);
    }else{
      const allTodos = await pool.query("SELECT * FROM todo WHERE user_id = $1", [userId]);
      res.json(allTodos.rows);
    }
   
  } catch  {
    return res.status(404).send("Cannot find user");
  }
});

//create a new todo
todoRoute.post("", authenticateToken, async (req:Request, res:Response) => {
  try {
    const { description,status } = req.body;
    const userId = req.users
    const newTodo = await pool.query(
      "INSERT INTO todo (description,status,user_id) VALUES ($1,$2,$3) RETURNING *",
      [description,status,userId]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    return res.status(404).send("Bad request");
  }
});
//update a todo
todoRoute.put("/:id", authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    const { description,status } = req.body;
    const userId = req.users
    const updateToDo = await pool.query(
      "UPDATE todo SET description = $1, status = $2 WHERE id = $3 AND user_id = $4",
      [description,status, id,userId ]
    );
    res.json("Todo was updated!");
  } catch (err) {
    return res.status(404).send("Bad request");
  }
});
//delete a todo
todoRoute.delete("/:id",authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users
    const deleteToDo = await pool.query("DELETE FROM todo WHERE id = $1 AND user_id = $2", [
      id,userId
    ]);
    if(deleteToDo.rowCount >= 1){
      res.json("ToDo was successfuly deleted!")
    }else{
      return res.status(404).send("Resource does not exist");
    }
    
  } catch (err) {
    return res.status(404).send("Resource does not exist");
  }
});
export default todoRoute;
