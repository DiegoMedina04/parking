import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService';
import { User } from '../../domain/models/User';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @swagger
   * /user:
   *   get:
   *     summary: Obtener todos los usuarios
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Lista de usuarios
   */
  async findAll(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getUsers();
    // Eliminar contraseñas del response por seguridad
    const safeUsers = users.map(u => {
      const { password, ...safeUser } = u as any;
      return safeUser;
    });
    res.status(200).json(safeUsers);
  }

  /**
   * @swagger
   * /role:
   *   post:
   *     summary: Crear un nuevo usuario
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: Usuario creado
   */
  async save(req: Request, res: Response): Promise<void> {
    const user: User = req.body;
    const savedUser = await this.userService.save(user);
    const { password, ...safeUser } = savedUser as any;
    res.status(201).json(safeUser);
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const user: User = req.body;
    user.id = id;
    const updatedUser = await this.userService.update(user);
    const { password, ...safeUser } = updatedUser as any;
    res.status(200).json(safeUser);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this.userService.delete(id);
    res.status(204).send();
  }
}
