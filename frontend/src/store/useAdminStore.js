/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

const isFresh = (timestamp) => {
  return (Date.now() - timestamp) < (5 * 60 * 1000); // 5 minute cache
};


export const useAdminStore = create((set) => ({

  
  // State
  diplomas: [],
  allRequest: [],
  departmentYears:[],
  allStudent:[],
  departmentsArr:[],
  statistics: {},
  allDean: [],
  


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
        const response = await axiosInstances.get('/admin/getSignedDiplomaByDepartment', {
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
  

  checkDiplomas: async (department, year) => {
    try {
      const response = await axiosInstances.get("/admin/checkDiploma", {
        params: { department, year },
      });
      
      if (response.data?.students) {
        set({ diplomas: response.data.students });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking diplomas:", error.message);
      return false;
    }
  },

  // Send diploma session to server
  sendSession: async (session) => {
    try {
      const response = await axiosInstances.post("/admin/sendDiplomaSession", session);
      if (response.status === 200) {
        console.log("Session sent successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error sending session:", error.message);
      return false;
    }
  },

  getAllRequest: async () => {
    try {
      const response = await axiosInstances.get("/admin/getDiplomaRequest");
      if (response.data?.data) {
        set({ allRequest: response.data.data });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error getting requests:", error.message);
      return false;
    }
  },

  acceptRequest: async (pid, reasonforAction) => {
    try {
      if (!pid) throw new Error("PID is required");
      const response = await axiosInstances.put(`/admin/acceptDiploma/${pid}`, { reasonforAction });
      return response.status === 200;
    } catch (error) {
      console.error("Error accepting request:", error.message);
      return false;
    }
  },

  RejectRequest: async (pid, reasonforAction) => {
    try {
      if (!pid) throw new Error("PID is required");
      const response = await axiosInstances.put(`/admin/rejectDiploma/${pid}`, {reasonforAction});
      return response.status === 200;
    } catch (error) {
      console.error("Error rejecting request:", error.message);
      return false;
    }
  },

  fetchDepartmentYears: async () => {

    try {
      const response = await axiosInstances.get('/admin/adminGetSignedDiploma');
      const apiData = response.data

      const formattedData = [];
      


      for(const department in apiData){
        for(const year in apiData[department]){
          formattedData.push({
            year,
            department,
            ...apiData[department][year]
          });
        }

        set({departmentYears:formattedData})
        set({departmentsArr: apiData });

      }
      
    } catch (error) {
      console.log(error)
    }
  },

  // npx hardhat run scripts/scripts.js --network localhost

  archiveUploadedDiploma: async (fileUrl, fullName, program, expectedYearToGraduate, uniqueToken, department) => {
    try {
      const response = await axiosInstances.post("/admin/archiveUploadedDiploma", {
        fileUrl,
        fullName,
        program,
        expectedYearToGraduate,
        uniqueToken,
        department,
      });
      return response.status === 200;
    } catch (error) {
      console.error("Error archiving diploma:", error.message);
      return false;
    }
  },

  getAllstudentsArchiveByDepartment: async (department,year) => {
    try {
      const response = await axiosInstances.get("/admin/getAlldepartment", {
        params: { department, year},
      });
      if (response.data?.success) {
        console.log("Students fetched: ", response.data.students);
        set({ allStudent: response.data.students });
        return true;
      }
      console.log("No students found");
      return false;
      
    } catch (error) {
      console.error("Error getting requests:", error.message);
      return false;
    }
  },

  getStats: async () =>{
    try {
      const response = await axiosInstances.get("/admin/statistics");
   
        console.log("Statistics fetched: ", response.data);
        set({ statistics: response.data });
      
      
    } catch (error) {
      console.error("Error getting statistics:", error.message);
      return false;
    }
  },

// In useAdminStore.js
getAllDean: async () => {
  try {
    const response = await axiosInstances.get("/admin/getAllDean");
    console.log("API Response:", response.data); // Debug log
    
    // Normalize the response data
    const deanData = Array.isArray(response.data) ? response.data : [];
    console.log("Processed Dean Data:", deanData); // Debug log
    
    set({ allDean: deanData });
    return deanData.length > 0;
  } catch (error) {
    console.error("Error getting deans:", error.message);
    set({ allDean: [] });
    return false;
  }
},
}));
