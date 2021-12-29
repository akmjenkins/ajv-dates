import { createErrorCreator, parse, parseOrThrow } from './utils';

export const isBefore = ({ parser }) => ({
  type: 'string',
  compile: (arg) => {
    const against = parseOrThrow(arg, parser);

    const validator = (subject) => {
      const createError = createErrorCreator(validator);
      return parse(subject, parser, createError, (parsed) => {
        if (parsed < against) return true;
        createError({ message: `Date must be before ${arg}` });
      });
    };

    return validator;
  },
});
