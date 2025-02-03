import React, { useState } from "react";
import useForgotPasswordViewModel from "../viewmodels/ForgotPasswordViewModel";
import "../styles/ForgotPassword.css";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const { message, error, requestPasswordReset } = useForgotPasswordViewModel();

    const handleSubmit = async (e) => {
        e.preventDefault();
        requestPasswordReset(email);
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password?</h2>
            <p>Enter your email to receive a reset link</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default ForgotPassword;
