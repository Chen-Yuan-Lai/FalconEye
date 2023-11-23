import AppError from '../utils/appError.js';
import genHash from '../utils/hash.js';

const processEvent = async (req, res, next) => {
  try {
    // process error stack
    const { errorData } = req.body;
    const { stack, ...other } = errorData;
    const stripedStack = stack
      .replace(/^.*[\\/]node_modules[\\/].*$/gm, '')
      .replace(/^.*node.*$/gm, '')
      .replace(errorData.workspacePath, '')
      .split('\n')
      .map(el => el.trim())
      ?.join('\n')
      .replace(/at.*file:\/\//g, '')
      .replace(/\n+/g, '\n');

    const stackObjs = [];
    stripedStack.split('\n').forEach(el => {
      if (el !== '' && el.startsWith('/')) {
        const trimStack = el.replace(/^.*\//gm, '').split(':');
        stackObjs.push({
          fileName: trimStack[0],
          line: +trimStack[1],
          column: +trimStack[2],
        });
      }
    });

    // generate fingerprints
    // const fingerprints = await argon2.hash(stripedStack.replace(/:[0-9]*:[0-9]*/gm, ''));
    const fingerprints = genHash(stripedStack.replace(/:[0-9]*:[0-9]*/gm, ''));

    const eventData = {
      ...other,
      fingerprints,
      stack: stripedStack,
      stackObjs,
    };
    req.body.eventData = eventData;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default processEvent;
