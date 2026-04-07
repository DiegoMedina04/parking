import { Request, Response } from 'express';
import { ClientService } from '../../application/services/ClientService';
import { Client } from '../../domain/models/Client';

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestión de clientes
 */

export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const clients = await this.clientService.getClients();
    res.status(200).json(clients);
  }

  async save(req: Request, res: Response): Promise<void> {
    const client: Client = req.body;
    const savedClient = await this.clientService.save(client);
    res.status(201).json(savedClient);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const client = await this.clientService.findById(String(id));
    res.status(200).json(client);
  }
}
