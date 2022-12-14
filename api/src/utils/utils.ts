/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
  return (Math.random() * (max - min) + min);
}

//https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return (Math.floor(Math.random() * (max - min + 1)) + min);
}

export function getAssetsPath(): string {
  if (process.env['NODE_ENV'] === 'production') {
    return ('./data/');
  } else {
    return ('../web/public/');
  }
}

export function generateCode() {
  let code = '';
  const availableChar = '1234567890abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++)
    code += availableChar.charAt(Math.floor(Math.random() * availableChar.length));
  return code;
}