import readFile from "../../utils/readFile";

interface Instruction {
  operator: string;
  effect: number;
}

function runPartA() {
  const fileData = readFile("08", "a") as string[];
  const instructions = fileData.map(
    (instruction): Instruction => {
      const matches = instruction.match(
        /(?<operator>(nop|acc|jmp)) (?<effect>(\+|-)\d+)/
      );
      return {
        operator: matches.groups.operator,
        effect: Number.parseInt(matches.groups.effect, 10),
      };
    }
  );

  const run = (
    currentIndex: number,
    accumulator: number,
    visitedIndexes: number[]
  ): number => {
    if (visitedIndexes.includes(currentIndex)) {
      return accumulator;
    } else {
      const instruction: Instruction = instructions[currentIndex];
      const newVisitedIndexes = [currentIndex, ...visitedIndexes];
      switch (instruction.operator) {
        case "nop":
          return run(currentIndex + 1, accumulator, newVisitedIndexes);
        case "acc":
          return run(
            currentIndex + 1,
            accumulator + instruction.effect,
            newVisitedIndexes
          );
        case "jmp":
          return run(
            currentIndex + instruction.effect,
            accumulator,
            newVisitedIndexes
          );
      }
    }
  };

  return run(0, 0, []);
}

function runPartB() {
  const fileData = readFile("08", "b") as string[];
  const instructions = fileData.map(
    (instruction): Instruction => {
      const matches = instruction.match(
        /(?<operator>(nop|acc|jmp)) (?<effect>(\+|-)\d+)/
      );
      return {
        operator: matches.groups.operator,
        effect: Number.parseInt(matches.groups.effect, 10),
      };
    }
  );

  const run = (
    instructions: Instruction[],
    currentIndex: number,
    accumulator: number,
    visitedIndexes: number[]
  ): number => {
    if (visitedIndexes.includes(currentIndex)) {
      return 0;
    } else if (currentIndex === instructions.length) {
      return accumulator;
    } else {
      const instruction = instructions[currentIndex];
      const newVisitedIndexes = [currentIndex, ...visitedIndexes];
      switch (instruction.operator) {
        case "nop":
          return run(
            instructions,
            currentIndex + 1,
            accumulator,
            newVisitedIndexes
          );
        case "acc":
          return run(
            instructions,
            currentIndex + 1,
            accumulator + instruction.effect,
            newVisitedIndexes
          );
        case "jmp":
          return run(
            instructions,
            currentIndex + instruction.effect,
            accumulator,
            newVisitedIndexes
          );
      }
    }
  };

  const buildNewInstructions = (
    instructions: Instruction[],
    startIndex: number
  ): Instruction[] => {
	const instruction = instructions[startIndex];
    if (instruction.operator === "nop") {
      instructions[startIndex] = {
        operator: "jmp",
        effect: instruction.effect,
      };
      return instructions;
    }
    if (instruction.operator === "jmp") {
      instructions[startIndex] = {
        operator: "nop",
        effect: instruction.effect,
      };
      return instructions;
    }
    return buildNewInstructions(instructions, startIndex + 1);
  };

  let startIndex = 0;
  let result = 0;
  do {
	result = run(buildNewInstructions([...instructions], startIndex), 0, 0, []);
	startIndex++;
  } while (result === 0 && startIndex < instructions.length);

  return result;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
