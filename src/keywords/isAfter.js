import { createValidator } from './utils';

export const isAfter = ({ parser }) => ({
  type: 'string',
  $data: true,
  validate: createValidator(
    parser,
    (arg, subject, createError) =>
      arg < subject || createError({ message: `Date must be after ${arg}` }),
  ),
});
