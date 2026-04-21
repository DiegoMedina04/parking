export class PlanMensualidad {
    constructor(
        public id: string,
        public nombre: string,
        public duracion: string,
        public valor: number,
        public parqueadero_id: string,
        public tipo_vehiculo_id: string
    ) {}
}
