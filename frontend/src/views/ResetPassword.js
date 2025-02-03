import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import useResetPasswordViewModel from "../viewmodels/ResetPasswordViewModel";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const { message, error, resetPassword } = useResetPasswordViewModel();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetPassword(token, newPassword);
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default ResetPassword;
