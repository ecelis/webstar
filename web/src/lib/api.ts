import axios, { InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";
const getCsrfToken = async () => {
  try {
    const response = await axios.get(`${API_URL}csrf/`, {
      withCredentials: true,
    });
    const csrfToken = response.data.csrfToken;
    console.log("CSRF Token:", csrfToken);
    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let csrftoken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));
    if (!csrftoken) {
      csrftoken = await getCsrfToken();
      if (csrftoken) config.headers["X-CSRFToken"] = csrftoken;
    } else {
      config.headers["X-CSRFToken"] = csrftoken.split("=")[1];
    }

    const sessionAuth = sessionStorage.getItem("wsauth");
    if (sessionAuth) {
      const { token } = JSON.parse(sessionAuth);
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  }
);

export default axiosInstance;
