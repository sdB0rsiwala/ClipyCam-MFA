
// import axios from "axios";

// const API_URL = "http://localhost:3001/api/auth";

// export const AuthModel = {
//     // ✅ Signup API
//     signup: async (userData) => {
//         try {
//             const response = await axios.post(`${API_URL}/signup`, userData);
//             return response.data;
//         } catch (error) {
//             throw error.response.data;
//         }
//     },

//     // ✅ Signin API
//     signin: async (userData) => {
//         try {
//             const response = await axios.post(`${API_URL}/signin`, userData);
//             return response.data;
//         } catch (error) {
//             throw error.response.data;
//         }
//     },

//     // ✅ Send OTP API
//     sendOtp: async (email) => {
//         try {
//             const response = await axios.post(`${API_URL}/send-otp`, { email });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || { error: "Failed to send OTP" };
//         }
//     },

//     // ✅ Verify OTP API
//     verifyOtp: async (email, otp) => {
//         try {
//             const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || { error: "OTP verification failed" };
//         }
//     },

//     // ✅ Forgot Password API
//     forgotPassword: async (email) => {
//         try {
//             const response = await axios.post(`${API_URL}/forgot-password`, { email });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || { error: "Failed to send password reset email" };
//         }
//     },

//     // ✅ Reset Password API
//     resetPassword: async (token, newPassword) => {
//         try {
//             const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || { error: "Failed to reset password" };
//         }
//     }
// };

import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const AuthModel = {
    // ✅ Signup API
    signup: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            throw error.response?.data || { error: "Signup failed" };
        }
    },

    // ✅ Signin API
    signin: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signin`, userData);
            return response.data;
        } catch (error) {
            console.error("Signin error:", error.response?.data || error.message);
            throw error.response?.data || { error: "Signin failed" };
        }
    },

    // ✅ Send OTP API
    sendOtp: async (email) => {
        if (sessionStorage.getItem("otpSent") === "true") {
            console.warn("OTP request blocked: Already sent for this session.");
            return { message: "OTP already sent. Please check your email." };
        }

        try {
            console.log("Sending OTP to:", email); // Debug log
            sessionStorage.setItem("otpSent", "true"); // ✅ Prevent duplicate requests
            const response = await axios.post(`${API_URL}/send-otp`, { email });
            return response.data;
        } catch (error) {
            console.error("Send OTP error:", error.response?.data || error.message);
            throw error.response?.data || { error: "Failed to send OTP" };
        }
    },

    // ✅ Verify OTP API
    verifyOtp: async (email, otp) => {
        try {
            console.log("Verifying OTP for:", email); // Debug log
            const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
            return response.data;
        } catch (error) {
            console.error("OTP verification error:", error.response?.data || error.message);
            throw error.response?.data || { error: "OTP verification failed" };
        }
    },

    // ✅ Forgot Password API
    forgotPassword: async (email) => {
        try {
            console.log("Requesting password reset for:", email); // Debug log
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            console.error("Forgot password error:", error.response?.data || error.message);
            throw error.response?.data || { error: "Failed to send password reset email" };
        }
    },

    // ✅ Reset Password API
    resetPassword: async (token, newPassword) => {
        try {
            console.log("Resetting password..."); // Debug log
            const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
            return response.data;
        } catch (error) {
            console.error("Reset password error:", error.response?.data || error.message);
            throw error.response?.data || { error: "Failed to reset password" };
        }
    }
};
