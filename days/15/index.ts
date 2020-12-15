import readFile from "../../utils/readFile";

function runPartA() {
  const data: string = readFile("15", "a", false) as string;
  const numbers = data.split(",").map((n) => Number.parseInt(n));

  const loop = (endTurn: number, startingNumbers: number[]): number => {
    const inner = (
      turn: number,
      previousNumbers: Map<number, number[]>,
      lastNumberSpoken: number
    ): number => {
      if (turn === endTurn + 1) {
        return lastNumberSpoken;
      } else {
        const lastNubmerOccurences: number[] =
          previousNumbers.get(lastNumberSpoken) || [];
        if (lastNubmerOccurences.length === 0) {
          previousNumbers.set(lastNumberSpoken, [turn]);
          return inner(turn + 1, previousNumbers, 0);
        } else if (lastNubmerOccurences.length === 1) {
          previousNumbers.set(0, [turn, ...(previousNumbers.get(0) || [])]);
          return inner(turn + 1, previousNumbers, 0);
        } else {
          const newNumber = lastNubmerOccurences[0] - lastNubmerOccurences[1];
          previousNumbers.set(newNumber, [
            turn,
            ...(previousNumbers.get(newNumber) || []),
          ]);
          return inner(turn + 1, previousNumbers, newNumber);
        }
      }
    };

    const previousNumbers = new Map<number, number[]>(
      startingNumbers.map((n, index) => [n, [index + 1]])
    );
    const lastNumberSpoken = startingNumbers[startingNumbers.length - 1];
    return inner(previousNumbers.size + 1, previousNumbers, lastNumberSpoken);
  };

  return loop(2020, numbers);
}

function runPartB() {
  const data: string = readFile("15", "b", false) as string;
  const startingNumbers = data.split(",").map((n) => Number.parseInt(n));

  const previousNumbers = new Map<number, number[]>(
    startingNumbers.map((n, index) => [n, [index + 1]])
  );
  let lastNumberSpoken = startingNumbers[startingNumbers.length - 1];
  for (let turn = startingNumbers.length + 1; turn <= 30000000; turn++) {
    const lastNubmerOccurences: number[] =
      previousNumbers.get(lastNumberSpoken) || [];
    if (lastNubmerOccurences.length === 0) {
      previousNumbers.set(lastNumberSpoken, [turn]);
      lastNumberSpoken = 0;
    } else if (lastNubmerOccurences.length === 1) {
      previousNumbers.set(
        0,
        [turn, ...(previousNumbers.get(0) || [])].slice(0, 2)
      );
      lastNumberSpoken = 0;
    } else {
      const newNumber = lastNubmerOccurences[0] - lastNubmerOccurences[1];
      previousNumbers.set(
        newNumber,
        [turn, ...(previousNumbers.get(newNumber) || [])].slice(0, 2)
      );
      lastNumberSpoken = newNumber;
    }
  }
  return lastNumberSpoken;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
