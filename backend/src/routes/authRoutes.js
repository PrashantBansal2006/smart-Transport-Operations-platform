import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/middleware.js";
import { registerValidator ,loginValidator } from "../validators/authValidator.js";
const router = Router();

router.post('/register' , registerValidator, register);
router.post('/login' , authMiddleware, loginValidator, login);
router.post('/logout', authMiddleware, logout);


export default router;