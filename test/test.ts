import Ajv, { _ } from 'ajv';
// eslint-disable-next-line
// @ts-ignore
import { Date as SDate } from 'sugar-date';
import { dates } from '../src';

describe('test', () => {
  const today = SDate.create('today');
  const yesterday = SDate.create('yesterday');
  const tomorrow = SDate.create('tomorrow');

  const saturday = SDate.create('Saturday');
  const monday = SDate.create('Monday');

  const todayString = today.toISOString();
  const tomorrowString = tomorrow.toISOString();

  const saturdayString = saturday.toISOString();
  const mondayString = monday.toISOString();

  const tests = [
    {
      keyword: 'isAfter',
      alternateKeyword: 'doit',
      tests: [
        {
          arg: tomorrow,
          subject: todayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be after'),
          }),
        },
        {
          arg: yesterday,
          subject: todayString,
        },
      ],
    },
    {
      keyword: 'isBefore',
      alternateKeyword: 'doit',
      tests: [
        {
          arg: tomorrow,
          subject: todayString,
        },
        {
          arg: yesterday,
          subject: todayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be before'),
          }),
        },
      ],
    },
    {
      keyword: 'isBetween',
      alternateKeyword: 'doit',
      tests: [
        {
          arg: [yesterday, tomorrow],
          subject: todayString,
        },
        {
          arg: [yesterday, today],
          subject: tomorrowString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be between'),
          }),
        },
      ],
    },
    {
      keyword: 'isWeekend',
      alternateKeyword: 'doit',
      tests: [
        {
          arg: true,
          subject: saturdayString,
        },
        {
          arg: true,
          subject: mondayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be a weekend'),
          }),
        },
        {
          arg: false,
          subject: mondayString,
        },
        {
          arg: false,
          subject: saturdayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must not be a weekend'),
          }),
        },
      ],
    },
    {
      keyword: 'isWeekday',
      alternateKeyword: 'doit',
      tests: [
        {
          arg: true,
          subject: mondayString,
        },
        {
          arg: true,
          subject: saturdayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be a weekday'),
          }),
        },
        {
          arg: false,
          subject: saturdayString,
        },
        {
          arg: false,
          subject: mondayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must not be a weekday'),
          }),
        },
      ],
    },
  ];

  tests.forEach(({ keyword, alternateKeyword, tests }) => {
    const runTest = (instance, { arg, errors = null, subject, keyword }) => {
      instance.validate({ type: 'string', [keyword]: arg }, subject);
      errors
        ? expect(instance.errors).toContainEqual(errors)
        : expect(instance.errors).toBeNull();
    };

    it(`should work with ${keyword}`, () => {
      tests.forEach((test) => {
        runTest(dates(new Ajv()), { ...test, keyword });
      });
    });

    if (alternateKeyword) {
      it(`should work with ${keyword} as ${alternateKeyword}`, () => {
        tests.forEach((test) => {
          runTest(
            dates(new Ajv(), { keywordMap: { [keyword]: alternateKeyword } }),
            { ...test, keyword: alternateKeyword },
          );
        });
      });
    }
  });
});

const f = dates(new Ajv(), { parser: SDate.create });
f.validate(
  {
    type: 'string',
    isAfter: '2 weeks from now',
  },
  'today',
);
console.log(f.errors);
