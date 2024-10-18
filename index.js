import express from "express";
import { connectDB } from "./connection.js";
import dotenv from "dotenv";
import { logRequest } from "./middlewares/logger.js";
import cors from 'cors'
import resumeBuilderRoutes from './routes/resumeBuilderRoutes.js'
import authRoutes from "./routes/authRoutes.js"
import passport from "passport"
import session from "express-session"
import "./auth.js"
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import MongoStore from "connect-mongo";

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://instant-cv-backend.vercel.app',
  credentials: true,
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(logRequest)

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax', maxAge: 30 * 60 * 1000  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, 
  })
}))
app.use(passport.initialize())
app.use(passport.session())



// app.use('/',(authRoutes))

app.get('/', (req,res)=> {
  res.send({message: "CHECK OK"})
})
app.use('/api',isAuthenticated,resumeBuilderRoutes)


app.listen(PORT, () => {
  console.log("Server is listening at port 8000");
});
