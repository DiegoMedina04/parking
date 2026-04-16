import React, { useState, useEffect } from 'react';
import { X, DollarSign, Clock, Car } from 'lucide-react';
import { vehicleTypeService } from '../../../infrastructure/services/vehicleTypeService';
import { useAuthStore } from '../../../application/store/authStore';

interface FeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

const FeeFormModal: React.FC<FeeFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [nombreTarifa, setNombreTarifa] = useState('');
  const [valor, setValor] = useState('');
  const [tiempoMinutos, setTiempoMinutos] = useState('');
  const [tipoVehiculoId, setTipoVehiculoId] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const user = useAuthStore(state => state.user);
  const parqueaderoId = user?.parqueadero_id || '';

  useEffect(() => {
    if (isOpen) {
      fetchVehicleTypes();
      if (initialData) {
        setNombreTarifa(initialData.nombre_tarifa);
        setValor(initialData.valor.toString());
        setTiempoMinutos(initialData.tiempo_minutos.toString());
        setTipoVehiculoId(initialData.tipo_vehiculo_id);
      } else {
        setNombreTarifa('');
        setValor('');
        setTiempoMinutos('');
        setTipoVehiculoId('');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const fetchVehicleTypes = async () => {
    setLoading(true);
    try {
      const data = await vehicleTypeService.getVehicleTypes();
      setVehicleTypes(data);
    } catch (err) {
      console.error('Error fetching vehicle types', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones preventivas
    if (!tipoVehiculoId) {
      setError('Por favor selecciona un tipo de vehículo');
      return;
    }

    if (!parqueaderoId) {
      setError('Error de sesión: No se encontró el ID del parqueadero. Intenta re-iniciar sesión.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      nombre_tarifa: nombreTarifa,
      valor: Number(valor),
      tiempo_minutos: Number(tiempoMinutos),
      tipo_vehiculo_id: tipoVehiculoId,
      parqueadero_id: parqueaderoId
    };

    console.log('FeeFormModal - Iniciando guardado:', payload);

    try {
      await onSave(payload);
      console.log('FeeFormModal - Guardado exitoso');
      onClose();
    } catch (err: any) {
      console.error('FeeFormModal - Error en onSave:', err);
      setError(err.response?.data?.message || 'Error al guardar la tarifa. Verifica los datos.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="text-blue-600" size={24} />
            {initialData ? 'Editar Tarifa' : 'Nueva Tarifa'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 italic">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Tipo de Vehículo</label>
            <div className="relative">
              <Car className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <select
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                value={tipoVehiculoId}
                onChange={(e) => setTipoVehiculoId(e.target.value)}
              >
                <option value="">Seleccione un tipo...</option>
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Nombre de la Tarifa</label>
            <input
              type="text"
              placeholder="Ej: Cuarto de hora"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={nombreTarifa}
              onChange={(e) => setNombreTarifa(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Tiempo (Minutos)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="number"
                  placeholder="15"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={tiempoMinutos}
                  onChange={(e) => setTiempoMinutos(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Valor ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="number"
                  placeholder="3000"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : initialData ? 'Actualizar Tarifa' : 'Crear Tarifa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeFormModal;
