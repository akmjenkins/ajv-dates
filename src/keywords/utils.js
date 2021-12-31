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

export const cloneDate = (date, ...args) => {
  return new Date(
    ...methods.slice(0, methods.length - args.length).map((m) => date[m]()),
    ...args,
  );
};
