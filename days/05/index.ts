import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("05", "a") as string[];

  const seatIDs = fileData.map((boardingPass) => {
    let row = 0;
    for (let i = 64, j = 0; i >= 1; i /= 2, j++) {
      if (boardingPass[j] === "B") {
        row += i;
      }
    }

    let column = 0;
    for (let i = 4, j = 7; i >= 1; i /= 2, j++) {
      if (boardingPass[j] === "R") {
        column += i;
      }
    }

    return row * 8 + column;
  });

  return seatIDs.reduce((previous, current) => Math.max(previous, current), 0);
}

function runPartB() {
  const fileData = readFile("05", "b") as string[];

  const seatIDs = fileData.map((boardingPass) => {
    let row = 0;
    for (let i = 64, j = 0; i >= 1; i /= 2, j++) {
      if (boardingPass[j] === "B") {
        row += i;
      }
    }

    let column = 0;
    for (let i = 4, j = 7; i >= 1; i /= 2, j++) {
      if (boardingPass[j] === "R") {
        column += i;
      }
    }

    return row * 8 + column;
  });

  return (
    seatIDs
      .sort()
      .find(
        (id, index, ids) =>
          index !== 0 &&
          index !== ids.length - 1 &&
          id - ids[index - 1] !== 1
      ) - 1
  );
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`); // 633
