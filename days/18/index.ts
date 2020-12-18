import readFile from "../../utils/readFile";

const peek = (arr) => arr[arr.length - 1];

const calculate = (line: string[], hasGreaterPrecedence: Function): number => {
  const parse = (line: string[]): (string | number)[] => {
    const operatorStack = [];
    const outputQueue = [];
    const inner = (line: string[]): (string | number)[] => {
      if (line.length === 0) {
        while (operatorStack.length > 0) {
          outputQueue.push(operatorStack.pop());
        }
        return outputQueue;
      } else {
        const token = line[0];
        if (token === " ") {
          return inner(line.slice(1));
        }
        switch (token) {
          case "+":
          case "*":
            while (
              operatorStack.length > 0 &&
              hasGreaterPrecedence(peek(operatorStack), token)
            ) {
              outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
            break;
          case "(":
            operatorStack.push(token);
            break;
          case ")":
            while (peek(operatorStack) !== "(") {
              outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
            break;
          default:
            outputQueue.push(Number.parseInt(token));
            break;
        }

        return inner(line.slice(1));
      }
    };
    return inner(line);
  };

  const calc = (outputQueue): number => {
    const calcStack = [];
    while (outputQueue.length > 0) {
      while (!isNaN(outputQueue[0])) {
        calcStack.push(outputQueue.shift());
      }
      const nextOperator = outputQueue.shift();
      const operand1 = calcStack.pop();
      const operand2 = calcStack.pop();
      let result = 0;
      switch (nextOperator) {
        case "+":
          result = operand1 + operand2;
          break;
        case "*":
          result = operand1 * operand2;
          break;
      }
      calcStack.push(result);
    }

    return calcStack[0];
  };
  return calc(parse(line));
};

function runPartA() {
  const lines = readFile("18", "a") as string[];
  return lines.reduce(
    (prev, line) =>
      prev + calculate(line.split(""), (first, _) => first !== "("),
    0
  );
}

function runPartB() {
  const lines = readFile("18", "b") as string[];
  return lines.reduce(
    (prev, line) =>
      prev +
      calculate(
        line.split(""),
        (first, second) => first !== "(" && first === "+" && second === "*"
      ),
    0
  );
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
