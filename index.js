import express from "express";
import { connectDB } from "./connection.js";
import dotenv from "dotenv";
import { logRequest } from "./middlewares/logger.js";
import cors from "cors";
import resumeBuilderRoutes from "./routes/resumeBuilderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);

app.use("/api", authRoutes);

app.use("/api", isAuthenticated, resumeBuilderRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at port:  ${PORT}`);
});
