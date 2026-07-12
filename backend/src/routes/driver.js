import express from 'express';
import { getDrivers, getAvailableDrivers, createDriver, updateDriver } from '../controllers/driver.controller.js';

const router = express.Router();

router.get('/available', getAvailableDrivers);
router.get('/', getDrivers);
router.post('/', createDriver);
router.put('/:id', updateDriver);

export default router;
