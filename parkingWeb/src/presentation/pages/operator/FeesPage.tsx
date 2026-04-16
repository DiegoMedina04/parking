import { useState, useEffect } from 'react';
import { Plus, DollarSign, Clock, Trash2, Edit3, Car } from 'lucide-react';
import { feeService } from '../../../infrastructure/services/feeService';
import { useAuthStore } from '../../../application/store/authStore';
import FeeFormModal from '../../components/operator/FeeFormModal';

const FeesPage = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);

  const user = useAuthStore(state => state.user);
  const parqueaderoId = user?.parqueadero_id || '';

  useEffect(() => {
    if (parqueaderoId) {
      fetchFees();
    }
  }, [parqueaderoId]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const data = await feeService.getFeesByParking(parqueaderoId);
      setFees(data);
    } catch (error) {
      console.error('Error fetching fees', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    if (editingFee) {
      await feeService.updateFee(editingFee.id, data);
    } else {
      await feeService.createFee(data);
    }
    fetchFees();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarifa?')) {
      try {
        await feeService.deleteFee(id);
        fetchFees();
      } catch (error) {
        alert('Error al eliminar la tarifa');
      }
    }
  };

  const openEditModal = (fee: any) => {
    setEditingFee(fee);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingFee(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Gestión de Tarifas</h1>
          <p className="text-gray-500 mt-2 font-medium">Define los cobros según el tiempo y tipo de vehículo</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-3xl font-bold flex items-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 group"
        >
          <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform">
            <Plus size={20} />
          </div>
          Nueva Tarifa
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 border-dashed">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No hay tarifas configuradas</h3>
          <p className="text-gray-500 mt-2">Comienza creando tu primera tarifa para este parqueadero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fees.map((fee) => (
            <div key={fee.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => openEditModal(fee)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(fee.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <Car className="text-blue-600" size={28} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                    {fee.tipoVehiculo?.name || 'Vehículo'}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1 line-clamp-1">{fee.nombre_tarifa}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span className="font-semibold text-sm">Tiempo Base</span>
                  </div>
                  <span className="font-bold text-gray-800">{fee.tiempo_minutos} min</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <div className="flex items-center gap-2 opacity-90">
                    <DollarSign size={18} />
                    <span className="font-semibold text-sm">Valor</span>
                  </div>
                  <span className="text-xl font-black">${Number(fee.valor).toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingFee}
      />
    </div>
  );
};

export default FeesPage;
