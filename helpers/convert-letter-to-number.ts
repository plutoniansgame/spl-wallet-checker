export function convertLetterToNumber(str: string): number {
  if (str && /^[a-zA-Z]+$/.test(str)) {
    str = str.toUpperCase();
    let out = 0,
      len = str.length;
    for (let pos = 0; pos < len; pos++) {
      out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1);
    }
    return out - 1;
  } else {
    return 0;
  }
}
