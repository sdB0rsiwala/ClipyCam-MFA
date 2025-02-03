import { useState } from "react";
import { AuthModel } from "../models/AuthModel"; // ✅ Use named import


const useForgotPasswordViewModel = () => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const requestPasswordReset = async (email) => {
        setError(null);
        setMessage(null);

        try {
            const response = await AuthModel.forgotPassword(email);
            if (response.success) {
                setMessage(response.message);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError("Something went wrong. Try again.");
        }
    };

    return { message, error, requestPasswordReset };
};

export default useForgotPasswordViewModel;
