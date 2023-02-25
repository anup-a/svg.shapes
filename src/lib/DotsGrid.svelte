<script>
  import gsap from "gsap";
  import { onMount } from "svelte";

  let canvasContainer;

  // legacy registerPlugin.min.js
  gsap.registerPlugin({
    name: "directionalRotation",
    init(e, t) {
      "object" != typeof t && (t = { rotation: t });
      var i,
        n,
        r,
        s,
        a,
        o = this,
        l = t.useRadians ? 2 * Math.PI : 360,
        c = 1e-6;
      // @ts-ignore
      for (i in ((o.endValues = {}), (o.target = e), t))
        "useRadians" !== i &&
          ((n = (a = (t[i] + "").split("_"))[0]),
          (r = parseFloat(e[i])),
          (s =
            // @ts-ignore
            (o.endValues[i] =
              "string" == typeof n && "=" === n.charAt(1)
                ? r + parseInt(n.charAt(0) + "1", 10) * Number(n.substr(2))
                : +n || 0) - r),
          a.length &&
            (~(n = a.join("_")).indexOf("short") &&
              (s %= l) !== s % (l / 2) &&
              (s = s < 0 ? s + l : s - l),
            -1 !== n.indexOf("_cw") && s < 0
              ? (s = ((s + 1e10 * l) % l) - ((s / l) | 0) * l)
              : -1 !== n.indexOf("ccw") &&
                s > 0 &&
                (s = ((s - 1e10 * l) % l) - ((s / l) | 0) * l)),
          // @ts-ignore
          (s > c || s < -c) && (o.add(e, i, r, r + s), o._props.push(i)));
    },
    render(e, t) {
      if (1 === e) for (let e in t.endValues) t.target[e] = t.endValues[e];
      else {
        let i = t._pt;
        for (; i; ) i.r(e, i.d), (i = i._next);
      }
    },
  });

  const isMobile =
    /iPhone|iPod|android/.test(navigator.userAgent) ||
    ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1);

  class DotGrid {
    constructor(elem) {
      this.DOM = { el: elem };
      this.size = {};
      this.time = 0;
      this.dots = [];
      this.gridDimension = {
        width: parseInt(elem.getAttribute("data-dots-h"), 10) || 16,
        height: parseInt(elem.getAttribute("data-dots-v"), 10) || 16,
      };
      this.k = parseFloat(elem.getAttribute("data-k")) || 1000 / 690;
      this.mouse = { x: 0, y: 0 };
      this.mouseOver = false;

      this.initCanvas();
      this.initColor();
      this.initDots();
      this.addIntersection();
      this.initEvents();
      this.render();
    }

    initCanvas() {
      this.canvas = document.createElement("canvas");
      this.resize();
      this.DOM.el.appendChild(this.canvas);
    }

    initColor() {
      const e = (
        getComputedStyle(this.DOM.el).getPropertyValue("color") ||
        "rgb(255, 255, 255)"
      ).replace(/\s/g, "");
      this.color = e.substring(e.indexOf("(") + 1, e.indexOf(")")).split(",");
    }

    initDots() {
      for (let i = 0; i < this.gridDimension.width; i++) {
        this.dots[i] = [];
        for (let j = 0; j < this.gridDimension.height; j++) {
          const dot = new DotLine();
          dot.left =
            ((this.size.width - 2 * this.magnitudeTop) /
              (this.gridDimension.width - 1)) *
              i +
            this.magnitudeTop;
          dot.top =
            ((this.size.height - 2 * this.magnitudeTop) /
              (this.gridDimension.height - 1)) *
              j +
            this.magnitudeTop;
          dot.magnitude = 0.001;
          this.dots[i][j] = dot;
        }
      }
    }

    addIntersection() {
      // this observer observes if the cursor is around the canvas
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(
          (entry) => (this.isVisible = entry.intersectionRatio > 0)
        );
      });
      this.observer.observe(this.DOM.el);
    }

    initEvents() {
      window.addEventListener("resize", this.resize.bind(this));
      this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
      this.canvas.addEventListener("mouseenter", () => (this.mouseOver = true));
      this.canvas.addEventListener("mouseleave", this.reset.bind(this));
      window.addEventListener("refresh", () => {
        setTimeout(() => {
          this.resize();
        }, 0);
      });
    }

    resize() {
      const { DOM, canvas, size } = this;
      size.width = DOM.el.clientWidth;
      size.height = DOM.el.clientHeight;
      canvas.width = size.width;
      canvas.height = size.height;

      this.ctx = canvas.getContext("2d");
      this.radius = window.innerWidth;
      this.magnitudeTop = this.radius / 80;
      this.lineWidth = Math.max(4, window.innerWidth / 500);
      this.initDots();
    }

    draw() {
      const { ctx, size, mouseOver, lineWidth, color } = this;
      ctx.clearRect(0, 0, size.width, size.height);
      if (mouseOver && !isMobile) this.calculateDotTransform();
      this.dots.forEach((row) => {
        row.forEach((dot) => dot.draw(ctx, mouseOver, lineWidth, color));
      });
    }

    calculateDotTransform() {
      const { mouse, dots, radius, magnitudeTop } = this;
      dots.forEach((row) => {
        row.forEach((dot) => {
          const dx = mouse.x - dot.left;
          const dy = mouse.y - dot.top;
          const dist = Math.sqrt(dx ** 2 + dy ** 2) || 1;
          const angle = Math.atan2(dy, dx);
          const magnitude = Math.min(
            Math.max(radius / dist, 0.001),
            magnitudeTop
          );
          gsap.to(dot, {
            duration: 0.8,
            ease: "elastic.out(1, 0.4)",
            magnitude,
            directionalRotation: { angle: `${angle}_short`, useRadians: true },
          });
        });
      });
    }

    mouseMove(e) {
      const { canvas, mouse } = this;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      this.mouseMoved = true;
    }

    reset() {
      this.mouseOver = false;
      this.dots.forEach((row) => {
        row.forEach((dot) => {
          gsap.to(dot, {
            duration: 0.8,
            magnitude: 0.001,
            directionalRotation: { angle: "0_short", useRadians: true },
          });
        });
      });
    }

    render() {
      if (this.isVisible) {
        this.time++;
        this.draw();
      }
      requestAnimationFrame(this.render.bind(this));
    }
  }

  class DotLine {
    constructor() {
      this.left = 0;
      this.top = 0;
      this.magnitude = 0;
      this.angle = 0;
      this.alphaFrame = Math.floor(201 * Math.random());
      this.alphaIncreasing = Math.random() < 0.5;
      this.alpha = 0;
    }

    modulateAlpha() {
      if (
        (200 === this.alphaFrame && this.alphaIncreasing) ||
        (0 === this.alphaFrame && !this.alphaIncreasing)
      ) {
        this.alphaIncreasing = !this.alphaIncreasing;
      }
      this.alphaIncreasing ? this.alphaFrame++ : this.alphaFrame--;
      this.alpha = this.alphaFrame / 200;
    }

    getColor(isVisible, color) {
      return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${this.alpha})`;
    }

    draw(ctx, isVisible, lineWidth, color) {
      this.modulateAlpha();
      ctx.strokeStyle = this.getColor(isVisible, color);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.save();
      ctx.beginPath();
      ctx.setTransform(1, 0, 0, 1, this.left, this.top);
      ctx.rotate(this.angle);
      ctx.moveTo(-this.magnitude / 2, 0);
      ctx.lineTo(this.magnitude / 2, 0);
      ctx.stroke();
      ctx.restore();
    }
  }

  onMount(() => {
    new DotGrid(canvasContainer);
  });

  export let alignment;
</script>

<div
  class="dots  {alignment === 'right' && 'right-align'}"
  data-dots-h="8"
  data-dots-v="24"
  bind:this={canvasContainer}
/>

<style>
  .dots {
    position: absolute;
    top: 0;
    width: 250px;
    height: 100vh;
    color: "rgba(255,255,255)";
  }
  .right-align {
    right: 0;
  }
</style>
