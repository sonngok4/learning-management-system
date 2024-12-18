// utils/password.util.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const hashPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
	return bcrypt.compare(password, hashedPassword);
};

const generateRandomPassword = (length = 12) => {
	const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
	let password = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		password += charset[randomIndex];
	}
	return password;
}

const generateResetToken = () => {
	return crypto.randomBytes(32).toString('hex');
};

const generateVerificationCode = (length = 6) => {
	return Math.floor(Math.random() * Math.pow(10, length))
		.toString()
		.padStart(length, '0');
};

const hashToken = token => {
	return crypto.createHash('sha256').update(token).digest('hex');
};

const validatePasswordStrength = async (password) => {
	const validationResult = {
		isValid: true,
		reasons: []
	};

	// Check minimum length
	if (password.length < 8) {
		validationResult.isValid = false;
		validationResult.reasons.push('Password must be at least 8 characters long');
	}

	// Check for uppercase letters
	if (!/[A-Z]/.test(password)) {
		validationResult.isValid = false;
		validationResult.reasons.push('Password must contain at least one uppercase letter');
	}

	// Check for lowercase letters
	if (!/[a-z]/.test(password)) {
		validationResult.isValid = false;
		validationResult.reasons.push('Password must contain at least one lowercase letter');
	}

	// Check for numbers
	if (!/[0-9]/.test(password)) {
		validationResult.isValid = false;
		validationResult.reasons.push('Password must contain at least one number');
	}

	// Check for special characters
	if (!/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password)) {
		validationResult.isValid = false;
		validationResult.reasons.push('Password must contain at least one special character');
	}

	return validationResult;
}

class PasswordUtil {
	static hashPassword = hashPassword;

	static comparePassword = comparePassword;

	static generateRandomPassword = generateRandomPassword;

	static generateResetToken = generateResetToken;

	static generateVerificationCode = generateVerificationCode;

	static hashToken = hashToken;

	static validatePasswordStrength = validatePasswordStrength;
}

module.exports = {
	PasswordUtil,
	hashPassword,
	comparePassword,
	generateRandomPassword,
	generateResetToken,
	generateVerificationCode,
	hashToken,
	validatePasswordStrength
};
