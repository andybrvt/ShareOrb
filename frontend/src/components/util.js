import axios from "axios";


export const authAxios = axios.create({
  baseURL: `${global.API_ENDPOINT}/userprofile/`,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});
