import { cloneDate, createValidator } from './utils';

export const isTimeAfter = ({ parser }) => ({
  type: 'string',
  $data: true,
  validate: createValidator(parser, (against, parsed, error, arg) => {
    const actualAgainst = cloneDate(
      parsed,
      against.getHours(),
      against.getMinutes(),
      against.getSeconds(),
      against.getMilliseconds(),
    );

    return (
      parsed > actualAgainst || error({ message: `Time must be after ${arg}` })
    );
  }),
});
