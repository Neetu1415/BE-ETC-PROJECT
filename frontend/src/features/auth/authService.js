import axios from "axios";

const BACKEND_DOMAIN = process.env.REACT_APP_BACKEND_DOMAIN || "http://localhost:8000";

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`;
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`;
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`;
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`;
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`;

// Centralized error message extractor
const extractErrorMessage = (error) => error.response?.data || error.message || "An unknown error occurred";

// Centralized config function
const getConfig = (token = null) => ({
  headers: {
    "Content-type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Register user
const register = async (userData) => {
    try {
      const { password, ...rest } = userData;
      const data = { ...rest, password, re_password: password };
      const response = await axios.post(REGISTER_URL, data, getConfig());
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error.response.data);
      throw error;
    }
  } // Pass the error message to the calling function
    /*catch (error) {
    console.error("Error registering user:", extractErrorMessage(error));
    throw error;
  }*/

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(LOGIN_URL, userData, getConfig());

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error("Error logging in:", extractErrorMessage(error));
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// Activate user
const activate = async (userData) => {
  try {
    const response = await axios.post(ACTIVATE_URL, userData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error activating user:", extractErrorMessage(error));
    throw error;
  }
};

// Reset Password
const resetPassword = async (userData) => {
  try {
    const response = await axios.post(RESET_PASSWORD_URL, userData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", extractErrorMessage(error));
    throw error;
  }
};

// Reset Password Confirm
const resetPasswordConfirm = async (userData) => {
  try {
    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error confirming password reset:", extractErrorMessage(error));
    throw error;
  }
};

// Get User Info
const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(GET_USER_INFO, getConfig(accessToken));
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", extractErrorMessage(error));
    throw error;
  }
};

const authService = { 
  register, 
  login, 
  logout, 
  activate, 
  resetPassword, 
  resetPasswordConfirm, 
  getUserInfo 
};

export default authService;



/*import axios from "axios";

const BACKEND_DOMAIN = "http://localhost:8000";

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`;
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`;
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`;
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`;
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`;

// Register user
const register = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const response = await axios.post(REGISTER_URL, userData, config);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        throw error;
    }
};

// Login user
const login = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const response = await axios.post(LOGIN_URL, userData, config);

        if (response.data) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.response?.data || error.message);
        throw error;
    }
};

// Logout user
const logout = () => {
    localStorage.removeItem("user");
};

// Activate user
const activate = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const response = await axios.post(ACTIVATE_URL, userData, config);
        return response.data;
    } catch (error) {
        console.error("Error activating user:", error.response?.data || error.message);
        throw error;
    }
};

// Reset Password
const resetPassword = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const response = await axios.post(RESET_PASSWORD_URL, userData, config);
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error.response?.data || error.message);
        throw error;
    }
};

// Reset Password Confirm
const resetPasswordConfirm = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config);
        return response.data;
    } catch (error) {
        console.error("Error confirming password reset:", error.response?.data || error.message);
        throw error;
    }
};

// Get User Info
const getUserInfo = async (accessToken) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await axios.get(GET_USER_INFO, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error.response?.data || error.message);
        throw error;
    }
};

const authService = { 
    register, 
    login, 
    logout, 
    activate, 
    resetPassword, 
    resetPasswordConfirm, 
    getUserInfo 
};

export default authService;





/*import axios from "axios"

const BACKEND_DOMAIN = "http://localhost:8000"

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`



// Register user

const register = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(REGISTER_URL, userData, config)
    .then(response => console.log(response))
    .catch(error => console.error)
    return response.data
}

// Login user

const login = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(LOGIN_URL, userData, config)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

// Logout 

const logout = () => {
    return localStorage.removeItem("user")
}

// Activate user

const activate = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(ACTIVATE_URL, userData, config)

    return response.data
}

// Reset Password

const resetPassword = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_URL, userData, config)

    return response.data
}

// Reset Password

const resetPasswordConfirm = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config)

    return response.data
}

// Get User Info

const getUserInfo = async (accessToken) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    const response = await axios.get(GET_USER_INFO, config)

    return response.data
}



const authService = { register, login, logout, activate, resetPassword, resetPasswordConfirm, getUserInfo }

export default authService*/