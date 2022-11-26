import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { pool } from "@src/databasePostgreSQL/db";

const usersRoute = Router();

//get a user
usersRoute.get("/user", authenticateToken, async (req: any, res: any) => {
  const users = await pool.query(
    "SELECT email,password FROM users WHERE email = $1",
    [req.users.email]
  );
  res.status(200).json(users.rows[0]);
});

//registrate user
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

//authenticate user
usersRoute.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query(
      "SELECT id,password FROM users WHERE email = $1",
      [email]
    );
    if (user === null) {
      return res.status(400).send("Cannot find user");
    }
    if (await bcrypt.compare(password, user.rows[0].password)) {
      const accessToken = jwt.sign(
        user.rows[0].id,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      res.status(200).json({ accessToken: accessToken });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});
//change password
usersRoute.put("/changePassword", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedPassword = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );
    if (updatedPassword.rowCount >= 1) {
      res.status(200).json("Password was changed!");
    } else {
      return res.status(400).send("Bad request");
    }
  } catch {
    return res.status(404).send("Resource does not exist");
  }
});

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    }
  );
}

export default usersRoute;
