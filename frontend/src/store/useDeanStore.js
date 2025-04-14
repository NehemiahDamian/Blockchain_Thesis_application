import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

// Helper function outside the store
const isFresh = (timestamp) => {
  return (Date.now() - timestamp) < (5 * 60 * 1000); // 5 minute cache
};
export const useDeanStore = create((set) => ({
  UrlSession: sessionStorage.getItem("deanSession") || "", // ✅ Load session if available
  studentDetails: JSON.parse(sessionStorage.getItem("studentDetails") || "[]"),

  setUrlSession: (id) => {
    sessionStorage.setItem("deanSession", id);
    set({ UrlSession: id });
  },

  getSession: async (department) => {
    try {
      const studentDepartment = `students in ${department}`;
      const cachedData = sessionStorage.getItem(studentDepartment);
      const cachedTimestamp = sessionStorage.getItem(`${studentDepartment}-timestamp`);
      const session = sessionStorage.getItem("deanSession");

      if (cachedData && cachedTimestamp && isFresh(Number(cachedTimestamp)) && session) {
        set({
          studentDetails: JSON.parse(cachedData),
          UrlSession: session  
        });
        return session;
      }

      const res = await axiosInstances.get("/dean/getdiploma", { 
        params: { department } 
      });

      const { sessionId, students } = res.data.data;

      // Save to sessionStorage
      const now = Date.now();
      sessionStorage.setItem(studentDepartment, JSON.stringify(students));
      sessionStorage.setItem(`${studentDepartment}-timestamp`, now.toString());
      sessionStorage.setItem("deanSession", sessionId);

      set({ 
        UrlSession: sessionId,
        studentDetails: students
      });

      return sessionId;
    } catch (err) {
      console.error("Error getting session:", err);
      set({ studentDetails: [] });
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
      });  //Send both as an object
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