// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useOtpViewModel from "../viewmodels/OtpViewModel";
// import "../styles/OtpPage.css";

// const OtpPage = () => {
//     const [otp, setOtp] = useState("");
//     const { sendOtp, verifyOtp, message, error } = useOtpViewModel();
//     const navigate = useNavigate();

//     const handleSendOtp = async () => {
//         const email = sessionStorage.getItem("email"); // Retrieve stored email
//         if (email) {
//             await sendOtp(email);
//         } else {
//             alert("No email found. Please login or signup again.");
//             navigate("/signin");
//         }
//     };

//     const handleVerifyOtp = async () => {
//         const email = sessionStorage.getItem("email"); // Retrieve stored email
//         if (!email) {
//             alert("No email found. Please login or signup again.");
//             navigate("/signin");
//             return;
//         }

//         const result = await verifyOtp(email, otp);
//         if (result.success) {
//             alert("OTP verified successfully!");
//             navigate("/dashboard"); // Redirect to the dashboard after successful OTP verification
//         }
//     };

//     return (
//         <div className="otp-container">
//             <div className="otp-box">
//                 <h1 className="otp-title">Verify Your Account</h1>
//                 <p className="otp-subtitle">Enter the OTP sent to your registered email.</p>

//                 <div className="input-group">
//                     <label>OTP Code</label>
//                     <input 
//                         type="text" 
//                         placeholder="Enter OTP" 
//                         value={otp} 
//                         onChange={(e) => setOtp(e.target.value)} 
//                         required 
//                     />
//                 </div>

//                 {error && <p className="error-message">{error}</p>}
//                 {message && <p className="success-message">{message}</p>}

//                 <button onClick={handleVerifyOtp} className="otp-button">Verify OTP</button>
//                 <button onClick={handleSendOtp} className="resend-button">Resend OTP</button>
//             </div>
//         </div>
//     );
// };

// export default OtpPage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useOtpViewModel from "../viewmodels/OtpViewModel";
import "../styles/OtpPage.css";

const OtpPage = () => {
    const [otp, setOtp] = useState("");
    const { sendOtp, verifyOtp, message, error, otpSent } = useOtpViewModel();
    const navigate = useNavigate();

    useEffect(() => {
        const email = sessionStorage.getItem("email");
        if (!email) {
            alert("No email found. Please login again.");
            navigate("/signin");
        } else if (!sessionStorage.getItem("otpSent")) {
            // ✅ Send OTP only once per session
            sessionStorage.setItem("otpSent", "true");
            sendOtp(email);
        }
    }, []);

    const handleVerifyOtp = async () => {
        const email = sessionStorage.getItem("email");
        if (!email) {
            alert("No email found. Please login again.");
            navigate("/signin");
            return;
        }

        if (!otp.trim()) {
            alert("Please enter the OTP.");
            return;
        }

        const result = await verifyOtp(email, otp);
        if (result.success) {
            alert("OTP verified successfully!");
            sessionStorage.removeItem("otpSent"); // ✅ Clear OTP sent status after successful verification
            navigate("/dashboard"); // Redirect after successful verification
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-box">
                <h1 className="otp-title">Verify Your Account</h1>
                <p className="otp-subtitle">Enter the OTP sent to your registered email.</p>

                <div className="input-group">
                    <label>OTP Code</label>
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <button onClick={handleVerifyOtp} className="otp-button">Verify OTP</button>
            </div>
        </div>
    );
};

export default OtpPage;
