

export const checkSession = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("http://localhost:5173/login")
    }
  };