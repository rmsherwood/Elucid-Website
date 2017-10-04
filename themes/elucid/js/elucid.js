/*
  Defines the default behavior.
*/
(function ($) {
  $(document).ready (function () {
    init ();
  });

  function init () {
    loadFonts ();

    // Initialize the material design component elements.
    // Note: this roundabout method is forced on us by IE9.
    // typeof mdc === "undefined" || mdc.autoInit ();
  }

  /*
    Loads the fonts used by this theme.

    Note: this function relies on the theme library including
    https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js
  */
  function loadFonts () {
    WebFont.load({
      google: {
        families: ['Open+Sans:300,400,600']
      }
    });
  }
}) (jQuery);
