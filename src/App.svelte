<script lang="ts">
  import AOS from "aos";
  import "aos/dist/aos.css";
  import { onMount } from "svelte";
  import "./../lib/webcomponent/float-menu";
  import Background from "./lib/Background.svelte";
  import Container from "./lib/Container.svelte";
  import Banner from "./lib/Banner.svelte";

  onMount(() => {
    AOS.init();
  });
</script>

<main id="main">
  <div style="top:0; position: fixed;z-index: 1;width: 100%;">
    <Banner />
  </div>
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

  #float-menu {
    position: absolute;
    z-index: 100;
    display: block;
    height: 0;
    top: 15%;
  }
</style>
