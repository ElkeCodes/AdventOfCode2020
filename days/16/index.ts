import readFile from "../../utils/readFile";

type Range = {
  min: number;
  max: number;
};

type Rule = { index: number; matches: string[] };

const isRuleValid = (rule: Range[], ticketElement: number) =>
  !!rule.find(
    (range) => ticketElement >= range.min && ticketElement <= range.max
  );

const countInvalid = (ticket, rules: Map<string, Range[]>) => {
  if (ticket.length === 0) {
    return 0;
  } else {
    const [element, ...otherElements] = ticket;
    let valid = !!Array.from(rules.values()).find((rule) =>
      isRuleValid(rule, element)
    );
    return (valid ? 0 : element) + countInvalid(otherElements, rules);
  }
};

const isValid = (ticket, rules: Map<string, Range[]>) => {
  if (ticket.length === 0) {
    return true;
  } else {
    const [element, ...otherElements] = ticket;
    let valid = !!Array.from(rules.values()).find((rule) =>
      isRuleValid(rule, element)
    );
    return valid && isValid(otherElements, rules);
  }
};

const parse = (data: string[]) => {
  data = data.filter((line) => line.length > 0);
  const rules = new Map<string, Range[]>();
  let i = 0;
  while (!data[i].startsWith("your ticket:")) {
    const name = data[i].split(": ")[0];
    const ranges = data[i]
      .split(": ")[1]
      .split(" or ")
      .map((range) => range.match(/(?<min>\d+)-(?<max>\d+)/).groups);
    rules.set(
      name,
      ranges.map((match) => ({
        min: Number.parseInt(match.min),
        max: Number.parseInt(match.max),
      }))
    );
    i++;
  }

  const otherTickets = data
    .slice(data.findIndex((line) => line.startsWith("nearby tickets:")) + 1)
    .map((line) => line.split(",").map((n) => Number.parseInt(n)));

  const myTicket = data[
    data.findIndex((line) => line.startsWith("your ticket:")) + 1
  ]
    .split(",")
    .map((n) => Number.parseInt(n));

  return {
    rules,
    otherTickets,
    myTicket,
    allTickets: [myTicket, ...otherTickets],
  };
};

function runPartA() {
  const { rules, otherTickets } = parse(readFile("16", "a") as string[]);

  return otherTickets.reduce(
    (prev, ticket) => prev + countInvalid(ticket, rules),
    0
  );
}

function runPartB() {
  const { rules, allTickets, myTicket } = parse(
    readFile("16", "b") as string[]
  );

  const validTickets = allTickets.filter((ticket) => isValid(ticket, rules));

  const matchRule = (rule: Range[], tickets: number[][], element: number) => {
    if (tickets.length === 0) {
      return true;
    } else {
      const [ticket, ...otherTickets] = tickets;
      return (
        isRuleValid(rule, ticket[element]) &&
        matchRule(rule, otherTickets, element)
      );
    }
  };

  const matchingRules = new Map<number, string[]>();
  for (let i = 0; i < validTickets[0].length; i++) {
    for (const [ruleName, ruleRanges] of rules) {
      if (matchRule(ruleRanges, validTickets, i)) {
        matchingRules.set(i, [ruleName, ...(matchingRules.get(i) || [])]);
      }
    }
  }

  let sortedMatchingRules = Array.from(matchingRules)
    .sort((match1, match2) => match1[1].length - match2[1].length)
    .map(([index, matches]) => ({ index, matches }));

  const cleanRule = (matches: string[], rulesToClean: string[]): string[] => {
    return matches.filter((match) => !rulesToClean.includes(match));
  };

  const cleanRules = (
    rules: Rule[],
    alreadyCleaned: string[],
    newRules: Rule[]
  ): Rule[] => {
    if (rules.length === 0) {
      return newRules;
    } else {
      const [rule, ...otherRules] = rules;
      rule.matches = cleanRule(rule.matches, alreadyCleaned);
      if (rule.matches.length === 1) {
        return cleanRules(
          otherRules,
          [rule.matches[0], ...alreadyCleaned],
          [rule, ...newRules]
        );
      } else {
        return cleanRules(otherRules, alreadyCleaned, [
          {
            index: rule.index,
            matches: rule.matches,
          },
          ...newRules,
        ]);
      }
    }
  };

  const cleanedRules = cleanRules(sortedMatchingRules, [], []);
  const relevantRules = cleanedRules.filter(
    ({ matches }) =>
      matches.filter((match) => match.indexOf("departure") > -1).length > 0
  );
  return relevantRules.reduce((prev, rule) => myTicket[rule.index] * prev, 1);
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
