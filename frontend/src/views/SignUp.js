
import React, { useState } from "react";
import useSignUpViewModel from "../viewmodels/SignUpViewModel";
import useOtpViewModel from "../viewmodels/OtpViewModel";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const SignUp = () => {
    const { signup, error, successMessage } = useSignUpViewModel();
    const { sendOtp } = useOtpViewModel();
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const result = await signup(user);

        if (result && result.success) {
            // ✅ Store email for OTP verification
            sessionStorage.setItem("email", user.email);
            sessionStorage.removeItem("otpSent"); // ✅ Reset OTP tracking

            // ✅ Send OTP automatically after signup
            await sendOtp(user.email);

            // ✅ Redirect to OTP Page
            navigate("/otp");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1 className="signup-title">Create an Account</h1>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="input-group">
                        <label>First Name</label>
                        <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone_number" placeholder="+1 123-456-7890" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <p className="signin-text">Already have an account? <a href="/signin">Sign in</a></p>
            </div>
        </div>
    );
};

export default SignUp;
