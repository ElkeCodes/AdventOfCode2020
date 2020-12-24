"use strict";

import readFile from "../../utils/readFile";

type Coordinate = { x: number; y: number; z: number };
const deltas = new Map<string, Coordinate>([
  ["e", { x: 1, y: -1, z: 0 }],
  ["se", { x: 0, y: -1, z: 1 }],
  ["sw", { x: -1, y: 0, z: 1 }],
  ["w", { x: -1, y: 1, z: 0 }],
  ["nw", { x: 0, y: 1, z: -1 }],
  ["ne", { x: 1, y: 0, z: -1 }],
]);

const getKey = ({ x, y, z }): string => `${x},${y},${z}`;

const getCoordsFromKey = (coordinate: string): Coordinate => ({
  x: Number.parseInt(coordinate.split(",")[0]),
  y: Number.parseInt(coordinate.split(",")[1]),
  z: Number.parseInt(coordinate.split(",")[2]),
});

const calculateBlackTiles = (tiles: Map<string, boolean>): number =>
  Array.from(tiles).reduce(
    (prev, [_, blackSideUp]) => prev + (blackSideUp ? 1 : 0),
    0
  );

const flipTile = (tileInstructions: string, tiles) => {
  const inner = (tileInstructions: string, { x, y, z }: Coordinate) => {
    if (tileInstructions.length === 0) {
      const tileToFlipKey = getKey({ x, y, z });
      if (tiles.has(tileToFlipKey)) {
        tiles.set(tileToFlipKey, !tiles.get(tileToFlipKey));
      } else {
        tiles.set(tileToFlipKey, true);
      }
    } else {
      const takeAmount =
        tileInstructions.startsWith("e") || tileInstructions.startsWith("w")
          ? 1
          : 2;
      const delta = deltas.get(tileInstructions.substr(0, takeAmount));
      return inner(tileInstructions.substr(takeAmount), {
        x: x + delta.x,
        y: y + delta.y,
        z: z + delta.z,
      });
    }
  };
  return inner(tileInstructions, { x: 0, y: 0, z: 0 });
};

const flipTiles = (tilesInstructions: string[], tiles) => {
  if (tilesInstructions.length === 0) {
    return tiles;
  } else {
    const [
      firstTileInstructions,
      ...otherTilesInstructions
    ] = tilesInstructions;
    flipTile(firstTileInstructions, tiles);
    return flipTiles(otherTilesInstructions, tiles);
  }
};

function runPartA() {
  const directions = readFile("24", "a") as string[];
  const tiles = new Map<string, boolean>();

  return calculateBlackTiles(flipTiles(directions, tiles));
}

function runPartB() {
  const directions = readFile("24", "b") as string[];
  let tiles = new Map<string, boolean>();

  function* getNeighbours({ x, y, z }: Coordinate) {
    for (let { x: deltaX, y: deltaY, z: deltaZ } of deltas.values()) {
      yield { x: x + deltaX, y: y + deltaY, z: z + deltaZ };
    }
  }

  flipTiles(directions, tiles);
  let blacks = new Map<string, boolean>(
    Array.from(tiles).filter(([_, isBlack]) => isBlack)
  );
  
  for (let day = 1; day <= 100; day++) {
    const newBlacks = new Map<string, boolean>();
    const toCheck: Coordinate[] = [];
    for (let [tileKey] of blacks) {
      for (let neighbour of getNeighbours(getCoordsFromKey(tileKey))) {
        toCheck.push(neighbour);
      }
    }
    for (let check of toCheck) {
      let blackNeighbours: number = 0;
      for (let neighbour of getNeighbours(check)) {
        if (blacks.has(getKey(neighbour))) {
          blackNeighbours++;
        }
      }
      if (
        blacks.has(getKey(check)) &&
        (blackNeighbours === 1 || blackNeighbours === 2)
      ) {
        newBlacks.set(getKey(check), true);
      } else if (!blacks.has(getKey(check)) && blackNeighbours === 2) {
        newBlacks.set(getKey(check), true);
      }
    }
    blacks = newBlacks;
  }

  return calculateBlackTiles(blacks);
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
