import { httpClient } from '../http/httpClient';

export const paymentService = {
  getPaymentsReport: async (date?: string) => {
    const response = await httpClient.get('/ticket-payment/report', {
      params: { 
        date 
      }
    });
    return response.data.data;
  }
};
