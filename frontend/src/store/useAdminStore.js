/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useAdminStore = create((set) => ({
  diplomas: [],

  checkDiplomas: async (department, year) => {
    try {
      const res = await axiosInstances.get("/admin/checkDiploma", {
        params: { department, year },
      });
    
      set({ diplomas: res.data.students });
    } catch (error) {
      console.log(error);
    }
  },

  sendSession: async (session) => {
    try {
      await axiosInstances.post("/admin/sendDiplomaSession", session);
      console.log("Session sent successfully");
    } catch (error) {
      console.log(error);
    }
  }
  
}));
