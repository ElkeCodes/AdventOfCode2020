import { create } from "ts-node";
import readFile from "../../utils/readFile";

enum InstructionType {
  Mask,
  Value,
}

type Instruction = {
  type: InstructionType;
  address?: bigint;
  value?: bigint;
  ones?: bigint;
  zeroes?: bigint;
  mask?: string;
};

function runPartA() {
  const data: string[] = readFile("14", "a") as string[];
  const program: Instruction[] = data.map((row: string) => {
    if (row.startsWith("mask = ")) {
      const mask = row.substr(7);
      const onesMask = BigInt("0b" + mask.replace(/X/g, "0")); // or
      const zeroesMask = BigInt("0b" + mask.replace(/X/g, "1")); // and
      return {
        type: InstructionType.Mask,
        ones: onesMask,
        zeroes: zeroesMask,
      };
    } else {
      const matches = row.match(/mem\[(?<address>\d+)\] = (?<value>\d+)/);
      return {
        type: InstructionType.Value,
        address: BigInt(matches.groups.address),
        value: BigInt(matches.groups.value),
      };
    }
  });

  const run = (program: Instruction[], memory: Map<bigint, bigint>, mask) => {
    if (program.length === 0) {
      return Array.from(memory.values()).reduce(
        (previous, current) => previous + current,
        BigInt(0)
      );
    } else {
      const [instruction, ...restProgram] = program;
      if (instruction.type === InstructionType.Mask) {
        return run(restProgram, memory, {
          ones: instruction.ones,
          zeroes: instruction.zeroes,
        });
      } else {
        memory.set(
          instruction.address,
          (instruction.value & mask.zeroes) | mask.ones
        );
        return run(restProgram, memory, mask);
      }
    }
  };

  return run(program, new Map<bigint, bigint>(), BigInt(0));
}

function runPartB() {
  const data: string[] = readFile("14", "b") as string[];

  const createMasks = (baseMask: string, address: string): bigint[] => {
    const inner = (baseMask, build, address) => {
      if (baseMask.length === 0) {
        return build;
      } else {
        const firstBit = baseMask[0];
        const firstAddressBit = address[0];
        const remainingMask = baseMask.substr(1);
        const remainingAddress = address.substr(1);
        if (firstBit === "1" || firstBit === "0") {
          return inner(
            remainingMask,
            build + (firstBit === "0" ? firstAddressBit : "1"),
            remainingAddress
          );
        } else {
          return [
            inner(remainingMask, build + "1", remainingAddress),
            inner(remainingMask, build + "0", remainingAddress),
          ];
        }
      }
    };
    return inner(baseMask, "", address)
      .flat(Infinity)
      .map((x) => BigInt("0b" + x));
  };

  const program: Instruction[] = data.map((row: string) => {
    if (row.startsWith("mask = ")) {
      const mask = row.substr(7);
      return {
        type: InstructionType.Mask,
        mask,
      };
    } else {
      const matches = row.match(/mem\[(?<address>\d+)\] = (?<value>\d+)/);
      return {
        type: InstructionType.Value,
        address: BigInt(matches.groups.address),
        value: BigInt(matches.groups.value),
      };
    }
  });

  const run = (
    program: Instruction[],
    memory: Map<bigint, bigint>,
    mask: string
  ) => {
    if (program.length === 0) {
      return Array.from(memory.values()).reduce(
        (previous, current) => previous + current,
        BigInt(0)
      );
    } else {
      const [instruction, ...restProgram] = program;
      if (instruction.type === InstructionType.Mask) {
        return run(restProgram, memory, instruction.mask);
      } else {
        createMasks(mask, instruction.address.toString(2).padStart(36, "0")).forEach((mask: bigint) => {
          memory.set(
			mask,
            instruction.value as bigint
          );
        });
        return run(restProgram, memory, mask);
      }
    }
  };

  return run(program, new Map<bigint, bigint>(), "");
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
