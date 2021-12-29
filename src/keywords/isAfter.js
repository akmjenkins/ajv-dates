import { createErrorCreator, parse, parseOrThrow } from './utils';

export const isAfter = ({ parser }) => ({
  type: 'string',
  compile: (arg) => {
    const against = parseOrThrow(arg, parser);

    const validator = (subject) => {
      const createError = createErrorCreator(validator);
      return parse(subject, parser, createError, (parsed) => {
        if (parsed > against) return true;
        createError({ message: `Date must be after ${arg}` });
      });
    };

    return validator;
  },
});
