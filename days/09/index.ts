import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("09", "a") as string[];
  const numbersList = fileData.map((line) => Number.parseInt(line, 10));

  const findSum = (sum, numbersList: number[]): number => {
    if (numbersList.length <= 1) {
      return 0;
    } else {
      const [firstNumber, ...remainingNubmers] = numbersList;
      const secondNumber = numbersList.find(
        (matchingNumber) => matchingNumber + firstNumber === sum
      );
      if (secondNumber) {
        return sum;
      } else {
        return findSum(sum, remainingNubmers);
      }
    }
  };

  const find = (
    numbersList,
    preamble: number,
    currentIndex: number
  ): number => {
    const sum = numbersList[currentIndex];
    const searchNumbersList = numbersList.slice(
      currentIndex - preamble,
      currentIndex
    );
    if (!findSum(sum, searchNumbersList)) {
      return sum;
    } else {
      return find(numbersList, preamble, currentIndex + 1);
    }
  };

  return find(numbersList, 25, 25);
}

function runPartB() {
  const fileData = readFile("09", "b") as string[];
  const numbersList = fileData.map((line) => Number.parseInt(line, 10));

  const findSum = (
    sum,
    numbersList: number[],
    previous: number[]
  ): number[] => {
    const previousSum = previous.reduce((prev, curr) => prev + curr, 0);
    if (numbersList.length <= 1 || previousSum > sum) {
      return [];
    } else {
      const [firstNumber, ...remainingNubmers] = numbersList;
      if (firstNumber + previousSum === sum) {
        return [...previous, firstNumber];
      } else {
        return findSum(sum, remainingNubmers, [...previous, firstNumber]);
      }
    }
  };

  const find = (numberToFind, numbersList, currentIndex: number): number[] => {
    const searchNumbersList = numbersList.slice(currentIndex);
    const foundSum = findSum(numberToFind, searchNumbersList, []);
    if (foundSum.length === 0) {
      return find(numberToFind, numbersList, currentIndex + 1);
    } else {
      return foundSum;
    }
  };

  const foundRange = find(2089807806, numbersList, 0).sort((a, b) => a - b);
  return foundRange.shift() + foundRange.pop();
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
