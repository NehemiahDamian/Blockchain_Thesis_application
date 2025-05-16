/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { axiosInstances } from "../lib/axios";
// Helper function outside the store
const isFresh = (timestamp) => {
  return (Date.now() - timestamp) < (5 * 60 * 1000); // 5 minute cache
};

export const useRegistrarStore = create((set) => ({
  departmentYears: [],
  studentDetails: JSON.parse(sessionStorage.getItem("studentDetails") || "[]"),

  fetchStudentDetails: async (department, expectedYearToGraduate) => {
    try {
      const storageKey = `students-${department}-${expectedYearToGraduate}`;
      
      // Check cache freshness
      const cachedData = sessionStorage.getItem(storageKey);
      const cachedTimestamp = sessionStorage.getItem(`${storageKey}-timestamp`);

      // pag fresh keep, pag greater than 5 minutes fetch from the backend      
      if (cachedData && cachedTimestamp && isFresh(Number(cachedTimestamp))) {
        set({ studentDetails: JSON.parse(cachedData) });
        return;
      }


      // Fetch fresh data
      const response = await axiosInstances.get('/registrar/getSignedDiplomaByDepartment', {
        params: { department, expectedYearToGraduate }
      });
      console.log("the response",response.data)


      // Update storage and state
      const now = Date.now();
      sessionStorage.setItem(storageKey, JSON.stringify(response.data));
      sessionStorage.setItem(`${storageKey}-timestamp`, now.toString());
      set({ studentDetails: response.data });
      
    } catch (error) {
      console.error("Fetch error:", error);
      set({ studentDetails: [] });
    }
  },

  fetchDepartmentYears: async () => {
    try {
      const response = await axiosInstances.get('/registrar/getSignedDiploma');
      const apiData = response.data;
      
      // Convert to flat array format
      const flatData = [];
      for (const department in apiData) {
        apiData[department].forEach(year => {
          flatData.push({ department, year });
        });
      }
      
      set({ departmentYears: flatData });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  },

  addEsignature: async (data) => {
    try {
      const res = await axiosInstances.put("/registrar/addEsiganture", data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in update profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  getEsignature: async () =>{
    try {
      const res = await axiosInstances.get("/registrar/getEsignature")
      console.log("API Response:", res.data);

      set({eSignature: res.data.data.signature})
    } catch (error) {
      console.log(error)
    }

  },

  digitalSignature: async (students, esignatures) => {
  const res = await axiosInstances.post("/registrar/digitalSignature", {
    students,
    esignatures 
  });
  return res.data; 
},
  
}));