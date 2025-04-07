// deanStore.js
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

// deanStore.js
export const useDeanStore = create((set) => ({
  UrlSession: sessionStorage.getItem("deanSession") || "",
  studentDetails: JSON.parse(sessionStorage.getItem("studentDetails") || "[]"),

  setUrlSession: (id) => {
    sessionStorage.setItem("deanSession", id);
    set({ UrlSession: id });
  },

  getSession: async (department) => {
    try {
      const res = await axiosInstances.get("/dean/getdiploma", { 
        params: { department } 
      });

      const { sessionId, students } = res.data.data;
      
      // Store in sessionStorage
      sessionStorage.setItem("studentDetails", JSON.stringify(students));
      
      set({ 
        UrlSession: sessionId,
        studentDetails: students
      });

      return sessionId;
    } catch (err) {
      console.error("Error getting session:", err);
      return null;
    }
  },


  addEsignature: async (data) => {
    try {
      const res = await axiosInstances.put("/dean/addEsignature", data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in update profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  digitalSignature: async (students, esignatures) => {
    try {
      const res = await axiosInstances.post("/dean/digitalSignature", { 
        students, 
        esignatures 
      });  // ✅ Send both as an object
      console.log("thestudents",students)
      console.log(res.data);
      console.log("the esig", esignatures);
    } catch (error) {
      console.log("error in digital signature:", error);
    }
  },
  

  
  getEsignature: async () => {
    try {
      const res = await axiosInstances.get("/dean/getEsignature");
      console.log("API Response:", res.data);
      set({ eSignature: res.data.data.signature });   
      set({ deanName: res.data.data.fullName });

    } catch (error) {
      console.log("error in digital signature:", error);
    }
  },


}));