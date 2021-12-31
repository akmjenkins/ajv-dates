import Ajv from 'ajv';

type Keyword = 'isAfter' | 'isBefore' | 'isBetween' | 'isWeekday' | 'isWeekend';
type TimeKeyword = 'isTimeAfter' | 'isTimeBefore' | 'isTimeBetween';

type KeywordMap = Record<Keyword, string>;
type TimeKeywordMap = Record<TimeKeyword, string>;

type Options = {
  parser?: (val: any) => Date | number;
  keywordMap?: Partial<KeywordMap>;
};

type TimeOptions = {
  parser: (val: any) => Date;
  keywordMap?: Partial<TimeKeywordMap>;
};

declare function dates(instance: Ajv, options?: Options): Ajv;
declare function times(instance: Ajv, options: TimeOptions): Ajv;

export const times;
export const dates;
export default dates;
