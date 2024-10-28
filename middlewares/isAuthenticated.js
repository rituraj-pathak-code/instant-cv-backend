import User from "../models/UserModal.js";
import jwt from 'jsonwebtoken'


export const isAuthenticated = async (req, res, next) => {
    try{
      const {token} = req.cookies;
      if (!token) {
       return res.status(401).send("Invalid Token");
      }
      const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
      const { _id } = decodedMessage;
      const user = await User.findById(_id);
  
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user
      next();
    }catch(err){
      res.status(400).send("ERROR : "+err.message)
    }
  };
  