import verifyJWT from '../utils/verifyJWT.js';

const authenticate = async (req, res, next) => {
  try {
    const tokenInHeaders = req.get('Authorization');
    const token = tokenInHeaders?.replace('Bearer ', '') || req.cookies.jwtToken;
    if (!token) {
      res.status(401).json({ errors: 'invalid token' });
      return;
    }
    const decoded = await verifyJWT(token);
    res.locals.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ errors: err });
      return;
    }
    res.status(401).json({ data: 'authenticate failed' });
  }
};
export default authenticate;
