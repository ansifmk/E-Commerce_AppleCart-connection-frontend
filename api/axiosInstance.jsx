import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7096",
  withCredentials: true,
});

// 🔹 REQUEST
axiosInstance.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
console.log("TOKEN:", token);
  return config;
});

// 🔹 RESPONSE (REFRESH FIXED)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "https://localhost:7096/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        // 🔥 FIX: update inside USER object
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
          const updatedUser = {
            ...storedUser,
            token: newToken,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        // 🔥 ALSO optional (keep this)
        localStorage.setItem("token", newToken);

        // 🔥 RETRY
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error("Refresh failed");

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;