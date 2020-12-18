import readFile from "../../utils/readFile";

const peek = (arr: string[]): string => arr[arr.length - 1];

type OutputQueue = (string | number)[];

const calculate = (
  line: string,
  hasGreaterPrecedence: (_: string, __: string) => boolean
): number => {
  const parse = (line: string[]): OutputQueue => {
    const operatorStack = [];
    const outputQueue = [];
    const inner = (line: string[]): OutputQueue => {
      if (line.length === 0) {
        while (operatorStack.length > 0) {
          outputQueue.push(operatorStack.pop());
        }
        return outputQueue;
      } else {
        const [token, ...remaining] = line;
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

        return inner(remaining);
      }
    };
    return inner(line);
  };

  const calc = (outputQueue: OutputQueue): number => {
    const calcStack: number[] = [];
    while (outputQueue.length > 0) {
      while (!isNaN(outputQueue[0] as number)) {
        calcStack.push(outputQueue.shift() as number);
      }
      const nextOperator = outputQueue.shift();
      const operand1 = calcStack.pop();
      const operand2 = calcStack.pop();
      switch (nextOperator) {
        case "+":
          calcStack.push(operand1 + operand2);
          break;
        case "*":
          calcStack.push(operand1 * operand2);
          break;
      }
    }

    return calcStack[0];
  };
  return calc(parse(line.split("").filter((token) => token !== " ")));
};

function runPartA() {
  const lines = readFile("18", "a") as string[];
  return lines.reduce(
    (prev, line) => prev + calculate(line, (first, _) => first !== "("),
    0
  );
}

function runPartB() {
  const lines = readFile("18", "b") as string[];
  return lines.reduce(
    (prev, line) =>
      prev +
      calculate(
        line,
        (first, second) => first !== "(" && first === "+" && second === "*"
      ),
    0
  );
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
