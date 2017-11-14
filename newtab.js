"use strict";

const KAKUGEN_ROWS_MIN = 6;
const KAKUGEN_ROWS_MAX = 25;
const KAKUGEN_COLS_MIN = 1;
const KAKUGEN_COLS_MAX = 8;

const API_ENDPOINT = "https://arigato-java.download/kakugen.json";
const FALLBACK_KAKUGEN = {
  t: "ジャバ.lang.NullPointerException\nat ジャバブラウザ.main(...)"
};

const utils = {
  sanitizeURL (url) {
    try {
      const u = new URL(url);
      if (u.protocol === "http:" || u.protocol === "https:") {
        return u.href;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  clamp (d, min, max) {
    return Math.max(Math.min(d, min), max);
  }
};

const newtab = {
  container: null,
  kakugen: null,

  /**
   * initialize newtab
   * 
   * @returns {void}
   */
  async init () {
    fetch(API_ENDPOINT)
      .then(r => r.json())
      .then(d => d[Math.floor(Math.random() * d.length)])
      .catch(e => {
        console.log("API Error: " + e);
        return FALLBACK_KAKUGEN;
      }).then(newtab.assign)
      .then(newtab.scale)
      .then(() => document.getElementById("loading").classList.add("loaded"));
  },

  /**
   * assign Kakugen to DOM and variables
   * 
   * @param {{t: String, u: null|String }} j - Java Simiru-kakugen Object Notation
   * @returns {void}
   */
  async assign (j) {
    newtab.container = document.getElementById("container");

    if (j.t) {
      newtab.kakugen = j.t;

      const txt = document.getElementById("quote");
      txt.textContent = j.t;
    }

    // Kakugen's cite
    const u = utils.sanitizeURL(j.u);
    if (u) {
      const ref = document.getElementById("cite");
      ref.href = u;
      ref.hidden = false;
    }
  },

  /**
   * scale font-size by kakugen length
   * 
   * @returns {void}
   */
  async scale () {
    if (!newtab.kakugen || !newtab.container) {
      return;
    }

    const rows = Math.max(...newtab.kakugen.split("\n").map(s => s.length));
    const cols = (newtab.kakugen.match(/\n/g) || []).length + 1;

    const s = Math.min(
      window.innerWidth / utils.clamp(rows, KAKUGEN_ROWS_MIN, KAKUGEN_ROWS_MAX),
      window.innerHeight / utils.clamp(cols, KAKUGEN_COLS_MIN, KAKUGEN_COLS_MAX)
    );
    newtab.container.style.fontSize = s + "px";
  }
};

newtab.init();
window.onresize = newtab.scale;
