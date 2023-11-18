import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_KEY;
const EXPIRE_TIME = process.env.EXPIRE_TIME;

function signJWT(userId) {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, JWT_KEY, { expiresIn: EXPIRE_TIME }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}

export default signJWT;
