<script lang="ts">
  import AOS from "aos";
  import "aos/dist/aos.css";
  import { onMount } from "svelte";
  import "./../lib/webcomponent/float-menu";
  import "./../lib/webcomponent/banner";
  import Background from "./lib/Background.svelte";
  import Container from "./lib/Container.svelte";

  onMount(() => {
    AOS.init();
  });
</script>

<main id="main">
  <banner-nav id="banner"></banner-nav>
  <float-menu
    id="float-menu"
    isDark={true}
    data-aos="fade-up"
    data-aos-duration="1000"
  />
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

  #banner {
    position: absolute;
    z-index: 100;
    top: 0;
    width: 100%;
  }
  #float-menu {
    position: absolute;
    z-index: 100;
    display: block;
    height: 0;
    top: 15%;
  }
</style>
