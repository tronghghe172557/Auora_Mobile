export const uploadImageToCloudinary = async (imageUri) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "photo.jpg",
  });
  formData.append("upload_preset", "Default");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dsd2msrfh/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  console.log("Upload thành công:", data.secure_url);

  //
  return data.secure_url || null;
};
