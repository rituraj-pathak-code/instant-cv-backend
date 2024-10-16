export const isAuthenticated = (req, res, next) => {
    console.log(req.session)
    if (req.session && req.session.user) {
      return next();
    } else {
      return res.status(401).send({ message: "Unauthorized. Please log in." });
    }
  };
  