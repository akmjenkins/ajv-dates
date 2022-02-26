import { cloneDate, createValidator } from './utils';

export const isTimeBetween = ({ parser }) => ({
  type: 'string',
  $data: true,
  schemaType: 'array',
  validate: createValidator(
    parser,
    ([dLower, dUpper], subject, error, [lower, upper]) => {
      const actualUpper = cloneDate(
        subject,
        dUpper.getHours(),
        dUpper.getMinutes(),
        dUpper.getSeconds(),
        dUpper.getMilliseconds(),
      );

      const actualLower = cloneDate(
        subject,
        dLower.getHours(),
        dLower.getMinutes(),
        dLower.getSeconds(),
        dLower.getMilliseconds(),
      );

      return (
        (actualLower < subject && subject < actualUpper) ||
        error({ message: `Time must be between ${lower} and ${upper}` })
      );
    },
  ),
});
