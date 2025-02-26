/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isCheckingAuth: false, // Added missing state

  checkAuth: async () => {
    set({ isCheckingAuth: true }); // Set loading state

    try {
      const res = await axiosInstances.get("/auth/check"); // Added `await`
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstances.post("/auth/signup", data);
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
