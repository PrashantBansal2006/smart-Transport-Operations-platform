import express from "express";
import {
  getVehicles,
  getAvailableVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.get("/available",  getAvailableVehicles); // GET    /api/vehicles/available
router.get("/",           getVehicles);          // GET    /api/vehicles
router.post("/",          createVehicle);        // POST   /api/vehicles
router.put("/:id",        updateVehicle);        // PUT    /api/vehicles/:id
router.delete("/:id",     deleteVehicle);        // DELETE /api/vehicles/:id

export default router;
