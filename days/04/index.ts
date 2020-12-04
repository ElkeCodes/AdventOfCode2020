import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("04", "a", false) as string;

  const cleanedFileData = fileData
    .replace(/\n\n/g, ";")
    .replace(/\n/g, " ")
    .split(";");

  return cleanedFileData
    .map((line) => new RegExp(
        /^((?=(cid:\S+)?)(?=.*(pid:\S+)+)(?=.*(eyr:\S+)+)(?=.*(hgt:\S+)+)(?=.*(iyr:\S+)+)(?=.*(ecl:\S+))+(?=.*(hcl:\S+)+)(?=.*(byr:\S+)+))/gim
      ).exec(line))
    .filter((valid) => !!valid).length;
}

function runPartB() {
  const fileData = readFile("04", "b", false) as string;

  const cleanedFileData = fileData
    .replace(/\n\n/g, ";")
    .replace(/\n/g, " ")
    .split(";");

  return cleanedFileData
    .map(
      (line) => new RegExp(
          /^((?=(cid:\S+)?)(?=.*(pid:\d{9}\b)+)(?=.*(eyr:20(2[0-9]|30))+)(?=.*(hgt:(1([5-8][0-9]|9[0-3])cm|(59|6[0-9]|7[0-6])in))+)(?=.*(iyr:20(1[0-9]|20))+)(?=.*(ecl:(amb|blu|brn|gry|grn|hzl|oth)))+(?=.*(hcl:\#[0-9a-f]{6}\b)+)(?=.*(byr:(19[2-9][0-9]|200[0-2]))+))/gim
        ).exec(line)
    )
    .filter((valid) => !!valid).length;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
