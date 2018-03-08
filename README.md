# expression-parser

A simple math  expression parser/calculator.

```javascript
import {calculate} from '@pie-framework/expression-parser';

calculate('2 + log(10) * sin(22)').value // => 1.9911486907

```

## Install

```shell
npm install @pie-framework/expression-parser 
#or
yarn add @pie-framework/expression-parser 
```

## supported

Have a look at the tests. Most basic functions you'd find on a scientific calculator.

> implicit multiplication: `2(4) = 8` isn't supported at the moment
