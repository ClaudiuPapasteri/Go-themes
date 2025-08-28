// ==UserScript==
// @name         OGS Simple Background
// @version      2.0
// @description  Sets a custom background on OGS game/review/demo pages & Zen Mode; may also be used to add a boarder to the goban. 
// @author       Claudiu C. Papasteri
// @credits      Started from a barebones version of a script by SoumyaK4 (https://soumyak4.in): https://github.com/SoumyaK4/OGS-Tampermonkey
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

    // Clear the game container background if it exists
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

  // Border around the Go board
  function setBoardBorder() {
      // Find the actual board element (the inner one with data-pointers-bound)
      const innerGoban = document.querySelector('.Goban[data-pointers-bound]');
      
      if (innerGoban) {
          if (DEFAULT_BORDER_WIDTH && DEFAULT_BORDER_COLOR) {
              // Apply border to the inner board
              innerGoban.style.border = `${DEFAULT_BORDER_WIDTH} solid ${DEFAULT_BORDER_COLOR}`;
              innerGoban.style.boxSizing = "border-box";
              
              // Adjust the board size to account for the border
              const borderWidth = parseInt(DEFAULT_BORDER_WIDTH);
              const computedStyle = window.getComputedStyle(innerGoban);
              const currentWidth = parseInt(computedStyle.width);
              const currentHeight = parseInt(computedStyle.height);
              
              // Reduce the inner board size to make room for the border
              innerGoban.style.width = `${currentWidth - (borderWidth * 2)}px`;
              innerGoban.style.height = `${currentHeight - (borderWidth * 2)}px`;
              
              // Adjust positioning to center the board
              const outerGoban = document.querySelector('.Goban:not([data-pointers-bound])');
              if (outerGoban) {
                  // Make sure the outer container doesn't clip the border
                  outerGoban.style.overflow = "visible";
                  
                  // Center the inner board within the outer container
                  innerGoban.style.position = "absolute";
                  innerGoban.style.top = `${borderWidth}px`;
                  innerGoban.style.left = `${borderWidth}px`;
              }
          } else {
              innerGoban.style.border = "none";
              
              // Reset size and positioning if border is removed
              innerGoban.style.width = "";
              innerGoban.style.height = "";
              innerGoban.style.top = "";
              innerGoban.style.left = "";
              innerGoban.style.position = "";
              
              const outerGoban = document.querySelector('.Goban:not([data-pointers-bound])');
              if (outerGoban) {
                  outerGoban.style.overflow = "";
              }
          }
      }
  }
  
  function applyAll() {
    setBackground();
    setBoardBorder();
  }
 
  // Run once on page load
  window.addEventListener('load', applyAll);

  // Run again if URL changes (for navigation within OGS SPA)
  new MutationObserver(applyAll).observe(document, { 
        childList: true, 
        subtree: true 
  });
})();
