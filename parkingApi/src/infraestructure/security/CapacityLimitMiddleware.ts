import { Request, Response, NextFunction } from 'express';
import { DependencyInjection } from '../config/DependencyInjection';

export const capacityLimitMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Intentamos obtener el parqueadero_id de varias fuentes comunes en la app
    const parkingId = 
        req.body.parqueadero_id || 
        req.body.parqueadero?.id || 
        req.query.parqueadero_id || 
        (req as any).user?.parkingId;

    if (!parkingId) {
        next();
        return;
    }

    try {
        const capacityService = DependencyInjection.getCapacityService();
        const { current, max } = await capacityService.getCapacity(parkingId);

        // Si max es 0, asumimos que no hay límite configurado o plan inválido (dejamos pasar o bloqueamos?)
        // Según el requerimiento, debemos comparar contra maxPlaces.
        if (max > 0 && current >= max) {
            res.status(403).json({
                status: 'error',
                message: 'Límite de vehículos alcanzado para tu plan actual. Libera espacio o mejora tu plan.',
                capacity: { current, max }
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking capacity:', error);
        next();
    }
};
