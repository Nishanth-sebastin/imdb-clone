export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ errors: error.errors.map((err) => ({ path: err.path, message: err.message })) });
  }
};
