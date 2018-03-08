# expression-parser

A simple expression parser/calculator.


## Usage

```javascript
import {calculate} from '@pie-framework/expression-parser';

calculate('2 + log(10) * sin(22)').value // => 1.9911486907

```

## supported

Have a look at the tests. Most basic functions you'd find on a scientific calculator.

> implicit multiplication: `2(4) = 8` isn't supported at the moment
