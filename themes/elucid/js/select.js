/*
  Defines the interactive behavior of select
  elements that possess the structure illustrated
  in select.html.twig.
*/
(function ($) {
  // Registers event handlers for select elements.
  Drupal.behaviors.select = {
    attach: function (context, settings) {
    }
  };

  /*
    Accepts one argument: featureElement,
    a jQuery HTML Element that represents an
    elucid select element; and returns an elucid
    select feature instance.
  */
  function Feature (featureElement) {
    this.featureElement = featureElement;
    this.labelElement   = this._getLabelElement ();
    this.selectElement  = this._getSelectElement ();
    this.iconElement    = this._getIconElement ();
  }

  /*
  */
  function initSelectElements (context) {}

  /*
  */
  function initSelectElement () {}

  /*
  */
  function liftLabelElement (labelElement) {
  }

  /*
    Expands the select element so that the
    label element can be positioned over it as
    placeholder text.
  */
  Feature.protoype.setSelectElementWidth = function () {
    var selectElementWidth = this.selectElement.width ();
    var labelElementWidth  = this.labelElement.outerWidth ();
    selectElementWidth < labelElementWidth && this.selectElement.width (labelElement.outerWidth () + selectElementWidth);
  }

  /*
    Returns a jQuery HTML Element that represents
    this instance's label element.
  */
  Feature.prototype._getLabelElement = function () {
    return $('.' + getLabelElementClassName (), this.featureElement);
  }

  /*
    Returns a jQuery HTML Element that represents
    this instance's select element.
  */
  Feature.prototype._getSelectElement = function () {
    return $('.' + getSelectElementClassName (), this.featureElement);
  }

  /*
    Returns a jQuery HTML Element that represents
    this instance's icon element.
  */
  Feature.prototype._getIconElement = function () {
    return $('.' + getIconElementClassName (), this.featureElement);
  }

  /*
    Returns the class used to label label
    elements.
  */
  function getLabelElementClassName () { return 'elucid-select-label'; }

  /*
    Returns the class used to label select
    elements.
  */
  function getSelectElementClassName () { return 'elucid-select-select'; }

  /*
    Returns the class used to label icon
    elements.
  */
  function getIconElementClassName () { return 'elucid-select-icon'; }

  /*
    Accepts one argument: context, a jQuery
    HTML Element; and returns a jQuery HTML
    Element set that lists all the Elucid select
    instances in context.
  */
  function getSelectElements (context) {
    return $('.' + getSelectElementsClassName (), context);
  }

  /*
    Returns the class used to label select
    elements.
  */
  function getSelectElementClassName () { return 'elucid-select'; }

}) (jQuery);
