import jwt from 'jsonwebtoken';

export const generateTokens = (user, res) => {

    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRETS_ACCESS,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRETS_ACCESS,
        { expiresIn: '30d' }
    );

    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return { accessToken, refreshToken };
}