const port_computer = process.env.EXPO_PUBLIC_PORT_COMPUTER || "localhost";
// const port_computer = "localhost";
const port_backend = process.env.EXPO_PUBLIC_PORT_BACKEND || "9999";
export const API_BASE_URL = `http://${port_computer}:${port_backend}/api`;

// AUTH
export const API_LOGIN = `/auth/login`;
export const API_REGISTER = `/auth/register`;

// IMAGE
export const API_IMAGE = `/image`;
export const API_IMAGES_USER = `/image/users`;
export const API_UPLOAD_IMAGE = `/image/upload`;

// USER
export const API_UPDATE_PROFILE = `/user`;

// ipconfig getifaddr en0

