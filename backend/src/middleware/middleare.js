// Auth middleware — placeholder until User/Auth is implemented
// Once auth routes are added, replace the stub below with real JWT verification

const protectRoute = (req, res, next) => {
  // TODO: Verify JWT token from Authorization header
  // const token = req.headers.authorization?.split(" ")[1];
  // if (!token) return res.status(401).json({ message: "Unauthorized — no token" });
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // req.user = await User.findById(decoded.id).select("-password");

  // Stub: attach a dummy user until auth is wired up
  req.user = { _id: "stub_user_id", role: "admin" };
  next();
};

export default protectRoute;
