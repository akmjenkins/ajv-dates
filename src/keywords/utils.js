export const isValid = (date) => !isNaN(date.getTime());

export const parseOrThrow = (subject, parser) => {
  const parsed = parser(subject);
  if (!isValid(parsed)) throw new Error(`Unable to parse ${subject}`);
  return parsed;
};

export const createErrorCreator = (validator) => (error) =>
  (validator.errors = [error]);

export const parse = (subject, parser, createError, then) => {
  try {
    return then(parseOrThrow(subject, parser));
  } catch {
    createError({ message: `Unable to parse date ${subject}` });
  }
};
