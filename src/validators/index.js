import { validationResult } from 'express-validator';

export const checkValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.validationErrors = errors.array();
  }
  next();
};

export const transformErrorArrayToErrorForm = (errs) => {
  return errs.reduce((acc, error) => {
    acc[error.path] = error.msg;
    return acc;
  }, {});
};
