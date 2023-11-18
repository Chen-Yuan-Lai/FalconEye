import signJWT from '../utils/signJWT.js';
import * as UserModel from '../models/user.js';
import AppError from '../utils/appError.js';

const signup = async (req, res, next) => {
  try {
    const { firstName, secondName, email, password } = req.body;
    const existed = await UserModel.findUser(email);

    if (existed) {
      return next(new AppError('user already existed!', 400));
    }

    const user = await UserModel.createUser(firstName, secondName, email, password);
    const userId = user.id;
    const jwt = await signJWT(userId);

    res.status(200).json({
      data: {
        user,
        token: jwt,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUser(email);

    if (!user) {
      return next(new AppError('user not existed!', 400));
    }

    // check password
    const isValid = await UserModel.checkPassword(email, password);
    if (!isValid) {
      return next(new AppError('email or password is wrong'));
    }

    const userId = user.id;
    delete user.password;
    const jwt = await signJWT(userId);
    res.status(200).json({
      data: {
        user,
        token: jwt,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { signin, signup };
