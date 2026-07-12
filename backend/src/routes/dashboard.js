import express from 'express';
import { getDashboardKPIs } from '../controllers/dashboard.controller.js';
import { authMiddleware, requireRole } from '../middleware/middleware.js';

const router = express.Router();

router.use(authMiddleware);

// All roles have at least 'view' access to Dashboard
router.get('/kpis', requireRole('fleetManager', 'dispatcher', 'safetyOfficer', 'financialAnalyst'), getDashboardKPIs);

export default router;
