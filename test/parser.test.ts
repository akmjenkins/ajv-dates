import Ajv from 'ajv';
// eslint-disable-next-line
// @ts-ignore
import { Date as SDate } from 'sugar-date';
import { parseDate } from 'chrono-node';
import { dates, times } from '../src';

type Test = {
  arg: any;
  subject: string;
  errors?: jest.Expect | null;
};

describe('test with sugar date as parser', () => {
  const parsers = [
    {
      name: 'sugar',
      parser: SDate.create,
    },
    {
      name: 'chrono',
      parser: parseDate,
    },
  ];

  const tests = [
    {
      keyword: 'isAfter',
      tests: [
        {
          arg: 'tomorrow',
          subject: 'today',
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be after'),
          }),
        },
        {
          arg: 'yesterday',
          subject: 'today',
        },
      ],
    },
    {
      keyword: 'isTimeBetween',
      tests: [
        {
          arg: ['7:00pm', '10:00pm'],
          subject: '7:30pm',
        },
        {
          arg: ['7:00pm', '10:00pm'],
          subject: '6:30pm',
          errors: expect.objectContaining({
            message: expect.stringMatching('Time must be between'),
          }),
        },
      ],
    },
    {
      keyword: 'isTimeAfter',
      tests: [
        {
          arg: '7:00pm',
          subject: '7:30pm',
        },
        {
          arg: '7:00pm',
          subject: '6:30pm',
          errors: expect.objectContaining({
            message: expect.stringMatching('Time must be after 7:00pm'),
          }),
        },
      ],
    },
    {
      keyword: 'isTimeBefore',
      tests: [
        {
          arg: '7:00pm',
          subject: '6:30pm',
        },
        {
          arg: '7:00pm',
          subject: '7:30pm',
          errors: expect.objectContaining({
            message: expect.stringMatching('Time must be before 7:00pm'),
          }),
        },
      ],
    },
    {
      keyword: 'isBefore',
      tests: [
        {
          arg: 'tomorrow',
          subject: 'Today',
        },
        {
          arg: 'yesterday',
          subject: 'Today',
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be before'),
          }),
        },
      ],
    },
    {
      keyword: 'isBetween',
      tests: [
        {
          arg: ['yesterday', 'tomorrow'],
          subject: 'Today',
        },
        {
          arg: ['yesterday', 'today'],
          subject: 'Tomorrow',
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be between'),
          }),
        },
      ],
    },
    {
      keyword: 'isWeekend',
      tests: [
        {
          arg: true,
          subject: 'Saturday',
        },
        {
          arg: true,
          subject: 'Monday',
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be a weekend'),
          }),
        },
        {
          arg: false,
          subject: 'Monday',
        },
        {
          arg: false,
          subject: 'Saturday',
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must not be a weekend'),
          }),
        },
      ],
    },
    {
      keyword: 'isWeekday',
      tests: [
        {
          arg: true,
          subject: 'Monday',
        },
        {
          arg: true,
          subject: 'Saturday',
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be a weekday'),
          }),
        },
        {
          arg: false,
          subject: 'Saturday',
        },
        {
          arg: false,
          subject: 'Monday',
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must not be a weekday'),
          }),
        },
      ],
    },
  ];

  parsers.forEach(({ name, parser }) => {
    tests.forEach(({ keyword, tests }) => {
      const runTest = (
        instance: Ajv,
        { arg, errors = null, subject, keyword }: Test & { keyword: string },
      ) => {
        instance.validate({ type: 'string', [keyword]: arg }, subject);
        errors
          ? expect(instance.errors).toContainEqual(errors)
          : expect(instance.errors).toBeNull();
      };

      it(`should work with ${keyword} using parser ${name}`, () => {
        tests.forEach((test) => {
          runTest(times(dates(new Ajv(), { parser }), { parser }), {
            ...test,
            keyword,
          });
        });
      });
    });
  });
});
