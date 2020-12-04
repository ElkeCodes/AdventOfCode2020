import { readFileSync } from "fs";

export default function readFile(
  day: string,
  part: "a" | "b",
  split: boolean = true
): string[] | string {
  const contents = readFileSync(`days/${day}/${day}${part}.txt`, {
    encoding: "utf8",
  }).toString();
  return split ? contents.split("\n") : contents;
}
