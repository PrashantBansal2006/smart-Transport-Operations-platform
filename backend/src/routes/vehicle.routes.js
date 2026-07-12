import express from "express";
import { authMiddleware as protectRoute } from "../middleware/middleware.js";
import {
  getVehicles,
  getAvailableVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.get("/available",  protectRoute, getAvailableVehicles); // GET  /api/vehicles/available
router.get("/",           protectRoute, getVehicles);          // GET  /api/vehicles
router.post("/",          protectRoute, createVehicle);        // POST /api/vehicles
router.put("/:id",        protectRoute, updateVehicle);        // PUT  /api/vehicles/:id
router.delete("/:id",     protectRoute, deleteVehicle);        // DELETE /api/vehicles/:id

export default router;
