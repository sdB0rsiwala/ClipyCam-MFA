import React, { useState } from "react";
import useSignUpViewModel from "../viewmodels/SignUpViewModel";
import "../styles/SignUp.css";

const SignUp = () => {
    const { signup, error, successMessage } = useSignUpViewModel();
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signup(user);
        if (result.success) {
            alert("Signup successful! Please login.");
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
