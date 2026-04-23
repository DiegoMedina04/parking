import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../../application/services/ClientService';
import { Client } from '../../domain/models/Client';

export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { parqueadero_id } = req.query;
      const clients = await this.clientService.getClients(parqueadero_id as string);
      res.status(200).json({ status: 'success', data: clients });
    } catch (error) {
      next(error);
    }
  }

  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client: Client = req.body;
      const savedClient = await this.clientService.save(client);
      res.status(201).json({ status: 'success', data: savedClient });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const client = await this.clientService.findById(String(id));
      res.status(200).json({ status: 'success', data: client });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client: Client = req.body;
      const updatedClient = await this.clientService.update(client);
      res.status(200).json({ status: 'success', data: updatedClient });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.clientService.delete(id);
      res.status(200).json({ status: 'success', message: 'Cliente eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
