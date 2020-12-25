import readFile from "../../utils/readFile";

enum Adjacency {
  NoFlipRight,
  NoFlipBottom,
  NoFlipLeft,
  NoFlipTop,
  FlipRight,
  FlipBottom,
  FlipLeft,
  FliptTop,
}

const deltas = new Map<Adjacency, { x: number; y: number; flipAxis: boolean }>([
  [Adjacency.NoFlipRight, { x: -1, y: 0, flipAxis: false }],
  [Adjacency.NoFlipBottom, { x: 0, y: 1, flipAxis: false }],
  [Adjacency.NoFlipLeft, { x: 1, y: 0, flipAxis: false }],
  [Adjacency.NoFlipTop, { x: 0, y: -1, flipAxis: false }],
  [Adjacency.FlipRight, { x: 0, y: -1, flipAxis: true }],
  [Adjacency.FlipBottom, { x: 1, y: 0, flipAxis: true }],
  [Adjacency.FlipLeft, { x: 0, y: 1, flipAxis: true }],
  [Adjacency.FliptTop, { x: -1, y: 0, flipAxis: true }],
]);

type Tile = { id: number; adjacencies: { id: number; type: Adjacency }[] };

function rotateRight(tile, dimensionX, dimensionY) {
  var rotatedTile = [];
  for (var i = 0; i < dimensionY; i++) {
    rotatedTile.push([]);
  }

  for (var i = 0; i < dimensionX; i++) {
    for (var j = 0; j < dimensionY; j++) {
      rotatedTile[j].unshift(tile[i][j]);
    }
  }

  return rotatedTile;
}

function flip(tile) {
  const dimensionX = tile[0].length;
  const dimensionY = tile.length;
  const flippedTile = [];
  for (let i = 0; i < dimensionX; i++) {
    flippedTile.push([]);
  }

  for (var i = 0; i < dimensionY; i++) {
    for (var j = 0; j < dimensionX; j++) {
      flippedTile[dimensionX - 1 - j].unshift(tile[i][j]);
    }
  }

  return flippedTile;
}

function transform(rotations, flips, tile) {
  while (rotations-- > 0) {
    tile = rotateRight(tile, tile[0].length, tile.length);
  }
  while (flips-- > 0) {
    tile = flip(tile);
  }
  return tile;
}

function rotate(tile, times) {
  if (times === 0) {
    return tile;
  } else {
    return rotate(rotateRight(tile, tile[0].length, tile.length), times - 1);
  }
}
const isLeftAdjacent = (tile1: boolean[][], tile2: boolean[][]): boolean => {
  return tile1.reduce(
    (prev, line, row) => prev && line[0] === tile2[row][9],
    true
  );
};

const isRightAdjacent = (tile1: boolean[][], tile2: boolean[][]): boolean => {
  return tile1.reduce(
    (prev, line, row) => prev && line[9] === tile2[row][0],
    true
  );
};

const isTopAdjacent = (tile1: boolean[][], tile2: boolean[][]): boolean => {
  return tile1[0].reduce(
    (prev, col, index) => prev && col === tile2[9][index],
    true
  );
};

const isBottomAdjacent = (tile1: boolean[][], tile2: boolean[][]): boolean => {
  return tile1[9].reduce(
    (prev, col, index) => prev && col === tile2[0][index],
    true
  );
};

const testAdjacent = (
  tile: boolean[][],
  testTile: boolean[][],
  testTileId: number
): {
  isAdjacent: boolean;
  adjacency: { id: number; type: Adjacency; rotations: number };
  newTile: { rotations: number; flips: number };
} => {
  for (let times = 0; times <= 3; times++) {
    if (isLeftAdjacent(rotate(testTile, times), tile)) {
      // if (isLeftAdjacent(tile, rotate(testTile, times))) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 0 },
        adjacency: {
          id: testTileId,
          type: Adjacency.NoFlipLeft,
          rotations: times,
        },
      };
    }
    if (isRightAdjacent(rotate(testTile, times), tile)) {
      // if (isRightAdjacent(tile, rotate(testTile, times))) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 0 },
        adjacency: {
          id: testTileId,
          type: Adjacency.NoFlipRight,
          rotations: times,
        },
      };
    }
    if (isTopAdjacent(rotate(testTile, times), tile)) {
      // if (isTopAdjacent(tile, rotate(testTile, times))) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 0 },
        adjacency: {
          id: testTileId,
          type: Adjacency.NoFlipTop,
          rotations: times,
        },
      };
    }
    if (isBottomAdjacent(rotate(testTile, times), tile)) {
      // if (isBottomAdjacent(tile, rotate(testTile, times))) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 0 },
        adjacency: {
          id: testTileId,
          type: Adjacency.NoFlipBottom,
          rotations: times,
        },
      };
    }
    if (isLeftAdjacent(flip(rotate(testTile, times)), tile)) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 1 },
        adjacency: {
          id: testTileId,
          type: Adjacency.FlipLeft,
          rotations: times,
        },
      };
    }
    if (isRightAdjacent(flip(rotate(testTile, times)), tile)) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 1 },
        adjacency: {
          id: testTileId,
          type: Adjacency.FlipRight,
          rotations: times,
        },
      };
    }
    if (isTopAdjacent(flip(rotate(testTile, times)), tile)) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 1 },
        adjacency: {
          id: testTileId,
          type: Adjacency.FliptTop,
          rotations: times,
        },
      };
    }
    if (isBottomAdjacent(flip(rotate(testTile, times)), tile)) {
      return {
        isAdjacent: true,
        newTile: { rotations: times, flips: 1 },
        adjacency: {
          id: testTileId,
          type: Adjacency.FlipBottom,
          rotations: times,
        },
      };
    }
  }
  return {
    isAdjacent: false,
    adjacency: null,
    newTile: null,
  };
};

const isCornerTile = (
  [cornerId, cornerTile],
  tiles: Map<number, boolean[][]>
): boolean => {
  return (
    Array.from(tiles.entries()).reduce((prev, [id, testTile]) => {
      if (id !== cornerId) {
        const { isAdjacent } = testAdjacent(cornerTile, testTile, id);
        if (isAdjacent) {
          return prev + 1;
        } else {
          return prev;
        }
      }
      return prev;
    }, 0) === 2
  );
};

const parse = (lines: string[]): { tiles: Map<number, boolean[][]> } => {
  const tiles = new Map<number, boolean[][]>();

  const parseTiles = (lines: string[]) => {
    if (lines.length === 0) {
      return tiles;
    } else {
      const [tileId, ...otherLines] = lines;
      const tileLines = otherLines.splice(0, 10);
      tiles.set(
        Number.parseInt(tileId.substr(5).split(":")[0]),
        tileLines.map((line) =>
          line.split("").map((character) => character === "#")
        )
      );
      return parseTiles(otherLines.slice(1));
    }
  };

  return { tiles: parseTiles(lines) };
};

function runPartA() {
  const { tiles } = parse(readFile("20", "a") as string[]);

  return Array.from(tiles.entries()).reduce(
    (prev, [tileId, tileContents]) =>
      prev * (isCornerTile([tileId, tileContents], tiles) ? tileId : 1),
    1
  );
}

function runPartB() {
  type TileEdge = boolean[];
  type TileVariant = boolean[][];
  type Tile = {
    variants: TileVariant[];
  };
  type VariantMatch = {
    tileId: number;
    variantIndex: number;
    edge: Edge;
    testId: number;
    testVariantIndex: number;
  };

  enum Edge {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
  }

  const EdgeComplement = {
    [Edge.TOP]: Edge.BOTTOM,
    [Edge.LEFT]: Edge.RIGHT,
    [Edge.RIGHT]: Edge.LEFT,
    [Edge.BOTTOM]: Edge.TOP,
  };

  const parse = (lines: string[]): { tiles: Map<number, Tile> } => {
    const tiles = new Map<number, Tile>();

    const parseTiles = (lines: string[]) => {
      if (lines.length === 0) {
        return tiles;
      } else {
        const [tileId, ...otherLines] = lines;
        const tileLines = otherLines.splice(0, 10);
        const parsedLines = tileLines.map((line) =>
          line.split("").map((character) => character === "#")
        );
        const variants: TileVariant[] = new Array(
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 0],
          [0, 1],
          [1, 1],
          [2, 1],
          [3, 1]
        ).map(([rotations, flips]) => transform(rotations, flips, parsedLines));
        tiles.set(Number.parseInt(tileId.substr(5).split(":")[0]), {
          variants,
        });
        return parseTiles(otherLines.slice(1));
      }
    };

    return { tiles: parseTiles(lines) };
  };

  const getEdge = (tileVariant: TileVariant, edge: Edge): TileEdge => {
    switch (edge) {
      case Edge.TOP:
        return tileVariant[0];
      case Edge.BOTTOM:
        return tileVariant[9];
      case Edge.LEFT:
        return tileVariant.map((line: boolean[]) => line[0]);
      case Edge.RIGHT:
        return tileVariant.map((line: boolean[]) => line[9]);
    }
  };

  const areEdgesEqual = (a: TileEdge, b: TileEdge): boolean => {
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const { tiles } = parse(readFile("20", "b") as string[]);

  const prettyPrint = (tiles: boolean[][]) => {
    if (tiles.length > 0) {
      const [line, ...otherTiles] = tiles;
      console.log(line.map((v) => (v ? "#" : ".")).join(""));
      prettyPrint(otherTiles);
    }
  };

  const findNeighbours = (
    tileId: number,
    tiles: Map<number, Tile>
  ): VariantMatch[] => {
    const foundMatches = [];
    tiles.get(tileId).variants.forEach((variant, variantIndex) => {
      for (let [testId, tile] of tiles) {
        if (testId === tileId) {
          continue;
        }
        for (let [testVariantIndex, testVariant] of tile.variants.entries()) {
          for (let edge of [Edge.BOTTOM, Edge.LEFT, Edge.TOP, Edge.RIGHT]) {
            if (
              areEdgesEqual(
                getEdge(variant, edge),
                getEdge(testVariant, EdgeComplement[edge])
              )
            ) {
              foundMatches.push({
                tileId,
                variantIndex,
                edge,
                testId,
                testVariantIndex,
              });
            }
          }
        }
      }
    });
    return foundMatches;
  };

  const findTopLeftCorner = (
    tiles: Map<number, Tile>
  ): {
    topLeftId: number;
    topLeftVariantIndex: number;
    // rightSideId: number;
    // bottomSideId: number;
    // rightSideVariantIndex: number;
    // bottomSideVariantIndex: number;
  } => {
    const testOrientation = (
      variantMatches: VariantMatch[]
    ): {
      rightSideId: number;
      bottomSideId: number;
      rightSideVariantIndex: number;
      bottomSideVariantIndex: number;
    } => {
      let rightSideId = null;
      let bottomSideId = null;
      let rightSideVariantIndex = null;
      let bottomSideVariantIndex = null;
      for (let {
        tileId,
        variantIndex,
        edge,
        testId,
        testVariantIndex,
      } of variantMatches.filter(({ edge }) =>
        [Edge.TOP, Edge.LEFT].includes(edge)
      )) {
        if (!rightSideId && edge === Edge.LEFT && bottomSideId !== testId) {
          rightSideId = testId;
          rightSideVariantIndex = testVariantIndex;
        }
        if (!bottomSideId && edge === Edge.TOP && rightSideId !== testId) {
          bottomSideId = testId;
          bottomSideVariantIndex = testVariantIndex;
        }
      }
      return {
        rightSideId,
        bottomSideId,
        rightSideVariantIndex,
        bottomSideVariantIndex,
      };
    };
    let result = {
      topLeftId: null,
      rightSideId: null,
      bottomSideId: null,
      rightSideVariantIndex: null,
      bottomSideVariantIndex: null,
    };
    for (let [id, _] of tiles) {
      const neighbours = findNeighbours(id, tiles);
      const uniqueNeighours = neighbours.reduce(
        (prev, curr) =>
          prev.indexOf(curr.testId) === -1 ? [curr.testId, ...prev] : prev,
        []
      );
      if (uniqueNeighours.length === 2) {
        result.topLeftId = id;
        result = {
          ...result,
          ...testOrientation(neighbours),
        };
        break;
      }
    }
    let topLeftVariantIndex = null;
    tiles
      .get(result.topLeftId)
      .variants.forEach((variant: TileVariant, index: number) => {
        if (
          areEdgesEqual(
            getEdge(variant, Edge.RIGHT),
            getEdge(
              tiles.get(result.rightSideId).variants[
                result.rightSideVariantIndex
              ],
              Edge.RIGHT
            )
          ) &&
          areEdgesEqual(
            getEdge(variant, Edge.BOTTOM),
            getEdge(
              tiles.get(result.bottomSideId).variants[
                result.bottomSideVariantIndex
              ],
              Edge.BOTTOM
            )
          )
        ) {
          topLeftVariantIndex = index;
        }
      });
    return { topLeftId: result.topLeftId, topLeftVariantIndex };
  };

  const prepareReconstruct = (tiles: Map<number, Tile>) => {
    const placed: Map<
      number,
      { x: number; y: number; tileVariant: number }
    > = new Map();
    const { topLeftId, topLeftVariantIndex } = findTopLeftCorner(tiles);
    placed.set(topLeftId, { x: 0, y: 0, tileVariant: topLeftVariantIndex });
    const getPreviousTile = (
      placed: Map<number, { x: number; y: number; tileVariant: number }>,
      placedX: number,
      placedY: number,
      offsetX: number,
      offsetY: number
    ): { id: number; variantIndex: number } => {
      const found = Array.from(placed).find(
        ([id, { x, y, tileVariant }]) =>
          x === placedX + offsetX && y === placedY + offsetY
      );
      if (found) {
        return { id: found[0], variantIndex: found[1].tileVariant };
      } else {
        return null;
      }
    };
    const getLeftTile = (placed, x: number, y: number) =>
      getPreviousTile(placed, x, y, -1, 0);
    const getTopTile = (placed, x: number, y: number) =>
      getPreviousTile(placed, x, y, 0, -1);
    const reconstructRight = (x: number, y: number) => {
      for (let [tileId, tile] of tiles) {
        if (placed.has(tileId)) {
          continue;
        }
        const previousLeftTile = getLeftTile(placed, x, y);
        const previousTopTile = getTopTile(placed, x, y);
        if (!!previousLeftTile) {
          const leftTileVariant = tiles.get(previousLeftTile.id).variants[
            previousLeftTile.variantIndex
          ];
          for (let [variantIndex, variant] of tile.variants.entries()) {
            if (
              areEdgesEqual(
                getEdge(variant, Edge.LEFT),
                getEdge(leftTileVariant, Edge.RIGHT)
              )
            ) {
              placed.set(tileId, { x, y, tileVariant: variantIndex });
              return reconstructRight(x + 1, y);
            }
          }
        } else if (!!previousTopTile) {
          const topTileVariant = tiles.get(previousTopTile.id).variants[
            previousTopTile.variantIndex
          ];
          for (let [variantIndex, variant] of tile.variants.entries()) {
            if (
              areEdgesEqual(
                getEdge(variant, Edge.TOP),
                getEdge(topTileVariant, Edge.BOTTOM)
              )
            ) {
              placed.set(tileId, { x, y, tileVariant: variantIndex });
              return reconstructRight(x + 1, y);
            }
          }
        }
      }
      return;
    };
    reconstructRight(1, 0);
    let y = 1;
    while (placed.size !== tiles.size) {
      reconstructRight(0, y++);
    }
    return placed;
  };

  const reconstruct = (
    originalTiles: Map<number, Tile>,
    tiles: Map<number, { x: number; y: number; tileVariant: number }>
  ) => {
    const reconstructed: any[][] = [];
    const maxX =
      Math.max.apply(
        Math,
        Array.from(tiles).map(([id, { x, y }]) => x)
      ) + 1;
    const maxY =
      Math.max.apply(
        Math,
        Array.from(tiles).map(([id, { x, y }]) => y)
      ) + 1;
    for (let i = 0; i < maxY * 8; i++) {
      reconstructed.push(new Array(maxX * 8));
    }
    for (let [tileId, { x, y, tileVariant }] of tiles) {
      const variantContents = originalTiles.get(tileId).variants[tileVariant];
      variantContents.slice(1, 9).forEach((line, lineIndex) => {
        line
          .slice(1, 9)
          .forEach(
            (el, elIndex) =>
              (reconstructed[y * 8 + lineIndex][x * 8 + elIndex] = el)
          );
      });
    }
    return reconstructed;
  };

  const findSeaMonster = (map: boolean[][]): number => {
    const seaMonsterCoordinates = [
      [0, 1],
      [1, 2],
      [4, 2],
      [5, 1],
      [6, 1],
      [7, 2],
      [10, 2],
      [11, 1],
      [12, 1],
      [13, 2],
      [16, 2],
      [17, 1],
      [18, 0],
      [18, 1],
      [19, 1],
    ];
    const mapVariants: boolean[][][] = new Array(
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1]
    ).map(([rotations, flips]) => transform(rotations, flips, map));

    const find = (variant: boolean[][]): number => {
      const isMatch = (x: number, y: number) =>
        seaMonsterCoordinates
          .map(([deltaX, deltaY]) => variant[y + deltaY][x + deltaX])
          .reduce((prev, curr) => curr && prev, true);
      const inner = (x: number, y: number) => {
        if (x > variant[0].length) {
          return inner(0, y + 1);
        } else if (y > variant.length - 3) {
          return 0;
        } else if (isMatch(x, y)) {
          return 1 + inner(x + 1, y);
        } else {
          return inner(x + 1, y);
        }
      };
      return inner(0, 0);
    };

    return (
      map.reduce(
        (prev, curr) =>
          prev +
          curr.reduce((linePrev, lineCurr) => linePrev + (lineCurr ? 1 : 0), 0),
        0
      ) - (mapVariants.reduce((prev, variant) => prev + find(variant), 0) * seaMonsterCoordinates.length)
    );
  };

  return findSeaMonster(reconstruct(tiles, prepareReconstruct(tiles)));
}

console.log(`Solution part A: ${runPartA()}`); // 21599955909991
console.log(`Solution part B: ${runPartB()}`);
