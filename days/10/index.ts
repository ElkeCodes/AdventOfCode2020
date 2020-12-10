import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("10", "a") as string[];
  const numbersList = fileData
    .map((line) => Number.parseInt(line, 10))
    .sort((joltage1, joltage2) => joltage1 - joltage2);

  const count = (numbersList, previous, ones, threes) => {
    if (numbersList.length === 0) {
      return [ones, threes + 1];
    } else {
      const [current, ...others] = numbersList;
      if (current - previous === 1) {
        return count(others, current, ones + 1, threes);
      } else if (current - previous === 3) {
        return count(others, current, ones, threes + 1);
      }
    }
  };

  const [ones, threes] = count(numbersList, 0, 0, 0);

  return ones * threes;
}

function runPartB() {
  const fileData = readFile("10", "b") as string[];
  const numbersList = fileData
    .map((line) => Number.parseInt(line, 10))
    .sort((joltage1, joltage2) => joltage1 - joltage2);

  // special version so we have 0, 1, 1, 2, 4, 7, 13, 24, ...
  // because 1 consecutive 1 diff = 1
  // because 2 consecutive 1 diff = 1
  // because 3 consecutive 1 diff = 2
  // because 4 consecutive 1 diff = 4
  // because 5 consecutive 1 diff = 7
  const tribonacci = (x: number): number => {
    switch (x) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 1;
      default:
        return tribonacci(x - 1) + tribonacci(x - 2) + tribonacci(x - 3);
    }
  };

  const count = (numbersList, previous, currentStreak) => {
    if (numbersList.length === 0) {
      return tribonacci(currentStreak);
    } else {
      const [current, ...others] = numbersList;
      if (current - previous > 3) {
        return 0;
      } else if (current - previous === 3) {
        return tribonacci(currentStreak) * count(others, current, 1);
      } else if (current - previous === 1) {
        return count(others, current, currentStreak + 1);
      }
    }
  };

  return count(numbersList, 0, 1);
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
