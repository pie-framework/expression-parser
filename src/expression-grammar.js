/**
 * An Example of implementing a Calculator with separated grammar and semantics (actions).
 * This separation makes it easier to maintain the grammar and reuse it in different use cases.
 *
 * This is accomplished by using the automatic CST (Concrete Syntax Tree) output capabilities
 * of chevrotain.
 *
 * See farther details here:
 * https://github.com/SAP/chevrotain/blob/master/docs/concrete_syntax_tree.md
 */
const factorialLoop = (num) => {
  var result = 1;
  for (var i = 1; i < num; i++) {
    result = (result * (i + 1));
  }
  return result;
}

const SUPERS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

const superToNormal = (su) => {
  const index = SUPERS.indexOf(su);

  if (index === -1) {
    throw new Error(`super must be a valid super script digit, got: ${su}`);
  }
  return index;
}

const { createToken, tokenMatcher, Lexer, Parser } = require("chevrotain");

// ----------------- lexer -----------------
// using the NA pattern marks this Token class as 'irrelevant' for the Lexer.
// AdditionOperator defines a Tokens hierarchy but only the leafs in this hierarchy define
// actual Tokens that can appear in the text
const AdditionOperator = createToken({
  name: "AdditionOperator",
  pattern: Lexer.NA
});

const Factorial = createToken({
  name: 'Factorial',
  pattern: /!/
});

const Pi = createToken({
  name: 'Pi',
  pattern: /π/
});

const SuperScriptNumber = createToken({
  name: 'SuperScriptNumber',
  pattern: /[⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹]/
});

const Plus = createToken({
  name: "Plus",
  pattern: /\+/,
  categories: AdditionOperator
})
const Minus = createToken({
  name: "Minus",
  pattern: /-/,
  categories: AdditionOperator
})

const SquareRoot = createToken({
  name: 'SquareRoot',
  pattern: /√/
});

const Percent = createToken({
  name: 'Percent',
  pattern: /%/
});

const MultiplicationOperator = createToken({
  name: "MultiplicationOperator",
  pattern: Lexer.NA
})

const Multi = createToken({
  name: "Multi",
  pattern: /[\*|\×]/,
  categories: MultiplicationOperator
});

const Div = createToken({
  name: "Div",
  pattern: /[\/|\÷]/,
  categories: MultiplicationOperator
});

const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });

const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /[1-9]\d*/
});

const DecimalPlace = createToken({
  name: 'DecimalPlace',
  pattern: /\./
});

const PowerFunc = createToken({ name: "PowerFunc", pattern: /power/ })
const LogFunc = createToken({ name: "LogFunc", pattern: /log/ })
const Comma = createToken({ name: "Comma", pattern: /,/ })

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
  line_breaks: true
});

const allTokens = [
  WhiteSpace, // whitespace is normally very common so it should be placed first to speed up the lexer's performance
  Plus,
  Minus,
  Multi,
  Div,
  Percent,
  LParen,
  RParen,
  NumberLiteral,
  AdditionOperator,
  MultiplicationOperator,
  PowerFunc,
  LogFunc,
  Comma,
  SquareRoot,
  SuperScriptNumber,
  Pi,
  DecimalPlace,
  Factorial
];


const CalculatorLexer = new Lexer(allTokens)

// ----------------- parser -----------------
// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
class CalculatorPure extends Parser {
  // Unfortunately no support for class fields with initializer in ES2015, only in esNext...
  // so the parsing rules are defined inside the constructor, as each parsing rule must be initialized by
  // invoking RULE(...)
  // see: https://github.com/jeffmo/es-class-fields-and-static-properties
  constructor(input) {
    super(input, allTokens, { outputCst: true })

    const $ = this

    $.RULE("expression", () => {
      $.SUBRULE($.additionExpression)
    })

    // Lowest precedence thus it is first in the rule chain
    // The precedence of binary expressions is determined by how far down the Parse Tree
    // The binary expression appears.
    $.RULE("additionExpression", () => {
      // using labels can make the CST processing easier
      $.SUBRULE($.multiplicationExpression, { LABEL: "lhs" })
      $.MANY(() => {
        // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
        $.CONSUME(AdditionOperator)
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        $.SUBRULE2($.multiplicationExpression, { LABEL: "rhs" })
      })
    })

    $.RULE("multiplicationExpression", () => {
      $.SUBRULE($.atomicExpression, { LABEL: "lhs" })
      $.MANY(() => {
        $.CONSUME(MultiplicationOperator)
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        $.SUBRULE2($.atomicExpression, { LABEL: "rhs" })
      })
    })

    // $.RULE('implicitMultiplication', () => {
    //   $.SUBRULE($.atomicExpression, { LABEL: 'lhs' });
    //   $.MANY(() => {
    //     $.CONSUME(WhiteSpace);
    //     $.SUBRULE2($.atomicExpression, { LABEL: 'rhs' });
    //   });
    // });

    $.RULE('percent', () => {
      $.CONSUME(NumberLiteral)
      $.CONSUME(Percent)
    });

    $.RULE('factorial', () => {
      $.CONSUME(NumberLiteral, { LABEL: 'base' });
      $.AT_LEAST_ONE(() => {
        $.CONSUME(Factorial);
      });
    });

    $.RULE('number', () => {

      $.AT_LEAST_ONE(() => {
        $.CONSUME(NumberLiteral, { LABEL: 'int' })
      });
      $.OPTION(() => {
        $.CONSUME(DecimalPlace);
        $.AT_LEAST_ONE2(() => {
          $.CONSUME2(NumberLiteral, { LABEL: 'decimal' });
        })
      });
    });

    $.RULE('exponentialNumber', () => {
      $.SUBRULE($.number, { LABEL: 'base' });
      $.SUBRULE2($.exponent, { LABEL: 'exponent' });
    });

    $.RULE("atomicExpression", () => {
      $.OR([
        // parenthesisExpression has the highest precedence and thus it appears
        // in the "lowest" leaf in the expression ParseTree.
        { ALT: () => $.SUBRULE($.parenthesisExpression) },
        { ALT: () => $.SUBRULE($.percent) },
        { ALT: () => $.SUBRULE($.powerFunction) },
        { ALT: () => $.SUBRULE($.logFunction) },
        { ALT: () => $.SUBRULE($.squareRootFunction) },
        { ALT: () => $.SUBRULE($.pi) },
        { ALT: () => $.SUBRULE($.exponentialNumber) },
        { ALT: () => $.SUBRULE($.factorial) },
        { ALT: () => $.SUBRULE($.number) },
      ])
    })

    $.RULE('pi', () => {
      $.CONSUME(Pi);
    });

    $.RULE("parenthesisExpression", () => {
      $.CONSUME(LParen)
      $.SUBRULE($.expression)
      $.CONSUME(RParen)
    });

    $.RULE('exponent', () => {
      $.AT_LEAST_ONE(() => {
        $.CONSUME(SuperScriptNumber);
      });
    });

    $.RULE('squareRootFunction', () => {
      $.OPTION1(() => {
        $.SUBRULE($.exponent, { LABEL: 'exponent' })
      });
      $.CONSUME(SquareRoot);
      $.CONSUME(LParen);
      $.SUBRULE($.expression, { LABEL: 'base' });
      $.CONSUME(RParen);
    });

    $.RULE("logFunction", () => {
      $.CONSUME(LogFunc)
      $.CONSUME(LParen)
      $.SUBRULE($.expression, { LABEL: "base" })
      $.CONSUME(RParen)
    });

    $.RULE("powerFunction", () => {
      $.CONSUME(PowerFunc)
      $.CONSUME(LParen)
      $.SUBRULE($.expression, { LABEL: "base" })
      $.CONSUME(Comma)
      $.SUBRULE2($.expression, { LABEL: "exponent" })
      $.CONSUME(RParen)
    })

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    Parser.performSelfAnalysis(this)
  }
}

// wrapping it all together
// reuse the same parser instance.
const parser = new CalculatorPure([])

// ----------------- Interpreter -----------------
// Obtains the default CstVisitor constructor to extend.
const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

// All our semantics go into the visitor, completly separated from the grammar.
class CalculatorInterpreter extends BaseCstVisitor {
  constructor() {
    super()
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor()
  }

  expression(ctx) {
    // visiting an array is equivalent to visiting its first element.
    return this.visit(ctx.additionExpression)
  }

  // Note the usage if the "rhs" and "lhs" labels to increase the readability.
  additionExpression(ctx) {
    let result = this.visit(ctx.lhs)

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand)
        let operator = ctx.AdditionOperator[idx]

        if (tokenMatcher(operator, Plus)) {
          result = parseFloat((result + rhsValue).toFixed(10), 10);
        } else {
          // Minus
          result -= rhsValue
        }
      })
    }

    return result
  }


  multiplicationExpression(ctx) {
    let result = this.visit(ctx.lhs)

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand)
        let operator = ctx.MultiplicationOperator[idx]

        if (tokenMatcher(operator, Multi)) {
          result *= rhsValue
        } else {
          // Division
          result /= rhsValue
        }
      })
    }

    return result
  }

  number(ctx) {
    if (ctx.decimal) {
      return parseFloat(`${ctx.int[0].image}.${ctx.decimal[0].image}`, 10);
    } else {
      return parseInt(ctx.int[0].image, 10);
    }
  }

  atomicExpression(ctx) {

    if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression)
    } else if (ctx.number) {
      return this.visit(ctx.number);
      //parseInt(ctx.NumberLiteral[0].image, 10)
    } else if (ctx.powerFunction) {
      return this.visit(ctx.powerFunction)
    } else if (ctx.percent) {
      return this.visit(ctx.percent);
    } else if (ctx.logFunction) {
      return this.visit(ctx.logFunction);
    } else if (ctx.squareRootFunction) {
      return this.visit(ctx.squareRootFunction)
    } else if (ctx.pi) {
      return this.visit(ctx.pi);
    } else if (ctx.exponentialNumber) {
      return this.visit(ctx.exponentialNumber);
    } else if (ctx.factorial) {
      return this.visit(ctx.factorial);
    }
  }

  factorial(ctx) {
    const base = this.visit(ctx.base);
    return factorialLoop(base);
  }

  pi(ctx) {
    return Math.PI;
  }

  percent(ctx) {
    const v = parseInt(ctx.NumberLiteral[0].image, 10);
    return v * 0.01;
  }

  parenthesisExpression(ctx) {
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.
    return this.visit(ctx.expression)
  }

  logFunction(ctx) {
    console.log('LOG!!');
    const base = this.visit(ctx.base);
    return Math.log(base);
  }

  powerFunction(ctx) {
    const base = this.visit(ctx.base)
    const exponent = this.visit(ctx.exponent)
    return Math.pow(base, exponent)
  }

  exponent(ctx) {
    if (!ctx.SuperScriptNumber) {
      return 2;
    } else {
      const normal = ctx.SuperScriptNumber
        .map(s => s.image)
        .map(superToNormal)
        .join('');
      const out = parseInt(normal, 10);
      return out;
    }
  }

  exponentialNumber(ctx) {
    const exponent = this.visit(ctx.exponent);
    const base = this.visit(ctx.base);
    return Math.pow(base, exponent);
  }

  squareRootFunction(ctx) {
    const exponent = ctx.exponent ? this.visit(ctx.exponent) : 2;
    const base = this.visit(ctx.base)
    return Math.pow(base, 1 / exponent);
  }
}

// We only need a single interpreter instance because our interpreter has no state.
const interpreter = new CalculatorInterpreter()

module.exports = function (text) {
  // 1. Tokenize the input.
  const lexResult = CalculatorLexer.tokenize(text)

  // 2. Parse the Tokens vector.
  parser.input = lexResult.tokens
  const cst = parser.expression()

  // 3. Perform semantics using a CstVisitor.
  // Note that separation of concerns between the syntactic analysis (parsing) and the semantics.
  const value = interpreter.visit(cst)

  return {
    value: value,
    lexResult: lexResult,
    parseErrors: parser.errors
  }
}