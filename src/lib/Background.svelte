<script>
  import DotsGrid from "./DotsGridBackground.svelte";
  import Obsidian from "./../assets/obsidian.svg";
  import tilt from "svelte-tilt";
  import { isMobileDevice } from "./utils/is-mobile-device";

  const isSmallScreen = typeof window !== "undefined" && isMobileDevice();
</script>

<div class="background">
  <div class="cursor-layer" />
  {#if !isSmallScreen}
    <div class="left-bg-pattern">
      <DotsGrid alignment="left" />
    </div>
    <div class="right-bg-pattern">
      <DotsGrid alignment={"right"} />
    </div>
  {/if}
  <div class="obsidian-shape" use:tilt>
    <img src={Obsidian} alt="obsidian shape" class="obsidian-shape-image" />
  </div>
</div>

<style>
  .background {
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    background: url("./../assets/Maika.svg") no-repeat center center/cover;
  }

  .cursor-layer {
    background: radial-gradient();
  }

  .obsidian-shape {
    position: absolute;
    left: 0;
    right: 0;
    top: 25%;
    margin-left: auto;
    margin-right: auto;
    width: 500px;
  }
  .obsidian-shape-image {
    max-width: 100%;
    height: auto;
  }
</style>
