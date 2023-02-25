<script lang="ts">
  import "@simonwep/pickr/dist/themes/monolith.min.css"; // 'classic' theme
  import { createEventDispatcher, onMount } from "svelte";
  import { quintOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";
  import GPickr from "./../gpickr/js/gpickr";
  import { fill } from "./store/store";

  const dispatch = createEventDispatcher();

  let bottom: number;
  let left: number;
  let view: "solid" | "gradient" = "gradient";
  let colorPicker;

  const initPosition = () =>
    ({ bottom, left } = anchor?.getBoundingClientRect() ?? {
      bottom: 0,
      left: 0,
    });

  const showColorPicker = (selector: string) => {
    if (!visible) return;

    const ColorPicker = GPickr;

    let pickerSettings = {
      el: selector,
      disableGradient: view === "solid",
      stops: [
        ["rgb(255,132,109)", 0],
        ["rgb(255,136,230)", 1],
      ],
    };

    colorPicker = new ColorPicker(pickerSettings);
    if (view === "solid") {
      colorPicker._pickr
        .on("init", (color) => {
          fill.update((f) => ({
            ...f,
            color: color.getColor().toRGBA().toString(0),
          }));
        })
        .on("change", (color) => {
          fill.update((f) => ({
            ...f,
            color: color.toRGBA().toString(0),
          }));
        });
    } else {
      colorPicker
        .on("init", (color) => {
          fill.update((f) => ({
            ...f,
            gradient: color,
          }));
        })
        .on("change", (color) => {
          fill.update((f) => ({
            ...f,
            gradient: color,
          }));
        });
    }
  };

  onMount(() => {
    showColorPicker(".pickr");
  });

  const togglePicker = () => {
    colorPicker.destroyAndRemove();
    const newDiv = document.createElement("div");
    newDiv.classList.add("pickr");
    document.querySelector(".wrapper").appendChild(newDiv);
    showColorPicker(".pickr");
  };

  export let anchor: HTMLElement, visible: Boolean;

  $: anchor, initPosition();
</script>

<svelte:window on:resize={initPosition} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  role="dialog"
  aria-labelledby="Title"
  aria-describedby="Description"
  aria-orientation="vertical"
  transition:fade
  class="popover"
  on:click|stopPropagation
  style="--popover-top: {`${bottom}px`}; --popover-left: {`${left}px`}"
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    on:click|stopPropagation={() => dispatch("hide", true)}
    transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
    class="backdrop"
  />
  <div class="wrapper">
    <div class="mode-switch">
      <h5
        class={view === "solid" && "active"}
        on:click={() => ((view = "solid"), togglePicker())}
      >
        Solid
      </h5>
      <h5
        class={view === "gradient" && "active"}
        on:click={() => ((view = "gradient"), togglePicker())}
      >
        Gradient
      </h5>
    </div>
    <div class="pickr" />
  </div>
</div>

<style>
  * {
    pointer-events: auto;
  }

  .gradient-pickr {
    pointer-events: auto;
  }

  :global(.gpickr) {
    pointer-events: auto;
    align-items: flex-start;
  }
  :global(.pcr-interaction) {
    padding: 1px;
  }

  :global(.pcr-button) {
    display: none;
  }

  .popover {
    position: fixed;
    inset: 0;
    z-index: 997;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  .wrapper {
    position: absolute;

    top: calc(var(--popover-top) + 10px);
    left: var(--popover-left);

    min-width: 200px;

    min-height: 100px;
    border-radius: 8px;
    padding: 0.8em;
    width: fit-content;
    height: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: black;
  }

  .wrapper .mode-switch {
    display: flex;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .mode-switch * {
    flex-grow: 1;
    text-align: center;
    height: 3rem;
    line-height: 3rem;
    margin: 0;
    cursor: pointer;
    border-radius: 4px;
    background-color: white;
    color: black;
    margin-bottom: 1em;
  }
  .mode-switch :not(.active) {
    background-color: black;
    color: white;
  }
</style>
