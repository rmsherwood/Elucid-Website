/*
  Defines the page-specific behavior for the
  Openings page.
*/
(function ($) {
  // Indicates whether or not the Filters are expanded or collapsed.
  var FiltersState = 'expanded';

  // Initialize all filters after each refresh.
  // See: https://www.drupal.org/docs/8/api/javascript-api
  Drupal.behaviors.openings = {
    attach: function (context, settings) {
      $(document).once ('openings').ajaxComplete (
        function (event, xhr, settings) {
          init ();
      });
    }
  }

  /*
    Initializes the expand and collapse feature
    for the Openings table filter.
  */
  function init () {
    initToggleButton ();
  }

  /*
  */
  function initToggleButton () {
    getToggleButton ().hasClass ('elucid-initialized') ||
      getToggleButton ()
        .addClass ('elucid-initialized')
        .click (function () {
          toggleFilters ();
        });
  }

  /*
  */
  function toggleFilters () {
    FiltersState === 'expanded' ? collapseFilters () : expandFilters ();
  }

  /*
  */
  function expandFilters () {
    getFiltersElement ().slideDown ();
    getToggleButton ().removeClass ('elucid-collapsed');
    FiltersState = 'expanded';
  }

  /*
  */
  function collapseFilters () {
    getFiltersElement ().slideUp ();
    getToggleButton ().addClass ('elucid-collapsed');
    FiltersState = 'collapsed';
  }

  /*
  */
  function getToggleButton () { return $('.' + toggleButtonClassName ()); }

  /*
  */
  function getFiltersElement () { return $('#' + filtersElementID ()); }

  /*
  */
  function getFiltersHeaderElement () { return $('.' + filtersHeaderClassName ()); }

  // The toggle button class name.
  function toggleButtonClassName () { return 'elucid-filters-container-toggle-button'; }

  // The Filters element ID.
  function filtersElementID () { return 'views-exposed-form-careers-career-block'; }
}) (jQuery);
