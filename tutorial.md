# JavaScript interactive workshop #2

## Overview

Topics covered:

- Context-agnostic business logic implementation (a.k.a. **test-driven development**)
- More **Svelte** notions

End result: a working [Sutom](https://sutom.nocle.fr/) clone!

## Part 0: project setup

### SvelteKit skeleton

- Create a new [SvelteKit](https://kit.svelte.dev/) project:

```sh
$ npm create svelte@latest sveltom
```

- Follow the instructions in your terminal, and make the following choices:
    - Which Svelte app template? **Skeleton project**
    - Add type checking with TypeScript? **No**
    - Select additional options: **None**
- Enter the project directory, install dependencies and make sure everything is working:

```sh
$ cd sveltom
$ npm install
$ npm run dev -- --open
```

If your Node.js version is too old, install the required one:

```html
$ nvm install 16.14
$ nvm use 16.14
```

Your browser should open to a page displaying a "Welcome to SvelteKit" message.

### Unit testing

- Install new development dependencies:

```sh
$ npm i jest @babel/preset-env --save-dev
```

- Create a `babel.config.json` file with the following contents:

```json
{
  "presets": ["@babel/preset-env"]
}
```

- Add a `test` user script to `package.json`:

```json
{
  // ...
  "scripts": {
    // ...
    "test": "jest"
  },
  // ...
}
```

- Run it; you should get the following result:

```sh
$ npm test

> test
> jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /Users/neemzy/www/critizr/sveltom
  16 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
  testPathIgnorePatterns: /node_modules/ - 16 matches
  testRegex:  - 0 matches
Pattern:  - 0 matches
```

## Part 1: business logic

Since TDD basics were covered in the previous workshop, and the test suite was provided for it, we are going to go the extra mile today and have _you_ write test cases along the way of your implementation! You don't have to strictly use TDD, just do things the way that works for you and try to get a sense of how and when unit tests can help you write code and refactor it with confidence.

The heart of Sutom's business logic is to compare a word proposed by the user with the word they are supposed to guess, and display the result to give them a hint for next turn:

- correct letters (the right letter in the right spot) are shown in red squares
- misplaced letters (the right letter in the wrong spot) are shown in yellow discs
- incorrect letters (letters absent from the answer) are shown without specific styling
- correct letters take precedence over misplaced letters
- if there are more occurrences of one given letter in the user's proposition than in the answer, these occurrences are prioritized from left to right

The following examples assume the word to guess to be MOUCHE (blue squares being incorrect letters as per definitions above):

```
LOUCHE -> 🟦🟥🟥🟥🟥🟥
DOUCES -> 🟦🟥🟥🟥🟡🟦
CHELOU -> 🟡🟡🟡🟦🟡🟡
CRECHE -> 🟦🟦🟦🟥🟥🟥
```

In the last example, note how the first C and E aren't displayed as misplaced letters, but as incorrect letters, since the second C and E were considered correct because they were in the right spot.

Your goal here is to write, in a standalone `src/tryWord.js` module, a function which will perform this analysis, along the lines of the following blueprint:

```js
const LetterState = {
  CORRECT: "correct",
  MISPLACED: "misplaced",
  INCORRECT: "incorrect",
};

function tryWord(word, answer) {
  return [
    // array of LetterState.CORRECT, LetterState.MISPLACED, LetterState.INCORRECT
  ];
}

export {tryWord, LetterState};

```

To help with this task, you will also write unit tests for this module in a `src/tryWord.test.js`:

```js
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

  // That was a good start, now add more test cases!
});
```

ℹ️ The `tryWord` function assumes both its parameters to be the same length and containing only lowercase letters (`[a-z]{6,10}`): input validation will be dealt with in the controller layer of our little app.

Once you think your implementation covers all edge cases, you can put it to the test by checking if it passes [these cases](src/tryWord.test.js).

## Part 2: Svelte

You know the drill by now: let's `import` our `tryWord` function into `src/routes/+page.svelte` and start building the app itself!

```html
<script>
import {tryWord, LetterState} from "../tryWord";

const tryCount = 6;        // number of propositions the player can make before losing
const answer = "tabouret"; // answer the player is searching for
// ...
</script>

<!-- Game markup here -->
```

Here are some key aspects of Sutom's gameplay to keep in mind:

- there is no visible form controls: no input, no button, just a grid which fills with letters as the player inputs them; letters can be removed with Backspace
- once a full proposition has been written (enough letters to fill the current row of the grid), it can be submitted with Enter, which in turn calls `tryWord` and displays the result directly in the grid
- once the answer has been discovered or the player has exhausted all their tries, no further input has any effect on the game

Once again, feel free to dive in [Svelte's documentation](https://svelte.dev/docs/introduction); you will mostly rely on the same principles as for the previous workshop.

## Part 3: Keyboard and dictionary

You are now going to add a couple of features which will turn your demo into the real thing!

- Display the AZERTY keyboard at the bottom with "global letter states":
  - letters of which at least one is shown as correct in the grid should get a red background
  - letters without a red background, but of which at least one is shown as misplaced in the grid, should get a yellow background
  - letters tried out in the grid but of which there are no occurrences in the answer should be marked as such (gray background? lowered opacity? do it however you like!)
- Instead of a fixed answer, use a [dictionary](static/dico.txt) to choose it at random when the game begins (put the file in the `static` folder to easily be able to `fetch` it from your code)

Implementing this second feature should lead you to isolate the game's internal logic inside a `src/Game.svelte` component, instantiated in `src/routes/+page.svelte` and receiving the answer [as a prop](https://svelte.dev/docs#component-format-script-1-export-creates-a-component-prop). To help the player, the app should also refuse a proposed word that isn't in the dictionary.

## Part 4: Bonus points

If you finished before your colleagues and want to perfect your app, here are a few ideas:

- Endgame screen (with scoring from all the games played previously, using local storage?)
- Letter animation like in the original game (you can add [Motus sounds](https://www.youtube.com/watch?v=zS11Lvi9_xQ) too!)
