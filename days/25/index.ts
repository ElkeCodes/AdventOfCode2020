"use strict";

import readFile from "../../utils/readFile";

function runPartA() {
  const keys = (readFile("25", "a") as string[]).map((key) =>
    Number.parseInt(key)
  );

  const transform = (value, subjectNumber) =>
    (value * subjectNumber) % 20201227;

  const findLoopSize = (key: number): number => {
    let size = 0;
    let subjectNumber = 1;
    while (true) {
      if (subjectNumber === key) {
        return size;
      }
      subjectNumber = transform(subjectNumber, 7);
      size++;
    }
  };

  const encrypt = (
    originalSubjectNumber: number,
    maxLoopSize: number
  ): number => {
    let subjectNumber = 1;
    for (let loopSize = 0; loopSize < maxLoopSize; loopSize++) {
      subjectNumber = transform(subjectNumber, originalSubjectNumber);
    }
    return subjectNumber;
  };

  return encrypt(keys[0], findLoopSize(keys[1]));
}

function runPartB() {
  //   const directions = readFile("25", "b") as string[];
}

console.log(`Solution part A: ${runPartA()}`);
// console.log(`Solution part B: ${runPartB()}`);
