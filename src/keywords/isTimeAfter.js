import { cloneDate, createErrorCreator, parse, parseOrThrow } from './utils';

export const isTimeAfter = ({ parser }) => ({
  type: 'string',
  compile: (arg) => {
    const against = parseOrThrow(arg, parser);

    const validator = (subject) => {
      const createError = createErrorCreator(validator);
      return parse(subject, parser, createError, (parsed) => {
        const actualAgainst = cloneDate(
          parsed,
          against.getHours(),
          against.getMinutes(),
          against.getSeconds(),
          against.getMilliseconds(),
        );

        if (parsed > actualAgainst) return true;

        createError({ message: `Time must be after ${arg}` });
      });
    };

    return validator;
  },
});
