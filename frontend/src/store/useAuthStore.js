import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data?.user ?? null });
    } catch (error) {
      console.error('checkAuth failed', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  }  

}));

export default useAuthStore;
