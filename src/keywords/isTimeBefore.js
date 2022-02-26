import { cloneDate, createValidator } from './utils';

export const isTimeBefore = ({ parser }) => ({
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
      parsed < actualAgainst || error({ message: `Time must be before ${arg}` })
    );
  }),
});
