import express from 'express';
import { getAnalytics, exportCSV } from '../controllers/reports.controller.js';
import { authMiddleware, requireRole } from '../middleware/middleware.js';

const router = express.Router();

router.use(authMiddleware);

// Fleet Manager, Safety Officer, and Financial Analyst have access
router.get('/analytics', requireRole('fleetManager', 'dispatcher', 'safetyOfficer', 'financialAnalyst'), getAnalytics);
router.get('/export.csv', requireRole('fleetManager', 'dispatcher', 'safetyOfficer', 'financialAnalyst'), exportCSV);

export default router;
