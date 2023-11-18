import { validationResult } from 'express-validator';

const handleResult = (req, res, next) => {
  const errorFormatter = ({ location, msg, param }) => `${location}[${param}]: ${msg}`;

  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
};

export default handleResult;
