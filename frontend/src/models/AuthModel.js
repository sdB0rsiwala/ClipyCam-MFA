import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const AuthModel = {
    signup: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    signin: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signin`, userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    // ✅ Forgot Password
    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Failed to send password reset email" };
        }
    },

    // ✅ Reset Password
    resetPassword: async (token, newPassword) => {
        try {
            const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Failed to reset password" };
        }
    }
};
