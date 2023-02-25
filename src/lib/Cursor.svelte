<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  let buttonRef;
  // again, declare your mousemove callback up top
  function mouseMoveEvent(e) {
    const { x, y } = buttonRef.getBoundingClientRect();
    buttonRef.style.setProperty("--x", e.clientX - x);
    buttonRef.style.setProperty("--y", e.clientY - y);
  }
  onMount(() => {
    buttonRef.addEventListener("mousemove", mouseMoveEvent);
  });
  onDestroy(() => {
    buttonRef.removeEventListener("mousemove", mouseMoveEvent);
  });
</script>

<button bind:this={buttonRef}>✨✨✨</button>
