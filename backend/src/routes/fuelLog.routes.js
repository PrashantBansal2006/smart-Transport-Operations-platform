import express from "express";
import { createFuelLog, getFuelLogs } from "../controllers/fuelLog.controller.js";
import { authMiddleware, requireRole } from "../middleware/middleware.js";

const router = express.Router();

router.use(authMiddleware); // all fuel-log routes require authentication

router.get("/",  requireRole("FleetManager", "SafetyOfficer", "FinancialAnalyst"), getFuelLogs);   // GET  /api/fuel-logs
router.post("/", requireRole("FleetManager", "Dispatcher"), createFuelLog);                        // POST /api/fuel-logs

export default router;

