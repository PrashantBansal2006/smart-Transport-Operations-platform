import express from "express";
import { createFuelLog, getFuelLogs } from "../controllers/fuelLog.controller.js";

const router = express.Router();

router.get("/",  getFuelLogs);   // GET  /api/fuel-logs
router.post("/", createFuelLog); // POST /api/fuel-logs

export default router;
