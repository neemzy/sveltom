<script>
import {tryWord, LetterState} from "../tryWord";

const tryCount = 6;
const answer = "tabouret";
let tries = [];
let tryStates = [];
let letterStates = "azertyuiopqsdfghjklmwxcvbn".split("").reduce((acc, cur) => ({...acc, [cur]: undefined}), {});
let currentTry = "";
let playerHasWon = false;

function range(length) {
  return new Array(length).fill();
}

function getLetterStateClassName(state) {
  switch (state) {
    case LetterState.CORRECT:
      return "letter-correct";
    case LetterState.MISPLACED:
      return "letter-misplaced";
    case LetterState.INCORRECT:
      return "letter-incorrect";
  }
}

function resetCurrentTry() {
  currentTry = answer.slice(0, 1);
}

function handleKeyup(event) {
  if (playerHasWon || tries.length === tryCount) {
    return;
  }

  if (event.key.match(/^[a-z]$/) && currentTry.length < answer.length) {
    currentTry = currentTry + event.key;
  } else if (event.keyCode === 8 && currentTry.length > 1) { // backspace
    currentTry = currentTry.slice(0, -1);
  } else if (event.keyCode === 13 && currentTry.length === answer.length) { // enter
    const result = tryWord(currentTry, answer);

    tries = [...tries, currentTry];
    tryStates = [...tryStates, result];

    // Track individual letter states for keyboard
    currentTry.split("").forEach((letter, index) => {
      if (result[index] === LetterState.CORRECT) {
        letterStates[letter] = LetterState.CORRECT;
      } else if (result[index] === LetterState.MISPLACED && letterStates[letter] !== LetterState.CORRECT) {
        letterStates[letter] = LetterState.MISPLACED;
      }
    });

    if (currentTry === answer) {
      playerHasWon = true;
    } else {
      resetCurrentTry();
    }
  }
}

resetCurrentTry();
</script>

<style>
:global(body) {
  margin: 0;
  font-size: 32px;
}

.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 6rem);
  padding: 3rem 0;
  background-color: #2B2B2B;
  font-family: sans-serif;
  text-transform: uppercase;
  color: white;
}

.title {
  margin: 0 0 3rem;
}

.grid {
  background-color: #0077C7;
  border: 2px solid white;
  border-collapse: collapse;
}

.grid td {
  width: 3rem;
  height: 2.5rem;
  padding-top: 0.5rem;
  border: 1px solid white;
  text-align: center;
}

.keyboard {
  margin-top: auto;
  font-size: 0.5em;
}

.keyboard-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.keyboard-key {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  margin: 0.25rem;
  border: 1px solid white;
  border-radius: 0.25rem;
  text-align: center;
}

.letter {
  position: relative;
  overflow: hidden;
}

.letter span {
  position: relative;
  z-index: 1;
}

.letter::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.letter-correct::before {
  background-color: #E7002A;
}

.letter-misplaced::before {
  background-color: #FFBD00;
  border-radius: 1.5rem;
}

.keyboard .letter-misplaced::before {
  border-radius: 0;
}
</style>

<svelte:window on:keyup={handleKeyup} />

<div class="game">
  <h1 class="title">Sveltom</h1>

  <table class="grid">
    {#each tries as triedWord, triedWordIndex}
      <tr>
        {#each triedWord.split("") as letter, letterIndex}
          <td class={"letter " + getLetterStateClassName(tryStates[triedWordIndex][letterIndex])}><span>{letter}</span></td>
        {/each}
      </tr>
    {/each}
    {#if !playerHasWon && tries.length < tryCount}
      <tr>
        {#each currentTry.split("") as letter}
          <td>{letter}</td>
        {/each}
        {#each range(answer.length - currentTry.length) as osef}
          <td></td>
        {/each}
      </tr>
    {:else}
      <tr>
        {#each answer.split("") as osef}
          <td></td>
        {/each}
      </tr>
    {/if}
    {#each range(tryCount - tries.length - 1) as osef}
      <tr>
        {#each answer.split("") as osef}
          <td></td>
        {/each}
      </tr>
    {/each}
  </table>

  <div class="keyboard">
    {#each range(Math.ceil(Object.keys(letterStates).length / 10)) as osef, row}
      <div class="keyboard-row">
        {#each Object.keys(letterStates).slice(row * 10, (row + 1) * 10) as letter}
          <div class={"keyboard-key letter " + getLetterStateClassName(letterStates[letter])}><span>{letter}</span></div>
        {/each}
      </div>
    {/each}
  </div>
</div>
