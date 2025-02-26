import axios from "axios"

export const axiosInstances = axios.create({
  baseURL:"http://localhost:4001/api",
  withCredentials:true,
})