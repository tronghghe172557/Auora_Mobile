export const uploadImageToCloudinary = async (imageUri) => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUD_NAME;
  const apiKey = process.env.EXPO_PUBLIC_CLOUD_API_KEY;
  const apiSecret = process.env.EXPO_PUBLIC_CLOUD_API_SECRET;
  
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    formData.append("upload_preset", "Default");
    formData.append("api_key", apiKey);
    
    // Add timestamp and signature if needed for authentication
    const timestamp = Math.floor(Date.now() / 1000);
    formData.append("timestamp", timestamp);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Upload error:", data);
      return null;
    }
    
    console.log("Upload thành công:", data.secure_url);

    // Thêm transformation vào URL
    if (data.secure_url) {
      // Kiểm tra xem URL có chứa '/upload/' không
      if (data.secure_url.includes("/upload/")) {
        const optimizedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/w_800,q_auto:good,f_auto/"
        );

        return optimizedUrl;
      }
    }
    
    return data.secure_url || null;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};