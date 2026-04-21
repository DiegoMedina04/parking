import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Wallet, Smartphone, Printer, CheckCircle2, Calendar, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MensualidadPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mensualidad: any;
  parqueaderoId: string;
  onProcessPayment: (data: any) => Promise<void>;
}

export const MensualidadPaymentModal: React.FC<MensualidadPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mensualidad,
  parqueaderoId,
  onProcessPayment
}) => {
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !mensualidad) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await onProcessPayment({
        valor: mensualidad.plan.valor,
        metodoPago,
        parqueaderoId
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'Efectivo', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'Tarjeta', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Transferencia', icon: Wallet, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'Nequi/Daviplata', icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Print Effect Overlay */}
          {isSuccess && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-center p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800">¡Pago Exitoso!</h3>
              <p className="text-gray-500 mt-2">La mensualidad ha sido actualizada a PAGADA.</p>
              <div className="mt-8 p-4 border-2 border-dashed border-gray-200 rounded-xl w-full">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Recibo #</span>
                  <span className="font-mono">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="text-left py-2 border-t border-gray-100">
                  <p className="font-bold text-gray-800">{mensualidad.vehiculo.licensePlate}</p>
                  <p className="text-sm text-gray-500">{mensualidad.plan.nombre}</p>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>TOTAL</span>
                  <span className="text-green-600">${mensualidad.plan.valor.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Registrar Pago
              </h2>
              <p className="text-sm text-gray-500">Completa la transacción del cliente</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
              disabled={isProcessing}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            {/* Info Section */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Car className="w-4 h-4" />
                  <span className="text-sm font-medium">Vehículo</span>
                </div>
                <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100 uppercase tracking-wider">
                  {mensualidad.vehiculo.licensePlate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Tarifa</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">{mensualidad.plan.nombre}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">MONTO A PAGAR</span>
                <span className="text-2xl font-black text-green-600">
                  ${mensualidad.plan.valor.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <label className="text-sm font-bold text-gray-700 mb-4 block flex items-center gap-2">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setMetodoPago(method.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      metodoPago === method.id
                        ? 'border-green-600 bg-green-50 shadow-md transform scale-[1.02]'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${method.bg}`}>
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                    </div>
                    <span className={`text-xs font-bold ${metodoPago === method.id ? 'text-green-700' : 'text-gray-600'}`}>
                      {method.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirmar Pago y Activar
                  </>
                )}
              </button>
              
              <button
                disabled={true}
                className="w-full bg-white border border-gray-200 text-gray-400 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Printer className="w-4 h-4" />
                Imprimir Recibo (Próximamente)
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
