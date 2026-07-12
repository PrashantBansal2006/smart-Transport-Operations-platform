import express from "express";
import { authMiddleware } from "../middleware/middleware.js";
import {
  getVehicles,
  getAvailableVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.get("/available",  authMiddleware, getAvailableVehicles); // GET  /api/vehicles/available
router.get("/",           authMiddleware, getVehicles);          // GET  /api/vehicles
router.post("/",         authMiddleware, createVehicle);        // POST /api/vehicles
router.put("/:id",        authMiddleware, updateVehicle);        // PUT  /api/vehicles/:id
router.delete("/:id",     authMiddleware, deleteVehicle);        // DELETE /api/vehicles/:id

export default router;
