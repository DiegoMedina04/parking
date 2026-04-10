import { Request, Response } from 'express';
import { RoleService } from '../../application/services/RoleService';
import { Role } from '../../domain/models/Role';

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles de usuario
 */

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * @swagger
   * /role:
   *   get:
   *     summary: Obtener todos los roles
   *     tags: [Roles]
   *     responses:
   *       200:
   *         description: Lista de roles
   */
  async findAll(req: Request, res: Response): Promise<void> {
    const roles = await this.roleService.getRoles();
    res.status(200).json(roles);
  }

  /**
   * @swagger
   * /role:
   *   post:
   *     summary: Crear un nuevo rol
   *     tags: [Roles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: Rol creado
   */
  async save(req: Request, res: Response): Promise<void> {
    const role: Role = req.body;
    const savedRole = await this.roleService.save(role);
    res.status(201).json(savedRole);
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const role: Role = req.body;
    role.id = id;
    const updatedRole = await this.roleService.update(role);
    res.status(200).json(updatedRole);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this.roleService.delete(id);
    res.status(204).send();
  }
}
