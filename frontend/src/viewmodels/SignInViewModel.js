import { useState } from "react";
import { AuthModel } from "../models/AuthModel";
import { sanitizeInput, validateEmail, validatePassword } from "../utils/validation";


const useSignInViewModel = () => {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const signin = async (user) => {
        setError(null);
    
        // ✅ Ensure `user` is an object and has required properties
        if (!user || !user.email || !user.password) {
            setError("Email and password are required!");
            return { success: false };
        }
    
        console.log("User attempting to log in:", user); // ✅ Debugging
    
        // ✅ Sanitize input fields
        const sanitizedUser = {
            email: sanitizeInput(user.email),
            password: sanitizeInput(user.password),
        };
    
        // ✅ Validate fields before sending to backend
        if (!validateEmail(sanitizedUser.email)) {
            setError("Invalid email format");
            return { success: false };
        }
        if (!validatePassword(sanitizedUser.password)) {
            setError("Password must be at least 8 characters long");
            return { success: false };
        }
    
        try {
            const response = await AuthModel.signin(sanitizedUser);
            setSuccessMessage("Login successful!");
            return { success: true, token: response.token };
        } catch (err) {
            setError(err.error || "Signin failed");
            return { success: false };
        }
    };
    

    return { error, successMessage, signin };
};

export default useSignInViewModel;
