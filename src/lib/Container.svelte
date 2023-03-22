<script>
  import Editor from "./Editor.svelte";
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Tiles from "./Tiles.svelte";
</script>

<div class="main-container">
  <Nav />
  <h1 class="title">SVG · Shapes</h1>
  <Editor />
  <h3 class="heading">100+ SVGs. No Attribution required.</h3>
  <Tiles />
  <Footer />
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

  .title {
    font-family: "Helvetica";
    font-weight: bold;
    font-size: 2.5rem;
  }

  .heading {
    font-family: "Helvetica";
    font-weight: normal;
    letter-spacing: 1px;
    font-size: 1rem;
    margin-top: 4rem;
    /* color: #000; */
    padding: 2px 12px;
    border-radius: 4px;
    background-color: #ffffff22;
  }
</style>
