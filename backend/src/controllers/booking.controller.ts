import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { listingId, startDate, endDate, guestsCount } = req.body;
        const touristId = req.user?.id; // Assumes authMiddleware sets req.user

        if (!touristId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.listingCategory === 'STUDENT_HOUSING') {
            return res.status(400).json({ message: 'This listing is not available for short-term booking' });
        }

        // Simple price calculation (assuming dailyPrice is provided, otherwise fallback to price)
        const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
        const pricePerNight = listing.dailyPrice || listing.price || 0;
        const totalPrice = days * pricePerNight;

        const booking = await prisma.booking.create({
            data: {
                listingId,
                touristId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                guestsCount: parseInt(guestsCount, 10) || 1,
                totalPrice,
                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Booking request created successfully', booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Failed to create booking' });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { touristId: userId },
                    { listing: { ownerId: userId } }
                ]
            },
            include: {
                listing: true,
                tourist: { select: { id: true, fullName: true, avatar: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // CONFIRMED, CANCELLED, COMPLETED
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { listing: true }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only listing owner can confirm/complete. Tourist can cancel.
        const isOwner = booking.listing.ownerId === userId;
        const isTourist = booking.touristId === userId;

        if (!isOwner && !isTourist) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (status === 'CONFIRMED' && !isOwner) {
            return res.status(403).json({ message: 'Only owner can confirm a booking' });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        res.json({ message: 'Booking status updated', booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Failed to update booking status' });
    }
};
