export const factorialLoop = (num: number): number => {
  var result = 1;
  for (var i = 1; i < num; i++) {
    result = (result * (i + 1));
  }
  return result;
}