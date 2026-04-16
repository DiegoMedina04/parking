import { Request, Response } from 'express';
import { TicketService } from '../../application/services/TicketService';
import { Ticket } from '../../domain/models/Ticket';

export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    /**
     * @swagger
     * /ticket:
     *   get:
     *     summary: Retrieve all tickets
     *     tags: [Ticket]
     *     responses:
     *       200:
     *         description: List of tickets
     */
    async findAll(req: Request, res: Response) {
        const { status, parqueadero_id } = req.query;
        const tickets = await this.ticketService.getTickets(status as string, parqueadero_id as string);
        res.json(tickets);
    }

    /**
     * @swagger
     * /ticket/{id}:
     *   get:
     *     summary: Get a ticket by ID
     *     tags: [Ticket]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Ticket details
     *       404:
     *         description: Ticket not found
     */
    async findById(req: Request, res: Response) {
        const ticket = await this.ticketService.findById(req.params.id as string);
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    }

    /**
     * @swagger
     * /ticket:
     *   post:
     *     summary: Create a new ticket (Check-in)
     *     tags: [Ticket]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Ticket'
     *     responses:
     *       201:
     *         description: Created
     */
    async save(req: Request, res: Response) {
        const ticketData = req.body as Ticket;
        const newTicket = await this.ticketService.save(ticketData);
        res.status(201).json(newTicket);
    }

    /**
     * @swagger
     * /ticket/checkout/{id}:
     *   patch:
     *     summary: Checkout a ticket (Update exit date and close)
     *     tags: [Ticket]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               exitDate:
     *                 type: string
     *                 format: date-time
     *     responses:
     *       200:
     *         description: Ticket checked out
     *       404:
     *         description: Ticket not found
     */
    async checkout(req: Request, res: Response) {
        const id = req.params.id as string;
        const { exitDate } = req.body;
        const updatedTicket = await this.ticketService.checkout(id, exitDate ? new Date(exitDate) : undefined);
        res.json(updatedTicket);
    }

    /**
     * @swagger
     * /ticket/active/{vehicleId}:
     *   get:
     *     summary: Get active ticket for a vehicle
     *     tags: [Ticket]
     *     parameters:
     *       - in: path
     *         name: vehicleId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Active ticket details
     *       404:
     *         description: No active ticket found
     */
    async getActiveTicketByVehicleId(req: Request, res: Response) {
        const vehicleId = req.params.vehicleId as string;
        const ticket = await this.ticketService.getActiveTicketByVehicleId(vehicleId);
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'No active ticket found for this vehicle' });
        }
    }
}
