import { pool } from "@src/databasePostgreSQL/db";
import { Router } from "express";
import bcrypt from 'bcrypt';

const usersRoute = Router();


usersRoute.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try{
   const salt = await bcrypt.genSalt()
   const hashedPassword = await bcrypt.hash(password, salt)
   const newUser = await pool.query(
      "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",[email,hashedPassword]
    );
    console.log(salt);
    console.log(hashedPassword);
    return res.status(201).json(newUser);
 
  } catch {
   return res.status(500).json({
     message: "User hasnt been created",
   });}

  
});

export default usersRoute;
