export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    } else {
      return res.status(401).json({message:"unauthorized"})
    }
  };
  