import jwt from 'jsonwebtoken';

function signToken({ userId, username }) {
  return jwt.sign(
    {
      sub: userId,
      username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
}

export { signToken };
