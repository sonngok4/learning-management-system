// utils/validation.util.js
class ValidationUtil {
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        return passwordRegex.test(password);
    }

    static isValidPhone(phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }

    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static sanitizeHtml(html) {
        // Basic HTML sanitization
        return html
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    static validateDate(date) {
        const dateObj = new Date(date);
        return dateObj instanceof Date && !isNaN(dateObj);
    }

    static validateFileType(filename, allowedTypes) {
        const extension = filename.split('.').pop().toLowerCase();
        return allowedTypes.includes(extension);
    }

    static validateFileSize(fileSize, maxSize) {
        return fileSize <= maxSize;
    }
}

module.exports = ValidationUtil;