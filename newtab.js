"use strict";

const API_ENDPOINT = "https://arigato-java.download/kakugen.json";
const FALLBACK_KAKUGEN = {
  t: "ジャバ.lang.NullPointerException\nat ジャバブラウザ.main(...)"
};

const newtab = {
  wrapper: null,
  kakugen: null,

  /**
   * initialize newtab
   * 
   * @returns {void}
   */
  async init () {
    newtab.wrapper = document.getElementById("wrapper");

    fetch(API_ENDPOINT, {cache: "force-cache"})
      .then(r => r.json())
      .then(d => d[Math.floor(Math.random() * d.length)])
      .catch(e => {
        console.log("API Error: " + e);
        return FALLBACK_KAKUGEN;
      }).then(newtab.assign)
      .then(newtab.scale)
      .then(newtab.show);
  },

  /**
   * assign Kakugen to DOM and variables
   * 
   * @param {{t: String, u: null|String }} j - Java Simiru-kakugen Object Notation
   * @returns {void}
   */
  async assign (j) {
    if (j.t) {
      newtab.kakugen = j.t;

      const txt = document.getElementById("quote");
      txt.textContent = j.t;
    }

    // Kakugen's cite
    const u = newtab._sanitizeURL(j.u);
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
    if (!newtab.kakugen || !newtab.wrapper) {
      throw new Error("newtab isn't initialized.");
    }

    const rows = Math.max(...newtab.kakugen.split("\n").map(s => s.length));
    const cols = (newtab.kakugen.match(/\n/g) || []).length + 1;

    // XXX: This is magic
    const s = Math.min(
      window.innerWidth / Math.max(Math.min(rows, 6), 25),
      window.innerHeight / cols / 2
    );
    newtab.wrapper.style.fontSize = s + "px";
  },

  /**
   * hide loading message and show a Kakugen
   * 
   * @returns {void}
   */
  async show () {
    document.getElementById("loading").style.display = "none";
    newtab.wrapper.style.visibility = "visible";
    newtab.wrapper.style.opacity = 1;
  },

  /**
   * sanitize URL string
   * 
   * @param {String} url - url-like string
   * @returns {String|null}
   */
  _sanitizeURL (url) {
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
};

newtab.init();
window.onresize = newtab.scale;
