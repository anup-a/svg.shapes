//@ts-nocheck
import "../scss/_main.scss";
import Pickr from "@simonwep/pickr";

import buildGPickr from "./template";
import simplifyEvent from "./utils/simplifyEvent";
import parseGradient from "./utils/parseGradient";
import normalize from "./utils/normalize";

const { utils } = Pickr;
const { on, off } = utils;

class GPickr {
  // Gradient props
  _stops = [];
  _eventBindings = [];
  // Liniear angle
  _angle = 0;
  _angles = [
    { angle: 0, name: "to top" },
    { angle: 90, name: "to right" },
    { angle: 180, name: "to bottom" },
    { angle: 270, name: "to left" },
  ];

  // Radial direction
  _direction = "circle at center";
  _directions = [
    { pos: "tl", css: "circle at left top" },
    { pos: "tm", css: "circle at center top" },
    { pos: "tr", css: "circle at right top" },
    { pos: "r", css: "circle at right" },
    { pos: "m", css: "circle at center" },
    { pos: "l", css: "circle at left" },
    { pos: "br", css: "circle at right bottom" },
    { pos: "bm", css: "circle at center bottom" },
    { pos: "bl", css: "circle at left bottom" },
  ];

  _focusedStop = null;
  _mode = "linear";
  _modes = ["linear", "radial"];
  _root = null;
  _eventListener = {
    init: [],
    change: [],
  };

  constructor(opt) {
    opt = Object.assign(
      {
        stops: [
          ["#42445a", 0],
          ["#20b6dd", 1],
        ],
      },
      opt
    );

    // Build dom
    this._root = buildGPickr(opt);

    if (!opt.disableGradient) {
      // Check if conic-gradient is supported
      if (CSS.supports("background-image", "conic-gradient(#fff, #fff)")) {
        this._modes.push("conic");
      }

      opt.el = opt.el.split(/>>/g).reduce((pv, cv, ci, a) => {
        pv = pv.querySelector(cv);
        return ci < a.length - 1 ? pv.shadowRoot : pv;
      }, document);

      opt.el.parentElement.replaceChild(this._root.root, opt.el);
    }

    this._pickr = Pickr.create({
      el: opt.disableGradient ? ".pickr" : this._root.pickr,
      theme: "monolith",
      inline: true,
      useAsButton: true,
      showAlways: true,
      defaultRepresentation: "HEXA",

      components: {
        palette: true,
        preview: true,
        opacity: true,
        hue: true,

        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          input: true,
        },
      },
    });

    if (!opt.disableGradient) {
      this._pickr
        .on("change", (color) => {
          if (this._focusedStop) {
            this._focusedStop.color = color.toRGBA().toString(0);
            this._render();
          }
        })
        .on("init", () => {
          // Add pre-defined swatches
          for (const [color, loc] of opt.stops) {
            this.addStop(color, loc, true);
          }

          this._bindEvents();
          this._emit("init", this);
        });
    }
  }

  _bindEvents() {
    const { gradient } = this._root;

    // Switch gradient mode
    this._eventBindings.push(
      on(gradient.mode, ["mousedown", "touchstart"], (e) => {
        const nextIndex = this._modes.indexOf(this._mode) + 1;
        this._mode =
          this._modes[nextIndex === this._modes.length ? 0 : nextIndex];

        // Repaint
        this._render(true);

        // Prevent some things
        e.stopPropagation();
      })
    );

    // Adding new stops
    this._eventBindings.push(
      on(gradient.stops.preview, "click", (e) => {
        this.addStop(
          this._pickr.getColor().toRGBA().toString(),
          this._resolveColorStopPosition(e.pageX)
        );
      })
    );

    // Adjusting the angle
    this._eventBindings.push(
      on(gradient.result, ["mousedown", "touchstart"], (e) => {
        e.preventDefault();

        if (this._mode !== "linear") {
          return;
        }

        gradient.angle.classList.add(`gpcr-active`);
        const m = on(window, ["mousemove", "touchmove"], (e) => {
          const { x, y } = simplifyEvent(e);
          const box = gradient.angle.getBoundingClientRect();

          // Calculate angle relative to the center
          const boxcx = box.left + box.width / 2;
          const boxcy = box.top + box.height / 2;
          const radians = Math.atan2(x - boxcx, y - boxcy) - Math.PI;
          const degrees = Math.abs((radians * 180) / Math.PI);

          // ctrl and shift can be used to divide / quarter the snapping points
          const div = [1, 2, 4][Number(e.shiftKey || e.ctrlKey * 2)];
          this.setLinearAngle(degrees - (degrees % (45 / div)));
        });

        const s = on(window, ["mouseup", "touchend", "touchcancel"], () => {
          gradient.angle.classList.remove(`gpcr-active`);
          off(...m);
          off(...s);
        });

        this._eventBindings.push(m);
        this._eventBindings.push(s);
      })
    );

    // Adusting circle position
    this._eventBindings.push(
      on(gradient.pos, ["mousedown", "touchstart"], (e) => {
        const pos = e.target.getAttribute("data-pos");
        const pair = this._directions.find((v) => v.pos === pos);
        this.setRadialPosition((pair && pair.css) || this._direction);
      })
    );
  }

  destroyAndRemove() {
    this._pickr.destroyAndRemove();
    this._eventBindings.forEach((args) => off(...args));
    const root = this._root?.root;
    if (root && root.parentElement) {
      root.parentElement.removeChild(root);
    }
  }

  _render(silent = false) {
    const {
      stops: { preview },
      result,
      arrow,
      angle,
      pos,
      mode,
    } = this._root.gradient;
    const { _stops, _mode, _angle } = this;
    _stops.sort((a, b) => a.loc - b.loc);

    for (const { color, el, loc } of _stops) {
      Object.assign(el.style, {
        left: `${loc * 100}%`,
        color,
      });
    }

    // Rotate arrow
    arrow.style.transform = `rotate(${_angle - 90}deg)`;

    // Apply gradient and update result
    preview.style.background = `linear-gradient(to right, ${this.getStops().toString(
      "linear"
    )})`;
    result.style.background = this.getGradient().toString();

    // Show / hide angle control. Update switch button
    pos.style.opacity = _mode === "radial" ? "" : "0";
    pos.style.visibility = _mode === "radial" ? "" : "hidden";
    angle.style.opacity = _mode === "linear" ? "" : "0";
    angle.style.visibility = _mode === "linear" ? "" : "hidden";

    mode.setAttribute("data-mode", _mode);

    // Fire event
    !silent && this._emit("change", this);
  }

  _resolveColorStopPosition(x) {
    const { markers } = this._root.gradient.stops;
    const mbcr = markers.getBoundingClientRect();
    const diff = x - mbcr.left;

    let loc = diff / mbcr.width;
    if (loc < 0) loc = 0;
    if (loc > 1) loc = 1;

    return loc;
  }

  /**
   * Adds a stop
   * @param color Stop color
   * @param loc Location between 0 and 1
   * @param silent
   * @returns {GPickr}
   */
  addStop(color, loc = 0.5, silent = false) {
    const { markers } = this._root.gradient.stops;
    const el = utils.createElementFromString('<div class="gpcr-marker"></div>');
    markers.appendChild(el);

    this._pickr.setColor(color);
    const newColor = this._pickr.getColor().toRGBA().toString(0);

    const stop = {
      el,
      loc,
      color: newColor,

      listener: on(el, ["mousedown", "touchstart"], (e) => {
        e.preventDefault();
        const markersbcr = markers.getBoundingClientRect();
        this._pickr.setColor(stop.color);
        this._focusedStop = stop;
        let hidden = false;

        // Listen for mouse / touch movements
        const m = on(window, ["mousemove", "touchmove"], (e) => {
          const { x, y } = simplifyEvent(e);
          const rootDistance = Math.abs(y - markersbcr.y);

          // Allow the user to remove the current stop with trying to drag the stop away
          hidden = rootDistance > 50 && this._stops.length > 2;
          el.style.opacity = hidden ? "0" : "1";

          if (!hidden) {
            stop.loc = this._resolveColorStopPosition(x);
            this._render();
          }
        });

        // Clear up after interaction endet
        const s = on(window, ["mouseup", "touchend", "touchcancel"], () => {
          off(...m);
          off(...s);

          // If hidden, which means the user wants to remove it, remove the current stop
          if (hidden) {
            this.removeStop(stop);
            this._render(true);
          }
        });
      }),
    };
    this._stops.push(stop);

    this._eventBindings.push(stop.listener);
    this._focusedStop = stop;
    this._render(silent);
    return this;
  }

  /**
   * Removes a stop.
   * @param v Location, color or stop object
   */
  removeStop(v) {
    const { _stops } = this;

    const stop = (() => {
      if (typeof v === "number") {
        return _stops.find((v) => v.loc === v);
      } else if (typeof v === "string") {
        return _stops.find((v) => v.color === v);
      } else if (typeof v === "object") {
        return v;
      }
    })();

    // Remove stop from list
    _stops.splice(_stops.indexOf(stop), 1);

    // Remove stop element
    stop.el.remove();

    // Unbind listener
    off(...stop.listener);

    // Focus another stop since the current one may gone
    if (this._focusedStop === stop) {
      this._focusedStop = _stops[0];
    }

    this._render();
  }

  /**
   * Tries to parse a existing gradient string.
   * @param str gradient string
   */
  setGradient(str) {
    console.log("definitely not here...");
    const parsed = parseGradient(str);

    if (!parsed || parsed.stops.length < 2) {
      return false;
    }

    const { type, stops, modifier } = parsed;
    const oldStops = [...this._stops];
    if (this._modes.includes(type)) {
      this._mode = type;

      // Apply new stops
      for (const stop of stops) {
        this.addStop(stop.color, stop.loc / 100);
      }

      // Remove current stops
      for (const stop of oldStops) {
        this.removeStop(stop);
      }

      if (type === "linear") {
        this._angle = 180; // Default value
        modifier && this.setLinearAngle(modifier);
      } else if (type === "radial") {
        this._direction = "circle at center"; // Default value
        modifier && this.setRadialPosition(modifier);
      }

      return true;
    }

    return false;
  }

  /**
   * Returns the gradient as css background string
   * @returns {string}
   */
  getGradient(mode = this._mode) {
    const linearStops = this.getStops().toString(mode);

    switch (mode) {
      case "linear":
        return `linear-gradient(${this._angle}deg, ${linearStops})`;
      case "radial":
        return `radial-gradient(${this._direction}, ${linearStops})`;
      case "conic":
        return `conic-gradient(${linearStops})`;
    }
  }

  /**
   * Returns the current stops.
   * To toString function is overridden and returns the comma-joined version which
   * can be used to custimize the direction aka angle.
   * @returns {{color: *, location: *}[]}
   */
  getStops() {
    console.log("here...");
    const stops = this._stops.map((v) => ({
      color: v.color,
      location: v.loc,
    }));

    const mode = this._mode;
    stops.toString = function (type = mode) {
      switch (type) {
        case "linear":
        case "radial":
          return this.map((v) => `${v.color} ${v.location * 100}%`).join(",");
        case "conic":
          return this.map((v) => `${v.color} ${v.location * 360}deg`).join(",");
      }
    };

    return stops;
  }

  /**
   * Returns the current angle.
   * @returns {number}
   */
  getLinearAngle() {
    return this._mode === "linear" ? this._angle : -1;
  }

  /**
   * Sets a new angle, can be a number (degrees) or any valid css string like 0.23turn or "to bottom"
   * @param angle
   */
  setLinearAngle(angle) {
    angle =
      typeof angle === "number"
        ? angle
        : normalize.angleToDegrees(angle) ||
          (this._angles.find((v) => v.name === angle) || {}).angle;

    if (typeof angle === "number") {
      this._angle = angle;
      this._render();
      return true;
    }

    return false;
  }

  /**
   * Sets a new radial position
   * @param position
   */
  setRadialPosition(position) {
    const pair = this._directions.find((v) => v.css === position);

    if (!pair) {
      return false;
    }

    this._direction = pair.css;

    // Apply class
    for (const child of Array.from(this._root.gradient.pos.children)) {
      child.classList[
        child.getAttribute("data-pos") === pair.pos ? "add" : "remove"
      ]("gpcr-active");
    }

    this._render();
    return true;
  }

  /**
   * Returns the current direction.
   * @returns {*}
   */
  getRadialPosition() {
    return this._mode === "radial" ? this._direction : null;
  }

  _emit(event, ...args) {
    this._eventListener[event].forEach((cb) => cb(...args, this));
  }

  /**
   * Adds an eventlistener
   * @param event
   * @param cb
   * @returns {GPickr}
   */
  on(event, cb) {
    // Validate
    if (
      typeof cb === "function" &&
      typeof event === "string" &&
      event in this._eventListener
    ) {
      this._eventListener[event].push(cb);
    }

    return this;
  }

  /**
   * Removes an eventlistener
   * @param event
   * @param cb
   * @returns {GPickr}
   */
  off(event, cb) {
    const callBacks = this._eventListener[event];

    if (callBacks) {
      const index = callBacks.indexOf(cb);

      if (~index) {
        callBacks.splice(index, 1);
      }
    }

    return this;
  }
}

// Expose pickr
GPickr.Pickr = Pickr;

export default GPickr;
