import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { httpClient } from '../../infrastructure/http/httpClient';

export const useCapacity = () => {
  const { activeParkingId } = useAppStore();
  const { user } = useAuthStore();
  const [capacity, setCapacity] = useState({ 
    current: user?.current_places || 0, 
    max: user?.max_places || 0 
  });
  const [loading, setLoading] = useState(false);

  const fetchCapacity = async () => {
    if (!activeParkingId) return;
    try {
      setLoading(true);
      const response = await httpClient.get(`/parqueadero/${activeParkingId}/capacity`);
      if (response.data.status === 'success') {
        setCapacity(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching capacity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacity();
  }, [activeParkingId]);

  const isFull = capacity.max > 0 && capacity.current >= capacity.max;

  return {
    ...capacity,
    isFull,
    loading,
    refreshCapacity: fetchCapacity
  };
};
