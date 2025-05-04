/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useAdminStore = create((set) => ({
  // State
  diplomas: [],
  allRequest: [],
  departmentYears:[],

  // Check diplomas for a specific department and year
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

  // Get all diploma requests
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

  // Accept a specific diploma request with reason
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

  // Reject a specific diploma request with reason
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
      }
      
    } catch (error) {
      console.log(error)
    }
  }
  


}));
