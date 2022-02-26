import { createValidator } from './utils';

export const isBefore = ({ parser }) => ({
  type: 'string',
  $data: true,
  validate: createValidator(
    parser,
    (arg, subject, createError) =>
      arg > subject || createError({ message: `Date must be before ${arg}` }),
  ),
});
