import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  getUserData,
  loginHandler,
  logoutHandler,
  signUpHandler,
} from "../controllers/authControllers.js";

const router = Router();

router.post("/signup", signUpHandler);

router.post("/login", loginHandler);

router.post("/logout", logoutHandler);

router.post("/userData", isAuthenticated, getUserData);

export default router;
