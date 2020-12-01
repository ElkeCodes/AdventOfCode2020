import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("01", "a");
  const data = fileData.map((value) => Number.parseInt(value));

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[i] + data[j] === 2020) {
        return data[i] * data[j];
      }
    }
  }
}

function runPartB() {
  const fileData = readFile("01", "b");
  const data = fileData.map((value) => Number.parseInt(value));

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      for (let k = 0; k < data.length; k++) {
        if (data[i] + data[j] + data[k] === 2020) {
          return data[i] * data[j] * data[k];
        }
      }
    }
  }
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
