import { Request, Response } from 'express';
import { TicketPaymentService } from '../../application/services/TicketPaymentService';
import { TicketPayment } from '../../domain/models/TicketPayment';

export class TicketPaymentController {
    constructor(private readonly ticketPaymentService: TicketPaymentService) {}

    async findAll(req: Request, res: Response) {
        const payments = await this.ticketPaymentService.findAll();
        res.json(payments);
    }

    async findById(req: Request, res: Response) {
        const payment = await this.ticketPaymentService.findById(req.params.id as string);
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Pago no encontrado' });
        }
    }

    async save(req: Request, res: Response) {
        const paymentData = req.body as TicketPayment;
        
        // Creamos una instancia parcial del dominio para pasarla al servicio
        // El servicio/caso de uso se encargará de completar los datos y validar
        // const paymentData = new TicketPayment(
        //     '',
        //     { id: ticketId } as any,
        //     paymentDate ? new Date(paymentDate) : new Date(),
        //     amount,
        //     paymentMethod,
        //     { id: parkingId } as any
        // );

        const newPayment = await this.ticketPaymentService.save(paymentData);
        res.status(201).json(newPayment);
    }

    async findByTicketId(req: Request, res: Response) {
        const payment = await this.ticketPaymentService.findByTicketId(req.params.ticketId as string);
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'No se encontró pago para este ticket' });
        }
    }

    async getPaymentsReport(req: Request, res: Response) {
        try {
            const { parqueadero_id, date } = req.query;
            if (!parqueadero_id) {
                return res.status(400).json({ message: 'parqueadero_id es requerido' });
            }

            const reportDate = date ? new Date(date as string) : new Date();
            const report = await this.ticketPaymentService.findByParkingAndDate(parqueadero_id as string, reportDate);
            
            res.json({
                success: true,
                data: report
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
