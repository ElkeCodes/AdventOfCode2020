import readFile from "../../utils/readFile";

const between = (min: number, max: number, amount: number) =>
  min <= amount && amount <= max;

function runPartA() {
  const fileData = readFile("02", "a");
  const data = fileData.filter((line) => {
    const [_, min, max, match, value] =
      line.match(/(\d+)-(\d+) (\w): (\w*)/) || [];
    return between(
      Number.parseInt(min),
      Number.parseInt(max),
      (value.match(new RegExp(match, "g")) || []).length
    );
  });
  return data.length;
}

function runPartB() {
  const fileData = readFile("02", "b");
  const data = fileData.filter((line) => {
    const [_, first, second, match, value] =
      line.match(/(\d+)-(\d+) (\w): (\w*)/) || [];
    return (
      (value[Number.parseInt(first) - 1] === match) !==
      (value[Number.parseInt(second) - 1] === match)
    );
  });
  return data.length;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
