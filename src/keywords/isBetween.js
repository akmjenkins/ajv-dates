import { createValidator } from './utils';

export const isBetween = ({ parser }) => ({
  type: 'string',
  schemaType: 'array',
  $data: true,
  validate: createValidator(
    parser,
    ([dLower, dUpper], parsed, error, [lower, upper]) =>
      (dLower < parsed && parsed < dUpper) ||
      error({ message: `Date must be between ${lower} and ${upper}` }),
  ),
});
