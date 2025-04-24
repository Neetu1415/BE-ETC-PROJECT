// authService.js
import axios from "axios";

const BACKEND_DOMAIN = "http://localhost:8000/api/v1";

// API endpoint URLs

const REGISTER_URL       = `${BACKEND_DOMAIN}/auth/users/`;
const LOGIN_URL          = `${BACKEND_DOMAIN}/auth/jwt/create/`;
const ACTIVATE_URL       = `${BACKEND_DOMAIN}/auth/users/activation/`;
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/auth/users/reset_password_confirm/`;
const GET_USER_INFO  = `${BACKEND_DOMAIN}/auth/users/me/`;

// Register user
const register = async (userData) => {
  // Remove any role field sent by the client so that the backend always sets the default role.
  const { role, ...data } = userData;
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  try {
    const response = await axios.post(REGISTER_URL, data, config);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};

// Login user
const login = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(LOGIN_URL, userData, config);
  if (response.data) {
    // The response should include user details along with tokens and role.
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// Activate user
const activate = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(ACTIVATE_URL, userData, config);
  return response.data;
};

// Reset Password
const resetPassword = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(RESET_PASSWORD_URL, userData, config);
  return response.data;
};

// Reset Password Confirm
const resetPasswordConfirm = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config);
  return response.data;
};

// Get User Info (should include the user's role)
const getUserInfo = async (accessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await axios.get(GET_USER_INFO, config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  activate,
  resetPassword,
  resetPasswordConfirm,
  getUserInfo,
};

export default authService;

