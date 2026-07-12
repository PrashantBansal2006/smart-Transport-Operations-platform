import express from "express";
import { createExpense, getExpenses } from "../controllers/expense.controller.js";
import { authMiddleware, requireRole } from "../middleware/middleware.js";

const router = express.Router();

router.use(authMiddleware); // all expense routes require authentication

router.get("/",  requireRole('fleetManager', 'dispatcher', 'safetyOfficer', 'financialAnalyst'), getExpenses);   // GET  /api/expenses
router.post("/", requireRole("FleetManager", "FinancialAnalyst"), createExpense); // POST /api/expenses

export default router;

