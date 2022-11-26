import { pool } from "@src/databasePostgreSQL/db";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const usersRoute = Router();

//get a user
usersRoute.get("/user", authenticateToken, async (req: any, res: any) => {
  console.log(req.users.email);

  const users = await pool.query(
    "SELECT email,password FROM users WHERE email = $1",
    [req.users.email]
  );
  res.json(users.rows[0]);
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
  const { email, password, id } = req.body;
  console.log(req.body.id);

  try {
    const users = await pool.query(
      "SELECT id,password FROM users WHERE id = $1",
      [id]
    );
    if (users === null) {
      return res.status(400).send("Cannot find user");
    }
    if (await bcrypt.compare(password, users.rows[0].password)) {
      const accessToken = jwt.sign(
        users.rows[0].id,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      res.json({ accessToken: accessToken });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, users: any) => {
      if (err) return res.sendStatus(403);
      req.users = users;
      next();
    }
  );
}

export default usersRoute;
