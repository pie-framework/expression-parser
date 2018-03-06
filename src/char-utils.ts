const SUPERS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

export const superToNormal = (su) => {
  const index = SUPERS.indexOf(su);

  if (index === -1) {
    throw new Error(`super must be a valid super script digit, got: ${su}`);
  }
  return index;
}
