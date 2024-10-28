import { Router } from "express";
import User from "../models/UserModal.js";
import jwt from "jsonwebtoken"
import bcrypt, { compare } from "bcrypt"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";


const router = Router();

router.post('/signup', async (req,res)=> {
  try{
    const {name,username,password} = req.body;
    if(!name || !username || !password){
      throw new Error("Please enter name, username & password")
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
      name:name,
      username: username,
      password: hashedPassword
    })
    await user.save();
    res.status(201).send("User created successfully")
  }catch(err){
    res.status(400).send(err)
  }
})

router.post('/login', async (req,res)=> {
  try{
    const {username,password} = req.body;
    if(!username || !password){
      throw new Error("Please enter username & password")
    }
    const user = await User.findOne({username:username});
    if(!user){
      throw new Error("Invalid Credentials")
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
      throw new Error("Invalid Credentials")
    }
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will last for 7 day
    });
    res.send({_id:user._id,name:user.name,username:user.username})
  }catch(err){
    res.status(400).json({message: err.message})
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None'
  });
  res.json({ message: 'Logout successful' });
});


router.post('/userData', isAuthenticated, async (req,res)=> {
  try{
    const {_id} = req.body;
    const user = await User.findById({_id:_id});
    if(!user){
      throw new Error("User not found")
    }
    res.send({_id:user._id,name:user.name,username:user.username})
  }catch(err){
    res.status(400).json({message: err.message})
  }
})

export default router;
