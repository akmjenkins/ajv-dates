import { createErrorCreator, parse } from './utils';

export const isWeekday = ({ parser }) => ({
  type: 'string',
  schemaType: 'boolean',
  compile: (arg) => {
    const validator = (subject) => {
      const createError = createErrorCreator(validator);
      return parse(subject, parser, createError, (parsed) => {
        const day = parsed.getDay();
        const isWeekend = day === 0 || day === 6;
        if (!isWeekend === arg) return true;
        createError({
          message: `Date must ${arg === false ? 'not be' : 'be'} a weekday`,
        });
      });
    };

    return validator;
  },
});
