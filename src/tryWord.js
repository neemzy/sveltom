const LetterState = {
  CORRECT: "correct",
  MISPLACED: "misplaced",
  INCORRECT: "incorrect",
};

function mapLetterIndexes(word) {
  return word.split("").reduce((acc, cur, index) => {
    if (!(cur in acc)) {
      acc[cur] = [];
    }

    acc[cur].push(index);
    return acc;
  }, {});
}

function removeLetterIndexFromMap(map, letter, index) {
  map[letter] = typeof index === "undefined"
    ? map[letter] = map[letter].slice(1)
    : map[letter].filter(value => value !== index);

  if (map[letter].length === 0) {
    delete map[letter];
  }

  return map;
}

function tryWord(word, answer) {
  let wordMap = mapLetterIndexes(word);
  let answerMap = mapLetterIndexes(answer);

  // Step 1: identify correct letters, and letters totally absent from the answer
  // Remove processed indexes in both maps
  const result = word.split("").map((letter, index) => {
    if (letter === answer[index]) {
      wordMap = removeLetterIndexFromMap(wordMap, letter, index);
      answerMap = removeLetterIndexFromMap(answerMap, letter, index);

      return LetterState.CORRECT;
    }

    if (!answer.includes(letter)) {
      wordMap = removeLetterIndexFromMap(wordMap, letter, index);

      return LetterState.INCORRECT;
    }

    return undefined;
  });

  // Step 2: iterate over remaining letters in tried word to determine their status
  Object.keys(wordMap).forEach(letter => {
    wordMap[letter].forEach(index => {
      if (Object.keys(answerMap).includes(letter)) {
        answerMap = removeLetterIndexFromMap(answerMap, letter);

        result[index] = LetterState.MISPLACED;
      } else {
        result[index] = LetterState.INCORRECT;
      }
    });
  });

  return result;
}

export {tryWord, LetterState};
