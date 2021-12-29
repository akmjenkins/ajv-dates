import * as keywords from './keywords';

const defaultOptions = {
  parser: (val) => new Date(val),
};

export const dates = (instance, options = defaultOptions) => (
  Object.entries(keywords).forEach(([keyword, def]) => {
    instance.addKeyword({
      keyword: options.keywordMap?.[keyword] || keyword,
      ...def({ ...defaultOptions, ...options }),
    });
  }),
  instance
);
