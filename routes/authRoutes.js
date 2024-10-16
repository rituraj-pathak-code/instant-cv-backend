import { Router } from "express";
import passport from "passport";
import User from "../models/UserModal.js";

const router = Router();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.status(401);
}

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  async (req, res) => {
    try {
      let existingUser = await User.findOne({ googleId: req.user.id });

      if (!existingUser) {
        const newUser = new User({
          googleId: req.user.id,
          displayName: req.user.displayName,
          email: req.user.emails[0].value,
          photo: req.user.photos[0].value,
        });

        await newUser.save();
        req.session.user = newUser;
      } else {
        req.session.user = existingUser;
      }

      res.redirect("/auth/protected");
    } catch (err) {
      console.error("Error saving user:", err);
      res.redirect("/auth/google/failure");
    }
  }
);

router.get("/auth/protected", isLoggedIn, (req, res) => {
  res.redirect(`http://localhost:5173/`);
});

router.get("/auth/google/failure", (req, res) => {
  res.send("Something went wrong");
});
router.get("/auth/google/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Failed to log out");
    }
    res.clearCookie("connect.sid");
    res.redirect("http://localhost:5173/login");
  });
});

router.get("/api/user", async (req, res) => {
  
  try {
    let user = await User.findOne({ _id: req.session.user._id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
