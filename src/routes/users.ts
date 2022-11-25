
import { Router } from "express";

const usersRoute = Router()

usersRoute.post("",(req,res)=> {
   const {email, password} = req.body
   const user = {
      email,
      password
   }
   if(user){
      return res.status(202).json(user)
   }else{
      return res.status(404).json({
         message: 'User hasnt been created'
      })
   }
   
})



export default usersRoute