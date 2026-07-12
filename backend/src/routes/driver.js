import express from 'express';
import { getDrivers, getAvailableDrivers, createDriver, updateDriver } from '../controllers/driver.controller.js';
import { authMiddleware, requireRole } from '../middleware/middleware.js';

const router = express.Router();

router.use(authMiddleware);

// GET routes: allowed for 'dispatcher' and 'safetyOfficer' (dispatcher can view)
router.get('/available', requireRole('dispatcher', 'safetyOfficer', 'fleetManager', 'financialAnalyst'), getAvailableDrivers);
router.get('/', requireRole('dispatcher', 'safetyOfficer', 'fleetManager', 'financialAnalyst'), getDrivers);

// POST/PUT routes: allowed ONLY for 'safetyOfficer'
router.post('/', requireRole('safetyOfficer'), createDriver);
router.put('/:id', requireRole('safetyOfficer'), updateDriver);

export default router;
