import { pool } from "@src/databasePostgreSQL/db";
import { Router } from "express";
import bcrypt from "bcrypt";

const usersRoute = Router();

usersRoute.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",
      [email, hashedPassword]
    );
    return res.status(201).json(newUser.rows[0]);
  } catch {
    return res.status(500).json({
      message: "User hasnt been created",
    });
  }
});
usersRoute.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query(
      "SELECT email,password FROM users WHERE email = $1" ,
      [email]
    );
    if (users === null) {
      return res.status(400).send("Cannot find user");
    }
    if (await bcrypt.compare(password, users.rows[0].password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

export default usersRoute;
