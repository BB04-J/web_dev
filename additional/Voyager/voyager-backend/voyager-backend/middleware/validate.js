import ApiError from "../utils/ApiError.js";

// Takes a Zod schema and returns Express middleware that validates req.body
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return next(new ApiError(400, "Validation failed", details));
  }

  req.body = result.data;
  next();
};

export default validate;
