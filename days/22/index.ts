"use strict";

import readFile from "../../utils/readFile";

const calculateWin = (cards: number[]): number => {
  let index = 1;
  return cards.reduceRight((prev, card) => prev + card * index++, 0);
};

const parse = (
  lines: string[]
): { player1Cards: number[]; player2Cards: number[] } => {
  const index = lines.indexOf("");
  return {
    player1Cards: lines.slice(1, index).map((card) => Number.parseInt(card)),
    player2Cards: lines.slice(index + 2).map((card) => Number.parseInt(card)),
  };
};

function runPartA() {
  const { player1Cards, player2Cards } = parse(readFile("22", "a") as string[]);

  const play = (player1Cards: number[], player2Cards: number[]): number => {
    const inner = () => {
      if (player1Cards.length === 0) {
        return calculateWin(player2Cards);
      } else if (player2Cards.length === 0) {
        return calculateWin(player1Cards);
      } else {
        const player1Card = player1Cards.shift();
        const player2Card = player2Cards.shift();
        const newCardOrder = [player1Card, player2Card].sort((c1, c2) =>
          c2 > c1 ? 1 : -1
        );
        if (player1Card > player2Card) {
          player1Cards.push(...newCardOrder);
        } else {
          player2Cards.push(...newCardOrder);
        }
        return inner();
      }
    };
    return inner();
  };

  return play(player1Cards, player2Cards);
}

function runPartB() {
  const { player1Cards, player2Cards } = parse(readFile("22", "b") as string[]);

  enum EndState {
    Player1Win,
    Player2Win,
  }

  const areArraysEqual = (a: number[], b: number[]): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const play = (player1Cards: number[], player2Cards: number[]): number => {
    const inner = (
      player1Cards: number[],
      player2Cards: number[],
      previousRoundsPlayer1Cards: number[][],
      previousRoundsPlayer2Cards: number[][]
    ): { score: number; state: EndState } => {
      if (player1Cards.length === 0) {
        return {
          score: calculateWin(player2Cards),
          state: EndState.Player2Win,
        };
      } else if (player2Cards.length === 0) {
        return {
          score: calculateWin(player1Cards),
          state: EndState.Player1Win,
        };
      } else if (
        !!previousRoundsPlayer1Cards.find((previousCards) =>
          areArraysEqual(previousCards, player1Cards)
        ) ||
        !!previousRoundsPlayer2Cards.find((previousCards) =>
          areArraysEqual(previousCards, player2Cards)
        )
      ) {
        return {
          score: calculateWin(player1Cards),
          state: EndState.Player1Win,
        };
      } else {
        const player1Card = player1Cards[0];
        const player2Card = player2Cards[0];
        const newCardOrder =
          player1Card > player2Card
            ? [player1Card, player2Card]
            : [player2Card, player1Card];
        if (
          player1Card <= player1Cards.length - 1 &&
          player2Card <= player2Cards.length - 1
        ) {
          const { state } = inner(
            player1Cards.slice(1, player1Card + 1),
            player2Cards.slice(1, player2Card + 1),
            [],
            []
          );
          if (state === EndState.Player1Win) {
            return inner(
              [...player1Cards.slice(1), player1Card, player2Card],
              player2Cards.slice(1),
              [...previousRoundsPlayer1Cards, player1Cards],
              [...previousRoundsPlayer2Cards, player2Cards]
            );
          } else {
            return inner(
              player1Cards.slice(1),
              [...player2Cards.slice(1), player2Card, player1Card],
              [...previousRoundsPlayer1Cards, player1Cards],
              [...previousRoundsPlayer2Cards, player2Cards]
            );
          }
        }
        if (player1Card > player2Card) {
          return inner(
            [...player1Cards.slice(1), ...newCardOrder],
            player2Cards.slice(1),
            [...previousRoundsPlayer1Cards, player1Cards],
            [...previousRoundsPlayer2Cards, player2Cards]
          );
        } else {
          return inner(
            player1Cards.slice(1),
            [...player2Cards.slice(1), ...newCardOrder],
            [...previousRoundsPlayer1Cards, player1Cards],
            [...previousRoundsPlayer2Cards, player2Cards]
          );
        }
      }
    };
    return inner(player1Cards, player2Cards, [], []).score;
  };

  return play(player1Cards, player2Cards);
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
