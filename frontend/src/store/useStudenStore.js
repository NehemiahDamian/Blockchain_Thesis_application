/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";
import StudentRequest from "../../../backend/src/models/student.request.model";

export const useStudentStore = create((set)=>({
  studentRequest: [], // Initialize with empty array


  postStudentDetails: async (details) =>{

    try {
      const res = await axiosInstances.post("/student/requestDiploma",details)
      return res.data;


    } catch (error) {
      console.error('Error posting student details:', error);
      throw error; // Re-throw to handle it in the component
    }

  },

  getMyRequest: async () => {
    try {
      const res = await axiosInstances.get("/student/getStudentRequest");
      set({ studentRequest: res.data.data }); // Assuming backend returns { data: [...] }
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }
  
}))
