import { argv } from 'node:process';

/** @type {<T>(argName: string, defaults: { splitBy: string; value: T }) => T} */
export function getProcessArgumentValue(argName, { splitBy = '=', value = undefined }) {
  const arg = argv.find((arg) => arg.includes(argName))?.split(splitBy);

  if (!arg) return value;

  if (arg[0] && (typeof arg[1] === 'boolean' || arg[1] === 'false')) return false;
  if (
    arg[0] &&
    (typeof arg[1] === 'undefined' ||
      arg[1] === 'undefined' ||
      typeof arg[1] === 'boolean' ||
      arg[1] === 'true')
  ) {
    return true;
  }

  return arg[1];
}
