import Ajv, { _ } from 'ajv';
import { parseDate } from 'chrono-node';
import dates from '../src';

type Test = {
  arg: any;
  subject: string;
  errors?: jest.Expect | null;
};

describe('test', () => {
  const today = parseDate('today');
  const yesterday = parseDate('yesterday');
  const tomorrow = parseDate('tomorrow');

  const saturday = parseDate('Saturday');
  const monday = parseDate('Monday');

  const todayString = today.toISOString();
  const tomorrowString = tomorrow.toISOString();

  const saturdayString = saturday.toISOString();
  const mondayString = monday.toISOString();

  const tests = [
    // {
    //   keyword: 'isAfter',
    //   alternateKeyword: 'doit',
    //   tests: [
    //     {
    //       arg: tomorrow,
    //       subject: todayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must be after'),
    //       }),
    //     },
    //     {
    //       arg: yesterday,
    //       subject: todayString,
    //     },
    //     {
    //       arg: { $data: '/tomorrow' },
    //       subject: todayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must be after'),
    //       }),
    //     },
    //     {
    //       arg: { $data: '/yesterday' },
    //       subject: todayString,
    //     },
    //   ],
    // },
    // {
    //   keyword: 'isBefore',
    //   alternateKeyword: 'doit',
    //   tests: [
    //     {
    //       arg: tomorrow,
    //       subject: todayString,
    //     },
    //     {
    //       arg: yesterday,
    //       subject: todayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must be before'),
    //       }),
    //     },
    //     {
    //       arg: { $data: '/tomorrow' },
    //       subject: todayString,
    //     },
    //     {
    //       arg: { $data: '/yesterday' },
    //       subject: todayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must be before'),
    //       }),
    //     },
    //   ],
    // },
    // {
    //   keyword: 'isBetween',
    //   alternateKeyword: 'doit',
    //   tests: [
    //     {
    //       arg: [yesterday, tomorrow],
    //       subject: todayString,
    //     },
    //     {
    //       arg: [yesterday, today],
    //       subject: tomorrowString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must be between'),
    //       }),
    //     },
    //     {
    //       arg: { $data: '/between' },
    //       subject: todayString,
    //     },
    //   ],
    // },
    // {
    //   keyword: 'isWeekend',
    //   alternateKeyword: 'doit',
    //   tests: [
    //     {
    //       arg: true,
    //       subject: saturdayString,
    //     },
    //     {
    //       arg: true,
    //       subject: mondayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must be a weekend'),
    //       }),
    //     },
    //     {
    //       arg: false,
    //       subject: mondayString,
    //     },
    //     {
    //       arg: false,
    //       subject: saturdayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must not be a weekend'),
    //       }),
    //     },
    //     {
    //       arg: { $data: '/true' },
    //       subject: saturdayString,
    //     },
    //     {
    //       arg: { $data: '/true' },
    //       subject: mondayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must be a weekend'),
    //       }),
    //     },
    //     {
    //       arg: { $data: '/false' },
    //       subject: mondayString,
    //     },
    //     {
    //       arg: { $data: '/false' },
    //       subject: saturdayString,
    //       errors: expect.objectContaining({
    //         message: expect.stringMatching('Date must not be a weekend'),
    //       }),
    //     },
    //   ],
    // },
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
        {
          arg: { $data: '/true' },
          subject: mondayString,
        },
        {
          arg: { $data: '/true' },
          subject: saturdayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must be a weekday'),
          }),
        },
        {
          arg: { $data: '/false' },
          subject: saturdayString,
        },
        {
          arg: { $data: '/false' },
          subject: mondayString,
          errors: expect.objectContaining({
            message: expect.stringMatching('Date must not be a weekday'),
          }),
        },
      ],
    },
  ];

  tests.forEach(({ keyword, alternateKeyword, tests }) => {
    const runTest = (
      instance: Ajv,
      { arg, errors = null, subject, keyword }: Test & { keyword: string },
    ) => {
      const schema = {
        type: 'object',
        properties: {
          subject: { type: 'string', [keyword]: arg },
        },
      };

      const context = {
        subject,
        today,
        yesterday,
        true: true,
        false: false,
        tomorrow,
        between: [yesterday, tomorrow],
      };

      instance.validate(schema, context);
      errors
        ? expect(instance.errors).toContainEqual(errors)
        : expect(instance.errors).toBeNull();
    };

    it(`should work with ${keyword}`, () => {
      tests.forEach((test) => {
        runTest(dates(new Ajv({ $data: true })), { ...test, keyword });
      });
    });

    if (alternateKeyword) {
      it(`should work with ${keyword} as ${alternateKeyword}`, () => {
        tests.forEach((test) => {
          runTest(
            dates(new Ajv({ $data: true }), {
              keywordMap: { [keyword]: alternateKeyword },
            }),
            { ...test, keyword: alternateKeyword },
          );
        });
      });
    }
  });
});
