const createEvent = async (req, res, next) => {
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

const getEvent = async (req, res, next) => {};

export default createEvent;
