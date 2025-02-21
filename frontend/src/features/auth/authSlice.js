// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
// Import jwtDecode as a named export if your version requires that:
import { jwtDecode } from "jwt-decode";

// Parse the stored user from localStorage (if any)
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  userRole: user ? user.role : "customer", // Default role is "customer"
  userInfo: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// REGISTER thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// LOGIN thunk
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const tokens = await authService.login(userData);
      // Decode the access token to extract the role
      const decoded = jwtDecode(tokens.access);
      console.log("Decoded token payload:", decoded);
      // If the token doesn't include a role, default to "customer"
      tokens.role = decoded.role || "customer";
      return tokens;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// LOGOUT thunk
export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
});

// ACTIVATE thunk
export const activate = createAsyncThunk(
  "auth/activate",
  async (userData, thunkAPI) => {
    try {
      return await authService.activate(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// RESET PASSWORD thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPassword(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// RESET PASSWORD CONFIRM thunk
export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPasswordConfirm(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET USER INFO thunk
export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      console.log("Access token for getUserInfo:", accessToken);
      const userData = await authService.getUserInfo(accessToken);
      console.log("Received userData:", userData);
      return userData;
    } catch (error) {
      const message =
        (error.response &&
         error.response.data &&
         error.response.data.message) ||
        error.message ||
        error.toString();
      console.error("getUserInfo error:", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.user = null;         // Clear user data on reset
      state.userInfo = {};       // Clear userInfo on reset
      state.userRole = "customer"; // Reset role to default if needed
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.userRole = action.payload.role; // Update role from response
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.userRole = action.payload.role; // Store the role from token decoding
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        console.log("Logging out: clearing state");
        state.user = null;
        state.userInfo = {}; 
        state.userRole = "customer";
      })
      // ACTIVATE
      .addCase(activate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.userRole = action.payload.role;
      })
      .addCase(activate.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // RESET PASSWORD CONFIRM
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // GET USER INFO
      .addCase(getUserInfo.fulfilled, (state, action) => {
        // Merge the GET_USER_INFO response into the existing user object.
        state.user = { ...state.user, ...action.payload };
        if (action.payload.role) {
          state.userRole = action.payload.role;
        }
        state.userInfo = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
