import { createErrorCreator, parse, parseOrThrow } from './utils';

export const isBetween = ({ parser }) => ({
  type: 'string',
  schemaType: 'array',
  compile: ([lower, upper]) => {
    const dLower = parseOrThrow(lower, parser);
    const dUpper = parseOrThrow(upper, parser);

    const validator = (subject) => {
      const createError = createErrorCreator(validator);
      return parse(subject, parser, createError, (parsed) => {
        if (dLower < parsed && parsed < dUpper) return true;
        createError({ message: `Date must be between ${lower} and ${upper}` });
      });
    };

    return validator;
  },
});
