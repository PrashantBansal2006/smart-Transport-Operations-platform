import { Router } from "express";
import { createMaintenance, closeMaintenance, getMaintenanceLogs } from "../controllers/maintenanceController.js";
import { authMiddleware ,requireRole } from "../middleware/middleware.js";

const router = Router();

router.get('/', authMiddleware, getMaintenanceLogs);
router.post('/', authMiddleware, requireRole(['FleetManager']), createMaintenance);
router.post('/:id/close', authMiddleware, requireRole(['FleetManager']), closeMaintenance);

export default router;