import { Router } from "express";
import { register, login, logout, updateDepot } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/middleware.js";
import { registerValidator ,loginValidator } from "../validators/authValidator.js";

const router = Router();

router.post('/register' , registerValidator, register);
router.post('/login' , loginValidator, login);
router.post('/logout', authMiddleware, logout);
router.put('/depot', authMiddleware, updateDepot);

export default router;