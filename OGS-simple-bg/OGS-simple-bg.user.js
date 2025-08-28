// ==UserScript==
// @name         OGS Simple Background
// @version      1.0
// @description  Just set a custom background on OGS game/review/demo pages
// @credits      This is barebones version of a script by SoumyaK4 (https://soumyak4.in): https://github.com/SoumyaK4/OGS-Tampermonkey
// @match        https://online-go.com/game/*
// @match        https://online-go.com/review/*
// @match        https://online-go.com/demo/*
// @downloadURL  https://github.com/ClaudiuPapasteri/Go-themes/raw/refs/heads/main/OGS-simple-bg/OGS-simple-bg.user.js
// @updateURL    https://github.com/ClaudiuPapasteri/Go-themes/raw/refs/heads/main/OGS-simple-bg/OGS-simple-bg.user.js
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULT_BG = 'https://claudiupapasteri.github.io/Go-themes/OGS-simple-bg/Immortals_Playing_Weiqi_on_Penglai_(overley).jpg';

  // Leave empty ("") for no border around Go board
  const DEFAULT_BORDER_WIDTH = "4px";    // e.g. "4px" or "" for none
  const DEFAULT_BORDER_COLOR = "#22150e"; // e.g. "#22150e" or "" for none

  function setBackground() {
    document.documentElement.style.backgroundImage = `url('${DEFAULT_BG}')`;
    document.documentElement.style.backgroundSize = 'cover';
    document.documentElement.style.backgroundPosition = 'center';
    document.documentElement.style.backgroundRepeat = 'no-repeat';

    // clear the game container background if it exists

    const containers = [
      document.getElementById('default-variant-container'),
      document.querySelector('.Game.MainGobanView.wide')  // both normal container and Zen mode container
    ];

    containers.forEach(container => {
      if (container) {
        container.style.backgroundImage = `url('${DEFAULT_BG}')`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        container.style.backgroundRepeat = 'no-repeat';
        container.style.backgroundColor = 'transparent';
      }
    });
  }

  // border around the Go board
  function setBorder() {
  if (!DEFAULT_BORDER_WIDTH || !DEFAULT_BORDER_COLOR) return;

  const innerGoban = document.querySelector(".goban-container > .Goban > .Goban");
  if (innerGoban) {
    innerGoban.style.border = `${DEFAULT_BORDER_WIDTH}px solid ${DEFAULT_BORDER_COLOR}`;
    innerGoban.style.boxSizing = "border-box";  // ensure border doesn’t shrink/expand the board
  }
}

function initTheme() {
  setBackground();
  setBorder();

  // Watch for SPA redraws, resizes, etc.
  const container = document.querySelector(".goban-container");
  if (container) {
    const observer = new MutationObserver(() => {
      setBackground();
      setBorder();
    });
    observer.observe(container, { childList: true, subtree: true, attributes: true });
  }
}

// Run on load
initTheme();
