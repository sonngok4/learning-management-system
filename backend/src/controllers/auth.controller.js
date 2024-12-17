const User = require('../models/User');
const { ApiError } = require('../utils/api-error');

class AuthController {
    static async register(req, res) {
        try {
            const { firstName, lastName, username, email, password } = req.body;
            
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ApiError(400, 'User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword
            });

            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                throw new ApiError(400, 'User not found');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new ApiError(400, 'Invalid password');
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = AuthController;