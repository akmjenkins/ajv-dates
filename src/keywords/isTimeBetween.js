import { cloneDate, createErrorCreator, parse, parseOrThrow } from './utils';

export const isTimeBetween = ({ parser }) => ({
  type: 'string',
  schemaType: 'array',
  compile: ([lower, upper]) => {
    const dLower = parseOrThrow(lower, parser);
    const dUpper = parseOrThrow(upper, parser);

    const validator = (subject) => {
      const createError = createErrorCreator(validator);
      return parse(subject, parser, createError, (parsed) => {
        const actualUpper = cloneDate(
          parsed,
          dUpper.getHours(),
          dUpper.getMinutes(),
          dUpper.getSeconds(),
          dUpper.getMilliseconds(),
        );

        const actualLower = cloneDate(
          parsed,
          dLower.getHours(),
          dLower.getMinutes(),
          dLower.getSeconds(),
          dLower.getMilliseconds(),
        );

        if (actualLower < parsed && parsed < actualUpper) return true;

        createError({ message: `Time must be between ${lower} and ${upper}` });
      });
    };

    return validator;
  },
});
