const createSourceMap = async (req, res, next) => {
  try {
    // console.log(JSON.parse(map));
    res.status(200).json({
      data: 'ok',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getSourceMap = async (req, res, next) => {};

export default createSourceMap;
