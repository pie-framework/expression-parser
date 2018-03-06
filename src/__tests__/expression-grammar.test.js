
// describe('The Calculator Grammar', () => {
//     context('Embedded Actions', () => {
//         const calc = require('./calculator_embedded_actions')
//         it('can calculate an expression', () => {
//             assert.equal(calc('1 + 2').value, 3)
//         })

//         it('can calculate an expression with operator precedence', () => {
//             // if it was evaluated left to right without taking into account precedence the result would have been 9
//             assert.equal(calc('1 + 2 * 3').value, 7)
//         })

//         it('can calculate an expression with operator precedence #2', () => {
//             assert.equal(calc('(1 + 2) * 3').value, 9)
//         })

//         it('can calculate an expression with many parenthesis', () => {
//             assert.equal(calc('((((666))))').value, 666)
//         })

//         it('can calculate an expression with power function', () => {
//             assert.equal(calc('1 + power(2,2)').value, 5)
//         })
//     })

describe('Pure Grammar with Separated Semantics', () => {
  const calc = require('../expression-grammar');
  // it('can calculate an expression', () => {
  //   expect(calc('10%').value).toEqual(0.1);
  // });
  // it('can calculate an expression', () => {
  //   expect(calc('10% + 2').value).toEqual(2.1);
  // });
  // it('can calculate an expression', () => {
  //   expect(calc('10% * 2').value).toEqual(0.2);
  // });

  // it('?', () => {
  //   expect(calc('10.12').value).toEqual(10.12);
  // });

  it('implicit multiplication', () => {
    const result = calc('2(10)');
    expect(result.parseErrors.length).toEqual(1);
  });

  it('?', () => {
    const result = calc('10.1.1');
    expect(result.parseErrors.length).toEqual(1);
  });

  it('?', () => {
    const result = calc('10.1 + 1.2');
    expect(result.value).toEqual(11.3);
  });
  it('?', () => {
    const result = calc('10 + 1.223399');
    expect(result.value).toEqual(11.223399);
  });

  it('?', () => {
    const result = calc('(10% * 100) + 1.2');
    expect(result.value).toEqual(11.2);
  });
  it('?', () => {
    const result = calc('(10% × 100) + 1.2');
    expect(result.value).toEqual(11.2);
  });

  it('?', () => {
    const result = calc('(100 ÷ 10) + 1.2');
    expect(result.value).toEqual(11.2);
  });

  // it.only('can calculate an expression', () => {
  //   expect(calc('log(10% * 2)').value).toEqual(Math.log(0.2));
  // });

  // it.only('can calculate an expression', () => {
  //   expect(calc('√(10% * 40)').value).toEqual(2);
  // });
  // it.only('can calculate an expression', () => {
  //   expect(calc('√(4)').value).toEqual(2);
  // });

  // it.only('can calculate an expression', () => {
  //   expect(calc('³√(8)').value).toEqual(2);
  // });
  it('factorial', () => {
    expect(calc('3!').value).toEqual(6);
  });

  it('factorial', () => {
    expect(calc('10!').value).toEqual(3628800);
  });

  it.only('can calculate an expression', () => {
    expect(calc('⁴√(16)').value).toEqual(2);
  });
  it.only('can calculate an expression', () => {
    expect(calc('2⁴').value).toEqual(16);
  });
  it.only('can calculate an expression', () => {
    expect(calc('2¹⁰').value).toEqual(1024);
  });

  // it.only('can calculate an expression', () => {
  //   expect(calc('¹⁰√(100)').value).toEqual(Math.pow(100, 1 / 10));
  // });

  // it.only('can calculate an expression', () => {
  //   expect(calc('2 * π').value).toEqual(2 * Math.PI);
  // });

  // //implicit multiplication
  // it.only('can calculate an expression', () => {
  //   expect(calc('2π').value).toEqual(2 * Math.PI);
  // });

  //((3!)!)

  // it('can calculate an expression with operator precedence', () => {
  //   // if it was evaluated left to right without taking into account precedence the result would have been 9
  //   assert.equal(calc('1 + 2 * 3').value, 7)
  // })

  // it('can calculate an expression with operator precedence #2', () => {
  //   assert.equal(calc('(1 + 2) * 3').value, 9)
  // })

  // it('can calculate an expression with many parenthesis', () => {
  //   assert.equal(calc('((((666))))').value, 666)
  // })

  // it('can calculate an expression with power function', () => {
  //   assert.equal(calc('1 + power(2,2)').value, 5)
  // })
})