<script>
  import { gsap } from "gsap";
  import ScrollToPlugin from "gsap/dist/ScrollToPlugin";
  import { selectedSvg } from "./store/store";
  import { initSVGs } from "./utils/load-svgs";

  const svgs = initSVGs(false);

  gsap.registerPlugin(ScrollToPlugin);

  const scrollToTop = () =>
    gsap.to(window, { scrollTo: { y: 0, autoKill: true } });

  function handleChange(file) {
    selectedSvg.update((_) => file);
    scrollToTop();
  }
</script>

<div class="svg-grid">
  {#each svgs as file, index}
    <div
      class="svg-item"
      data-aos={index > 3 && "fade-up"}
      on:click={() => handleChange(file)}
      on:keydown={(event) => {
        if (event.keyCode == 13) {
          handleChange(file);
        }
      }}
    >
      {@html file.svg()}
    </div>
  {/each}
</div>

<style>
  .svg-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 3rem;
    pointer-events: auto;
    max-width: 720px;
  }

  .svg-grid > * {
    min-width: 0px;
  }

  @media screen and (max-width: 768px) {
    .svg-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .svg-grid div {
    padding: 2rem;
    background-color: var(--slate-black);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    margin: 8px;
  }

  @media screen and (max-width: 512px) {
    .svg-grid div {
      padding: 0.5rem;
    }
  }

  .svg-item:hover {
    cursor: pointer;
  }

  :global(.svg-grid .svg-item svg) {
    height: 100%;
    display: block;
    margin: auto;
    transition: all 0.7s ease-in-out;
  }

  :global(.svg-grid .svg-item:hover > svg) {
    transform: scale(1.1) rotate(360deg);
  }
</style>
