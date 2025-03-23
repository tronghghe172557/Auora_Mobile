import axios from "axios";
import { Platform } from "react-native";
import { API_BASE_URL, API_UPLOAD_IMAGE } from "../constants/api.contants";

const uploadImageInBE = async (imageUri) => {
  // Tạo FormData object
  const formData = new FormData();

  // Xử lý đường dẫn file cho iOS (nếu cần)
  const uri =
    Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri;

  // Lấy tên file từ uri
  const filename = uri.split("/").pop();

  // Lấy loại file
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  // Thêm file vào formData
  formData.append("image", {
    uri,
    name: filename,
    type,
  });

  try {
    // Gửi request đến server
    // console.log(`${API_BASE_URL}${API_UPLOAD_IMAGE}`)
    const response = await axios.post(
      `${API_BASE_URL}${API_UPLOAD_IMAGE}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Trả về kết quả từ server
    console.log("Upload thành công:", response.data);
    return response.data; // { imageUrl, imageId }
  } catch (error) {
    console.error(
      "Lỗi upload ảnh:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export default uploadImageInBE;
