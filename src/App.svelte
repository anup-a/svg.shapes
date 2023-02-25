<script lang="ts">
  import Background from "./lib/Background.svelte";
  import Content from "./lib/Content.svelte";
</script>

<main id="main">
  <Background />
  <Content />
</main>

<style>
  :global(:root) {
    --slate-black: rgba(0, 0, 0, 0.36);
    --slate-black-light: rgba(0, 0, 0, 0.25);
  }

  #main {
    width: 100%;
    height: 100%;
    /* position: relative; */
  }
</style>
