import AppError from '../utils/appError.js';
import genHash from '../utils/hash.js';

const processEvent = async (req, res, next) => {
  try {
    // process error stack
    const { errorData } = req.body;
    const { stack, ...other } = errorData;

    const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for RegExp
    const stripedStack = stack
      .replace(/^ *at.*(\(|file:\/\/| )/gm, '')
      .replace(/^ *at /g, '')
      .replace(/\)/g, '')
      .replace(/\n+/g, '\n')
      .replace(new RegExp(escapeRegExp(`${errorData.workspacePath}`), 'g'), '');

    const stackObjs = [];
    stripedStack.split('\n').forEach(el => {
      if (el !== '' && el.startsWith('/')) {
        const trimStack = el.slice(1).split(':');
        stackObjs.push({
          stack: el,
          fileName: trimStack[0],
          line: +trimStack[1],
          column: +trimStack[2],
        });
      }
    });
    // console.log(stack);
    // console.log(stripedStack);
    // console.log(stackObjs);
    // generate fingerprints
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
