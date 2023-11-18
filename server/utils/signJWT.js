import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_KEY || '';

export default function signJWT(userId) {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, JWT_KEY, { expiresIn: EXPIRE_TIME }, function (err, token) {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}
