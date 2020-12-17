import readFile from "../../utils/readFile";

interface Cube {
  x: number;
  y: number;
  z: number;
  w?: number;
  active: boolean;
}

const getKey = ({ x, y, z, w }: Cube): string => `${x},${y},${z},${w}`;

const countActiveNeighbours = (
  cubes: Map<string, Cube>,
  { x, y, z, w }: { x: number; y: number; z: number; w: number },
  delta: number
): number => {
  let result = 0;
  for (let testCube of expanded(x, y, z, w, delta)) {
    const key = getKey(testCube);
    if (cubes.has(key) && key !== getKey({ x, y, z, w, active: false })) {
      result += cubes.get(key).active ? 1 : 0;
    }
  }
  return result;
};

function* expanded(
  oldX: number,
  oldY: number,
  oldZ: number,
  oldW: number,
  delta: number
) {
  for (let x = oldX - 1; x <= oldX + 1; x++) {
    for (let y = oldY - 1; y <= oldY + 1; y++) {
      for (let z = oldZ - 1; z <= oldZ + 1; z++) {
        for (let w = oldW - delta; w <= oldW + delta; w++) {
          yield { x, y, z, w, active: false };
        }
      }
    }
  }
}

const cycle = (
  cubes: Map<string, Cube>,
  amount: number,
  createExpanded: Function
): number => {
  const inner = (
    cubes: Map<string, Cube>,
    delta: number
  ): Map<string, Cube> => {
    if (delta === amount) {
      return cubes;
    } else {
      const newCubes = new Map<string, Cube>();
      for (const [key, cube] of cubes) {
        for (let newCube of createExpanded(cube)) {
          if (newCubes.has(getKey(newCube))) {
            continue;
          }
          const activeNeighbours = countActiveNeighbours(cubes, newCube, 1);
          const oldCube = cubes.get(getKey(newCube)) || {
            ...newCube,
            active: false,
          };
          if (
            oldCube.active &&
            (activeNeighbours === 2 || activeNeighbours === 3)
          ) {
            newCubes.set(getKey(newCube), {
              ...newCube,
              active: true,
            });
          } else if (!oldCube.active && activeNeighbours === 3) {
            newCubes.set(getKey(newCube), {
              ...newCube,
              active: true,
            });
          }
        }
      }
      return inner(newCubes, delta + 1);
    }
  };

  return Array.from(inner(cubes, 0))
    .map(([_, cube]) => cube)
    .reduce((prev, cube) => prev + (cube.active ? 1 : 0), 0);
};

const parse = (data: string[]): Map<string, Cube> => {
  let cubes: Map<string, Cube> = new Map();
  data
    .map((line: string, y: number) =>
      line.split("").map(
        (state, x): Cube => ({
          x,
          y,
          z: 0,
          w: 0,
          active: state === "#",
        })
      )
    )
    .reduce((acc, val) => acc.concat(val), [])
    .forEach((cube) => cubes.set(getKey(cube), cube));
  return cubes;
};

const runPartA = () =>
  cycle(parse(readFile("17", "a") as string[]), 6, (cube: Cube) =>
    expanded(cube.x, cube.y, cube.z, 0, 0)
  );

const runPartB = () =>
  cycle(parse(readFile("17", "b") as string[]), 6, (cube: Cube) =>
    expanded(cube.x, cube.y, cube.z, cube.w, 1)
  );

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
