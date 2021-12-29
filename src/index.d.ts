import Ajv from 'ajv';

type Keyword = 'isAfter' | 'isBefore' | 'isBetween' | 'isWeekday' | 'isWeekend';

type KeywordMap = Record<Keyword, string>;

type Options = {
  parser?: (val: any) => Date | number;
  keywordMap?: Partial<KeywordMap>;
};

export function dates(instance: Ajv, options?: Options): Ajv;
