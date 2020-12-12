import readFile from "../../utils/readFile";

enum Direction {
  NORTH = "N",
  EAST = "E",
  SOUTH = "S",
  WEST = "W",
}

type Position = Map<Direction, number>;

type WayPoint = {
  first: [Direction, number];
  second: [Direction, number];
  third: [Direction, number];
  fourth: [Direction, number];
};

const turnRight = (direction: Direction, amount: number): Direction => {
  if (amount <= 0) {
    return direction;
  } else {
    switch (direction) {
      case Direction.NORTH:
        return turnRight(Direction.EAST, amount - 90);
      case Direction.EAST:
        return turnRight(Direction.SOUTH, amount - 90);
      case Direction.SOUTH:
        return turnRight(Direction.WEST, amount - 90);
      case Direction.WEST:
        return turnRight(Direction.NORTH, amount - 90);
    }
  }
};

const turnLeft = (direction: Direction, amount: number): Direction => {
  if (amount <= 0) {
    return direction;
  } else {
    switch (direction) {
      case Direction.NORTH:
        return turnLeft(Direction.WEST, amount - 90);
      case Direction.WEST:
        return turnLeft(Direction.SOUTH, amount - 90);
      case Direction.SOUTH:
        return turnLeft(Direction.EAST, amount - 90);
      case Direction.EAST:
        return turnLeft(Direction.NORTH, amount - 90);
    }
  }
};

const turnWayPoint = (
  wayPoint: WayPoint,
  amount: number,
  turn: Function
): WayPoint => {
  if (amount <= 0) {
    return wayPoint;
  } else {
    return turnWayPoint(
      {
        first: [turn(wayPoint.first[0], 90), wayPoint.first[1]],
        second: [turn(wayPoint.second[0], 90), wayPoint.second[1]],
        third: [turn(wayPoint.third[0], 90), wayPoint.third[1]],
        fourth: [turn(wayPoint.fourth[0], 90), wayPoint.fourth[1]],
      },
      amount - 90,
      turn
    );
  }
};

function runPartA() {
  const directions: any[] = (readFile("12", "a") as string[]).map((row) => {
    const matches = row.match(/(?<direction>\w)(?<amount>\d+)/);
    return {
      direction: matches.groups.direction,
      amount: Number.parseInt(matches.groups.amount),
    };
  });

  const move = (moves, position: Position, direction: Direction): Position => {
    if (moves.length === 0) {
      return position;
    } else {
      const [currentMove, ...remainingMoves] = moves;
      switch (currentMove.direction) {
        case "F":
          return move(
            remainingMoves,
            position.set(
              direction,
              position.get(direction) + currentMove.amount
            ),
            direction
          );
        case "N":
        case "E":
        case "S":
        case "W":
          return move(
            remainingMoves,
            position.set(
              currentMove.direction,
              position.get(currentMove.direction) + currentMove.amount
            ),
            direction
          );
        case "R":
          return move(
            remainingMoves,
            position,
            turnRight(direction, currentMove.amount)
          );
        case "L":
          return move(
            remainingMoves,
            position,
            turnLeft(direction, currentMove.amount)
          );
      }
      return move(remainingMoves, position, direction);
    }
  };

  const result = move(
    directions,
    new Map<Direction, number>([
      [Direction.NORTH, 0],
      [Direction.EAST, 0],
      [Direction.SOUTH, 0],
      [Direction.WEST, 0],
    ]),
    Direction.EAST
  );

  return (
    Math.abs(result.get(Direction.NORTH) - result.get(Direction.SOUTH)) +
    Math.abs(result.get(Direction.EAST) - result.get(Direction.WEST))
  );
}

function runPartB() {
  const directions: any[] = (readFile("12", "b") as string[]).map((row) => {
    const matches = row.match(/(?<direction>\w)(?<amount>\d+)/);
    return {
      direction: matches.groups.direction,
      amount: Number.parseInt(matches.groups.amount),
    };
  });

  const move = (moves, position: Position, wayPoint: WayPoint): Position => {
    if (moves.length === 0) {
      return position;
    } else {
      const [currentMove, ...remainingMoves] = moves;
      switch (currentMove.direction) {
        case "F":
          return move(
            remainingMoves,
            position
              .set(
                wayPoint.first[0],
                position.get(wayPoint.first[0]) +
                  wayPoint.first[1] * currentMove.amount
              )
              .set(
                wayPoint.second[0],
                position.get(wayPoint.second[0]) +
                  wayPoint.second[1] * currentMove.amount
              )
              .set(
                wayPoint.third[0],
                position.get(wayPoint.third[0]) +
                  wayPoint.third[1] * currentMove.amount
              )
              .set(
                wayPoint.fourth[0],
                position.get(wayPoint.fourth[0]) +
                  wayPoint.fourth[1] * currentMove.amount
              ),
            wayPoint
          );
        case "N":
        case "E":
        case "S":
        case "W":
          return move(remainingMoves, position, {
            first:
              wayPoint.first[0] === currentMove.direction
                ? [wayPoint.first[0], wayPoint.first[1] + currentMove.amount]
                : wayPoint.first,
            second:
              wayPoint.second[0] === currentMove.direction
                ? [wayPoint.second[0], wayPoint.second[1] + currentMove.amount]
                : wayPoint.second,
            third:
              wayPoint.third[0] === currentMove.direction
                ? [wayPoint.third[0], wayPoint.third[1] + currentMove.amount]
                : wayPoint.third,
            fourth:
              wayPoint.fourth[0] === currentMove.direction
                ? [wayPoint.fourth[0], wayPoint.fourth[1] + currentMove.amount]
                : wayPoint.fourth,
          });
        case "R":
          return move(
            remainingMoves,
            position,
            turnWayPoint(wayPoint, currentMove.amount, turnRight)
          );
        case "L":
          return move(
            remainingMoves,
            position,
            turnWayPoint(wayPoint, currentMove.amount, turnLeft)
          );
      }
      return move(remainingMoves, position, wayPoint);
    }
  };

  const result = move(
    directions,
    new Map<Direction, number>([
      [Direction.NORTH, 0],
      [Direction.EAST, 0],
      [Direction.SOUTH, 0],
      [Direction.WEST, 0],
    ]),
    {
      first: [Direction.NORTH, 1],
      second: [Direction.EAST, 10],
      third: [Direction.SOUTH, 0],
      fourth: [Direction.WEST, 0],
    }
  );

  return (
    Math.abs(result.get(Direction.NORTH) - result.get(Direction.SOUTH)) +
    Math.abs(result.get(Direction.EAST) - result.get(Direction.WEST))
  );
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
