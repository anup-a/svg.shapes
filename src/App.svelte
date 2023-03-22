<script lang="ts">
  import Background from "./lib/Background.svelte";
  import Container from "./lib/Container.svelte";
  import "./../lib/webcomponent/float-menu";
</script>

<main id="main">
  <float-menu id="float-menu" isDark={true} />
  <Background />
  <Container />
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

  #float-menu {
    position: absolute;
    z-index: 100;
    display: block;
    height: 0;
    top: 0;
  }
</style>
