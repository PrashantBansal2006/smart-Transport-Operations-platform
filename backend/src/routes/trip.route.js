import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import {
  createTrip,
  getTrips,
  dispatchTripHandler,
  completeTripHandler,
  cancelTripHandler,
} from "../controllers/trip.controller.js";

const router = Router();

// TEMP: auth/role checks commented out for local Postman testing
// router.get('/trips', authMiddleware, requireRole(['Dispatcher']), getTrips);
// router.post('/trips', authMiddleware, requireRole(['Dispatcher']), createTrip);
// router.post('/trips/:id/dispatch', authMiddleware, requireRole(['Dispatcher']), dispatchTripHandler);
// router.post('/trips/:id/complete', authMiddleware, requireRole(['Dispatcher']), completeTripHandler);
// router.post('/trips/:id/cancel', authMiddleware, requireRole(['Dispatcher']), cancelTripHandler);

router.get('/trips', getTrips);
router.post('/trips', createTrip);
router.post('/trips/:id/dispatch', dispatchTripHandler);
router.post('/trips/:id/complete', completeTripHandler);
router.post('/trips/:id/cancel', cancelTripHandler);

export default router;