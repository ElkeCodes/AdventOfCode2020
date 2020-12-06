import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("06", "a", false) as string;
  const cleanedFileData = fileData
    .replace(/\n\n/g, ";")
    .replace(/\n/g, "")
    .split(";");

  const count = (groups: string[]) => {
    if (groups.length == 0) {
      return 0;
    } else {
      const [groupAnswers, ...remainingGroups] = groups;
      return (
        groupAnswers.split("").filter(function (answer, index, group) {
          return group.indexOf(answer) === index;
        }).length + count(remainingGroups)
      );
    }
  };

  return count(cleanedFileData);
}

function runPartB() {
  const fileData = readFile("06", "b", false) as string;

  const cleanedFileData = fileData
    .replace(/\n\n/g, ";")
    .replace(/\n/g, "-")
    .split(";");

  const unique = (array1: string[], array2: string[]): string[] => {
    return array1.filter((value) => array2.indexOf(value) > -1);
  };

  const count = (groups: string[]) => {
    if (groups.length == 0) {
      return 0;
    } else {
      const [groupAnswers, ...remainingGroups] = groups;
      const [firstAnswer, ...remainingAnswers] = groupAnswers.split("-");

      if (remainingAnswers.length === 0) {
        return firstAnswer.length + count(remainingGroups);
      } else {
        return (
          remainingAnswers.reduce((previousAnswer, currentAnswer) => {
            const newCurrentAnswer = currentAnswer.split("");
            return unique(newCurrentAnswer, previousAnswer);
          }, firstAnswer.split("")).length + count(remainingGroups)
        );
      }
    }
  };

  return count(cleanedFileData);
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
