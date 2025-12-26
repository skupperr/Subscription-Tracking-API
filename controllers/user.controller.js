import User from '../models/user.model.js'

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        // No need to hit the database again, we're already getting the user from the db in authorize middleware
        // const user = await User.findById(req.params.id).select('-password');

        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
}