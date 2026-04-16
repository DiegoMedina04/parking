export class Fee {
  constructor(
    public id: string,
    public nombre_tarifa: string,
    public valor: number,
    public tiempo_minutos: number,
    public tipo_vehiculo_id: string,
    public parqueadero_id: string,
  ) {}
}
