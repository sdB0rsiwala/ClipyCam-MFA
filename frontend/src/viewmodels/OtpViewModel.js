// import { useState } from "react";
// import { AuthModel } from "../models/AuthModel";

// const useOtpViewModel = () => {
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");

//     const sendOtp = async (email) => {
//         try {
//             const response = await AuthModel.sendOtp(email);
//             setMessage(response.message);
//             setError(""); // Clear error if OTP sent successfully
//         } catch (err) {
//             setError(err.error || "Failed to send OTP.");
//             setMessage("");
//         }
//     };

//     const verifyOtp = async (email, otp) => {
//         try {
//             const response = await AuthModel.verifyOtp(email, otp);
//             setMessage(response.message);
//             setError(""); // Clear error if OTP is verified successfully
//             return { success: true };
//         } catch (err) {
//             setError(err.error || "Failed to verify OTP.");
//             setMessage("");
//             return { success: false };
//         }
//     };

//     return { sendOtp, verifyOtp, message, error };
// };

// export default useOtpViewModel;

import { useState } from "react";
import { AuthModel } from "../models/AuthModel";

const useOtpViewModel = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(() => sessionStorage.getItem("otpSent") === "true");

    const sendOtp = async (email) => {
        if (otpSent) {
            setMessage("OTP already sent. Please check your email.");
            return;
        }

        try {
            setLoading(true);
            sessionStorage.setItem("otpSent", "true");
            console.log("Requesting OTP for:", email);
            const response = await AuthModel.sendOtp(email);
            setMessage(response.message || "OTP sent successfully!");
            setError("");
            setOtpSent(true);
        } catch (err) {
            console.error("Error sending OTP:", err);
            setError(err.error || "Failed to send OTP. Please try again.");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (email, otp) => {
        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return { success: false };
        }

        try {
            setLoading(true);
            const response = await AuthModel.verifyOtp(email, otp);
            setMessage(response.message || "OTP verified successfully!");
            setError("");
            sessionStorage.removeItem("otpSent"); // ✅ Clear OTP sent status after successful verification
            return { success: true };
        } catch (err) {
            setError(err.error || "Failed to verify OTP.");
            setMessage("");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { sendOtp, verifyOtp, message, error, loading, otpSent };
};

export default useOtpViewModel;
