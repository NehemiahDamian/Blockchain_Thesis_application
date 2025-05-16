/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isCheckingAuth: false, // Added missing state
  isLoggingIn: false,
  message: null,


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
  },

  forgotPassword  : async (email) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstances.post("/auth/forgot-password", { email });
      // console.log("Password reset email sent:", res.data);
      // toast.success("Password reset email sent");
      set({message:"Password Reset Email Sent" })
      set({messageBody: " If you don't receive an email within a few minutes, please check your spam folder."})
    } catch (error) {
      console.log(error.response.data.message);
      set({message: "Password Reset Failed", messageBody: "Please ensure the email is registered."});
    } finally {
      set({ isLoggingIn: false });
    }
  },

resetPassword: async (token, newPassword) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstances.post("/auth/reset-password", {
      token,        // Include token
      newPassword   // Include newPassword (not 'password')
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Password reset failed";
    throw error; // Make sure to throw so the error reaches your component
  } finally {
    set({ isLoggingIn: false });
  }
},
resetPasswordatLoggedIn: async (currentPassword, newPassword) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstances.patch("/auth/changepassword", {
      currentPassword,
      newPassword
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Password reset failed";
    throw error; 
  } finally {
    set({ isLoggingIn: false });
  }
},


}));  
