import express from "express";
import { authMiddleware } from "../middleware/middleware.js";
import {
  getVehicles,
  getAvailableVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";
import { authMiddleware, requireRole } from "../middleware/middleware.js";

const router = express.Router();

router.use(authMiddleware); // all vehicle routes require authentication

router.get("/available",  requireRole("FleetManager", "Dispatcher", "SafetyOfficer"), getAvailableVehicles); // GET    /api/vehicles/available
router.get("/",           requireRole("FleetManager", "Dispatcher", "SafetyOfficer"), getVehicles);          // GET    /api/vehicles
router.post("/",          requireRole("FleetManager"), createVehicle);                                       // POST   /api/vehicles
router.put("/:id",        requireRole("FleetManager"), updateVehicle);                                       // PUT    /api/vehicles/:id
router.delete("/:id",     requireRole("FleetManager"), deleteVehicle);                                       // DELETE /api/vehicles/:id

export default router;
