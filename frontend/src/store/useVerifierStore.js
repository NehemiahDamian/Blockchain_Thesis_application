import { create } from "zustand";
import { axiosInstances } from "../lib/axios";

export const useVerifierStore = create((set) => ({
  tokens: "",
  error: null,

  
  
  getToken: async (alumniName, alumniCourse, dateOfBirth) => {
    try {
      const res = await axiosInstances.get(`/verifier/verifierTae`, {
        params: { alumniName, alumniCourse, dateOfBirth },
      });
  
      if (res.status === 200) {
        set({ tokens:res.data.uniqueToken, error: null });
      } else {
        console.log("Unexpected status code:", res.status);
        }
  
      } catch (error) {
        set({ error: error.message || "An error occurred", tokens: "" });
        console.error(error);
      }
    },
  }));
  

