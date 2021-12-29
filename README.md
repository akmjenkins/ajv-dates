# ajv-dates

[![npm version](https://img.shields.io/npm/v//ajv-dates.svg)](https://npmjs.org/package/ajv-dates)
[![Coverage Status](https://coveralls.io/repos/github/akmjenkins/ajv-dates/badge.svg)](https://coveralls.io/github/akmjenkins/ajv-dates)
![Build Status](https://github.com/akmjenkins/schema2/actions/workflows/main.yaml/badge.svg)
[![Bundle Phobia](https://badgen.net/bundlephobia/minzip/ajv-dates)](https://bundlephobia.com/result?p=ajv-dates)

## What's this?

Good date validation has been conspicuously missing from the JSON schema spec. This adds some (configurable) keywords to [ajv](https://ajv.js.org/) to make date validation a snap. 


## Getting Started

```bash
npm install ajv-dates
# or
yarn add ajv-dates
```

## Usage

```js
import Ajv from 'ajv';
import { dates } from 'ajv-dates';

const instance = dates(new Ajv());

const validator = instance.compile({
    type: 'string',
    isAfter: Date.UTC(2021, 12, 31)
});

console.log(validator('2022-01-01').errors)
// null, no errors!

console.log(validator('2021-01-01').errors)
/*

      [
        {
          message: 'Date must be after 1643587200000',
          instancePath: '',
          schemaPath: '#/isAfter'
        }
      ]

*/

```

## Keywords

- [isAfter](#isAfter)
- [isBefore](#isBefore)
- [isBetween](#isBetween)
- [isWeekday](#isWeekday)
- [isWeekend](#isWeekend)

`isAfter`
---

`isAfter` accepts a single argument that is, or can be parsed into a Date or unix timestamp:

```ts
instance.validate({
    type: 'string',
    isAfter: Date.now()
})
```

`isBefore`
---

`isBefore` accepts a single argument that is, or can be parsed into a Date or unix timestamp:

```ts
instance.validate({
    type: 'string',
    isAfter: Date.now()
})
```

`isBetween`
---

`isBetween` accepts a tuple of two values that are, or can be parsed into, Dates or unix timestamps:

```ts
instance.validate({
    type: 'string',
    isBetween: [Date.now()-86400, Date.now()+86400]
})
```

`isWeekday`
---

`isWeekday` accepts a boolean:

```ts
instance.validate({
    type: 'string',
    isWeekday: true
})
```

`isWeekend`
---

`isWeekend` accepts a boolean:

```ts
instance.validate({
    type: 'string',
    isWeekend: false
})
```


## API

This library exports a single named function `dates`. It accepts an AJV instance and [options](#options).

### Options

```ts
type Options = {
  parser?: (val: any) => Date | number;
  keywordMap?: KeywordMap;
};
```

#### `parser = (val) => new Date(val)`

The parser accepts any value and tries to parse it to a Date (or a unix timestamp). It is used to parse both the subject being evaluated and the arguments given to the keyword. As shown [below](#sugar-date), the ability to specify a parser allows some really great features to be unlocked.


#### `keywordMap = Partial<Record<Keyword,string>>`

Don't like the keywords? Configure your own using the keyword map:

```js

const instance = dates(
    new Ajv(),
    { 
        keywordMap: { 
            isAfter: 'isDateAfter' 
        }
    }
)

instance.validate({
    type: 'string',
    isDateAfter: Date.now()
}, '2021-12-31')
```



## Sugar Date

[Sugar Date](https://sugarjs.com/dates/) gives your validators super powers. You can use relative date strings in your schemas (or as your subjects, for that matter).

It's as easy as:

```js
import { Date as SDate } from 'sugar-date'
import Ajv from 'ajv';
import { dates } from 'ajv-dates';


const instance = dates(new Ajv(), { parser: SDate.create })
```

The super power you get is being able to encode relative dates in a schema:


```js
import { Date as SDate } from 'sugar-date'

const schema = {
    type: 'string',
    isAfter: '30 days ago'
}

const instance = dates(new Ajv(), { parser: SDate.create })

const today = (new Date()).toISOString();

instance.validate(
    {
        type: 'string',
        isAfter: '2 weeks ago'
    }, 
    today
);
console.log(instance.errors); // null

instance.validate(
    {
        type: 'string',
        isAfter: '2 weeks from now'
    }, 
    today
);

console.log(instance.errors);
/*

[
    {
        message: 'Date must be after 2 weeks from now',
        instancePath: '',
        schemaPath: '#/isAfter'
    }
]

*/
```



## License

[MIT](./LICENSE)

## Contributing

PRs welcome!