/*
  This module scans the current document for
  IMG elements that have the "inlinesvg" class
  attribute and replaces them with inlined
  versions of their SVG images.
*/

(function ($) {
  /*
    An associative array listing the set of
    loaded SVG Documents keyed by URL.
  */
  var SVGDocuments = [];

  Drupal.behaviors.inlinesvg = {
    /*
      Scan the current document for IMG elements
      that have the "inlinesvg" class attribute and
      replace them with inlined SVG elements when
      the DOM loads and after AJAX calls.
    */
    attach: function (context, settings) {
      replaceImageElements (context);
    }
  };

  /*
    Accepts one argument: context, a jQuery
    HTML Element, scans context for IMG
    elements that have the "inlinesvg" class,
    and replaces these elements with inline
    SVG images.
  */
  function replaceImageElements (context) {
    getInlineSVGElements (context).each (function (i, _element) {
      // I. get the element's URL.
      var element = $(_element);
      var url = element.attr ('src');
      /*
        skip images that do not have src
        attribute values or whose URLs do not
        include the "svg" file extension.
      */
      if (!url || !/.*\.svg/i.test (url)) { return; }

      // II. replace element with an inlined version.
      var imageElement = createImageElement (url);
      element.replaceWith (imageElement);
    });
  }

  /*
    Accepts one argument: url, a URL string that
    references an SVG document; and returns
    a jQuery HTML Element that represents
    the image.
  */
  function createImageElement (url) {
    var svgDocument = getImage (url);
    if (!svgDocument) { return null; }

    var svgElement = document.importNode (svgDocument.documentElement, true);
    return $(svgElement);
  }

  /*
    Accepts one argument: url, a URL string that
    references an SVG document; and returns the
    SVG document.
  */
  function getImage (url) {
    return SVGDocuments [url] ? SVGDocuments [url] : loadImage (url);
  }

  /*
    Accepts one argument: url, a URL string
    that references an SVG document; loads the
    referenced SVG document; caches the SVG
    document; and returns the document.

    Note: this function loads images
    synchronously, which means that this function
    may block until the file loads.
  */
  function loadImage (url) {
    $.ajax (url, {
      async: false,
      success: function (svgDocument) {
        SVGDocuments [url] = svgDocument;
      },
      error: function () {
        console.log ('[inlinesvg][loadIcon] Error: an error occured while trying to load an SVG icon: "' + url + '".');
      }
    });
    return SVGDocuments [url] ? SVGDocuments [url] : null;
  }

  /*
    Accepts one argument: context, a jQuery HTML
    element; and returns a jQuery HTML Element
    set listing all of the IMG elements that
    should be replaced in context.
  */
  function getInlineSVGElements (context) {
    return $('.' + getInlineSVGElementClassName (), context);
  }

  // Returns the class used to label replaceable IMG elements.
  function getInlineSVGElementClassName () {
    return 'inlinesvg';
  }
}) (jQuery);
