import readFile from "../../utils/readFile";

function runPartA() {
  const data: any[] = readFile("13", "a") as string[];
  const earliestDepartingTime = Number.parseInt(data[0]);
  const busIDs = data[1].match(/(\d+)/g).map((id) => Number.parseInt(id));

  const nextBusDepartingTimes = busIDs.map((id) => ({
    id,
    time: Math.ceil(earliestDepartingTime / id) * id,
  }));
  const nextBus = nextBusDepartingTimes.sort((bus1, bus2) =>
    bus1.time > bus2.time ? 1 : -1
  )[0];

  return nextBus.id * (nextBus.time - earliestDepartingTime);
}

function runPartB() {
  const data: any[] = readFile("13", "b") as string[];
  const busses: [number, number][] = data[1]
    .split(",")
    .map((busDepartingTime, index) => [parseInt(busDepartingTime, 10), index])
    .filter(([busDepartingTime]) => !Number.isNaN(busDepartingTime));

  let multiplier = busses[0][0];
  return busses.slice(1).reduce((previousResult, [busDepartingTime, busIndex]) => {
    while (true) {
      if ((previousResult + busIndex) % busDepartingTime === 0) {
        multiplier *= busDepartingTime;
        break;
      }
      previousResult += multiplier;
    }
    return previousResult;
  }, 0);
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
