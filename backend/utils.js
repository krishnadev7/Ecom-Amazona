import jwt from 'jsonwebtoken'
export const genarateToken = (user) => {
    return jwt.sign(
      {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15d',
      }
    );
}