<script>
import {onMount} from "svelte";
import Game from "../Game.svelte";

let validWords = [];
let answer = "";

onMount(() => {
  fetch("dico.txt")
    .then(response => response.text())
    .then(text => {
      const words = text.split("\n");
      answer = words[Math.floor(Math.random() * words.length)];
      validWords = words.filter(word => word[0] === answer[0] && word.length === answer.length);
    });
});
</script>

{#if answer.length > 0}
  <Game tryCount={6} validWords={validWords} answer={answer} />
{/if}
