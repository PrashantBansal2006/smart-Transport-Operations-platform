import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/middleware.js";
import {
  createTrip,
  getTrips,
  dispatchTripHandler,
  completeTripHandler,
  cancelTripHandler,
} from "../controllers/trip.controller.js";

const router = Router();

router.get('/', authMiddleware, requireRole("Dispatcher", "FleetManager", "SafetyOfficer", "FinancialAnalyst"), getTrips);
router.post('/', authMiddleware, requireRole("Dispatcher", "FleetManager", "SafetyOfficer", "FinancialAnalyst"), createTrip);
router.post('/:id/dispatch', authMiddleware, requireRole("Dispatcher", "FleetManager", "SafetyOfficer", "FinancialAnalyst"), dispatchTripHandler);
router.post('/:id/complete', authMiddleware, requireRole("Dispatcher", "FleetManager", "SafetyOfficer", "FinancialAnalyst"), completeTripHandler);
router.post('/:id/cancel', authMiddleware, requireRole("Dispatcher", "FleetManager", "SafetyOfficer", "FinancialAnalyst"), cancelTripHandler);


// router.get('/', getTrips);
// router.post('/', createTrip);
// router.post('/:id/dispatch', dispatchTripHandler);
// router.post('/:id/complete', completeTripHandler);
// router.post('/:id/cancel', cancelTripHandler);


export default router;