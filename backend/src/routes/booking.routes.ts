import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.put('/:id/status', updateBookingStatus);

export default router;
