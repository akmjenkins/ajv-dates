export const isValid = (date) => !isNaN(date.getTime());

export const parseOrThrow = (subject, parser) => {
  const parsed = parser(subject);
  if (!isValid(parsed)) throw new Error(`Unable to parse ${subject}`);
  return parsed;
};

export const createErrorCreator = (validator) => (error) => {
  validator.errors = [error];
};

export const createValidator = (parser, validate) => {
  return function validator(arg, subject) {
    const createError = createErrorCreator(validator);
    const isArray = Array.isArray(arg);
    const against = (isArray ? arg : [arg])
      .map((a) => parse(a, parser, createError))
      .filter((a) => !!a);

    const evaluated = parse(subject, parser, createError);
    return (
      against.length &&
      evaluated &&
      validate(isArray ? against : against[0], evaluated, createError, arg)
    );
  };
};

export const parse = (subject, parser, createError) => {
  try {
    return parseOrThrow(subject, parser);
  } catch {
    createError({ message: `Unable to parse date ${subject}` });
  }
};

const methods = [
  'getFullYear',
  'getMonth',
  'getDate',
  'getHours',
  'getMinutes',
  'getSeconds',
  'getMilliseconds',
];

export const getPieces = (date, ...methods) => methods.map((m) => date[m]());

export const cloneDate = (date, ...args) =>
  new Date(
    ...getPieces(date, ...methods.slice(0, methods.length - args.length)),
    ...args,
  );
