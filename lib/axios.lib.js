import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api.contants";
import { Alert } from "react-native";

/**
 * Tạo một instance axios tùy chỉnh với các tùy chọn có thể cấu hình
 * @param {Object} options - Các tùy chọn cấu hình
 * @param {string} options.baseUrl - URL cơ sở cho instance (mặc định là API_BASE_URL)
 * @param {Object} options.headers - Headers tùy chỉnh để bao gồm
 * @param {number} options.timeout - Thời gian chờ request tính bằng mili giây
 * @param {boolean} options.withCredentials - Có bao gồm thông tin xác thực hay không
 * @returns {AxiosInstance} Instance axios đã được cấu hình
 */
export const createApiInstance = (options = {}) => {
  const {
    baseUrl = API_BASE_URL,
    headers = {},
    timeout = 30000,
    withCredentials = false,
  } = options;

  const instance = axios.create({
    baseURL: baseUrl,
    timeout,
    withCredentials,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  // Interceptor cho request
  instance.interceptors.request.use(
    async (config) => {
      try {
        // Thêm token xác thực từ AsyncStorage
        const token = await AsyncStorage.getItem("Token");
        console.log("Token in instance.interceptors:", token);
        if (token) {
          config.headers.authorization = `${token}`;
        }
      } catch (error) {
        console.error("Lỗi khi lấy token từ AsyncStorage:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor cho response
  instance.interceptors.response.use(
    (response) => {
      // Bạn có thể sửa đổi hoặc biến đổi dữ liệu phản hồi ở đây
      return response;
    },
    async (error) => {
      // Xử lý các lỗi phổ biến ở đây
      if (error.response) {
        // Máy chủ trả về mã trạng thái lỗi
        const { status } = error.response;
        console.log(error.response.data);

        if (status === 401) {
          // Không được phép - chuyển hướng đến đăng nhập hoặc làm mới token
          console.error("Xác thực thất bại");
          try {
            await AsyncStorage.removeItem("Token");
            // Có thể thêm xử lý chuyển trang login ở đây
          } catch (storageError) {
            console.error("Lỗi khi xóa token:", storageError);
          }
        } else if (status === 403) {
          console.error("Truy cập bị từ chối");
        } else if (status >= 300) {
          console.error("Truy cập bị từ chối");
        }
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được phản hồi
        console.error("Lỗi mạng, không nhận được phản hồi");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Instance mặc định với cấu hình cơ bản
const api = createApiInstance();

export default api;
