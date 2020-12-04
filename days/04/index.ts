import readFile from "../../utils/readFile";

function runPartA() {
  const fileData = readFile("04", "a", false) as string;

  const cleanedFileData = fileData
    .replace(/\n\n/g, ";")
    .replace(/\n/g, " ")
    .split(";");

  return cleanedFileData
    .map((line) => new RegExp(
        /^((?=(?<cid>cid:\S+)?)(?=.*(?<pid>pid:\S+)+)(?=.*(?<eyr>eyr:\S+)+)(?=.*(?<hgt>hgt:\S+)+)(?=.*(?<iyr>iyr:\S+)+)(?=.*(?<ecl>ecl:\S+))+(?=.*(?<hcl>hcl:\S+)+)(?=.*(?<byr>byr:\S+)+))/gim
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
          /^((?=(?<cid>cid:\S+)?)(?=.*(?<pid>pid:\d{9}\b)+)(?=.*(?<eyr>eyr:20(2[0-9]|30))+)(?=.*(?<hgt>hgt:(1([5-8][0-9]|9[0-3])cm|(59|6[0-9]|7[0-6])in))+)(?=.*(?<iyr>iyr:20(1[0-9]|20))+)(?=.*(?<ecl>ecl:(amb|blu|brn|gry|grn|hzl|oth)))+(?=.*(?<hcl>hcl:\#[0-9a-f]{6}\b)+)(?=.*(?<byr>byr:(19[2-9][0-9]|200[0-2]))+))/gim
        ).exec(line)
    )
    .filter((valid) => !!valid).length;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
