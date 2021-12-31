import { isAfter } from './keywords/isAfter';
import { isWeekday } from './keywords/isWeekday';
import { isWeekend } from './keywords/isWeekend';
import { isBefore } from './keywords/isBefore';
import { isBetween } from './keywords/isBetween';
import { isTimeBetween } from './keywords/isTimeBetween';
import { isTimeAfter } from './keywords/isTimeAfter';
import { isTimeBefore } from './keywords/isTimeBefore';

const dateKeywords = {
  isAfter,
  isWeekday,
  isWeekend,
  isBefore,
  isBetween,
};

const defaultOptions = {
  parser: (val) => new Date(val),
};

export const dates = (instance, options = defaultOptions) =>
  Object.entries(dateKeywords).reduce(
    (acc, [keyword, def]) => (
      acc.addKeyword({
        keyword: options.keywordMap?.[keyword] || keyword,
        ...def({ ...defaultOptions, ...options }),
      }),
      acc
    ),
    instance,
  );

const timeKeywords = {
  isTimeBetween,
  isTimeBefore,
  isTimeAfter,
};

export const times = (instance, options) => {
  if (!options.parser) throw new Error('A parser must be required');

  return Object.entries(timeKeywords).reduce(
    (acc, [keyword, def]) => (
      acc.addKeyword({
        keyword: options.keywordMap?.[keyword] || keyword,
        ...def(options),
      }),
      acc
    ),
    instance,
  );
};

export default dates;
