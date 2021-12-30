import { isAfter } from './keywords/isAfter';
import { isWeekday } from './keywords/isWeekday';
import { isWeekend } from './keywords/isWeekend';
import { isBefore } from './keywords/isBefore';
import { isBetween } from './keywords/isBetween';

const keywords = {
  isAfter,
  isWeekday,
  isWeekend,
  isBefore,
  isBetween,
};

const defaultOptions = {
  parser: (val) => new Date(val),
};

const dates = (instance, options = defaultOptions) => (
  Object.entries(keywords).forEach(([keyword, def]) => {
    instance.addKeyword({
      keyword: options.keywordMap?.[keyword] || keyword,
      ...def({ ...defaultOptions, ...options }),
    });
  }),
  instance
);

export default dates;
