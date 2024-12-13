import axios from "axios";

const api = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://api.vinylvibe.live",
    headers: {
        "Content-Type": "application/json",
    },
});

export const setupAxiosInterceptors = (tokenStorage) => {
    api.interceptors.request.use((config) => {
        if (tokenStorage.isValid()) {
            config.headers.Authorization = `Bearer ${tokenStorage.get()}`;
            console.log("API Request:", {
                fullUrl: `${config.baseURL}${config.url}`,
                method: config.method,
            });
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            console.log("Response Error:", {
                url: error.config?.url,
                status: error.response?.status,
                message:
                    error.response?.data?.error ||
                    error.response?.data?.message,
            });

            if (error.response?.status === 401) {
                tokenStorage.remove();
            }
            return Promise.reject(error);
        },
    );
};

export default api;
