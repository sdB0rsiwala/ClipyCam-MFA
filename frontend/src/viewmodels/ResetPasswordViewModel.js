import { useState } from "react";
import { AuthModel } from "../models/AuthModel"; // ✅ Use named import


const useResetPasswordViewModel = () => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const resetPassword = async (token, newPassword) => {
        setError(null);
        setMessage(null);

        try {
            const response = await AuthModel.resetPassword(token, newPassword);
            if (response.success) {
                setMessage(response.message);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError("Something went wrong. Try again.");
        }
    };

    return { message, error, resetPassword };
};

export default useResetPasswordViewModel;
