/*
  This module detects clicks on View term
  list filters and interfaces with the Drupal
  Select Term command to apply the selected
  filter terms.
*/
(function ($, Drupal, drupalSettings) {
  /*
    An associative array of SVGDocuments keyed
    by name.
  */
  var ICONS = {};

  /*
    A Filter array that represents the set of
    filters on the current page.
  */
  var FILTERS = {};

  // Initializes the filter elements.
  $(document).ready (function () {
    // stores all of the filters on the current page in the FILTERS array.
    FILTERS = getFilters ();

    // initializes the filter elements.
    initFilterElements ();
  });

  /*
    Accepts no arguments and returns the filters
    as an array of the Filters.
  */
  function getFilters () {
    return getListElements ().map (
      function (listElement) {
        return new Filter (getListFilterId ($(listElement)));
    });
  }

  // Initialize all filters after each refresh.
  // See: https://www.drupal.org/docs/8/api/javascript-api
  Drupal.behaviors.view_term_list = {
    attach: function (context, settings) {
      $(document).once ('view_term_list').ajaxComplete (
        function (event, xhr, settings) {
          // initializes all of the filters on view updates.
          if (settings.url.indexOf ('/views/ajax') === 0) {
            // initializes the filter elements.
            initFilterElements ();
          }
      });
    }
  }

  /*
    Accepts no arguments and initializes all of
    the filter elements.
  */
  function initFilterElements () {
    _.invoke (FILTERS, 'initElement');
  }

  // Represents the set of possible filter states.
  var EXPANDED = 'expanded';
  var COLLAPSED = 'collapsed';

  /*
    Accepts one argument: filterId, a string;
    and returns a Filter object that
    represents a Term List filter.
  */
  function Filter (filterId) {
    this._id = filterId;
    this._state = COLLAPSED;
  }

  /*
    Accepts no arguments and returns a string
    that represents this filter's id.
  */
  Filter.prototype.getId = function () {
    return this._id;
  }

  /*
    Accepts no arguments and returns a string
    that represents this filter's current state.
  */
  Filter.prototype.getState = function () {
    return this._state;
  }

  /*
    Accepts no arguments: adds deselect buttons
    and click event handlers to this filter's
    item elements; and returns undefined.
  */
  Filter.prototype.initElement = function () {
    // set overflow visibility.
    this.initOverflow ();

    // add buttons and click event handlers to items.
    this.initItemElements ();

    // add a click event handler to the toggle element.
    this.getNumOverflowItems () > 0 ?
      this.initToggleElement ():
      this.removeToggleElement ();

    // add a click event handler to the reset element.
    this.initResetElement ();
  }

  /*
    Accepts no arguments, *quickly* shows/hides
    this filter's overflow element based on
    this filter's current state, and returns
    undefined.
  */
  Filter.prototype.initOverflow = function () {
    this.isExpanded () ? 
      this.showOverflow ():
      this.hideOverflow ();
  }

  /*
    Accepts no arguments, adds buttons and
    click event handlers to this filter's item
    elements, and returns undefined.
  */
  Filter.prototype.initItemElements = function () {
    var self = this;
    var selectedTermIds = this.getSelectedTermIds ();
    this.getItemElements ().forEach (function (itemElement, i) {
      self.initItemElement (selectedTermIds, $(itemElement), i);
    });
  }

  /*
    Accepts three arguments:

    * selectedTermIds, an array of integers that
      represent the currently selected term ids
    * itemElement, a jQuery HTML Element that
      represents a filter item element
    * i, an integer that represents itemElement's
      array index within this filter's set of
      item elements

    sets the click event handler for itemElement,
    adds the appropriate classes, appends a
    deselect button if necessary, and returns
    undefined.
  */
  Filter.prototype.initItemElement = function (selectedTermIds, itemElement, i) {
    var self = this;
    itemElement.attr (getItemIndexAttributeName (), i);

    var termId = getItemTermId (itemElement);
    if (_.contains (selectedTermIds, termId)) {
      itemElement
        .addClass (getSelectedItemClassName)
        .append (createItemDeselectButtonElement ())
        .click (function () {
          getItemDeselectButtonElement (itemElement).remove ();
          self.deselectTerm (termId);
          self.updateResetButton ();
          self.submitForm ();
        });
    } else {
      itemElement.click (function () {
        itemElement.append (createItemDeselectButtonElement ());
        self.selectTerm (termId);
        self.showResetButton ();
        self.submitForm ();
      });
    }
  }

  /*
    Accepts no arguments, sets the click event
    handler for this filter's toggle element,
    and returns undefined.
  */
  Filter.prototype.initToggleElement = function () {
    this.getToggleElement ()
      .text (this.isExpanded () ? getToggleElementHideText () : getToggleElementShowText ())
      .click (_.bind (this.toggleOverflow, this));
  } 

  /*
    Accepts no arguments, sets the click event
    handler for the reset button, and returns
    undefined.
  */
  Filter.prototype.initResetElement = function () {
    // I. Hide/show the button.
    this.updateResetButton ();

    // II. Set the click event handler.
    this.getResetButtonElement ().click (_.bind (this.reset, this));
  }


  /*
    Accepts no arguments, clears the term
    filters, refresh the view, and return
    undefined.
  */
  Filter.prototype.reset = function () {
    // I. Deselect all term filters.
    var self = this;
    this.getSelectedOptionElements ().forEach (
      function (_optionElement) {
        var optionElement = $(_optionElement);

        // Deselect the option.
        optionElement.removeAttr ('selected');

        // Remove the deselect button icon.
        var termId = optionElement.val ();
        var itemElement = self.getItemElement (termId);
        getItemDeselectButtonElement (itemElement).remove ();
    });

    // II. Refresh results.
    this.submitForm ();
  }

  /*
    Accepts no arguments and submits this
    filter's view form by simulating a click on
    the form's submit button.
  */
  Filter.prototype.submitForm = function () {
    this.getSubmitButtonElement ().click ();
  }

  /*
    Accepts no arguments, expands/collapses
    this filter's overflow element based on
    this filter's current state, and returns
    undefined.
  */
  Filter.prototype.toggleOverflow = function () {
    this.isExpanded () ?
      this.collapseOverflow ():
      this.expandOverflow ();
  }

  /*
    Accepts no arguments, expands this
    filter's overflow element, and returns
    undefined.
  */
  Filter.prototype.expandOverflow = function () {
    this.isExpanded () || this.getOverflowElement ().slideDown (_.bind (this.showOverflow, this));
  }

  /*
    Accepts no arguments, collapses this filter's
    overflow element, and returns undefined.
  */
  Filter.prototype.collapseOverflow = function () {
    this.isExpanded () && this.getOverflowElement ().slideUp (_.bind (this.hideOverflow, this));
  }

  /*
    Accepts no arguments; *quickly* hides this
    filter's overflow element; and returns
    undefined.
  */
  Filter.prototype.showOverflow = function () {
    this.getOverflowElement ().show ();
    this.getToggleElement ().text (getToggleElementHideText ());
    this._state = EXPANDED;
  }

  /*
    Accepts no arguments; *quickly* expands
    this filter's overflow element; and returns
    undefined.
  */
  Filter.prototype.hideOverflow = function () {
    this.getOverflowElement ().hide ();
    this.getToggleElement ().text (getToggleElementShowText ());
    this._state = COLLAPSED;
  }

  /*
    Accepts no arguments, shows/hides the
    reset button based on the number of terms
    currently selected in this filter, and
    returns undefined.
  */
  Filter.prototype.updateResetButton = function () {
    this.getNumSelectedTermIds () > 0 ?
      this.showResetButton ():
      this.hideResetButton ();
  }

  /*
    Accepts no arguments, shows this filter's
    reset button, and returns undefined.
  */
  Filter.prototype.showResetButton = function () {
    this.getResetButtonElement ().show ();
  }

  /*
    Accepts no arguments, hides this filter's
    reset button, and returns undefined.
  */
  Filter.prototype.hideResetButton = function () {
    this.getResetButtonElement ().hide ();
  }

  /*
    Accepts no arguments; removes the toggle
    element; and returns undefined.
  */
  Filter.prototype.removeToggleElement = function () {
    this.getToggleElement ().remove ();
  }

  /*
    Accepts one argument: termId, an integer
    that represents a taxonomy term ID; selects
    the HTML option element that is associated
    with the taxonomy term having termId; and
    returns undefined.
  */
  Filter.prototype.selectTerm = function (termId) {
    this.getOptionElement (termId).attr ('selected', 'selected');
  }

  /*
    Accepts one argument: termId, an integer that
    represents a taxonomy term ID; deselects
    the HTML option element that is associated
    with the taxonomy term that has termID;
    and returns undefined.
  */
  Filter.prototype.deselectTerm = function (termId) {
    this.getOptionElement (termId).removeAttr ('selected');
  }

  /*
    Accepts no arguments and returns a jQuery
    HTML Element that represents the view form
    submit button.
  */
  Filter.prototype.getSubmitButtonElement = function () {
    return $('.' + getSubmitClassName (), this.getViewElement ());
  }

  /*
    Accepts no arguments and returns a jQuery
    HTML Element that represents the view element
    that contains this filter.
  */
  Filter.prototype.getViewElement = function () {
    return $('.js-view-dom-id-' + this.getViewId ());
  }

  /*
    Accepts no arguments and returns a string
    that represents the DOM ID of the view
    associated with this filter.
  */
  Filter.prototype.getViewId = function () {
    return getListViewId (this.getListElement ());
  }

  /*
    Accepts one argument: listElement, a jQuery
    HTML Element that represents a list element;
    and returns the DOM ID of the view associated
    with listElement.
  */
  function getListViewId (listElement) {
    return listElement.attr (getViewIdAttributeName ());
  }

  /*
    Accepts one argument: itemElement, a jQuery
    HTML Element that represents a filter list
    item; and returns a jQuery HTML Element that
    represents the item's deselect button.

    Note: item deselect buttons are added by
    this module. See: Filter.init ().
  */
  function getItemDeselectButtonElement (itemElement) {
    return $('.' + getItemDeselectButtonClassName (), itemElement);
  }

  /*
    Accepts one argument: itemElement, a jQuery
    HTML Element that represents a filter list
    item; and returns a jQuery HTML Element that
    represents the list item label.
  */
  function getItemLabelElement (itemElement) {
    return $('.' + getItemLabelClassName (), itemElement);
  }

  /*
    Accepts one argument: itemElement, a jQuery
    HTML Element that represents a filter list
    item; and returns a string that represents
    the id of the taxonomy term associated
    with itemElement.
  */
  function getItemTermId (itemElement) {
    return itemElement.attr (getItemTermAttributeName ());
  }

  /*
    Accepts one argument: termId, a string that
    represents a term ID; and returns the filter
    item element associated with termId as a
    jQuery HTML Element.
  */
  Filter.prototype.getItemElement = function (termId) {
    return $('.' + getItemClassName () + '[' + getItemTermAttributeName () + '="' + termId + '"]', this.getListElement ());
  }

  /*
    Accepts no arguments and returns this
    filter's list item elements as an array of
    DOM HTML Elements.
  */
  Filter.prototype.getItemElements = function () {
    return $('.' + getItemClassName (), this.getListElement ()).toArray ();
  }

  /*
    Accepts no arguments and returns the
    expand/collapse (toggle) element as a jQuery
    HTML Element.
  */
  Filter.prototype.getToggleElement = function () {
    return $('.' + getToggleClassName (), this.getListElement ());
  }

  /*
    Accepts no arguments and returns a jQuery
    HTML Element that represents this filter's
    reset button.
  */
  Filter.prototype.getResetButtonElement = function () {
    return $('.' + getResetButtonClassName (), this.getListElement ());
  }

  /*
    Accepts no arguments and returns the number
    of overflow items as an integer.
  */
  Filter.prototype.getNumOverflowItems = function () {
    return parseInt (this.getOverflowElement ().attr (getOverflowNumItemsAttributeName ()));
  }

  /*
    Accepts no arguments and returns a jQuery
    HTML Element that represent the this filter's
    overflow element.
  */
  Filter.prototype.getOverflowElement = function () {
    return $('.' + getOverflowClassName (), this.getListElement ());
  }

  /*
    Accepts no arguments and returns true iff
    this filter should be expanded.

    Note: this module uses a hidden select option
    to indicate whether or not filters should be
    expanded or collapsed. This function checks
    to see whether or not this filter's expand
    option has been selected.
  */
  Filter.prototype.isExpanded = function () {
    return this.getState () === EXPANDED;
  }

  /*
    Accepts no arguments and returns a jQuery
    HTML Element that represents the HTML list
    element associated with this filter.
  */
  Filter.prototype.getListElement = function () {
    return $('[' + getFilterAttributeName () + '="' + this.getId () + '"].' + getListClassName ());
  }

  /*
    Accepts no arguments and returns the number
    of terms currently selected in this filter
    as an integer.
  */
  Filter.prototype.getNumSelectedTermIds = function () {
    return this.getSelectedOptionElements ().length;
  }

  /*
    Accepts no arguments and returns the set of
    terms currently selected in this filter as
    an array of strings.
  */
  Filter.prototype.getSelectedTermIds = function () {
    return this.getSelectedOptionElements ().map (function (optionElement) {
      return $(optionElement).val ();
    });
  }

  /*
    Accepts no arguments and returns this
    filter's selected option elements in a jQuery
    HTML Element array.
  */
  Filter.prototype.getSelectedOptionElements = function () {
    return $('option:selected', this.getSelectElement ()).toArray ();
  }

  /*
    Accepts one argument: termId, an integer that
    represents a taxonomy term ID; and returns a
    jQuery HTML element that represents the HTML
    option element associated with the taxonomy
    term that has termId.

    Note: we enable or disable term filters by
    selecting/deselecting these options.
  */
  Filter.prototype.getOptionElement = function (termId) {
    return $('option[value="' + termId + '"]', this.getSelectElement ());
  }

  /*
    Accepts no arguments and returns a jQuery
    HTML Element that represents the HTML select
    element associated with this filter.
  */
  Filter.prototype.getSelectElement = function () {
    return $('[' + getFilterAttributeName () + '="' + this.getId () + '"].form-select');
  }

  /*
    Accepts one argument: listElement, a jQuery
    HTML Element that represents a filter list
    element; and returns a string that represents
    the ID of the filter that listElement is
    associated with.
  */
  function getListFilterId (listElement) {
    return listElement.attr (getFilterAttributeName ());
  }

  /*
    Accepts no arguments and returns the view
    term list elements in a DOM HTML Element
    array.
  */
  function getListElements () {
    return $('.' + getListClassName ()).toArray ();
  }

  /*
    Accepts no arguments and returns a jQuery
    HTML Element that represents an item deselect
    button.
  */
  function createItemDeselectButtonElement () {
    return $('<div></div>')
      .addClass (getItemDeselectButtonClassName ())
      .append ($(loadIcon ('deselect-button', '/modules/custom/view_term_list/images/close-icon.svg')));
  }

  /*
    Accepts two arguments: 

    * name, a string
    * and url, a URL string

    loads the SVG file referenced by url, caches
    the loaded icon, and returns the file as
    an SVGDocument.
  */
  function loadIcon (name, url) {
    if (!ICONS [name]) {
      $.ajax (url, {
        async: false,
        success: function (svgDocument) {
          ICONS [name] = svgDocument;
        },
        error: function () {
          console.log ('[view_term_list] Error: an error occured while trying to load the "' + name + '" icon from "' + url + '".');
        }
      });
    }
    return ICONS [name] ? (ICONS [name]).documentElement.cloneNode (true) : null;
  }

  /*
    Accepts no arguments and returns a string
    that represents the item label class name.
  */
  function getItemLabelClassName () {
    return getItemClassName () + '_label';
  }

  /*
    Accepts no arguments and returns a string
    that represents the item deselect button
    element class name.
  */
  function getItemDeselectButtonClassName () {
    return getItemClassName () + '_deselect_button';
  }

  /*
    Accepts no arguments and returns a string
    that represents the class used to label
    overflow filter item elements.

    Overflow filter item elements are those items
    that should not be displayed when the filter
    is "collapsed".
  */
  function getOverflowItemClassName () {
    return getItemClassName () + '_overflow';
  }

  /*
    Accepts no arguments and returns a string
    that represents the class used to label
    selected item elements.
  */
  function getSelectedItemClassName () {
    return getItemClassName () + '_selected';
  }

  /*
    Accepts no arguments and returns a string
    that represents the item element class name.
  */
  function getItemClassName () {
    return getModuleClassPrefix () + '_item';
  }

  /*
    Accepts no arguments and returns a string
    that represents the DOM ID of the topic list
    element.
  */
  function getTopicListElementId () {
    return 'edit-view-term-list-item';
  }  

  /*
    Accepts no arguments and returns a string
    that represents the Number of Overflow Items
    data attribute name.
  */
  function getOverflowNumItemsAttributeName () {
    return getModuleAttributePrefix () + '-num-overflow-items';
  }

  /*
    Accepts no arguments and returns a string
    that represents the name of the class used
    to label the expand/collapse (toggle) button.
  */
  function getToggleClassName () {
    return getListClassName () + '_toggle_button';
  }

  /*
    Accepts no arguments and returns a string
    that represents the name of the class used
    to label the reset button.
  */
  function getResetButtonClassName () {
    return getListClassName () + '_reset_button';
  }

  /*
    Accepts no arguments and returns a string
    that represents the class used to label
    overflow elements.
  */
  function getOverflowClassName () {
    return getListClassName () + '_overflow';
  }

  /*
    Accepts no arguments and returns a string
    that represents the list element class name.
  */
  function getListClassName () {
    return getModuleClassPrefix () + '_list';
  }

  /*
    Accepts no arguments and returns a string
    that represents the name of the data
    attribute used to specify filter item
    indicies.
  */
  function getItemIndexAttributeName () {
    return getModuleAttributePrefix () + '-item-index';
  }

  /*
    Accepts no arguments and returns a string
    that represents the name of the data
    attribute used to specify the ID of the term
    associated with filter items.
  */
  function getItemTermAttributeName () {
    return getModuleAttributePrefix () + '-item-term-id';
  }

  /*
    Accepts no arguments and return a string
    that represents the view DOM Id data
    attribute name.

    Note: this attribute is used to store the
    DOM ID of the view associated with a filter
    element.
  */
  function getViewIdAttributeName () {
    return getModuleAttributePrefix () + '-view';
  }

  /*
    Accepts no arguments and returns a string
    that represents the filter data attribute
    name.
  */
  function getFilterAttributeName () {
    return getModuleAttributePrefix () + '-filter';
  }

  /*
    Accepts no arguments and returns a string
    that represents the view form button's
    class name.
  */
  function getSubmitClassName () {
    return 'js-form-submit';
  }

  /*
    Accepts no arguments and returns the prefix
    prepended onto all data attributes created
    by this module.
  */
  function getModuleAttributePrefix () {
    return 'data-view-term-list';
  }

  /*
    Accepts no arguments and returns the prefix
    prepended onto all classes created by
    this module.
  */
  function getModuleClassPrefix () {
    return 'view_term_list';
  }

  /*
    Accepts no arguments and returns a string
    that represents the text used to label the
    overflow toggle button when collapsed.
  */
  function getToggleElementShowText () {
    return 'Show More';
  }

  /*
    Accepts no arguments and returns a string
    that represents the text used to label the
    overflow toggle button when expanded.
  */
  function getToggleElementHideText () {
    return 'Show Less';
  }
}) (jQuery, Drupal, drupalSettings);
