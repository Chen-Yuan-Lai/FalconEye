const validate = async (req, res, next) => {
  try {
    res.status(200).json({
      data: 'OK',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default validate;
