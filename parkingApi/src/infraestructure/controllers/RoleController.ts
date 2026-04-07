import { Request, Response } from 'express';
// Assuming RoleService exists or implement via UseCase
import { CreateRoleUseCase } from '../../domain/ports/in/role/CreateRoleUseCase';
import { RetrieveRoleUseCase } from '../../domain/ports/in/role/RetrieveRoleUseCase';
import { Role } from '../../domain/models/Role';

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles de usuario
 */

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
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
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly retrieveRoleUseCase: RetrieveRoleUseCase
  ) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const roles = await this.retrieveRoleUseCase.getRoles();
    res.status(200).json(roles);
  }

  async save(req: Request, res: Response): Promise<void> {
    const role: Role = req.body;
    const savedRole = await this.createRoleUseCase.save(role);
    res.status(201).json(savedRole);
  }
}
