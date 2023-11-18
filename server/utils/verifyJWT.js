import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_KEY;

export default function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (err, decoded) => {
      try {
        if (err) reject(err);
        resolve(decoded);
      } catch (e) {
        reject(new Error('invalid decoded value'));
      }
    });
  });
}
