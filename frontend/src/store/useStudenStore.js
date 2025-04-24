/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useStudentStore = create((set)=>({

  postStudentDetails: async (details) =>{

    try {
      const res = await axiosInstances.post("/student/requestDiploma",details)
      return res.data;


    } catch (error) {
      console.error('Error posting student details:', error);
      throw error; // Re-throw to handle it in the component
    }

  }
  
}))
