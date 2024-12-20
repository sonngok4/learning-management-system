import axios from "axios";

// const BASE_URL = "https://lms-server-vd61.onrender.com/api/v1";
const BASE_URL = "http://localhost:3000/api";


const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

// Add request interceptor to check token expiry
axiosInstance.interceptors.response.use(
    response => response,  // Nếu response hợp lệ, trả về bình thường
    async error => {
        // Kiểm tra nếu lỗi là do token hết hạn
        if (error.response && error.response.data.message === 'jwt expired') {
            // Lấy refresh token từ cookie (trình duyệt tự động gửi token nếu đã lưu trong cookie)
            try {
                // Gửi yêu cầu làm mới token
                const refreshResponse = await axios.post('auth/refresh-token', {}, { withCredentials: true });

                // Lấy access token mới từ phản hồi
                const newAccessToken = refreshResponse.data.accessToken;

                // Cập nhật lại Authorization header với access token mới
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Lặp lại yêu cầu gốc với token mới
                return axiosInstance(error.config);
            } catch (refreshError) {
                // Nếu không thể làm mới token, chuyển hướng người dùng đến trang đăng nhập
                console.log('Failed to refresh token', refreshError);
                window.location.href = '/login';
            }
        }

        // Nếu lỗi khác, trả về lỗi gốc
        return Promise.reject(error);
    }
);

export default axiosInstance;