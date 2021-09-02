// all validate functions return true if validations pass
export const validateEmptyField = (field) => {
    if (field === null || field === "") return false;
    return true;
};

export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    if (email === null || email === "") return false;
    return re.test(email);
};

export const validatePassword = (password) => {
    const re = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{7,}/;
    if (password === null) return false;
    return re.test(password);
};
