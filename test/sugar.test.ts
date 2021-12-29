import Ajv from 'ajv';
// eslint-disable-next-line
// @ts-ignore
import { Date as SDate } from 'sugar-date';
import { dates } from '../src';

describe('test with sugar date as parser', () => {
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

  tests.forEach(({ keyword, tests }) => {
    const runTest = (instance, { arg, errors = null, subject, keyword }) => {
      instance.validate({ type: 'string', [keyword]: arg }, subject);
      errors
        ? expect(instance.errors).toContainEqual(errors)
        : expect(instance.errors).toBeNull();
    };

    it(`should work with ${keyword}`, () => {
      tests.forEach((test) => {
        runTest(dates(new Ajv(), { parser: SDate.create }), {
          ...test,
          keyword,
        });
      });
    });
  });
});
