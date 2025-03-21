// deanStore.js
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useDeanStore = create((set) => ({
  UrlSession: "",
  studentDetails: [],
  setUrlSession: (id) => set({ UrlSession: id }),

  getSession: async (department) => {
    try {
      const res = await axiosInstances.get("/dean/getdiploma", {
        params: { department },
      });
  
      console.log("🎯 API response:", res.data.data); // Add this
  
      const sessionId = res.data.data.sessionId;
      set({ UrlSession: sessionId });
      set({ studentDetails: res.data.data.students });
  
      return sessionId;
    } catch (err) {
      console.log("❌ Error getting session:", err);
      return null;
    }
  },
  
}));
