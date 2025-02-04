
// import React, { useState } from "react";
// import useSignInViewModel from "../viewmodels/SignInViewModel";
// import { useNavigate } from "react-router-dom";
// import "../styles/SignIn.css";

// const SignIn = () => {
//     const { signin, error, successMessage } = useSignInViewModel();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email.trim()) return alert("Email is required");
//         if (!password.trim()) return alert("Password is required");

//         const result = await signin({ email, password });

//         if (result.success) {
//             // ✅ Store email for OTP verification
//             sessionStorage.setItem("email", email);

//             // ✅ Redirect to OTP Page
//             navigate("/otp");
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-box">
//                 <h1 className="login-title">Welcome back</h1>
//                 <p className="login-subtitle">Please enter your details</p>
//                 <form onSubmit={handleSubmit} className="login-form">
//                     <div className="input-group">
//                         <label>Email address</label>
//                         <input 
//                             type="email" 
//                             placeholder="Enter your email" 
//                             value={email} 
//                             onChange={(e) => setEmail(e.target.value)} 
//                             required 
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label>Password</label>
//                         <input 
//                             type="password" 
//                             placeholder="Enter your password" 
//                             value={password} 
//                             onChange={(e) => setPassword(e.target.value)} 
//                             required 
//                         />
//                     </div>
//                     <div className="remember-section">
//                         <label>
//                             <input type="checkbox" /> Remember for 30 days
//                         </label>
//                         <a onClick={() => navigate("/forgot-password")} className="forgot-password" style={{ cursor: "pointer" }}>
//                             Forgot password?
//                         </a>
//                     </div>
//                     {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
//                     {successMessage && <p className="success-message" style={{ color: "green" }}>{successMessage}</p>}
//                     <button type="submit" className="login-button">Sign in</button>
//                 </form>
//                 <p className="signup-text">
//                     Don’t have an account? <a href="/signup">Sign up</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignIn;


import React, { useState } from "react";
import useSignInViewModel from "../viewmodels/SignInViewModel";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";

const SignIn = () => {
    const { signin, sendOtp, error, successMessage } = useSignInViewModel();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Added loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return alert("Email is required");
        if (!password.trim()) return alert("Password is required");

        setLoading(true); // ✅ Show loading state
        const result = await signin({ email, password });

        if (result.success) {
            // ✅ Store email for OTP verification
            sessionStorage.setItem("email", email);

            // ✅ Automatically send OTP after successful login
            await sendOtp(email);

            // ✅ Redirect to OTP Page
            navigate("/otp");
        }
        setLoading(false); // ✅ Stop loading
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Welcome back</h1>
                <p className="login-subtitle">Please enter your details</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="remember-section">
                        <label>
                            <input type="checkbox" /> Remember for 30 days
                        </label>
                        <a onClick={() => navigate("/forgot-password")} className="forgot-password" style={{ cursor: "pointer" }}>
                            Forgot password?
                        </a>
                    </div>
                    {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
                    {successMessage && <p className="success-message" style={{ color: "green" }}>{successMessage}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
                <p className="signup-text">
                    Don’t have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
