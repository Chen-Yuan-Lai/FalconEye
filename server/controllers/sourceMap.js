const getSourceMap = async (req, res, next) => {
  try {
    console.log(req.body);
    res.status(200).json({
      data: 'ok',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default getSourceMap;
