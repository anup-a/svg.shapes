<script>
  import Editor from "./Editor.svelte";
  import { initSVGs, loadSVG } from "./utils/load-svgs";
  import { selectedSvg } from "./store/store";
  import { gsap } from "gsap";
  import ScrollToPlugin from "gsap/dist/ScrollToPlugin";

  const svgs = initSVGs(false);
  gsap.registerPlugin(ScrollToPlugin);

  const scrollToTop = () =>
    gsap.to(window, { scrollTo: { y: 0, autoKill: true } });

  function handleChange(file) {
    selectedSvg.update((_) => file);
    scrollToTop();
  }
</script>

<div class="main-container">
  <div class="nav-icons">
    <a href="https://github.com/anup-a/svg.shapes">buy me a coffee</a>
    <a href="https://github.com/anup-a/svg.shapes">github</a>
  </div>
  <h1 class="title">SVG · Shapes</h1>
  <Editor />
  <div class="svg-grid">
    {#each svgs as file}
      <div
        class="svg-item"
        on:click={() => handleChange(file)}
        on:keydown={() => handleChange(file)}
      >
        {@html file.svg()}
      </div>
    {/each}
  </div>
  <footer>
    <div>SVG Credits - <a href="https://shapes.framer.website/">Shapes</a></div>
  </footer>
</div>

<style>
  .main-container {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
  }

  .main-container * {
    pointer-events: auto;
  }

  .main-container h1 {
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(30%, #fff),
      to(hsl(0deg 0% 49% / 50%))
    );
    padding: 1rem;
    background-image: linear-gradient(352deg, #fff 30%, hsl(0deg 0% 49% / 50%));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .main-container .nav-icons {
    display: flex;
    margin-top: 1rem;
    gap: 4rem;
  }
  a {
    color: #fff;
    display: inline;
  }

  .title {
    font-family: "Helvetica";
    font-weight: bold;
    font-size: 3em;
  }

  footer {
    margin-top: 5rem;
    margin-bottom: 1rem;
  }

  .svg-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 6rem;
  }

  .svg-grid div {
    width: 180px;
    height: 180px;
    background-color: var(--slate-black);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    margin: 4px;
    /* margin: /rem; */
  }

  .svg-item {
    cursor: pointer;
  }

  :global(.svg-grid .svg-item svg) {
    width: 100px;
    height: 100%;
    display: block;
    margin: auto;
    transition: all 0.7s ease-in-out;
  }
  :global(.svg-grid .svg-item:hover > svg) {
    transform: scale(1.1) rotate(360deg);
  }
</style>
