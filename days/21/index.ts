import readFile from "../../utils/readFile";

const intersect = (set, arr): Set<string> =>
  new Set(arr.filter((x: string) => set.has(x)));

const differnce = (set1, set2): Set<string> =>
  new Set([...set1].filter((x) => !set2.has(x)));

const parse = (
  lines: string[]
): {
  ingredientsList: Map<string, Set<string>>;
  ingredientsOccurences: Map<string, number>;
} => {
  const ingredientsList = new Map<string, Set<string>>();
  const ingredientsOccurences = new Map<string, number>();
  const inner = (lines: string[]) => {
    if (lines.length === 0) {
      while (
        Math.max.apply(
          Math,
          [...ingredientsList.values()].map((ing) => ing.size)
        ) > 1
      ) {
        const filterList = [...ingredientsList.values()].filter(
          (x) => x.size === 1
        );
        for (let f of filterList) {
          for (let [key, value] of ingredientsList) {
            if (value.size !== 1) {
              ingredientsList.set(key, differnce(value, f));
            }
          }
        }
      }
      return { ingredientsList, ingredientsOccurences };
    } else {
      const [firstLine, ...otherLines] = lines;
      const match = firstLine.match(
        /^(?<ingredients>[^(]+)(| \(contains (?<allergens>.*)\))$/
      );
      const allergens = match.groups.allergens.split(", ");
      const ingredients = match.groups.ingredients.split(" ");
      for (let ingredient of ingredients) {
        if (ingredientsOccurences.has(ingredient)) {
          ingredientsOccurences.set(
            ingredient,
            1 + ingredientsOccurences.get(ingredient)
          );
        } else {
          ingredientsOccurences.set(ingredient, 1);
        }
      }

      for (let allergen of allergens) {
        if (ingredientsList.has(allergen)) {
          ingredientsList.set(
            allergen,
            intersect(ingredientsList.get(allergen), ingredients)
          );
        } else {
          ingredientsList.set(allergen, new Set(ingredients));
        }
      }
      return inner(otherLines);
    }
  };
  return inner(lines);
};

function runPartA() {
  const { ingredientsList, ingredientsOccurences } = parse(
    readFile("21", "a") as string[]
  );

  return (
    [...ingredientsOccurences.values()].reduce((prev, curr) => prev + curr, 0) -
    [...ingredientsList.values()].reduce((prev, value: Set<string>) => {
      return prev + ingredientsOccurences.get(value.values().next().value);
    }, 0)
  );
}

function runPartB() {
  const { ingredientsList, ingredientsOccurences } = parse(
    readFile("21", "b") as string[]
  );

  return [...ingredientsList]
    .sort(([keyA, _], [keyB, __]) => keyA.localeCompare(keyB))
    .map(([_, ingredient]) => ingredient.values().next().value)
    .join(",");
}

console.log(`Solution part A: ${runPartA()}`);
console.log(`Solution part B: ${runPartB()}`);
