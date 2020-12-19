import readFile from "../../utils/readFile";

const flatten = (arrays) => [].concat.apply([], arrays);

const parse = (
  lines: string[]
): { rules: Map<string, string>; messages: string[] } => {
  const rules = new Map<string, string>();
  const messages = [];
  const inner = (lines: string[]) => {
    if (lines.length === 0) {
      return { rules, messages };
    } else {
      const [firstLine] = lines;
      if (firstLine.match(/^\d+: /)) {
        const parts = firstLine.split(": ");
        rules.set(parts[0], parts[1]);
      }
      if (firstLine.match(/^[ab]+$/)) {
        messages.push(firstLine);
      }
      return inner(lines.slice(1));
    }
  };

  return inner(lines);
};

function runPartA() {
  const { messages, rules } = parse(readFile("19", "a") as string[]);

  const generateRegEx = (rules: Map<string, string>, rule: string): string => {
    let match;
    if ((match = /^"(\w+)"$/.exec(rule))) {
      return match[1];
    } else if (/^\d+$/.test(rule)) {
      return generateRegEx(rules, rules.get(rule));
    } else if (/\|/.test(rule)) {
      return (
        "(" +
        rule
          .split(" | ")
          .map((r) => generateRegEx(rules, r))
          .join("|") +
        ")"
      );
    } else {
      return rule
        .split(" ")
        .map((r) => generateRegEx(rules, r))
        .join("");
    }
  };
  return messages.filter((message) =>
    new RegExp(`^${generateRegEx(rules, "0")}$`).test(message)
  ).length;
}

function runPartB() {
  const { messages, rules } = parse(readFile("19", "b") as string[]);

  rules.set("8", "42 | 42 8");
  rules.set("11", "42 31 | 42 11 31");

  const matchRule = (
    rules: Map<string, string>,
    rule: string,
    message: string
  ): string[] => {
    let match;
    if ((match = /^"(\w)"$/.exec(rule))) {
      if (message[0] === match[1]) {
        return [message.slice(1)];
      } else {
        return [];
      }
    } else if (/^(\d+)$/.test(rule)) {
      return matchRule(rules, rules.get(rule), message);
    } else if (/\|/.test(rule)) {
      return flatten(
        rule.split(" | ").map((rulePart) => matchRule(rules, rulePart, message))
      );
    } else {
      return rule
        .split(" ")
        .reduce(
          (result, rulePart) =>
            flatten(
              result.map((message) => matchRule(rules, rulePart, message))
            ),
          [message]
        );
    }
  };

  return messages.filter((message) =>
    matchRule(rules, "0", message).includes("")
  ).length;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
