import jwt from 'jsonwebtoken';

export const generateToken = (user, res) => {

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRETS,
        { expiresIn: '3d' }
    );

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    });

    return token;
}