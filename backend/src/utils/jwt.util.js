// src/utils/jwt.util.js
const jwt = require('jsonwebtoken');
const config = require('../configs/environment');

const generateToken = (payload, expiresIn = '1d') => {
	return jwt.sign({ userId: payload._id }, config.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = payload => {
	return jwt.sign({ userId: payload._id }, config.JWT_SECRET, {
		expiresIn: '7d',
	});
};

const verifyToken = token => {
	return jwt.verify(token, config.JWT_SECRET);
};

const verifyRefreshToken = token => {
	return jwt.verify(token, config.JWT_SECRET);
};

const decodeToken = token => {
	return jwt.decode(token);
};

class JWTUtil {
	static generateToken = generateToken;
	static generateRefreshToken = generateRefreshToken;
	static verifyToken = verifyToken;
	static verifyRefreshToken = verifyRefreshToken;
	static decodeToken = decodeToken;
}

module.exports = {
	JWTUtil,
	generateToken,
	generateRefreshToken,
	verifyToken,
	verifyRefreshToken,
	decodeToken,
};
