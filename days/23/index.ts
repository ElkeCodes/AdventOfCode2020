"use strict";

import readFile from "../../utils/readFile";

const parse = (line: string) => line.split("").map((x) => Number.parseInt(x));

function runPartA() {
  const createRing = (startingElements: number[], maxNumber: number) => {
    let pointer: number = 0;

    let elements = [...startingElements];

    const current = () => elements[pointer];

    const setCurrent = (newNumber: number) =>
      (pointer = elements.indexOf(newNumber));

    const moveCurrent = (amount: number = 1) => {
      pointer = (pointer + amount) % elements.length;
    };

    const nextCurrent = (amount: number = 1) =>
      pointer + amount >= elements.length
        ? elements[0]
        : elements[(pointer + amount) % elements.length];

    const pickUp = (amount: number = 3): number[] => {
      let pickedUp = elements.splice(pointer + 1, amount);
      if (pickedUp.length < amount) {
        pickedUp = pickedUp.concat(
          elements.splice(0, amount - pickedUp.length)
        );
      }
      return pickedUp;
    };

    const insert = (newNumber: number, newElements: number[]) => {
      if (newNumber <= 0) {
        newNumber = maxNumber;
      }
      const newIndex = elements.indexOf(newNumber);
      if (newIndex < 0) {
        insert(newNumber - 1, newElements);
      } else {
        elements.splice(newIndex + 1, 0, ...newElements);
      }
    };

    const toString = () =>
      elements
        .map((x, index) => (index === pointer ? `(${x})` : `${x}`))
        .join(" ");

    const resultPart1 = () => {
      const start = (elements.indexOf(1) + 1) % elements.length;
      return [...elements.slice(start), ...elements.slice(0, start - 1)].join(
        ""
      );
    };

    const resultPart2 = () => {
      const first = (elements.indexOf(1) + 1) % elements.length;
      const second = (elements.indexOf(1) + 2) % elements.length;
      return first * second;
    };

    return {
      current,
      setCurrent,
      moveCurrent,
      nextCurrent,
      pickUp,
      insert,
      elements,
      toString,
      resultPart1,
      resultPart2,
    };
  };

  const cups = createRing(parse(readFile("23", "a", false) as string), 9);

  for (let i = 0; i < 100; i++) {
    const current = cups.current();
    const pickedUp = cups.pickUp(3);
    const nextCurrent = cups.nextCurrent();
    cups.insert(current - 1, pickedUp);
    cups.setCurrent(nextCurrent);
  }

  return cups.resultPart1();
}

function runPartB() {
  type Element = {
    label: number;
    next?: Element;
  };

  let data: (number | Element)[] = parse(
    readFile("23", "b", false) as string
  ).map((label: number) => ({ label }));
  for (let label = 10; label <= 1000000; label++) {
    data.push({ label });
  }
  data.forEach(
    (element: Element, index) =>
      (element.next =
        index < data.length - 1
          ? (data[index + 1] as Element)
          : (data[0] as Element))
  );
  const cups = new Map(data.map((item) => [(item as Element).label, item]));

  let head = data[0] as Element;
  for (let i = 0; i < 10000000; i++) {
    const pickedUp = [
      head.next.label,
      head.next.next.label,
      head.next.next.next.label,
    ];
    const pickedUpNext = head.next;
    head.next = head.next.next.next.next;
    let currentCupLabel = head.label - 1;
    while (true) {
      while (pickedUp.includes(currentCupLabel)) {
        currentCupLabel--;
      }
      if (currentCupLabel === 0) {
        currentCupLabel += 1000000;
      }
      while (pickedUp.includes(currentCupLabel)) {
        currentCupLabel--;
      }
      const currentCup = cups.get(currentCupLabel) as Element;
      if (currentCup) {
        pickedUpNext.next.next.next = currentCup.next;
        currentCup.next = pickedUpNext;
        break;
      }
      currentCupLabel--;
    }
    head = head.next;
  }

  const cupLabeledOne = cups.get(1) as Element;
  return cupLabeledOne.next.label * cupLabeledOne.next.next.label;
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
