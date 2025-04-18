/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isCheckingAuth: false, // Added missing state
  isLoggingIn: false,


  checkAuth: async () => {
    set({ isCheckingAuth: true }); // Set loading state

    try {
      const res = await axiosInstances.get("/auth/checkUser"); // Added `await`
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
      set({ authUser: res.data }); // Fixed typo here
      console.log("Fetched user:", res.data);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstances.post("/auth/login", data);
      set({ authUser: res.data });
      // toast.success("Logged in successfully");

      // get().connectSocket();
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async()=>{
    try {
       await axiosInstances.post("/auth/logout")
       set({authUser:null})
       return { success: true };
       {/*toast.success("loggedout")*/}
    } catch (error) {
      console.error("Logout error:", error?.response?.data?.message || "Logout failed");
      {/* toast.error(error.response.data.message)*/}
      return { 
        success: false, 
        error: error?.response?.data?.message || "Logout failed" 
      };
    }
  }
}));  
