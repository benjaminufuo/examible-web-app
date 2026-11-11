// Works out a calculator expression such as "2+3*√(16)-50%" or "(1.5^2)/3".
// A small parser rather than eval or new Function, which the Content Security
// Policy blocks. Throws on anything it doesn't understand.
//
//   expression = term (("+" | "-") term)*
//   term       = unary (("*" | "/") unary)*
//   unary      = ("-" | "+") unary | power
//   power      = percent ("^" unary)?     2^3^2 = 2^9, 2^-1 = 0.5
//   percent    = primary "%"*             50% = 0.5
//   primary    = number | "(" expression ")" | "√(" expression ")"
//
// "-2^2" is -(2^2) = -4, as on a normal calculator.
export const calculate = (text) => {
  let pos = 0;
  const peek = () => text[pos];
  const fail = () => {
    throw new Error(`Can't read the expression at ${pos}`);
  };
  const expect = (char) => {
    if (text[pos] !== char) fail();
    pos++;
  };

  const number = () => {
    const match = /^(\d+\.?\d*|\.\d+)/.exec(text.slice(pos));
    if (!match) fail();
    pos += match[0].length;
    return parseFloat(match[0]);
  };

  const primary = () => {
    if (peek() === "(") {
      pos++;
      const value = expression();
      expect(")");
      return value;
    }
    if (peek() === "√") {
      pos++;
      expect("(");
      const value = expression();
      expect(")");
      return Math.sqrt(value);
    }
    return number();
  };

  const percent = () => {
    let value = primary();
    while (peek() === "%") {
      pos++;
      value /= 100;
    }
    return value;
  };

  const power = () => {
    const base = percent();
    if (peek() !== "^") return base;
    pos++;
    return base ** unary();
  };

  const unary = () => {
    if (peek() === "-") {
      pos++;
      return -unary();
    }
    if (peek() === "+") {
      pos++;
      return unary();
    }
    return power();
  };

  const term = () => {
    let value = unary();
    while (peek() === "*" || peek() === "/") {
      const op = text[pos++];
      const right = unary();
      value = op === "*" ? value * right : value / right;
    }
    return value;
  };

  const expression = () => {
    let value = term();
    while (peek() === "+" || peek() === "-") {
      const op = text[pos++];
      const right = term();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  };

  const result = expression();
  if (pos !== text.length) fail();
  return result;
};
