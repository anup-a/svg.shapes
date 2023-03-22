<script lang="ts">
  import type { Svg } from "@svgdotjs/svg.js";

  import DownloadIcon from "./../assets/download.svg";
  import CopyIcon from "./../assets/copy.svg";
  import ColorPicker from "./ColorPicker.svelte";
  import { fill, selectedSvg } from "./store/store";
  import { cleanAndFillSvg } from "./utils/clean-fill-svg";
  import { parseGradient } from "./utils/parse-gradient";
  import { saveSVG } from "./utils/save-svg";
  import Popover from "svelte-easy-popover";

  let visible = false;
  let svg: Svg;
  let cssFill;
  let referenceElement;
  let copyText = "Copy";

  selectedSvg.subscribe((s) => {
    svg = s;
  });

  fill.subscribe((_) => {
    // apply svg fill whenever the selected color changes
    cssFill = _.type === "solid" ? _.color : _.gradient._raw;
    svg = cleanAndFillSvg(
      svg,
      _.type,
      _.type === "solid" ? _.color : parseGradient(_.gradient)
    );
  });

  const copySVG = () => {
    navigator.clipboard.writeText(svg.svg()).then(
      () => {
        copyText = "Copied !";
        setTimeout(() => (copyText = "Copy"), 2000);
      },
      () => {
        console.error("Failed to copy");
      }
    );
  };
  let anchor: HTMLElement | undefined = undefined;
</script>

<div class="svg-container">
  <div class="svg-image">
    {@html svg.svg()}
  </div>

  <Popover
    triggerEvents={["click"]}
    {referenceElement}
    placement="bottom-start"
    closeOnClickAway={true}
    spaceAway={10}
    on:change={({ detail: { isOpen } }) => (visible = isOpen)}
  >
    <ColorPicker {visible} {anchor} on:hide={() => (visible = false)} />
  </Popover>

  <div class="btn-container">
    <div
      class="btn"
      role="button"
      tabindex="0"
      bind:this={referenceElement}
      on:click={(e) => {
        visible = true;
      }}
      on:keydown={(e) => {
        visible = true;
      }}
    >
      <p>Fill</p>
      <div class="action-icon">
        <div class="color-box" style="background:{cssFill};" />
      </div>
    </div>

    <div
      class="btn"
      on:click={() => saveSVG(svg.svg(), "image/svg+xml", "asset")}
      on:keypress={(e) =>
        e.key === "Enter" && saveSVG(svg.svg(), "image/svg+xml", "asset")}
      role="button"
      tabindex="0"
    >
      <p>Save</p>
      <div class="action-icon">
        <img src={DownloadIcon} alt="download icon" />
      </div>
    </div>
    <div
      class="btn"
      on:click={() => copySVG()}
      on:keypress={(e) => e.key === "Enter" && copySVG()}
      role="button"
      tabindex="0"
    >
      <p>{copyText}</p>
      <div class="action-icon">
        <img src={CopyIcon} alt="download icon" />
      </div>
    </div>
  </div>
</div>

<style>
  .svg-container {
    display: flex;
    margin-top: 2rem;
    pointer-events: none;
    gap: 3rem;
  }

  @media screen and (max-width: 512px) {
    .svg-container {
      flex-direction: column;
      align-items: center;
    }
  }

  .svg-container * {
    pointer-events: auto;
  }

  :global(.gpickr) {
    pointer-events: auto;
    align-items: flex-start;
    /* position: fixed;
    z-index: 9; */
  }
  :global(.pcr-interaction) {
    padding: 1px;
  }

  .svg-image {
    padding: 3rem;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
  }

  :global(.svg-image svg) {
    transition: all 0.5s ease-in-out;
    cursor: pointer;
  }

  :global(.svg-image svg:hover) {
    transform: rotate(60deg) scale(1.1);
  }

  .svg-container img {
    margin: 2rem;
  }

  .btn {
    width: 85px;
    padding: 0 1.5rem;
    background-color: var(--slate-black-light);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 6px;
    margin-bottom: 1rem;
    cursor: pointer;
    position: relative;
    transition: all 300ms ease-in-out;
  }

  .btn > .action-icon {
    background: transparent;
    position: absolute;
    right: 0;
    padding-right: 0.9rem;
    top: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    transition: transform 500ms ease, left 500ms ease, opacity 250ms ease;
    border-radius: 8px;
    flex-grow: 1;
    opacity: 0.8;
  }

  .btn:hover > .action-icon {
    background: rgba(0, 0, 0, 0.5);
    left: 55%;
    float: right;
    opacity: 1;
    margin: 8px;
    padding: 0;
  }

  .btn > .action-icon * {
    transition: transform 500ms ease, left 500ms ease, opacity 250ms ease,
      margin 500ms ease;
    margin-right: 0;
    float: right;
  }

  .btn:hover > .action-icon > * {
    transform: scale(1.1);
    margin-right: calc(50% - 1.1rem);
  }

  .color-box {
    background: linear-gradient(#aaaaaa, #ffffff);
    width: 2rem;
    height: 2rem;
    border-radius: 6px;
    float: right;
  }

  .btn img {
    margin: 0;
    float: right;
  }

  .btn p {
    /* font-weight: bold; */
    font-size: 14px;
    padding-right: 1rem;
  }
</style>
