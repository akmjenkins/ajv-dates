import { createErrorCreator, parse } from './utils';

export const isWeekend = ({ parser }) => ({
  type: 'string',
  schemaType: 'boolean',
  $data: true,
  validate: function validator(arg, subject) {
    const createError = createErrorCreator(validator);
    const against = parse(subject, parser, createError);
    if (!against) return;
    const day = against.getDay();
    const isWeekend = day === 0 || day === 6;
    if (isWeekend === arg) return true;
    createError({
      message: `Date must ${arg === false ? 'not be' : 'be'} a weekend`,
    });
  },
});
