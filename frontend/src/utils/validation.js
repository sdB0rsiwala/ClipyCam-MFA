export const sanitizeInput = (input) => {
    return input.replace(/[<>{}'"`]/g, ""); // Removes special characters to prevent XSS
};

export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+[1-9]{1}[0-9]{3,14}$/; // International format (E.164)
    return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
    return password.length >= 8; // Minimum 8 characters
};
