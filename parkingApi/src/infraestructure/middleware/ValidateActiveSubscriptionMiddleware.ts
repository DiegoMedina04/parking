import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/DatabaseConfig';
import { SubscriptionEntity } from '../entities/SubscriptionEntity';
import { SubscriptionStatus } from '../../domain/models/SubscriptionStatus';

export const validateActiveSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const path = req.originalUrl || req.path;
  
  // 1. Eximir rutas que no deben ser bloqueadas
  // El módulo de 'Mis Parqueaderos' (parking), Login (auth), usuarios, roles, planes y suscripciones.
  const exemptedPrefixes = [
    '/api/auth',
    '/api/parqueadero', // En index.ts, las rutas de parking están mapeadas a '/parqueadero'
    '/api/user',
    '/api/role',
    '/api/plan',
    '/api/subscription'
  ];

  if (exemptedPrefixes.some(prefix => path.startsWith(prefix))) {
    return next();
  }

  // 2. Extraer parqueadero_id
  const parqueaderoId = req.query.parqueadero_id || req.body.parqueadero_id;

  // Si el endpoint no recibe parqueadero_id, permitimos que continúe y sea manejado
  // por los controladores específicos o middlewares de validación
  if (!parqueaderoId) {
    return next();
  }

  try {
    const subscriptionRepo = AppDataSource.getRepository(SubscriptionEntity);
    
    // console.log({
    //   parqueaderoId: String(parqueaderoId),
    //   status: SubscriptionStatus.ACTIVA
    // });
    
    // 3. Buscar la suscripción ACTIVA más reciente para este parqueadero
    const subscription = await subscriptionRepo.findOne({
      where: {
        parking: { id: String(parqueaderoId) },
        status: SubscriptionStatus.ACTIVA
      },
      order: {
        endDate: 'DESC'
      }
    });
    console.log('subscription found ', {subscription});
    
    if (!subscription) {
      res.status(403).json({
        status: "blocked",
        message: "No se encontro una suscripción activa para este parqueadero."
      });
      return;
    }

    // 4. Validar que la fecha actual no haya superado el vencimiento de la suscripción
    const currentDate = new Date();
    // Normalizar la fecha actual para comparar solo días
    currentDate.setHours(0, 0, 0, 0);

    let isExpired = false;

    if (subscription.endDate) {
      // console.log('end date ', subscription.endDate)
      const endDate = new Date(subscription.endDate);
      // Al final del día del vencimiento
      endDate.setHours(23, 59, 59, 999);
    // console.log({
    //   currentDate,
    //   endDate
    // });
    
      if (currentDate > endDate) {
        isExpired = true;
      }
    }

    if (isExpired) {
      res.status(403).json({
        status: "blocked",
        message: "Tu suscripción ha vencido. Por favor, renuévala en el módulo 'Mis Parqueaderos' para continuar operando."
      });
      return;
    }

    // Si todo está bien, continuamos
    next();
  } catch (error) {
    console.error('[ValidateActiveSubscription] Error:', error);
    next(error);
  }
};
