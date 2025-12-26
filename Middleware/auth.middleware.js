import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { JWT_SECRET } from '../config/env.js'
import User from '../models/user.model.js'

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, JWT_SECRET);

        // Select everything of a user except for the password
        const user = await User.findById(decoded.userId).select('-password').lean();

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

const ownership = async (req, res, next) => {
    try {
        const requestedUserId = req.params.id;
        const loggedInUserId = req.user._id.toString();

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(requestedUserId)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        // Authorization check
        if (requestedUserId !== loggedInUserId) {
            return res.status(403).json({
                message: 'Forbidden: You can only access your own data'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
}

export { authorize, ownership };