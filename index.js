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

dotenv.config();
connectDB();

const app = express();



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(logRequest)

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax', maxAge: 30 * 60 * 1000  }
}))
app.use(passport.initialize())
app.use(passport.session())



app.use('/',authRoutes)
app.use('/api',isAuthenticated,resumeBuilderRoutes)


app.listen(8000, () => {
  console.log("Server is listening at port 8000");
});
