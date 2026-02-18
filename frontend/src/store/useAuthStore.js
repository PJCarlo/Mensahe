import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useAuthStore = create((set) => ({
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
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      set({ authUser: response.data?.user ?? null });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('login failed', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', formData);
      set({ authUser: response.data?.user ?? null });
    } catch (error) {
      console.error('signup failed', error);
    } finally {
      set({ isSigningUp: false });
    }
  }

}));
