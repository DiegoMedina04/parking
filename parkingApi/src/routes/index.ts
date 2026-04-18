import { Router, Request, Response } from 'express';
import { jwtValidationMiddleware } from '../infraestructure/security/jwt/JwtValidationMiddleware';
import { DependencyInjection } from '../infraestructure/config/DependencyInjection';

// Routers
import { createUserRouter } from './user.routes';
import { createParkingRouter } from './parking.routes';
import { createPlanRouter } from './plan.routes';
import { createRoleRouter } from './role.routes';
import { createSubscriptionRouter } from './subscription.routes';
import { createAuthRouter } from './auth.routes';
import { createClientRouter } from './client.routes';
import { createVehicleTypeRouter } from './vehicleType.routes';
import { createVehicleRouter } from './vehicle.routes';
import { createTicketRouter } from './ticket.routes';
import { createTicketPaymentRouter } from './ticketPayment.routes';
import { createPlanMensualidadRouter } from '../infraestructure/routes/planMensualidad.routes';
import { createMensualidadRouter } from '../infraestructure/routes/mensualidad.routes';
import { createFeeRouter } from './fee.routes';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Note: In a real app, DependencyInjection.init(dataSource) would be called in index.ts/app.ts
// For now, we'll provide the wired routers.

// Auth routes (Public)
router.use('/auth', (req, res, next) => createAuthRouter(DependencyInjection.getAuthController())(req, res, next));

// Proteger todas las rutas siguientes con JWT
// Proteger todas las rutas siguientes con JWT
router.use(jwtValidationMiddleware);

// Domain routes
router.use('/user', (req, res, next) => createUserRouter(DependencyInjection.getUserController())(req, res, next));
router.use('/parqueadero', (req, res, next) => createParkingRouter(DependencyInjection.getParkingController())(req, res, next));
router.use('/plan', (req, res, next) => createPlanRouter(DependencyInjection.getPlanController())(req, res, next));
router.use('/role', (req, res, next) => createRoleRouter(DependencyInjection.getRoleController())(req, res, next));
router.use('/subscription', (req, res, next) => createSubscriptionRouter(DependencyInjection.getSubscriptionController())(req, res, next));
router.use('/client', (req, res, next) => createClientRouter(DependencyInjection.getClientController())(req, res, next));
router.use('/vehicle-type', (req, res, next) => createVehicleTypeRouter(DependencyInjection.getVehicleTypeController())(req, res, next));
router.use('/vehicle', (req, res, next) => createVehicleRouter(DependencyInjection.getVehicleController())(req, res, next));
router.use('/ticket', (req, res, next) => createTicketRouter(DependencyInjection.getTicketController())(req, res, next));
router.use('/ticket-payment', (req, res, next) => createTicketPaymentRouter(DependencyInjection.getTicketPaymentController())(req, res, next));
router.use('/plan_mensualidades', (req, res, next) => createPlanMensualidadRouter(DependencyInjection.getPlanMensualidadController())(req, res, next));
router.use('/mensualidades', (req, res, next) => createMensualidadRouter(DependencyInjection.getMensualidadController())(req, res, next));
router.use('/fee', (req, res, next) => createFeeRouter(DependencyInjection.getFeeController())(req, res, next));

export default router;
