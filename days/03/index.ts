import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("03", "a");

  const treeRowLength = fileData[0].length;
  const treeColumnLength = fileData.length;

  const countTrees = (currentRow: number, currentColumn: number): number => {
    if (currentRow >= treeColumnLength) {
      return 0;
    } else if (
      fileData[currentRow % treeColumnLength][currentColumn % treeRowLength] ===
      "#"
    ) {
      return 1 + countTrees(currentRow + 1, currentColumn + 3);
    } else {
      return countTrees(currentRow + 1, currentColumn + 3);
    }
  };

  return countTrees(1, 3);
}

function runPartB() {
  const fileData = readFile("03", "b");

  const treeRowLength = fileData[0].length;
  const treeColumnLength = fileData.length;

  const countTrees = (
    currentRow: number,
    currentColumn: number,
    amountRight: number,
    amountDown: number
  ): number => {
    if (currentRow >= treeColumnLength) {
      return 0;
    } else if (
      fileData[currentRow % treeColumnLength][currentColumn % treeRowLength] ===
      "#"
    ) {
      return (
        1 +
        countTrees(
          currentRow + amountDown,
          currentColumn + amountRight,
          amountRight,
          amountDown
        )
      );
    } else {
      return countTrees(
        currentRow + amountDown,
        currentColumn + amountRight,
        amountRight,
        amountDown
      );
    }
  };

  const pathsToCheck = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  return pathsToCheck.reduce(
    (previousValue, path, current): number =>
      previousValue *
      countTrees(0, 0, pathsToCheck[current][0], pathsToCheck[current][1]),
    1
  );
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
