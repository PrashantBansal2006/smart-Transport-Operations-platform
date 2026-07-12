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

router.get('/', authMiddleware, requireRole("Dispatcher"), getTrips);
router.post('/', authMiddleware, requireRole("Dispatcher"), createTrip);
router.post('/:id/dispatch', authMiddleware, requireRole("Dispatcher"), dispatchTripHandler);
router.post('/:id/complete', authMiddleware, requireRole("Dispatcher"), completeTripHandler);
router.post('/:id/cancel', authMiddleware, requireRole("Dispatcher"), cancelTripHandler);


// router.get('/', getTrips);
// router.post('/', createTrip);
// router.post('/:id/dispatch', dispatchTripHandler);
// router.post('/:id/complete', completeTripHandler);
// router.post('/:id/cancel', cancelTripHandler);


export default router;