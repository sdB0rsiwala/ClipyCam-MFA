import { useState } from "react";
import { AuthModel } from "../models/AuthModel";
import { sanitizeInput, validateEmail, validatePhoneNumber, validatePassword } from "../utils/validation";

const useSignUpViewModel = () => {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const signup = async (user) => {
        setError(null); // Reset errors before validation

        // ✅ Sanitize input fields
        const sanitizedUser = {
            firstname: sanitizeInput(user.firstname),
            lastname: sanitizeInput(user.lastname),
            email: sanitizeInput(user.email),
            phone_number: sanitizeInput(user.phone_number),
            password: sanitizeInput(user.password),
            confirmPassword: sanitizeInput(user.confirmPassword),
        };

        // ✅ Validate fields before sending to backend
        if (!validateEmail(sanitizedUser.email)) {
            setError("Invalid email format");
            return { success: false };
        }
        if (!validatePhoneNumber(sanitizedUser.phone_number)) {
            setError("Invalid phone number format");
            return { success: false };
        }
        if (!validatePassword(sanitizedUser.password)) {
            setError("Password must be at least 8 characters long");
            return { success: false };
        }
        if (sanitizedUser.password !== sanitizedUser.confirmPassword) {
            setError("Passwords do not match");
            return { success: false };
        }

        try {
            await AuthModel.signup(sanitizedUser);
            setSuccessMessage("Signup successful! Sending OTP for verification...");

            // ✅ Store email for OTP verification
            sessionStorage.setItem("email", sanitizedUser.email);
            sessionStorage.removeItem("otpSent"); // ✅ Reset OTP tracking

            // ✅ Send OTP automatically after signup
            const otpResponse = await AuthModel.sendOtp(sanitizedUser.email);

            return {success: true};
        } catch (err) {
            setError(err.error || "Signup failed");
            return { success: false };
        }
    };

    return { error, successMessage, signup };
};

export default useSignUpViewModel;
