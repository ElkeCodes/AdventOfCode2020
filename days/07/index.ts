import { reduceEachLeadingCommentRange } from "typescript";
import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("07", "a") as string[];
  const rules = fileData.map((rule) => {
    const matches = rule.split(" bags contain ");
    const contents =
      matches[1].matchAll(
        /((?<amount>\d+) (?<colour>(\w+) (\w+)) (?! bag(s, |s.|, )))/g
      ) || [];
    return {
      colour: matches[0],
      contents: [...contents].map((content) => ({
        amount: content.groups.amount,
        colour: content.groups.colour,
      })),
    };
  });

  const unique = (array1: string[]): string[] => {
    return array1.filter((value, index) => array1.indexOf(value) === index);
  };

  const count = (searchStrings: string[]): string[] => {
    if (searchStrings.length === 0) {
      return [];
    } else {
      const [searchString, ...remainingSearchStrings] = searchStrings;
      const found = rules
        .filter(
          (rule) =>
            rule.contents.filter((contents) => contents.colour === searchString)
              .length > 0
        )
        .map((f) => f.colour);
      return [...found, ...count([...remainingSearchStrings, ...found])];
    }
  };

  return unique(count(["shiny gold"])).length;
}

function runPartB() {
  const fileData = readFile("07", "b") as string[];
  const rules = fileData.map((rule) => {
    const matches = rule.split(" bags contain ");
    const contents =
      matches[1].matchAll(
        /((?<amount>\d+) (?<colour>(\w+) (\w+)) (?! bag(s, |s.|, )))/g
      ) || [];
    return {
      colour: matches[0],
      contents: [...contents].map((content) => ({
        amount: content.groups.amount,
        colour: content.groups.colour,
      })),
    };
  });

  const count = (searchStrings: string[]): number => {
    if (searchStrings.length === 0) {
      return 0;
    } else {
      const [searchString, ...remainingSearchStrings] = searchStrings;
      const found = rules.find((rule) => rule.colour === searchString);

      if (!found) {
        return 0;
      } else {
        return (
          1 +
          found.contents
            .map((content) => content.amount * count([content.colour]))
            .reduce((prev, curr) => prev + curr, 0)
        );
      }
    }
  };

  return count(["shiny gold"]) - 1;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
