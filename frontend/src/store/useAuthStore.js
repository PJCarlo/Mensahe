import {create} from 'zustand';
import { api as axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get('/auth/status');
      set({ authUser: response.data?.user ?? null });
    } catch (error) {
      console.error('checkAuth failed', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  }  

  

}));
