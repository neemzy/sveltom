import {tryWord, LetterState} from "./tryWord";

describe("tryWord", () => {
  it("validates a correct guess", () => {
    expect(tryWord("tabouret", "tabouret")).toEqual([
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
    ]);
  });

  it("discriminates correct and incorrect letters", () => {
    expect(tryWord("taboules", "tabouret")).toEqual([
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.INCORRECT,
      LetterState.CORRECT,
      LetterState.INCORRECT,
    ]);
  });

  it("identifies misplaced letters", () => {
    expect(tryWord("tableaux", "tabouret")).toEqual([
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.INCORRECT,
      LetterState.MISPLACED,
      LetterState.INCORRECT,
      LetterState.MISPLACED,
      LetterState.INCORRECT,
    ]);
  });

  it("prioritizes correct and incorrect letters over misplaced letters", () => {
    expect(tryWord("tabexxex", "tabouret")).toEqual([
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.INCORRECT,
      LetterState.INCORRECT,
      LetterState.INCORRECT,
      LetterState.CORRECT,
      LetterState.INCORRECT,
    ]);

    expect(tryWord("tabexxux", "tabouret")).toEqual([
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.CORRECT,
      LetterState.MISPLACED,
      LetterState.INCORRECT,
      LetterState.INCORRECT,
      LetterState.MISPLACED,
      LetterState.INCORRECT,
    ]);

    expect(tryWord("abouleuh", "tabouret")).toEqual([
      LetterState.MISPLACED,
      LetterState.MISPLACED,
      LetterState.MISPLACED,
      LetterState.MISPLACED,
      LetterState.INCORRECT,
      LetterState.MISPLACED,
      LetterState.INCORRECT,
      LetterState.INCORRECT,
    ]);
  });
});
