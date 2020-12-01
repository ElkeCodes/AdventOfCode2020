import { readFileSync } from "fs";

export default function readFile(day: string, part: "a" | "b"): string[] {
  return readFileSync(`days/${day}/${day}${part}.txt`, { encoding: "utf8" }).toString().split("\n");
}
