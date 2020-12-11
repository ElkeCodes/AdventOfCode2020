import readFile from "../../utils/readFile";

const OCCUPIED = "#";
const EMPTY = "L";
const FLOOR = ".";

type Comparator = (seats: string[][], x: number, y: number) => boolean;

function runPartA() {
  const seats: string[][] = (readFile("11", "a") as string[]).map((row) =>
    row.split("")
  );

  const seatRowsAmount = seats.length;
  const seatColumnsAmount = seats[0].length;

  const isOccupied: Comparator = (seats, x, y): boolean =>
    seats[y][x] === OCCUPIED;
  const isEmpty: Comparator = (seats, x, y): boolean => seats[y][x] === EMPTY;

  const seatsAround = (x, y): number[][] => {
    let allSeatsAround = [];
    for (let row = y - 1; row <= y + 1; row++) {
      for (let column = x - 1; column <= x + 1; column++) {
        allSeatsAround = [...allSeatsAround, [column, row]];
      }
    }
    return allSeatsAround;
  };

  const countAround = (seats, x, y, comparator: Comparator) =>
    seatsAround(x, y)
      .filter(
        (seat) =>
          seat[0] >= 0 &&
          seat[0] < seatColumnsAmount &&
          seat[1] >= 0 &&
          seat[1] < seatRowsAmount &&
          !(seat[0] === x && seat[1] === y)
      )
      .reduce((count, seat) => {
        return count + (comparator(seats, seat[0], seat[1]) ? 1 : 0);
      }, 0);

  const isEqualSeatArrangement = (seats1, seats2) =>
    seats1.reduce(
      (prevRowCompare, currentRow, rowIndex) =>
        prevRowCompare &&
        currentRow.reduce(
          (prevColumnCompare, seatAssignment, columnIndex) =>
            prevColumnCompare &&
            seatAssignment === seats2[rowIndex][columnIndex],
          true
        ),
      true
    );

  const fill = (seats) => {
    let newSeats = [...seats.map((row) => [...row])];
    for (let row = 0; row < seatRowsAmount; row++) {
      for (let column = 0; column < seatColumnsAmount; column++) {
        if (
          isEmpty(seats, column, row) &&
          countAround(seats, column, row, isOccupied) === 0
        ) {
          newSeats[row][column] = OCCUPIED;
        } else if (
          isOccupied(seats, column, row) &&
          countAround(seats, column, row, isOccupied) >= 4
        ) {
          newSeats[row][column] = EMPTY;
        }
      }
    }

    if (isEqualSeatArrangement(seats, newSeats)) {
      return newSeats.reduce(
        (prevCountRow, row) =>
          prevCountRow +
          row.reduce(
            (prevCountColumn, seat) =>
              prevCountColumn + (seat === OCCUPIED ? 1 : 0),
            0
          ),
        0
      );
    } else {
      return fill(newSeats);
    }
  };

  return fill(seats);
}

function runPartB() {
  const seats: string[][] = (readFile("11", "b") as string[]).map((row) =>
    row.split("")
  );

  const seatRowsAmount = seats.length;
  const seatColumnsAmount = seats[0].length;

  const isOccupied: Comparator = (seats, x, y): boolean =>
    seats[y][x] === OCCUPIED;
  const isEmpty: Comparator = (seats, x, y): boolean => seats[y][x] === EMPTY;
  const isSeat: Comparator = (seats, x, y): boolean => seats[y][x] !== FLOOR;

  const seatsAround = (x, y): number[][] => {
    let allSeatsAround = [];

    for (
      let grow = 1;
      grow <= Math.max(seatColumnsAmount, seatRowsAmount);
      grow++
    ) {
      allSeatsAround = [
        ...allSeatsAround,
        [x - grow, y - grow],
        [x, y - grow],
        [x + grow, y - grow],
        [x - grow, y],
        [x + grow, y],
        [x - grow, y + grow],
        [x, y + grow],
        [x + grow, y + grow],
      ];
    }

    return allSeatsAround;
  };

  const countAround = (seats, x, y, comparator: Comparator) => {
    const checked = Array.from({ length: 8 }).fill(0);
    const orderedSeats = seatsAround(x, y);
    for (let i = 0; i < Math.floor(orderedSeats.length / 8); i++) {
      const seatsToCheck = orderedSeats
        .slice(i * 8, i * 8 + 8)
        .sort(
          (seat1, seat2) =>
            Math.abs(seat2[0] - seat1[0]) - Math.abs(seat2[1] - seat1[1])
        );
      for (let j = 0; j < 8; j++) {
        const seatToCheck = seatsToCheck[j];
        if (
          checked[j] === 0 &&
          seatToCheck[0] >= 0 &&
          seatToCheck[0] < seatColumnsAmount &&
          seatToCheck[1] >= 0 &&
          seatToCheck[1] < seatRowsAmount &&
          isSeat(seats, seatToCheck[0], seatToCheck[1])
        ) {
          checked[j] = comparator(seats, seatToCheck[0], seatToCheck[1])
            ? 1
            : -1;
        }
      }
    }
    return checked.reduce(
      (prev: number, curr: number) => prev + (curr > 0 ? 1 : 0),
      0
    );
  };

  const isEqualSeatArrangement = (seats1, seats2) =>
    seats1.reduce(
      (prevRowCompare, currentRow, rowIndex) =>
        prevRowCompare &&
        currentRow.reduce(
          (prevColumnCompare, seatAssignment, columnIndex) =>
            prevColumnCompare &&
            seatAssignment === seats2[rowIndex][columnIndex],
          true
        ),
      true
    );

  const fill = (seats) => {
    let newSeats = [...seats.map((row) => [...row])];
    for (let row = 0; row < seatRowsAmount; row++) {
      for (let column = 0; column < seatColumnsAmount; column++) {
        if (
          isEmpty(seats, column, row) &&
          countAround(seats, column, row, isOccupied) === 0
        ) {
          newSeats[row][column] = OCCUPIED;
        } else if (
          isOccupied(seats, column, row) &&
          countAround(seats, column, row, isOccupied) >= 5
        ) {
          newSeats[row][column] = EMPTY;
        }
      }
    }

    if (isEqualSeatArrangement(seats, newSeats)) {
      return newSeats.reduce(
        (prevCountRow, row) =>
          prevCountRow +
          row.reduce(
            (prevCountColumn, seat) =>
              prevCountColumn + (seat === OCCUPIED ? 1 : 0),
            0
          ),
        0
      );
    } else {
      return fill(newSeats);
    }
  };

  return fill(seats);
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
