import AppError from '../utils/appError.js';

const trimError = async (req, res, next) => {
  try {
    // process error stack
    const { stack, ...errorData } = req.body;
    const stripedStack = stack
      .replace(/^.*[\\/]node_modules[\\/].*$/gm, '')
      .replace(/^.*node.*$/gm, '')
      .match(/at.*file:\/\/[^ ]+/g)
      ?.join('\n')
      .replace(/at.*file:\/\//g, '')
      .replace(/\n+/g, '\n');

    const stackObjs = [];
    stripedStack.split('\n').forEach(el => {
      if (el !== '') {
        const trimStack = el.replace(/^.*\//gm, '').split(':');
        stackObjs.push({
          fileName: trimStack[0],
          line: +trimStack[1],
          column: +trimStack[2],
        });
      }
    });
    const eventData = {
      ...errorData,
      stack: stripedStack,
      stackObjs,
    };
    res.locals.eventData = eventData;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default trimError;
